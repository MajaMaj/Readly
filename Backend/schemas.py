from pydantic import BaseModel, EmailStr

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
    cover_id: str | None = None

class RateBook(BaseModel):
    rating: int