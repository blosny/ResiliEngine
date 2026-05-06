# ResiliEngine

<div align="center">
  <h3>Yapay Zekâ Destekli Kaos Mühendisliği (Chaos Engineering) Platformu</h3>
</div>

---

## Project Overview

**ResiliEngine**, bulut tabanlı ve servis odaklı mimariler (SOA) için tasarlanmış yenilikçi bir **Kaos Mühendisliği (Chaos Engineering)** platformudur. Sistemlerin beklenmedik hatalara (ağ gecikmeleri, servis çökmeleri, veri tabanı bağlantı kopmaları) karşı ne kadar dayanıklı olduğunu ölçmek amacıyla sisteme bilinçli ve kontrollü arızalar (hata enjeksiyonu) verir.

Sadece hataları enjekte etmekle kalmaz, entegre **Yapay Zekâ (Gemini AI)** desteğiyle sistemin bu hatalara verdiği tepkileri analiz ederek, darboğazları tespit eder ve geliştiricilere doğrudan kullanılabilecek mimari iyileştirme önerileri (Root Cause Analysis) sunar.

## System Architecture

ResiliEngine, sağlam ve ölçeklenebilir bir mikroservis yapısı üzerine inşa edilmiştir.

```mermaid
graph TD
    %% Tanımlamalar
    User([Kullanıcı])
    Frontend[Frontend <br/> React + TypeScript]
    Backend[Backend <br/> NestJS]
    AIService[AI Service <br/> Python / FastAPI]
    Gemini([Gemini AI])
    DB[(PostgreSQL)]

    %% İlişkiler
    User -->|Kaos Stratejisi Belirler| Frontend
    Frontend -->|REST API| Backend
    Backend -->|Hata Logları & Metrikler| AIService
    Backend <-->|CRUD İşlemleri| DB
    AIService <-->|Root Cause Analysis| Gemini
    AIService -->|Analiz Raporu| Backend
    Backend -->|Sonuçları Gösterir| Frontend

    %% Stil
    classDef react fill:#61dafb,stroke:#fff,stroke-width:2px,color:#000;
    classDef nestjs fill:#e0234e,stroke:#fff,stroke-width:2px,color:#fff;
    classDef python fill:#3776ab,stroke:#fff,stroke-width:2px,color:#fff;
    classDef ai fill:#f4b400,stroke:#fff,stroke-width:2px,color:#000;
    classDef db fill:#336791,stroke:#fff,stroke-width:2px,color:#fff;

    class Frontend react;
    class Backend nestjs;
    class AIService python;
    class Gemini ai;
    class DB db;
```

## Key Features
- **Gerçek Zamanlı Terminal Ajanı (`guard.js`):** Yazılımcıların terminal akışlarını izleyen, bir hata (`Error`, `Exception` vb.) yakaladığı anda anında sunucuya raporlayan Node.js tabanlı canlı izleme hook'u.
- **Dinamik Hata Enjeksiyonu (Strategy Pattern):** Sistemlerin dayanıklılığını ölçmek amacıyla `Latency`, `429`, `401` ve `500` hataları fırlatabilen kaos enjeksiyon motoru.
- **Çok Katmanlı Yapay Zekâ Analiz Hattı:**
  1. **Hafıza (DB Cache):** Daha önce analiz edilmiş hatalar anında çekilir.
  2. **Bulut Yapay Zekâ (Gemini):** Güncel ve gelişmiş model desteği.
  3. **Simüle Edilmiş Güvenlik Ağı (Fallback):** Yapay zekanın erişilemez olduğu veya kota sınırlarının dolduğu durumlarda devreye giren zenginleştirilmiş DevOps asistanı.

## Deployment Links
| Servis / Bileşen  | Teknoloji          | Canlı Link (Render)                                                              |  Durum   |
| :---------------- | :----------------- | :------------------------------------------------------------------------------- | :------: |
| **Frontend (UI)** | React / Vite       | [resiliengine-frontend.onrender.com](https://resiliengine-frontend.onrender.com) | 🟢 Aktif |
| **Backend (API)** | NestJS             | [resiliengine-backend.onrender.com](https://resiliengine-backend.onrender.com)   | 🟢 Aktif |
| **AI Service**    | Python / FastAPI   | [resiliengine-ai.onrender.com](https://resiliengine-ai.onrender.com)             | 🟢 Aktif |
| **Database**      | Managed PostgreSQL | _[Dış erişime kapalı, iç ağda]_                                                  | 🟢 Aktif |

## How to Run & Presentation Guide (Sunum Senaryosu)

### Adım 1: Docker Konteynerlarını Başlatma
Sunumu yapmadan önce tüm mikroservis mimarisini ayağa kaldırmak için terminalde çalıştırın:
```bash
docker-compose up -d
```
*Not: Sistem Docker üzerinden `frontend (port 5173)`, `backend (port 3000)`, `ai-service (port 8000)`, `local-ai (Ollama)` ve PostgreSQL veritabanını izole şekilde yönetir.*

### Adım 2: Canlı Takip Ekranını Açma
Tarayıcınızı açarak aşağıdaki adrese gidin:
**http://localhost:5173**

Ekranda yeşil renkle yanıp sönen **"Aktif İzleme Devrede (Guard.js Dinleniyor...)"** panelini sunum katılımcılarına gösterin.

### Adım 3: Gerçek Zamanlı Hata Yakalama (Canlı Demo)
Sunum esnasında bir yazılımcının sistemde beklenmedik bir hata yaptığını simüle etmek için terminalinizde şu komutlardan birini çalıştırın:

- **Senaryo 1 (Veritabanı Çökmesi):**
  ```bash
  node guard.js "echo [ERROR] Fatal: Database deadlocked in /src/database.ts"
  ```
- **Senaryo 2 (Yetkilendirme Hatası):**
  ```bash
  node guard.js "echo [ERROR] Unauthorized: Invalid JWT Signature in /src/auth.ts"
  ```

*Komut çalıştıktan 2-3 saniye sonra tarayıcıyı yenilemeden, Dashboard ekranına anında hatanın düştüğünü ve Yapay Zeka'nın Türkçe bir dille mimari çözüm ürettiğini sunabilirsiniz.*

