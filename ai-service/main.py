import os
import json
import requests
import uvicorn
import asyncio
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
# SCRUM-39: Akıllı Karar Mekanizması - Logları önce yerel Knowledge Base'de arar, 
# eşleşme bulamazsa Yerel AI (Ollama) servisine danışır.
# Veritabanı importları
from database import engine, get_db
import models
from repository import AnalysisRepository

# Veritabanında tabloları otomatik oluştu

# Database imports
from database import engine, get_db
import models
from repository import AnalysisRepository

# Load environment
load_dotenv()

# Auto-create database tables
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
# API KEY
api_key = os.getenv("GEMINI_API_KEY")
client = None

if api_key and api_key != "YOUR_GEMINI_API_KEY":
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Gemini Client başlatılamadı (Fallback modu kullanılacak): {e}")

MODEL_NAME = "gemini-2.0-flash"

class LogRequest(BaseModel):
    log_content: str

def get_fallback_analysis(log_content: str):
    """API hatası durumunda dönecek profesyonel ve detaylı analiz kütüphanesi."""
    log_upper = log_content.upper()
    
    if "LATENCY" in log_upper:
        return {
            "analysis": "Kritik Eşik Aşımı:\n• Sistem yanıt süresinde 2000ms üzerinde bir gecikme tespit edildi.\n• Bu durum genellikle 'Cascading Failure' (zincirleme çöküş) riskini tetikler.\n• İstek kuyrukları (Request Queues) dolmaya başlamış olabilir.",
            "recommendation": "Mimari Tavsiye:\n1. 'Timeout' değerlerini agresif bir şekilde yapılandırın.\n2. Yanıt vermeyen servisleri sistemden izole etmek için 'Circuit Breaker' (Hata Kesici) deseni uygulayın.\n3. Read-heavy işlemler için Redis önbellekleme katmanını devreye alın."
        }
    elif "429" in log_upper or "RATE LIMIT" in log_upper:
        return {
            "analysis": "Trafik Anomalisi:\n• Sisteme gelen istek trafiği belirlenen eşik değerlerin üzerine çıktı.\n• HTTP 429 hatası, servislerin kaynak tüketimini korumak için kendilerini savunmaya aldığını gösterir.",
            "recommendation": "Dayanıklılık Önerisi:\n1. API Gateway seviyesinde 'Rate Limiting' uygulayın.\n2. İstemci tarafında 'Exponential Backoff' (üstel bekleme) ile retry mekanizması kurun.\n3. Kritik olmayan istekleri kuyruğa alarak yükü zamana yayın."
        }
    elif "401" in log_upper or "UNAUTHORIZED" in log_upper:
        return {
            "analysis": "Güvenlik Katmanı Hatası:\n• Kimlik doğrulama sürecinde başarısızlık tespit edildi.\n• Bu durum yanlış konfigürasyon veya süresi dolmuş token kullanımından kaynaklanıyor olabilir.",
            "recommendation": "Çözüm Yolu:\n1. Token yenileme (Refresh Token) akışını kontrol edin.\n2. Merkezi bir Identity Provider (Auth0, Keycloak vb.) kullanımını değerlendirin.\n3. Mikroservisler arası 'Service-to-Service' güvenliği için mTLS yapılandırması kurun."
        }
    elif "500" in log_upper or "INTERNAL SERVER ERROR" in log_upper:
        return {
            "analysis": "Sistem İstisnası:\n• Beklenmedik bir sunucu hatası (Runtime Exception) oluştu.\n• Bu durum veri tabanı tutarsızlığı veya yakalanamayan bir uygulama hatası olduğunu gösterir.",
            "recommendation": "Mühendislik Önerisi:\n1. 'Graceful Shutdown' ve 'Global Exception Filter' mekanizmalarını kurun.\n2. Log izleme araçlarıyla (ELK, Prometheus) hatanın stack-trace bilgisini takip edin.\n3. Kritik işlemler için idempotent yapılandırma kullanın."
        }
    else:
        return {
            "analysis": "Bilinmeyen Anomali:\n• Sistem metriklerinde standart dışı bir sapma gözlemlendi.\n• Bu durum, sinsi başlayan bir kaynak sızıntısına işaret ediyor olabilir.",
            "recommendation": "Genel Tavsiye:\n1. Sistem kaynaklarını (CPU/RAM/IO) anlık olarak izleyin.\n2. Otomatik ölçeklendirme eşiklerini gözden geçirin.\n3. 'Dead Letter Queue' mekanizmasıyla hatalı işlemleri ayrıştırın."
        }

@app.post("/analyze")
async def analyze_logs(request: LogRequest, db: Session = Depends(get_db)):
    repo = AnalysisRepository(db)
    
    # 1. Önce Veritabanında (Cache) ara
    try:
        existing_analysis = repo.get_analysis_by_log(request.log_content)
        if existing_analysis:
            # Yapay gecikme (Cache için de ekliyoruz ki çok hızlı gelmesin)
            await asyncio.sleep(1.2)
            return {
                "analysis": existing_analysis.analysis,
                "recommendation": existing_analysis.recommendation,
                "mode": "cached"
            }
    except Exception as e:
        print(f"Cache arama hatası: {e}")

    result = None
    mode = "live"
    
    # 2. Gemini ile şansımızı deneyelim
    if client:
        try:
            prompt = f"""
            Sen bir Yazılım Mimarı ve Kaos Mühendisliği uzmanısın.
            Aşağıdaki log verisini analiz et. 
            Logun nedenini ve sistem dayanıklılığını nasıl artıracağımızı açıkla.

            LOG:
            {request.log_content}

            Yanıtı SADECE şu JSON formatında ver, başka hiçbir metin ekleme:
            {{
             "analysis": "Mimari zayıflık tespiti",
             "recommendation": "Teknik çözüm önerisi"
            }}
            """
            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt
            )
            text = response.text
            clean_text = text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean_text)
        except Exception as e:
            print(f"Gemini Hatası (Fallback Devrede): {e}")
            await asyncio.sleep(2.0) # Fallback için daha uzun gecikme
            result = get_fallback_analysis(request.log_content)
            mode = "fallback"
    else:
        await asyncio.sleep(1.8)
        result = get_fallback_analysis(request.log_content)
        mode = "fallback"

    # 3. Sonucu Veritabanına Kaydet
    try:
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
    except Exception as db_e:
        print(f"DB Kayıt Hatası: {db_e}")

    result["mode"] = mode
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)