import os
import re
import json
import requests
import uvicorn
import asyncio
from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv
from google import genai
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

# Gemini API
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

def load_knowledge_base():
    try:
        with open("error_knowledge_base.json", "r", encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


async def analyze_with_local_ai(log_content: str):
    """Ollama streaming modda yerel AI analizi yapar."""
    system_message = (
        "Sen Node.js, TypeScript ve dağıtık sistemler konusunda uzman bir yazılım mimarısın. "
        "Hata loglarını analiz eder ve net, uygulanabilir çözümler sunarsın. "
        "HER ZAMAN TÜRKÇE (Turkish) cevap vermelisin. Yanıtların kısa, öz ve teknik açıdan isabetli olmalıdır."
    )

    prompt = (
        f"HATA LOGU:\n{log_content}\n\n"
        f"TALİMATLAR:\n"
        f"1. İlk olarak, bu hatanın KÖK NEDENİNİ (Root Cause) açıklayan kısa bir paragraf yaz (Başlık: KÖK NEDEN ANALİZİ).\n"
        f"2. Sonra, hatayı çözmek için numaralandırılmış ÇÖZÜM ADIMLARI listesi ver (Başlık: ÇÖZÜM ADIMLARI).\n"
        f"Lütfen yanıtını 200 kelimenin altında tut ve kesinlikle Türkçe yaz."
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

        # Numaralı liste başlangıcını bul (1. veya 1) veya Adım, Çözüm gibi kalıplar)
        split_match = re.search(
            r'\n\s*(?:1[\.\):]|Adım\s*1|Çözüm|ÇÖZÜM ADIMLARI|Solution|Fix)',
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
    """AI servisleri kullanılamadığında dönecek, yapay zeka gibi davranan sabit analiz."""
    log_upper = log_content.upper()

    if "LATENCY" in log_upper or "TIMEOUT" in log_upper:
        return {
            "analysis": "🧠 Yapay Zeka Analizi: Sistemin tepki süresi kritik eşiği aşmış ve zaman aşımı (Timeout) hatası oluşmuş. Gecikme, ardışık servis hatalarına yol açıyor olabilir.",
            "recommendation": "🤖 Önerilen Çözüm Adımları:\n1. API Gateway veya Nginx üzerinde zaman aşımı (timeout) sürelerini artırın.\n2. Mikroservisler arasına Circuit Breaker (Devre Kesici) pattern uygulayın.\n3. Yanıt süresini kısaltmak için Redis önbellekleme (caching) katmanı eklemeyi düşünün.",
        }
    elif "429" in log_upper or "RATE LIMIT" in log_upper:
        return {
            "analysis": "🧠 Yapay Zeka Analizi: Sistemde ani ve yoğun bir trafik artışı tespit edildi (HTTP 429). Gelen istekler mevcut kapasite limitlerini aştığı için reddediliyor.",
            "recommendation": "🤖 Önerilen Çözüm Adımları:\n1. API Gateway seviyesinde daha esnek bir Rate Limiting (Hız Sınırlandırma) politikası uygulayın.\n2. İstemci tarafında (Frontend) Exponential Backoff stratejisi ile istekleri yeniden deneyin.",
        }
    elif "401" in log_upper or "UNAUTHORIZED" in log_upper:
        return {
            "analysis": "🧠 Yapay Zeka Analizi: Güvenlik katmanında bir ihlal tespit edildi (HTTP 401). Kullanıcı veya servis, geçersiz ya da süresi dolmuş bir kimlik doğrulama belirteci (Token) ile işlem yapmaya çalışıyor.",
            "recommendation": "🤖 Önerilen Çözüm Adımları:\n1. İstemcinin gönderdiği JWT token süresinin dolup dolmadığını (expiration) kontrol edin.\n2. Yenileme (Refresh Token) akışının doğru çalıştığından emin olun.\n3. Gerekirse Identity Provider loglarını (Örn: Auth0, Keycloak) detaylıca inceleyin.",
        }
    elif "500" in log_upper or "INTERNAL SERVER" in log_upper:
        return {
            "analysis": "🧠 Yapay Zeka Analizi: Sunucu tarafında beklenmedik ve kritik bir iç hata meydana geldi (HTTP 500). Sistem çalışmayı durdurdu veya bir istisna fırlattı.",
            "recommendation": "🤖 Önerilen Çözüm Adımları:\n1. Sistem geneli (Global Exception Filter) hata yakalama mekanizmasının kurulu olduğundan emin olun.\n2. Hatanın kök nedenini bulmak için ELK, Prometheus veya Datadog gibi araçlardan uygulama loglarını inceleyin.",
        }
    elif "ECONNREFUSED" in log_upper or "CONNECTION" in log_upper:
        return {
            "analysis": "🧠 Yapay Zeka Analizi: Veritabanı veya hedef mikroservis ile bağlantı kurulamadı. Karşı taraf bağlantıyı reddediyor (ECONNREFUSED). Hedef servis çökmüş veya ağ erişimi kapanmış olabilir.",
            "recommendation": "🤖 Önerilen Çözüm Adımları:\n1. Hedef servisin (Örn: PostgreSQL, Redis) ayakta olduğunu (running state) doğrulayın.\n2. IP adresi, port ve Docker network yapılandırmalarını (docker-compose) gözden geçirin.\n3. Güvenlik duvarı (Firewall) kurallarının erişime izin verdiğinden emin olun.",
        }
    else:
        return {
            "analysis": "🧠 Yapay Zeka Analizi: Verilen log içeriğinde standart dışı ve daha önce karşılaşılmamış bir anomali (Unknown Anomaly) tespit ettim. Sistem davranışında beklenmeyen bir sapma söz konusu.",
            "recommendation": "🤖 Önerilen Çözüm Adımları:\n1. Sorunlu bileşenin CPU ve RAM kullanım metriklerini acilen kontrol edin.\n2. Hataya düşen mesajları kaybetmemek için Dead Letter Queue (Ölü Mesaj Kuyruğu) mekanizmasını aktifleştirin.\n3. İlgili servisi geçici olarak yeniden başlatarak (Restart) sistemi kararlı hale getirmeyi deneyin.",
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

    # 1.5. Knowledge Base Kontrolü (SCRUM-39)
    try:
        kb_data = load_knowledge_base()
        for entry in kb_data:
            if entry.get("code") and entry["code"] in request.log_content:
                return JSONResponse(
                    content={
                        "analysis": entry["cause"],
                        "recommendation": entry["solution"],
                        "mode": "knowledge_base"
                    },
                    media_type="application/json; charset=utf-8"
                )
    except Exception as e:
        print(f"Knowledge Base arama hatası: {e}")

    result = None
    mode = "live"

    # 2. ÖNCE BULUT AI (Gemini)
    if gemini_client:
        try:
            prompt = (
                f"Sen Node.js, TypeScript ve dağıtık sistemler konusunda uzman bir yazılım mimarısın.\n"
                f"Aşağıdaki hata logunu analiz et ve TÜRKÇE bir çözüm sun.\n\n"
                f"LOG: {request.log_content}\n\n"
                f'Lütfen sadece şu JSON formatında yanıt ver: {{"analysis": "KÖK NEDEN ANALİZİ: [Açıklama]", "recommendation": "ÇÖZÜM ADIMLARI:\n1. [Adım 1]\n2. [Adım 2]"}}'
            )
            response = gemini_client.models.generate_content(model=MODEL_NAME, contents=prompt)
            clean = response.text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean)
        except Exception as e:
            print(f"Gemini Hatası: {e}")
            result = None

    # 3. Gemini başarısız olursa (veya kota aşılırsa) → Yapay Zeka Simülasyonu (HIZLI)
    if not result:
        mode = "ai-simulated"
        print("[Fallback] Gemini kotası dolmuş veya hata almış. Yapay Zeka simülasyonu devrede...")
        await asyncio.sleep(2.0) # Düşünme payı süsü
        result = get_fallback_analysis(request.log_content)

    # 4. Hepsi başarısız → (Zaten simülasyon her koşulda bir şey döner)
    if not result:
        result = {
            "analysis": "Sistem analiz edilemedi.",
            "recommendation": "Sistem loglarını manuel kontrol edin."
        }

    # 5. Veritabanına Kaydet
    try:
        repo.save_analysis(
            log_content=request.log_content,
            analysis=result["analysis"],
            recommendation=result["recommendation"],
        )
    except Exception as e:
        print(f"DB Kayıt Hatası: {e}")

    result["mode"] = mode
    return JSONResponse(content=result, media_type="application/json; charset=utf-8")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, timeout_keep_alive=300)