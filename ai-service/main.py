import os
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv

# .env dosyasındaki değişkenleri okumak için
load_dotenv()

app = FastAPI()

class LogData(BaseModel):
    logs: str

@app.get("/")
def home():
    return {"message": "ResiliEngine AI Service is Running!"}

@app.post("/analyze")
async def analyze_logs(data: LogData):
    # Bu kısım Aşama 2'de OpenAI/Gemini API ile bağlanacak
    return {
        "status": "success",
        "received_logs": data.logs,
        "ai_suggestion": "Analiz motoru hazır. Loglar başarıyla alındı."
    }