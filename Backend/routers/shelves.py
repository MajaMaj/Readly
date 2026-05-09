from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import database, schemas
from database import get_db

router = APIRouter(prefix="/api/shelves", tags=["Shelves"])


@router.get("/{user_id}", response_model=list[schemas.Shelf])
def get_shelves(user_id: int, db: Session = Depends(get_db)):
    return db.query(database.Shelf).filter(database.Shelf.user_id == user_id).all()


@router.get("/single/{shelf_id}", response_model=schemas.Shelf)
def get_shelf(shelf_id: int, db: Session = Depends(get_db)):
    shelf = db.query(database.Shelf).filter(database.Shelf.id == shelf_id).first()
    if not shelf:
        raise HTTPException(status_code=404, detail="Shelf not found")
    return shelf


@router.post("/", response_model=schemas.Shelf)
def create_shelf(shelf: schemas.ShelfCreate, db: Session = Depends(get_db)):
    db_shelf = database.Shelf(name=shelf.name, user_id=shelf.user_id)
    db.add(db_shelf)
    db.commit()
    db.refresh(db_shelf)
    return db_shelf


@router.post("/{shelf_id}/books")
def add_book_to_shelf(shelf_id: int, book: schemas.BookSave, db: Session = Depends(get_db)):
    shelf = db.query(database.Shelf).filter(database.Shelf.id == shelf_id).first()
    if not shelf:
        raise HTTPException(status_code=404, detail="Shelf not found")

    existing = db.query(database.ShelfBook).filter(
        database.ShelfBook.shelf_id == shelf_id,
        database.ShelfBook.book_id == book.google_books_id
    ).first()

    if existing:
        return {"ok": True}

    db_book = database.ShelfBook(
        shelf_id=shelf_id,
        book_id=book.google_books_id,
        title=book.title,
        author=book.author,
        image_url=book.image_url
    )

    db.add(db_book)
    db.commit()
    return {"ok": True}


@router.delete("/{shelf_id}/books/{book_id}")
def remove_book_from_shelf(shelf_id: int, book_id: str, db: Session = Depends(get_db)):
    book = db.query(database.ShelfBook).filter(
        database.ShelfBook.shelf_id == shelf_id,
        database.ShelfBook.book_id == book_id
    ).first()

    if not book:
        raise HTTPException(status_code=404, detail="Not found")

    db.delete(book)
    db.commit()
    return {"ok": True}