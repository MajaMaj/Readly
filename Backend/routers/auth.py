from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
import database, schemas
from database import get_db
import jwt
from datetime import datetime, timedelta, timezone
from fastapi_mail import FastMail, MessageSchema, MessageType
from mail_config import conf

SECRET_KEY = "readly_secure_key_for_jwt_tokens_2026_fixed"
ALGORITHM = "HS256"

router = APIRouter(prefix="/api", tags=["Auth"])

def create_reset_token(email: str):
    expire = datetime.now(timezone.utc) + timedelta(hours=1)
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if user.password != user.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    existing = db.query(database.User).filter(
        or_(database.User.username == user.username, database.User.email == user.email)
    ).first()
    if existing: 
        raise HTTPException(status_code=400, detail="Username or email already exists")
    db_user = database.User(username=user.username, email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"id": db_user.id}

@router.post("/login")
def login(user: schemas.UserAuth, db: Session = Depends(get_db)):
    db_user = db.query(database.User).filter(
        or_(database.User.username == user.identifier, database.User.email == user.identifier)
    ).first()
    
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=400, detail="Incorrect identifier or password")

    access_token_expires = timedelta(minutes=60)
    expire = datetime.now(timezone.utc) + access_token_expires
    to_encode = {"sub": str(db_user.id), "exp": expire}
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "access_token": token, 
        "token_type": "bearer", 
        "id": db_user.id, 
        "username": db_user.username
    }

@router.post("/forgot-password")
async def forgot_password(data: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(database.User).filter(database.User.email == data.email).first()
    if user:
        token = create_reset_token(user.email)
        reset_link = f"http://localhost:5173/reset-password?token={token}"
        
        html_content = f"""
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Readly Password Reset</h2>
            <p>Click the button below to set a new password:</p>
            <a href="{reset_link}" style="background: #C19A6B; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px;">RESET PASSWORD</a>
        </div>
        """

        message = MessageSchema(
            subject="Readly - Password Reset",
            recipients=[user.email],
            body=html_content,
            subtype=MessageType.html
        )

        try:
            fm = FastMail(conf)
            await fm.send_message(message)
        except Exception as e:
            print(f"SMTP Error: {str(e)}")
            raise HTTPException(status_code=500, detail="Mail error")
    
    return {"detail": "Link sent"}

@router.post("/reset-password-confirm")
def reset_password_confirm(token: str, data: schemas.ResetPasswordConfirm, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        user = db.query(database.User).filter(database.User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        user.password = data.password
        db.commit()
        return {"detail": "Success"}
    except:
        raise HTTPException(status_code=400, detail="Invalid token")