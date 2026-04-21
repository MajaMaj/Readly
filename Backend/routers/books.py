from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, schemas
from database import get_db

router = APIRouter(prefix="/api/books", tags=["Books"])

@router.get("/latest", response_model=list[schemas.Book])
def get_latest_books(db: Session = Depends(get_db)):
    return db.query(database.Book).order_by(database.Book.id.desc()).limit(3).all()