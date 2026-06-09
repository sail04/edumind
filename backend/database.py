import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session

# Load environment variables
load_dotenv()

# Determine database url
DATABASE_URL = os.environ.get("DATABASE_URL")

# Resolve render/railway postgres url dialect replacement if needed
if DATABASE_URL:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
else:
    # SQLite local fallback
    DATABASE_URL = "sqlite:///edumind.db"

# Create Database engine
# SQLite needs connect_args={"check_same_thread": False} for FastAPI requests concurrency
is_sqlite = DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if is_sqlite else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)

def create_db_and_tables():
    # Renders tables inside database
    SQLModel.metadata.create_all(engine)

def get_session():
    # FastAPI session provider
    with Session(engine) as session:
        yield session
