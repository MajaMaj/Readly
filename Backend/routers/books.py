from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, schemas
import httpx
from database import get_db 

router = APIRouter(prefix="/api", tags=["Books"])

@router.get("/search")
async def search(q: str):
    clean_q = q.replace("-", "").replace(" ", "")
    url = f"https://openlibrary.org/search.json?q={clean_q}&limit=12"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        return res.json()

@router.get("/my-books/{user_id}")
def get_my_books(user_id: int, db: Session = Depends(get_db)):
    return db.query(database.UserBook).filter(database.UserBook.user_id == user_id).all()

@router.post("/my-books")
def save_book(book: schemas.BookSave, db: Session = Depends(get_db)):
    new_item = database.UserBook(**book.model_dump())
    db.add(new_item)
    db.commit()
    return {"message": "Zapisano"}

@router.put("/my-books/{book_id}/rate")
def rate_book(book_id: int, payload: schemas.RateBook, db: Session = Depends(get_db)):
    book = db.query(database.UserBook).filter(database.UserBook.id == book_id).first()
    if not book: raise HTTPException(status_code=404)
    book.rating = payload.rating
    db.commit()
    return {"message": "Oceniono"}

@router.delete("/my-books/{book_id}")
def delete_book(book_id: int, db: Session = Depends(get_db)):
    book = db.query(database.UserBook).filter(database.UserBook.id == book_id).first()
    if not book: raise HTTPException(status_code=404)
    db.delete(book)
    db.commit()
    return {"message": "Usunięto"}