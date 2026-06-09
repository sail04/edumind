import os
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from database import create_db_and_tables, get_session
from models import (
    User, Note, Summary, MCQSet, Flashcard, Planner, QuizAttempt,
    AuthRequest, ProfileUpdateRequest, AIRequest, QuizAttemptCreate
)
from ai import (
    generate_summary, generate_mcqs, generate_tutor_reply, generate_planner
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database and tables
    create_db_and_tables()
    yield

app = FastAPI(
    title="EduMind API Backend",
    description="Decoupled Python FastAPI backend for EduMind AI Study Companion",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- AI ROUTER ENDPOINT ---

@app.post("/api/ai")
async def handle_ai_request(request: AIRequest):
    try:
        req_type = request.type.lower()
        if req_type == "summary":
            if not request.content:
                raise HTTPException(status_code=400, detail="Content is required for summary generation")
            result = generate_summary(request.content, request.length or "medium")
            return {"result": result}
            
        elif req_type == "mcq":
            if not request.content:
                raise HTTPException(status_code=400, detail="Content is required for MCQ generation")
            result = generate_mcqs(request.content, request.count or 10)
            return {"result": result}
            
        elif req_type == "tutor":
            if not request.prompt:
                raise HTTPException(status_code=400, detail="Prompt is required for Tutor Chat")
            result = generate_tutor_reply(request.prompt, request.history or [])
            return {"result": result}
            
        elif req_type == "planner":
            if not request.subjects or not request.examDate or not request.hours:
                raise HTTPException(status_code=400, detail="subjects, examDate, and hours are required for study planner")
            result = generate_planner(request.subjects, request.examDate, request.hours)
            return {"result": result}
            
        else:
            raise HTTPException(status_code=400, detail=f"Invalid AI request type: '{request.type}'")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- DATABASE CRUD ENDPOINTS ---

# 1. AUTHENTICATION / USER PROFILE SYNC
@app.post("/api/auth", response_model=User)
async def sync_auth_user(request: AuthRequest, session: Session = Depends(get_session)):
    # Check if user already exists
    statement = select(User).where(User.uid == request.uid)
    db_user = session.exec(statement).first()
    
    if not db_user:
        # Create user
        db_user = User(
            uid=request.uid,
            email=request.email,
            display_name=request.displayName or request.email.split("@")[0],
            avatar=request.avatar or f"https://api.dicebear.com/7.x/adventurer/svg?seed={request.uid}",
            education="University Student",
            goals="Learn with AI"
        )
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
    return db_user

@app.put("/api/profile", response_model=User)
async def update_profile(
    request: ProfileUpdateRequest, 
    uid: str = Query(...), 
    session: Session = Depends(get_session)
):
    statement = select(User).where(User.uid == uid)
    db_user = session.exec(statement).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.display_name = request.displayName
    db_user.education = request.education
    db_user.goals = request.goals
    db_user.avatar = request.avatar
    
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user

@app.get("/api/profile", response_model=User)
async def get_profile(uid: str = Query(...), session: Session = Depends(get_session)):
    statement = select(User).where(User.uid == uid)
    db_user = session.exec(statement).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


# 2. NOTES
@app.get("/api/notes", response_model=List[Note])
async def get_notes(uid: str = Query(...), session: Session = Depends(get_session)):
    statement = select(Note).where(Note.uid == uid)
    return session.exec(statement).all()

@app.post("/api/notes", response_model=Note)
async def create_note(note: Note, session: Session = Depends(get_session)):
    # Check if note with same ID exists
    statement = select(Note).where(Note.id == note.id)
    db_note = session.exec(statement).first()
    if db_note:
        return db_note
        
    session.add(note)
    session.commit()
    session.refresh(note)
    return note

@app.delete("/api/notes/{note_id}")
async def delete_note(note_id: str, session: Session = Depends(get_session)):
    statement = select(Note).where(Note.id == note_id)
    db_note = session.exec(statement).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    # Also delete associated summaries, MCQSets, flashcards
    sum_stmt = select(Summary).where(Summary.note_id == note_id)
    summaries = session.exec(sum_stmt).all()
    for summary in summaries:
        session.delete(summary)
        
    mcq_stmt = select(MCQSet).where(MCQSet.note_id == note_id)
    mcqsets = session.exec(mcq_stmt).all()
    for mcqset in mcqsets:
        session.delete(mcqset)
        
    fc_stmt = select(Flashcard).where(Flashcard.note_id == note_id)
    flashcards = session.exec(fc_stmt).all()
    for flashcard in flashcards:
        session.delete(flashcard)

    session.delete(db_note)
    session.commit()
    return {"message": "Note and associated assets deleted successfully"}


# 3. SUMMARIES
@app.get("/api/summaries", response_model=List[Summary])
async def get_summaries(uid: str = Query(...), session: Session = Depends(get_session)):
    # Join Note to filter by user's uid
    statement = select(Summary).join(Note, Summary.note_id == Note.id).where(Note.uid == uid)
    return session.exec(statement).all()

@app.post("/api/summaries", response_model=Summary)
async def create_summary(summary: Summary, session: Session = Depends(get_session)):
    statement = select(Summary).where(Summary.id == summary.id)
    db_summary = session.exec(statement).first()
    if db_summary:
        return db_summary
        
    session.add(summary)
    session.commit()
    session.refresh(summary)
    return summary

@app.delete("/api/summaries/{summary_id}")
async def delete_summary(summary_id: str, session: Session = Depends(get_session)):
    statement = select(Summary).where(Summary.id == summary_id)
    db_summary = session.exec(statement).first()
    if not db_summary:
        raise HTTPException(status_code=404, detail="Summary not found")
    session.delete(db_summary)
    session.commit()
    return {"message": "Summary deleted successfully"}


# 4. MCQ SETS
@app.get("/api/mcqs", response_model=List[MCQSet])
async def get_mcqsets(uid: str = Query(...), session: Session = Depends(get_session)):
    # Join Note to filter by user's uid
    statement = select(MCQSet).join(Note, MCQSet.note_id == Note.id).where(Note.uid == uid)
    return session.exec(statement).all()

@app.post("/api/mcqs", response_model=MCQSet)
async def create_mcqset(mcqset: MCQSet, session: Session = Depends(get_session)):
    statement = select(MCQSet).where(MCQSet.id == mcqset.id)
    db_mcqset = session.exec(statement).first()
    if db_mcqset:
        return db_mcqset
        
    session.add(mcqset)
    session.commit()
    session.refresh(mcqset)
    return mcqset


# 5. FLASHCARDS
@app.get("/api/flashcards", response_model=List[Flashcard])
async def get_flashcards(uid: str = Query(...), session: Session = Depends(get_session)):
    # Join Note to filter by user's uid
    statement = select(Flashcard).join(Note, Flashcard.note_id == Note.id).where(Note.uid == uid)
    return session.exec(statement).all()

@app.post("/api/flashcards", response_model=Flashcard)
async def create_flashcard(flashcard: Flashcard, session: Session = Depends(get_session)):
    statement = select(Flashcard).where(Flashcard.id == flashcard.id)
    db_fc = session.exec(statement).first()
    if db_fc:
        return db_fc
        
    session.add(flashcard)
    session.commit()
    session.refresh(flashcard)
    return flashcard

@app.put("/api/flashcards/{fc_id}", response_model=Flashcard)
async def toggle_flashcard(fc_id: str, learned: bool, session: Session = Depends(get_session)):
    statement = select(Flashcard).where(Flashcard.id == fc_id)
    db_fc = session.exec(statement).first()
    if not db_fc:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    db_fc.learned = learned
    session.add(db_fc)
    session.commit()
    session.refresh(db_fc)
    return db_fc

@app.delete("/api/flashcards/{fc_id}")
async def delete_flashcard(fc_id: str, session: Session = Depends(get_session)):
    statement = select(Flashcard).where(Flashcard.id == fc_id)
    db_fc = session.exec(statement).first()
    if not db_fc:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    session.delete(db_fc)
    session.commit()
    return {"message": "Flashcard deleted successfully"}


# 6. STUDY PLANNER
@app.get("/api/planner", response_model=Optional[Planner])
async def get_planner(uid: str = Query(...), session: Session = Depends(get_session)):
    statement = select(Planner).where(Planner.uid == uid)
    # Get latest/only plan for user
    return session.exec(statement).first()

@app.post("/api/planner", response_model=Planner)
async def save_planner(planner: Planner, session: Session = Depends(get_session)):
    # Delete old planner for this user if exists (keep only one planner configuration)
    statement = select(Planner).where(Planner.uid == planner.uid)
    old_planners = session.exec(statement).all()
    for old_p in old_planners:
        session.delete(old_p)
        
    session.add(planner)
    session.commit()
    session.refresh(planner)
    return planner


# 7. QUIZ ATTEMPTS
@app.get("/api/quizzes", response_model=List[QuizAttempt])
async def get_quizzes(uid: str = Query(...), session: Session = Depends(get_session)):
    statement = select(QuizAttempt).where(QuizAttempt.uid == uid)
    return session.exec(statement).all()

@app.post("/api/quizzes", response_model=QuizAttempt)
async def create_quiz_attempt(attempt: QuizAttempt, session: Session = Depends(get_session)):
    statement = select(QuizAttempt).where(QuizAttempt.id == attempt.id)
    db_attempt = session.exec(statement).first()
    if db_attempt:
        return db_attempt
        
    session.add(attempt)
    session.commit()
    session.refresh(attempt)
    return attempt


# Health Check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}
