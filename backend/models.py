from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from backend.database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    assignee = Column(String, nullable=True)
    status = Column(String, default="unassigned")
    comment = Column(String, nullable=True)

    creation_date = Column(DateTime, default=datetime.utcnow)
