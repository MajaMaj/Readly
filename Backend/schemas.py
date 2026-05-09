from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    confirmPassword: str


class UserAuth(BaseModel):
    identifier: str
    password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordConfirm(BaseModel):
    password: str


class ProfileUpdate(BaseModel):
    description: Optional[str] = None
    password: Optional[str] = None


class User(BaseModel):
    id: int
    username: str
    email: str
    profile_image: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class BookBase(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    google_books_id: str


class BookSave(BookBase):
    pass


class Book(BaseModel):
    id: int
    title: str
    author: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    google_books_id: str

    model_config = ConfigDict(from_attributes=True)


class ReviewBase(BaseModel):
    rating: int
    content: str


class ReviewCreate(ReviewBase):
    user_id: str
    username: str


class ReviewUpdate(ReviewBase):
    pass


class Review(BaseModel):
    id: int
    book_id: str
    user_id: str
    username: str
    rating: int
    content: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class BookInShelf(BaseModel):
    id: int
    book_id: str
    title: str
    author: str
    image_url: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class ShelfBase(BaseModel):
    name: str


class ShelfCreate(ShelfBase):
    user_id: int


class Shelf(BaseModel):
    id: int
    name: str
    user_id: int
    books: list[BookInShelf] = []

class ShelfBook(BaseModel):
    id: int
    shelf_id: int
    book_id: str
    title: str
    author: str
    image_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)