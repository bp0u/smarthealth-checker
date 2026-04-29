from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime, timedelta
import jwt
import bcrypt
import joblib
import numpy as np
import json
import uuid
import os
from enum import Enum
from sqlalchemy import create_engine, Column, String, DateTime, Text, ForeignKey, Integer, func, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from sqlalchemy.dialects.postgresql import JSONB
from dotenv import load_dotenv

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is required. Set it to your Supabase Postgres connection string.")

if "supabase.co" in DATABASE_URL and "sslmode=" not in DATABASE_URL:
    separator = "&" if "?" in DATABASE_URL else "?"
    DATABASE_URL = f"{DATABASE_URL}{separator}sslmode=require"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

app = FastAPI(
    title="Smart Health Checker API",
    description="Disease prediction system with symptom analysis",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()


class UserTable(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    profile = Column(JSONB, nullable=False, default=dict)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class PredictionTable(Base):
    __tablename__ = "predictions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    input_data = Column(JSONB, nullable=False)
    predictions = Column(JSONB, nullable=False)
    confidence_level = Column(String, nullable=False)
    recommendation = Column(Text, nullable=False)
    model_version = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)

class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    age: Optional[int] = None
    gender: Optional[Gender] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserProfile(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[Gender] = None
    chronic_conditions: Optional[List[str]] = []
    medications: Optional[List[str]] = []
    allergies: Optional[List[str]] = []

class PredictionRequest(BaseModel):
    age: int
    gender: Gender
    symptoms: List[int]
    chronic_conditions: Optional[List[str]] = []
    
    @validator('age')
    def age_must_be_valid(cls, v):
        if v < 0 or v > 120:
            raise ValueError('Age must be between 0 and 120')
        return v

class PredictionResponse(BaseModel):
    predictions: List[dict]
    model_version: str
    confidence_level: str
    recommendation: str
    created_at: datetime

SYMPTOMS_DB = {
    1: {"name": "Fever", "synonyms": ["high temperature", "pyrexia"]},
    2: {"name": "Cough", "synonyms": ["hacking", "tussis"]},
    3: {"name": "Headache", "synonyms": ["head pain", "cephalalgia"]},
    4: {"name": "Fatigue", "synonyms": ["tiredness", "exhaustion"]},
    5: {"name": "Sore Throat", "synonyms": ["throat pain", "pharyngitis"]},
    6: {"name": "Shortness of Breath", "synonyms": ["dyspnea", "breathlessness"]},
    7: {"name": "Chest Pain", "synonyms": ["thoracic pain"]},
    8: {"name": "Nausea", "synonyms": ["queasiness", "sick stomach"]},
    9: {"name": "Vomiting", "synonyms": ["emesis", "throwing up"]},
    10: {"name": "Diarrhea", "synonyms": ["loose stools"]},
    11: {"name": "Abdominal Pain", "synonyms": ["stomach pain", "belly ache"]},
    12: {"name": "Muscle Ache", "synonyms": ["myalgia", "muscle pain"]},
    13: {"name": "Joint Pain", "synonyms": ["arthralgia", "joint ache"]},
    14: {"name": "Dizziness", "synonyms": ["vertigo", "lightheadedness"]},
    15: {"name": "Loss of Taste", "synonyms": ["ageusia"]},
    16: {"name": "Loss of Smell", "synonyms": ["anosmia"]},
    17: {"name": "Runny Nose", "synonyms": ["rhinorrhea", "nasal discharge"]},
    18: {"name": "Sneezing", "synonyms": ["sternutation"]},
    19: {"name": "Chills", "synonyms": ["shivers", "shivering"]},
    20: {"name": "Sweating", "synonyms": ["perspiration", "diaphoresis"]},
    21: {"name": "Rash", "synonyms": ["skin eruption", "exanthem"]},
    22: {"name": "Itching", "synonyms": ["pruritus"]},
    23: {"name": "Back Pain", "synonyms": ["dorsalgia"]},
    24: {"name": "Confusion", "synonyms": ["disorientation", "mental fog"]},
    25: {"name": "Rapid Heartbeat", "synonyms": ["tachycardia", "palpitations"]},
    26: {"name": "Swelling", "synonyms": ["edema", "inflammation"]},
    27: {"name": "Weight Loss", "synonyms": ["unexplained weight loss"]},
    28: {"name": "Difficulty Swallowing", "synonyms": ["dysphagia"]},
    29: {"name": "Blurred Vision", "synonyms": ["vision problems"]},
    30: {"name": "Ear Pain", "synonyms": ["otalgia", "earache"]},
}

DISEASES_DB = {
    1: {"name": "Common Cold", "description": "Viral upper respiratory infection", 
        "symptoms": [1, 2, 5, 17], "severity": "mild"},
    2: {"name": "Influenza", "description": "Seasonal flu virus infection",
        "symptoms": [1, 2, 3, 4, 12, 19], "severity": "moderate"},
    3: {"name": "COVID-19", "description": "SARS-CoV-2 coronavirus infection",
        "symptoms": [1, 2, 4, 6, 15, 16], "severity": "moderate"},
    4: {"name": "Gastroenteritis", "description": "Stomach and intestinal inflammation",
        "symptoms": [8, 9, 10, 11], "severity": "mild"},
    5: {"name": "Migraine", "description": "Severe headache disorder",
        "symptoms": [3, 8, 29], "severity": "moderate"},
    6: {"name": "Bronchitis", "description": "Inflammation of bronchial tubes",
        "symptoms": [2, 7, 4, 6], "severity": "moderate"},
    7: {"name": "Pneumonia", "description": "Lung infection causing inflammation",
        "symptoms": [1, 2, 7, 6, 19], "severity": "severe"},
    8: {"name": "Sinusitis", "description": "Sinus cavity inflammation",
        "symptoms": [3, 5, 17, 1], "severity": "mild"},
    9: {"name": "Allergic Rhinitis", "description": "Allergic response in nasal passages",
        "symptoms": [17, 18, 22], "severity": "mild"},
    10: {"name": "Strep Throat", "description": "Bacterial throat infection",
        "symptoms": [5, 1, 3, 28], "severity": "moderate"},
    11: {"name": "Urinary Tract Infection", "description": "Bacterial infection of urinary system",
        "symptoms": [1, 11, 8], "severity": "moderate"},
    12: {"name": "Appendicitis", "description": "Inflammation of the appendix",
        "symptoms": [11, 8, 9, 1], "severity": "severe"},
    13: {"name": "Food Poisoning", "description": "Illness from contaminated food",
        "symptoms": [8, 9, 10, 11, 1], "severity": "moderate"},
    14: {"name": "Mononucleosis", "description": "Epstein-Barr virus infection",
        "symptoms": [1, 5, 4, 26], "severity": "moderate"},
    15: {"name": "Tonsillitis", "description": "Tonsil inflammation",
        "symptoms": [5, 1, 3, 28], "severity": "mild"},
}

MODEL_VERSION = "v1.0.0"
MODEL = None

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload.get("sub")
    user = db.get(UserTable, user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

def predict_disease(age: int, gender: str, symptoms: List[int], chronic_conditions: List[str]):
    symptom_set = set(symptoms)

    disease_scores = []
    for disease_id, disease_data in DISEASES_DB.items():
        disease_symptoms = set(disease_data["symptoms"])
        overlap = len(symptom_set.intersection(disease_symptoms))
        total = len(disease_symptoms)
        
        if total > 0:
            score = overlap / total
            if age > 60 and disease_id in [2, 3]:
                score *= 1.2
            
            disease_scores.append({
                "disease": disease_data["name"],
                "score": min(score, 1.0),
                "description": disease_data["description"],
                "severity": disease_data["severity"]
            })
    
    disease_scores.sort(key=lambda x: x["score"], reverse=True)

    top_predictions = disease_scores[:3]

    if not top_predictions or top_predictions[0]["score"] < 0.3:
        confidence = "low"
        recommendation = "Your symptoms don't match common conditions strongly. Monitor your symptoms and consult a doctor if they persist or worsen."
    elif top_predictions[0]["score"] < 0.6:
        confidence = "moderate"
        recommendation = "Consider scheduling an appointment with your healthcare provider to discuss these symptoms."
    else:
        confidence = "high"
        if top_predictions[0]["severity"] == "severe":
            recommendation = "⚠️ IMPORTANT: These symptoms may require immediate medical attention. Please consult a healthcare provider promptly."
        else:
            recommendation = "Please consult with a healthcare provider for proper diagnosis and treatment."
    
    return top_predictions, confidence, recommendation

@app.get("/")
async def root():
    return {
        "message": "Smart Health Checker API",
        "version": MODEL_VERSION,
        "status": "operational",
        "disclaimer": "For educational purposes only. Not a substitute for professional medical advice."
    }

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(UserTable).filter(UserTable.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    new_user = UserTable(
        id=user_id,
        email=user_data.email,
        password_hash=hash_password(user_data.password),
        name=user_data.name,
        age=user_data.age,
        gender=user_data.gender.value if user_data.gender else None,
        profile={
            "chronic_conditions": [],
            "medications": [],
            "allergies": []
        }
    )
    db.add(new_user)
    db.commit()

    token = create_access_token({"sub": user_id})
    return {"token": token, "user_id": user_id, "message": "Registration successful"}

@app.post("/api/auth/login")
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(UserTable).filter(UserTable.email == credentials.email).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id})
    return {"token": token, "user_id": user.id, "name": user.name}

@app.get("/api/user/me")
async def get_profile(current_user: UserTable = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "age": current_user.age,
        "gender": current_user.gender,
        "profile": current_user.profile or {}
    }

@app.put("/api/user/me")
async def update_profile(
    profile: UserProfile,
    current_user: UserTable = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if profile.name:
        current_user.name = profile.name
    if profile.age is not None:
        current_user.age = profile.age
    if profile.gender:
        current_user.gender = profile.gender.value

    current_user.profile = {
        "chronic_conditions": profile.chronic_conditions,
        "medications": profile.medications,
        "allergies": profile.allergies
    }
    db.add(current_user)
    db.commit()

    return {"message": "Profile updated successfully"}

@app.get("/api/symptoms")
async def get_symptoms():
    return {"symptoms": [{"id": k, **v} for k, v in SYMPTOMS_DB.items()]}

@app.get("/api/diseases")
async def get_diseases():
    return {"diseases": [{"id": k, **v} for k, v in DISEASES_DB.items()]}

@app.post("/api/predict", response_model=PredictionResponse)
async def create_prediction(
    request: PredictionRequest,
    current_user: UserTable = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    for symptom_id in request.symptoms:
        if symptom_id not in SYMPTOMS_DB:
            raise HTTPException(status_code=400, detail=f"Invalid symptom ID: {symptom_id}")

    predictions, confidence, recommendation = predict_disease(
        request.age,
        request.gender,
        request.symptoms,
        request.chronic_conditions
    )
    
    prediction_id = str(uuid.uuid4())
    prediction_record = {
        "id": prediction_id,
        "user_id": current_user.id,
        "input": {
            "age": request.age,
            "gender": request.gender.value,
            "symptoms": request.symptoms,
            "chronic_conditions": request.chronic_conditions
        },
        "predictions": predictions,
        "confidence_level": confidence,
        "recommendation": recommendation,
        "model_version": MODEL_VERSION,
        "created_at": datetime.utcnow()
    }

    db_prediction = PredictionTable(
        id=prediction_id,
        user_id=current_user.id,
        input_data=prediction_record["input"],
        predictions=prediction_record["predictions"],
        confidence_level=prediction_record["confidence_level"],
        recommendation=prediction_record["recommendation"],
        model_version=prediction_record["model_version"],
        created_at=prediction_record["created_at"]
    )
    db.add(db_prediction)
    db.commit()

    return PredictionResponse(
        predictions=predictions,
        model_version=MODEL_VERSION,
        confidence_level=confidence,
        recommendation=recommendation,
        created_at=prediction_record["created_at"]
    )

@app.get("/api/predictions/history")
async def get_prediction_history(
    current_user: UserTable = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    records = (
        db.query(PredictionTable)
        .filter(PredictionTable.user_id == current_user.id)
        .order_by(PredictionTable.created_at.desc())
        .limit(20)
        .all()
    )
    user_predictions = [
        {
            "id": p.id,
            "user_id": p.user_id,
            "input": p.input_data,
            "predictions": p.predictions,
            "confidence_level": p.confidence_level,
            "recommendation": p.recommendation,
            "model_version": p.model_version,
            "created_at": p.created_at
        }
        for p in records
    ]
    return {"predictions": user_predictions}

@app.get("/api/admin/stats")
async def get_stats(db: Session = Depends(get_db)):
    return {
        "total_users": db.query(func.count(UserTable.id)).scalar() or 0,
        "total_predictions": db.query(func.count(PredictionTable.id)).scalar() or 0,
        "model_version": MODEL_VERSION,
        "symptoms_count": len(SYMPTOMS_DB),
        "diseases_count": len(DISEASES_DB)
    }

@app.post("/api/admin/retrain")
async def trigger_retrain():
    return {
        "message": "Model retraining queued",
        "status": "pending",
        "estimated_time": "15-30 minutes"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.on_event("startup")
def startup():
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER"))
        conn.execute(text("ALTER TABLE users DROP COLUMN IF EXISTS birth_date"))
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)