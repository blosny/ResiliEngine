from sqlalchemy.orm import Session
from models import AnalysisResult
# SCRUM-29: Repository Mapping Logic
# AI'dan gelen analiz verilerini veritabanı şemasına (models.py) hatasız eşler.
class AnalysisRepository:
    def __init__(self, db: Session):
        self.db = db

    def save_analysis(self, log_content: str, analysis: str, recommendation: str):
        db_record = AnalysisResult(
            log_content=log_content,
            analysis=analysis,
            recommendation=recommendation
        )
        self.db.add(db_record)
        self.db.commit()
        self.db.refresh(db_record)
        return db_record