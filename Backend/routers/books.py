from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import database, schemas
from database import get_db

router = APIRouter(prefix="/api/books", tags=["Books"])

@router.get("/{book_id}/reviews", response_model=list[schemas.Review])
def get_reviews(book_id: str, db: Session = Depends(get_db)):
    return db.query(database.Review).filter(database.Review.book_id == book_id).all()

@router.post("/{book_id}/reviews", response_model=schemas.Review)
def add_review(book_id: str, review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    db_review = database.Review(book_id=book_id, **review.model_dump())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.put("/reviews/{review_id}", response_model=schemas.Review)
def update_review(review_id: int, review_update: schemas.ReviewUpdate, db: Session = Depends(get_db)):
    db_review = db.query(database.Review).filter(database.Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db_review.rating = review_update.rating
    db_review.content = review_update.content
    db.commit()
    db.refresh(db_review)
    return db_review

