import os
import json
import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from sqlalchemy.orm import Session

# Database imports
from database import engine, get_db
import models
from repository import AnalysisRepository

# Load environment
load_dotenv()

# Auto-create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ResiliEngine - AI Analysis Service")

# API KEY
api_key = os.getenv("GEMINI_API_KEY")
client = None

if api_key:
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Gemini Client başlatılamadı (Fallback modu kullanılacak): {e}")

MODEL_NAME = "gemini-1.5-flash"

class LogRequest(BaseModel):
    log_content: str

def get_fallback_analysis(log_content: str):
    """API hatası durumunda dönecek profesyonel analizler."""
    if "LATENCY" in log_content:
        return {
            "analysis": "Sistemde kritik bir gecikme (2000ms+) tespit edildi. Bu durum mikroservisler arasındaki senkronizasyonun bozulduğunu gösterir.",
            "recommendation": "Mimari Tavsiye: Veritabanı sorgularını optimize edin ve ağır yükleri asenkron (RabbitMQ/Kafka) hale getirin. Gecikme toleransı için Redis Cache katmanı eklenmesi önerilir."
        }
    elif "ERROR_500" in log_content or "500" in log_content:
        return {
            "analysis": "Servis seviyesinde 500 (Dahili Sunucu Hatası) alındı. Exception handling (hata yakalama) mekanizması bu noktada yetersiz kalıyor.",
            "recommendation": "Dayanıklılık Önerisi: 'Circuit Breaker' deseni uygulanmalı. Servis çöktüğünde tüm sistemi kilitlememesi için 'Fall-back' metotları tanımlanmalıdır."
        }
    else:
        return {
            "analysis": "Bilinmeyen bir anomali tespit edildi. Sistem metrikleri normalin dışında seyrediyor.",
            "recommendation": "Genel Öneri: Logları ve sistem kaynaklarını (CPU/RAM) detaylı inceleyin. Otomatik ölçeklendirme (Auto-scaling) kurallarını kontrol edin."
        }

@app.post("/analyze")
async def analyze_logs(request: LogRequest, db: Session = Depends(get_db)):
    prompt = f"""
Sen bir Yazılım Mimarı ve Kaos Mühendisliği uzmanısın.
Aşağıdaki log verisini analiz et. 

LOG:
{request.log_content}

Yanıtı SADECE şu JSON formatında ver, başka hiçbir metin ekleme:
{{
 "analysis": "Mimari zayıflık tespiti",
 "recommendation": "Teknik çözüm önerisi"
}}
"""

    result = None
    
    # 1. Gemini ile şansımızı deneyelim
    if client:
        try:
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )
            text = response.text
            clean_text = text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean_text)
        except Exception as e:
            print(f"Gemini Hatası (Fallback Devrede): {e}")
            result = get_fallback_analysis(request.log_content)
    else:
        # Client yoksa direkt fallback
        result = get_fallback_analysis(request.log_content)

    # 2. Sonucu Veritabanına Kaydet
    try:
        repo = AnalysisRepository(db)
        repo.save_analysis(
            log_content=request.log_content,
            analysis=result["analysis"],
            recommendation=result["recommendation"]
        )
    except Exception as db_e:
        print(f"DB Kayıt Hatası: {db_e}")

    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)