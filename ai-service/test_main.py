import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app
from database import engine, get_db
from models import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# TEST İÇİN GEÇİCİ VERİTABANI
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_temp.db"
engine_test = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

Base.metadata.create_all(bind=engine_test)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

# --- TEST 1: Hızlı Arama ---
def test_analyze_with_knowledge_base():
    response = client.post("/analyze", json={"log_content": "Error: ECONNREFUSED at db_connection"})
    
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "knowledge_base"
    # Küçük harfe çevirip kontrol ediyoruz ki büyük/küçük harf hatası vermesin
    assert "veritabanı" in data["analysis"].lower()

# --- TEST 2: Yerel AI Devreye Girme Testi ---
@patch('main.requests.post')
def test_analyze_with_mock_local_ai(mock_post):
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {
        "response": '{"analysis": "Bilinmeyen Sistem Çökmesi", "recommendation": "Sistemi yeniden başlatın"}'
    }
    
    # JSON dosyasında KESİNLİKLE olmayan uydurma bir hata gönderiyoruz
    # Böylece sistem JSON'da bulamayıp mecburen AI'a gidecek.
    response = client.post("/analyze", json={"log_content": "HATA: 999 UZAYLI_ISTILASI_BILINMEYEN_KOD"})
    
    assert response.status_code == 200
    data = response.json()
    assert data["source"] == "local_ai"

# --- TEST 3: Veritabanına Kayıt (Repository Mapping) ---
def test_repository_database_mapping():
    response = client.post("/analyze", json={"log_content": "Test mapping error: MODULE_NOT_FOUND"})
    assert response.status_code == 200
    
    db = TestingSessionLocal()
    from models import AnalysisResult
    saved_record = db.query(AnalysisResult).filter(AnalysisResult.log_content.contains("Test mapping")).first()
    
    assert saved_record is not None
    assert saved_record.analysis is not None
    db.close()

# --- TEST 4: Kararlılık Testi (Geçersiz JSON) ---
def test_invalid_request_body():
    response = client.post("/analyze", json={"yanlis_parametre": "veri"})
    assert response.status_code == 422