from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, schemas
from database import get_db

router = APIRouter(prefix="/api/books", tags=["Books"])

@router.post("/save")
def save_book(book: schemas.BookSave, db: Session = Depends(get_db)):
    db_book = database.Book(
        title=book.title,
        author=book.author,
        description=book.description,
        image_url=book.image_url,
        google_books_id=book.google_books_id
    )
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book