import os
import json
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

# .env yükle
load_dotenv()

app = FastAPI(title="ResiliEngine - AI Analysis Service")

# API KEY
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY bulunamadı!")

# Gemini client
client = genai.Client(api_key=api_key)



class LogRequest(BaseModel):
    log_content: str


@app.post("/analyze")
async def analyze_logs(request: LogRequest):

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
        # HATA DÜZELTME: 'gemini-1.5-flash-latest' yerine 'gemini-1.5-flash' kullan
        response = client.models.generate_content(
            model="models/gemini-flash-latest", 
            contents=prompt
        )

        text = response.text

        result = json.loads(text)

        return result

    except Exception as e:

        print("DEBUG HATASI:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Gemini hata döndürdü: {str(e)}"
        )


if __name__ == "__main__":

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )