from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
import database, schemas
from database import get_db

router = APIRouter(prefix="/api", tags=["Auth"])

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if user.password != user.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing = db.query(database.User).filter(
        or_(database.User.username == user.username, database.User.email == user.email)
    ).first()
    
    if existing: 
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    db_user = database.User(
        username=user.username, 
        email=user.email, 
        password=user.password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"id": db_user.id, "username": db_user.username, "email": db_user.email}

@router.post("/login")
def login(user: schemas.UserAuth, db: Session = Depends(get_db)):
    db_user = db.query(database.User).filter(
        or_(database.User.username == user.identifier, database.User.email == user.identifier),
        database.User.password == user.password
    ).first()
    
    if not db_user: 
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    return {"id": db_user.id, "username": db_user.username}