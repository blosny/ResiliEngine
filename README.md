# 🛡️ ResiliEngine
### Yapay Zekâ Destekli Kaos Mühendisliği (Chaos Engineering) Platformu

<div align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" />
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</div>

---

## 🚀 Proje Genel Bakış

**ResiliEngine**, bulut tabanlı ve servis odaklı mimariler (SOA) için tasarlanmış yenilikçi bir **Kaos Mühendisliği (Chaos Engineering)** platformudur. Sistemlerin beklenmedik hatalara (ağ gecikmeleri, servis çökmeleri, veritabanı bağlantı kopmaları) karşı ne kadar dayanıklı olduğunu ölçmek amacıyla sisteme bilinçli ve kontrollü arızalar (hata enjeksiyonu) verir.

Sadece hataları enjekte etmekle kalmaz, entegre **Yapay Zekâ (Gemini AI)** desteğiyle sistemin bu hatalara verdiği tepkileri analiz ederek, darboğazları tespit eder ve geliştiricilere doğrudan kullanılabilecek mimari iyileştirme önerileri (Root Cause Analysis) sunar.

---

## 🛠️ Teknik Mimari & Çalışma Akışı

ResiliEngine, sağlam ve ölçeklenebilir bir mikroservis yapısı üzerine inşa edilmiştir.

### 🧱 Sistem Bileşenleri
```mermaid
graph TD
    %% Bileşenler
    UI[React Frontend]
    BE[NestJS Backend]
    AI[FastAPI AI Service]
    Guard[Guard.js Agent]
    DB[(PostgreSQL)]
    Gemini([Google Gemini API])

    %% Bağlantılar
    Guard -- "[1] Hata Yakalar" --> BE
    BE -- "[2] Analiz İster" --> AI
    AI -- "[3] Veri Çeker/Kaydeder" --> DB
    AI -- "[4] Akıllı Analiz" --> Gemini
    AI -- "[5] Rapor Döner" --> BE
    BE -- "[6] Canlı Görünüm" --> UI
    UI -- "Kaos Tetikler" --> BE

    %% Stil
    style UI fill:#61dafb,stroke:#333,stroke-width:2px
    style BE fill:#e0234e,stroke:#333,stroke-width:2px,color:#fff
    style AI fill:#3776ab,stroke:#333,stroke-width:2px,color:#fff
    style Guard fill:#f4b400,stroke:#333,stroke-width:2px
    style DB fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style Gemini fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
```

### 🔄 Çalışma Akışı
```mermaid
sequenceDiagram
    participant Dev as 👨‍💻 Yazılımcı / Terminal
    participant Guard as 🛡️ Guard.js (Agent)
    participant BE as ⚙️ NestJS Backend
    participant AI as 🧠 AI Service (FastAPI)
    participant Gemini as ✨ Google Gemini AI
    participant DB as 🗄️ PostgreSQL

    Dev->>Guard: Komutu Çalıştır (Örn: node guard.js "npm run dev")
    Guard->>Dev: Uygulama Çıktılarını Ekrana Basar
    Note over Guard: Regex ile Hata Tespiti (Error/Exception)
    Guard->>BE: POST /chaos/terminal-error (Hata Logu)
    BE->>DB: Logu Veritabanına Kaydet
    BE->>AI: POST /analyze (Log İçeriği)
    AI->>AI: Local Cache & Knowledge Base Kontrolü
    alt Cache/KB Eşleşmesi Yoksa
        AI->>Gemini: Prompt Gönder (Log Analizi & Çözüm)
        Gemini-->>AI: Analiz Raporu (JSON)
    end
    AI-->>BE: Mimari Öneri & Kök Neden Analizi
    BE->>DB: Analiz Sonuçlarını Güncelle
    BE->>Dev: Dashboard Üzerinden Canlı Bildirim & Rapor
```

---

## 🌟 Öne Çıkan Özellikler

*   **🛡️ Guard.js (Canlı Terminal Gözcüsü):** Yazılımcıların terminal akışlarını izleyen, bir hata (`Error`, `Exception` vb.) yakaladığı anda anında sunucuya raporlayan Node.js tabanlı canlı izleme ajanı.
*   **🧪 Dinamik Hata Enjeksiyonu (Strategy Pattern):** Sistemlerin dayanıklılığını ölçmek amacıyla `Latency`, `429`, `401` ve `500` hataları fırlatabilen modüler kaos motoru.
*   **🧠 Hibrit Yapay Zekâ Hattı:**
    Sistem, verimlilik ve maliyet optimizasyonu için kademeli bir analiz mantığı yürütür:

```mermaid
flowchart TD
    Start([Hata Logu Geldi]) --> Cache{Cache'de Var mı?}
    Cache -- Evet --> Return[Hızlı Yanıt Dön]
    Cache -- Hayır --> KB{KB'de Tanımlı mı?}
    KB -- Evet --> Return
    KB -- Hayır --> Gemini{Gemini Erişilebilir mi?}
    Gemini -- Evet --> Gen[Gemini ile Analiz Et]
    Gemini -- Hayır --> Fallback[Fallback Kurallarını İşlet]
    Gen --> Save[Sonucu Kaydet]
    Fallback --> Return
    Save --> Return
```

    1.  **L1 - Veritabanı Cache:** Daha önce analiz edilmiş benzer hatalar milisaniyeler içinde çekilir.
    2.  **L2 - Knowledge Base:** Sık karşılaşılan DevOps ve kodlama hataları için yerel uzman kütüphanesi.
    3.  **L3 - Bulut AI (Gemini):** Güncel ve gelişmiş mimari analizler için Google Gemini 2.0 Flash entegrasyonu.
    4.  **L4 - Fallback Engine:** Tüm sistemler çevrimdışı olsa bile devreye giren akıllı DevOps asistanı.

---

## 🚦 Kurulum & Çalıştırma Rehberi

### 1. Docker Konteynerlarını Başlatma
Tüm mikroservis mimarisini ayağa kaldırmak için terminalde çalıştırın:
```bash
docker-compose up -d
```
*Not: Sistem Docker üzerinden `frontend (5173)`, `backend (3000)`, `ai-service (8000)` ve `PostgreSQL` veritabanını yönetir.*

### 2. Canlı Takip Ekranı
Tarayıcınızdan **http://localhost:5173** adresine giderek Dashboard'u açın. Ekranda yeşil renkle yanıp sönen **"Aktif İzleme Devrede"** panelini görün.

### 3. Gerçek Zamanlı Hata Yakalama (Demo)
Bir yazılımcının sistemde hata yaptığını simüle etmek için yeni bir terminalde şu komutu çalıştırın:

```bash
node guard.js "echo [ERROR] Fatal: Database deadlocked in /src/database.ts"
```

*Komut çalıştıktan 2-3 saniye sonra Dashboard ekranına anında hatanın düştüğünü ve Yapay Zeka'nın Türkçe bir dille mimari çözüm ürettiğini göreceksiniz.*

---

## 📊 Deployment Bilgileri

| Servis / Bileşen | Teknoloji | Durum |
| :--- | :--- | :---: |
| **Frontend (UI)** | React / Vite | 🟢 Aktif |
| **Backend (API)** | NestJS | 🟢 Aktif |
| **AI Service** | Python / FastAPI | 🟢 Aktif |
| **Database** | Managed PostgreSQL | 🟢 Aktif |

---
<div align="center">
  <sub>ResiliEngine - Kaosun İçindeki Düzeni Keşfedin.</sub>
</div>


