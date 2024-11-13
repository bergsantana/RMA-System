from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth.auth import create_access_token, authenticate_user
from database import SessionLocal
from schemas import UserCreate, Token

router = APIRouter()

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: UserCreate, db: Session = Depends(SessionLocal)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
