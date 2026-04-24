import os
import json
import requests
import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

# Veritabanı importları
from database import engine, get_db
import models
from repository import AnalysisRepository

# Veritabanında tabloları otomatik oluştu
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ResiliEngine - AI Analysis Service")

class LogRequest(BaseModel):
    log_content: str

def load_knowledge_base():
    try:
        with open("error_knowledge_base.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

@app.post("/analyze")
async def analyze_logs(request: LogRequest, db: Session = Depends(get_db)):
    log_text = request.log_content

    # 1. ADIM: HIZLI ARAMA (Knowledge Base Kontrolü)
    kb_data = load_knowledge_base()
    for entry in kb_data:
        if entry["code"] in log_text or entry["cause"] in log_text:
            # Bulunduysa anında veritabanına kaydet ve dön
            repo = AnalysisRepository(db)
            repo.save_analysis(
                log_content=log_text,
                analysis=entry["cause"],
                recommendation=entry["solution"]
            )
            return {
                "source": "knowledge_base",
                "analysis": entry["cause"],
                "recommendation": entry["solution"]
            }

    # 2. ADIM: YEREL AI (Ollama - Phi3) DEVREYE GİRER
    prompt = f"""
    Sen bir Yazılım Mimarı ve Kaos Mühendisliği uzmanısın. Aşağıdaki logu Türkçe analiz et.
    LOG: {log_text}
    Yanıtı SADECE şu JSON formatında ver:
    {{
     "analysis": "Hatanın kısa nedeni",
     "recommendation": "Çözüm önerisi"
    }}
    """

    try:
        # Yerel Ollama Konteynerine İstek At
        response = requests.post("http://localhost:11434/api/generate", json={
            "model": "phi3:mini",
            "prompt": prompt,
            "stream": False
        })
        response.raise_for_status()
        
        ai_text = response.json().get("response", "")
        
        # HATA ÖNLEME: AI cevabının etrafındaki markdown taglerini temizle
        clean_text = ai_text.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean_text)

        # Veritabanına kaydet
        repo = AnalysisRepository(db)
        repo.save_analysis(
            log_content=log_text,
            analysis=result["analysis"],
            recommendation=result["recommendation"]
        )

        result["source"] = "local_ai"
        return result

    except json.JSONDecodeError:
        # AI düzgün JSON dönmezse (SCRUM-22 Kararlılık)
        raise HTTPException(status_code=500, detail="Yapay zeka geçerli bir JSON formatı döndüremedi.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Yerel AI veya Veritabanı Hatası: {str(e)}")
     #SCRUM-22: Kararlilik kontrolleri ve DB mapping tamamlandi
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)