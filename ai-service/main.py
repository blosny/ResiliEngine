import os
import re
import json
import requests
import uvicorn
import asyncio
from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
<<<<<<< HEAD
import httpx
from dotenv import load_dotenv
from google import genai
=======
>>>>>>> origin/feature/SCRUM-36
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

<<<<<<< HEAD
# Gemini API
=======
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
>>>>>>> origin/feature/SCRUM-36
api_key = os.getenv("GEMINI_API_KEY")
gemini_client = None

if api_key and api_key != "YOUR_GEMINI_API_KEY":
    try:
        gemini_client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Gemini Client başlatılamadı: {e}")

MODEL_NAME = "gemini-2.0-flash"

# Ollama Config
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://local-ai:11434/api/generate")


class LogRequest(BaseModel):
    log_content: str


async def analyze_with_local_ai(log_content: str):
    """Ollama streaming modda yerel AI analizi yapar."""
    system_message = (
        "You are an expert software architect specializing in Node.js, TypeScript, "
        "and distributed systems. You analyze error logs and provide clear, actionable solutions. "
        "Always respond in English. Be concise and specific."
    )

    prompt = (
        f"ERROR LOG:\n{log_content}\n\n"
        f"INSTRUCTIONS:\n"
        f"1. First, write a short paragraph explaining the ROOT CAUSE of this error.\n"
        f"2. Then, write a numbered list of SOLUTION STEPS to fix it.\n"
        f"Keep your response under 200 words."
    )

    try:
        print("[LocalAI] Ollama streaming isteği başlatılıyor...")
        full_response = ""

        async with httpx.AsyncClient(timeout=300.0) as client:
            async with client.stream(
                "POST",
                OLLAMA_URL,
                json={
                    "model": "phi3:mini",
                    "prompt": prompt,
                    "system": system_message,
                    "stream": True,
                },
                timeout=300.0,
            ) as response:
                async for line in response.aiter_lines():
                    if line:
                        try:
                            chunk = json.loads(line)
                            full_response += chunk.get("response", "")
                            if chunk.get("done"):
                                break
                        except Exception:
                            continue

        print(f"[LocalAI] Cevap alındı ({len(full_response)} karakter): {full_response[:300]}")

        if not full_response.strip():
            return None

        # Cevabı akıllıca ikiye böl: analysis ve recommendation
        text = full_response.strip()

        # Numaralı liste başlangıcını bul (1. veya 1) veya Step gibi kalıplar)
        split_match = re.search(
            r'\n\s*(?:1[\.\):]|Step\s*1|Solution|Fix|To fix|To resolve)',
            text,
            re.IGNORECASE
        )

        if split_match:
            analysis = text[:split_match.start()].strip()
            recommendation = text[split_match.start():].strip()
        else:
            # Paragraf bazlı böl: ilk paragraf = analysis, geri kalan = recommendation
            paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
            if len(paragraphs) >= 2:
                analysis = paragraphs[0]
                recommendation = '\n\n'.join(paragraphs[1:])
            else:
                # Tek blok geldi, yarıdan böl
                sentences = text.split('. ')
                mid = max(1, len(sentences) // 2)
                analysis = '. '.join(sentences[:mid]) + '.'
                recommendation = '. '.join(sentences[mid:])

        return {"analysis": analysis[:500], "recommendation": recommendation[:800]}

    except Exception as e:
        print(f"[LocalAI] Hata: {e}")
        return None


def get_fallback_analysis(log_content: str):
    """AI servisleri kullanılamadığında dönecek sabit analiz."""
    log_upper = log_content.upper()

    if "LATENCY" in log_upper or "TIMEOUT" in log_upper:
        return {
            "analysis": "Critical Threshold Exceeded:\n- System response time exceeded 2000ms.\n- Risk of cascading failure detected.",
            "recommendation": "Architecture Recommendation:\n1. Configure timeout values.\n2. Implement Circuit Breaker pattern.\n3. Add Redis caching layer.",
        }
    elif "429" in log_upper or "RATE LIMIT" in log_upper:
        return {
            "analysis": "Traffic Anomaly:\n- Request traffic exceeded threshold limits.",
            "recommendation": "Resilience Recommendation:\n1. Apply Rate Limiting at API Gateway.\n2. Use Exponential Backoff strategy.",
        }
    elif "401" in log_upper or "UNAUTHORIZED" in log_upper:
        return {
            "analysis": "Security Layer Failure:\n- Authentication failure detected.",
            "recommendation": "Solution:\n1. Check token renewal flow.\n2. Evaluate Identity Provider usage.",
        }
    elif "500" in log_upper or "INTERNAL SERVER" in log_upper:
        return {
            "analysis": "System Exception:\n- Unexpected server error occurred.",
            "recommendation": "Engineering Recommendation:\n1. Set up Global Exception Filter.\n2. Monitor with ELK/Prometheus.",
        }
    elif "ECONNREFUSED" in log_upper or "CONNECTION" in log_upper:
        return {
            "analysis": "Connection Failure:\n- Target service is unreachable or not running.",
            "recommendation": "Solution:\n1. Verify the target service is running.\n2. Check host/port configuration.\n3. Review firewall and network settings.",
        }
    else:
        return {
            "analysis": "Unknown Anomaly:\n- Non-standard deviation observed in system behavior.",
            "recommendation": "General Recommendation:\n1. Monitor system resources.\n2. Implement Dead Letter Queue mechanism.",
        }


@app.on_event("startup")
async def warmup_model():
    """Uygulama başladığında modeli RAM'e yükle."""
    try:
        print("[Warmup] Model RAM'e yükleniyor: phi3:mini")
        async with httpx.AsyncClient(timeout=120.0) as client:
            await client.post(
                OLLAMA_URL,
                json={"model": "phi3:mini", "prompt": "hi", "stream": False}
            )
        print("[Warmup] Model hazır.")
    except Exception as e:
        print(f"[Warmup] Model yüklenemedi (önemli değil): {e}")


@app.post("/analyze")
async def analyze_logs(request: LogRequest, db: Session = Depends(get_db)):
    repo = AnalysisRepository(db)

    # 1. Veritabanı Cache
    try:
        existing = repo.get_analysis_by_log(request.log_content)
        if existing:
            await asyncio.sleep(0.5)
            return JSONResponse(
                content={
                    "analysis": existing.analysis,
                    "recommendation": existing.recommendation,
                    "mode": "cached",
                },
                media_type="application/json; charset=utf-8"
            )
    except Exception as e:
        print(f"Cache arama hatası: {e}")

    result = None
    mode = "local-ai"

    # 2. Yerel AI (Ollama / phi3:mini)
    result = await analyze_with_local_ai(request.log_content)

    # 3. Yerel AI başarısız → Gemini
    if not result and gemini_client:
        mode = "live"
        try:
            prompt = (
                f"You are a Software Architect and Chaos Engineering expert.\n"
                f"Analyze this log and provide a solution.\n\n"
                f"LOG: {request.log_content}\n\n"
                f'Respond in JSON format: {{"analysis": "...", "recommendation": "..."}}'
            )
            response = gemini_client.models.generate_content(model=MODEL_NAME, contents=prompt)
            clean = response.text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean)
        except Exception as e:
            print(f"Gemini Hatası: {e}")

    # 4. Hepsi başarısız → Fallback
    if not result:
        mode = "fallback"
        result = get_fallback_analysis(request.log_content)

    # 5. Veritabanına Kaydet
    try:
        repo.save_analysis(
            log_content=log_text,
            analysis=result["analysis"],
            recommendation=result["recommendation"],
        )
<<<<<<< HEAD
    except Exception as e:
        print(f"DB Kayıt Hatası: {e}")
=======

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
>>>>>>> origin/feature/SCRUM-36

    result["mode"] = mode
    return JSONResponse(content=result, media_type="application/json; charset=utf-8")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, timeout_keep_alive=300)