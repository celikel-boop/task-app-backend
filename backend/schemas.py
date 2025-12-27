from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TaskBase(BaseModel):
    title: str
    assignee: Optional[str] = None
    status: Optional[str] = "unassigned"
    comment: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    assignee: Optional[str] = None
    status: Optional[str] = None
    comment: Optional[str] = None


class TaskOut(TaskBase):
    id: int
    creation_date: datetime

    class Config:
        from_attributes = True
