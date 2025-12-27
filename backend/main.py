from backend.database import engine
from backend.models import Base

from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.database import SessionLocal, engine
from backend.models import Base

from backend.models import Task
from backend.schemas import TaskCreate, TaskUpdate, TaskOut

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE vs
    allow_headers=["*"],  # Content-Type vs
)

//Base.metadata.create_all(bind=engine)

# 🔹 DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔹 GET all tasks
@app.get("/tasks", response_model=List[TaskOut])
def get_tasks():
    db: Session = SessionLocal()
    tasks = db.query(Task).order_by(Task.creation_date.desc()).all()
    db.close()
    return tasks


# 🔹 POST new task
@app.post("/tasks", response_model=TaskOut)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    db_task = Task(**task.dict())

    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    return db_task


# 🔹 PUT update task
@app.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db),
):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    update_data = task.dict(exclude_unset=True)

    # 🔒 created_at ASLA güncellenmez
    update_data.pop("created_at", None)

    for key, value in update_data.items():
        setattr(db_task, key, value)

    db.commit()
    db.refresh(db_task)

    return db_task


# 🔹 DELETE task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(db_task)
    db.commit()

    return {"ok": True}
@app.get("/")
def health():
    return {"status": "ok"}
