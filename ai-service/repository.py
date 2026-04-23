from sqlalchemy.orm import Session
from models import AnalysisResult

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

    def get_analysis_by_log(self, log_content: str):
        return self.db.query(AnalysisResult).filter(AnalysisResult.log_content == log_content).order_by(AnalysisResult.id.desc()).first()