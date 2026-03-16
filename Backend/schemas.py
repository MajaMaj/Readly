from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    confirmPassword: str 

class UserAuth(BaseModel):
    identifier: str
    password: str

class BookSave(BaseModel):
    user_id: int
    title: str
    author: str
    cover_id: Optional[str] = None

class RateBook(BaseModel):
    rating: int