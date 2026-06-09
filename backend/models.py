from typing import Optional, List, Dict, Any
from sqlmodel import SQLModel, Field
from pydantic import BaseModel

# --- DATABASE MODELS ---

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uid: str = Field(unique=True, index=True)
    email: str
    display_name: str
    avatar: str
    education: str
    goals: str

class Note(SQLModel, table=True):
    id: str = Field(primary_key=True)
    uid: str = Field(index=True)  # user's uid
    name: str
    subject: str
    upload_date: str
    size: str
    content: str
    type: str

class Summary(SQLModel, table=True):
    id: str = Field(primary_key=True)
    note_id: str = Field(index=True)
    title: str
    length: str
    content: str

class MCQSet(SQLModel, table=True):
    id: str = Field(primary_key=True)
    note_id: str = Field(index=True)
    title: str
    questions_json: str  # JSON-serialized questions array

class Flashcard(SQLModel, table=True):
    id: str = Field(primary_key=True)
    note_id: str = Field(index=True)
    front: str
    back: str
    learned: bool = Field(default=False)

class Planner(SQLModel, table=True):
    id: str = Field(primary_key=True)
    uid: str = Field(index=True)
    exam_date: str
    subjects: str
    hours: str
    plan_json: str  # JSON-serialized planner output

class QuizAttempt(SQLModel, table=True):
    id: str = Field(primary_key=True)
    uid: str = Field(index=True)
    title: str
    date: str
    score: int
    total_questions: int
    time_spent: int
    percentage: int
    performance: str


# --- PYDANTIC SCHEMAS ---

class AuthRequest(BaseModel):
    uid: str
    email: str
    displayName: Optional[str] = None
    avatar: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    displayName: str
    education: str
    goals: str
    avatar: str

class AIRequest(BaseModel):
    type: str
    content: Optional[str] = None
    length: Optional[str] = None
    count: Optional[int] = None
    prompt: Optional[str] = None
    history: Optional[List[Dict[str, Any]]] = None
    subjects: Optional[str] = None
    examDate: Optional[str] = None
    hours: Optional[str] = None

class QuizAttemptCreate(BaseModel):
    title: str
    score: int
    totalQuestions: int
    timeSpent: int
    percentage: int
    performance: str
