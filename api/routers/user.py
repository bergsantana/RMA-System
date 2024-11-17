from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from auth.auth import create_access_token, authenticate_user, get_password_hash,  validate_token
from database import SessionLocal
from schemas import UserCreate, Token, LoginDTO
from models.user import User
from utils.utils import get_session_local
from fastapi.security import OAuth2PasswordBearer 

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")


@router.post("/token" )
def login_for_access_token(form_data: LoginDTO, db: Session = Depends(get_session_local)):
    user = authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})

    me = db.query(User).filter(User.email == form_data.email).one()

    return {"access_token": access_token, "token_type": "bearer", "me": me }


@router.post('/signup')
def signup(form_datas: list[UserCreate], db: Session = Depends(get_session_local)):
    for form_data in form_datas:
        hashed_pass =get_password_hash(form_data.password)
        user = User(username=form_data.username, email=form_data.email, hashed_password=hashed_pass, role='employee')
        db.add(user)
        db.commit()
        db.refresh(user)
        print(user.__dict__)
    return user

@router.get('/{id}')
def get_user_by_id(id: int, token: str = Depends(oauth2_scheme), db: Session = Depends(get_session_local)):

    
    return db.query(User).filter(User.id == id).one()