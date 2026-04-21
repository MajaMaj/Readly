from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional

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

class BookBase(BaseModel):
    title: str
    author: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    google_books_id: str

class BookSave(BookBase):
    pass

class Book(BookBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)
class User(BaseModel):
    id: int
    username: str
    email: str
    profile_image: Optional[str] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    description: Optional[str] = None
    password: Optional[str] = None

class ProfileUpdate(BaseModel):
    description: Optional[str] = None
    password: Optional[str] = None