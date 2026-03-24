import os
import json
import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from sqlalchemy.orm import Session

# --- YENİ: VERİTABANI İÇİN GEREKLİ DOSYALARI İÇE AKTARIYORUZ ---
from database import engine, get_db
import models
from repository import AnalysisRepository
# --------------------------------------------------------------

# .env yükle
load_dotenv()

# YENİ: Veritabanında tabloları otomatik oluştur (Eğer yoksa)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ResiliEngine - AI Analysis Service")

# API KEY
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY bulunamadı!")

# Gemini client
client = genai.Client(api_key=api_key)


class LogRequest(BaseModel):
    log_content: str

# YENİ: Fonksiyona "db: Session = Depends(get_db)" ekledik ki veritabanına bağlanabilelim
@app.post("/analyze")
async def analyze_logs(request: LogRequest, db: Session = Depends(get_db)):

    prompt = f"""
Sen bir Yazılım Mimarı ve Kaos Mühendisliği uzmanısın.

Aşağıdaki log verisini analiz et.

LOG:
{request.log_content}

Yanıtı SADECE şu JSON formatında ver:

{{
 "analysis": "Mimari zayıflık",
 "recommendation": "Teknik çözüm"
}}
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-flash-latest", 
            contents=prompt
        )

        text = response.text

        # HATA ÖNLEME: Gemini cevabın başına/sonuna ```json koyarsa kod çökmesin diye temizliyoruz
        clean_text = text.replace("```json", "").replace("```", "").strip()

        result = json.loads(clean_text)

        # --- YENİ GÖREV (SCRUM-10): ANALİZİ VERİTABANINA KAYDET ---
        repo = AnalysisRepository(db)
        repo.save_analysis(
            log_content=request.log_content,
            analysis=result["analysis"],
            recommendation=result["recommendation"]
        )
        # ----------------------------------------------------------

        return result

    except Exception as e:

        print("DEBUG HATASI:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Gemini veya Veritabanı hata döndürdü: {str(e)}"
        )


if __name__ == "__main__":

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )