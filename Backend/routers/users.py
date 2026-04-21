import shutil
import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from sqlalchemy.orm import Session
import database
import schemas

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/me", response_model=schemas.User)
def get_current_user(db: Session = Depends(database.get_db)):
    user = db.query(database.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/upload-avatar")
def upload_avatar(request: Request, file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    user = db.query(database.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    upload_dir = "static/profiles"
    os.makedirs(upload_dir, exist_ok=True)
    
    file_extension = os.path.splitext(file.filename)[1]
    file_name = f"user_{user.id}{file_extension}"
    file_path = os.path.join(upload_dir, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    base_url = str(request.base_url).rstrip("/")
    user.profile_image = f"{base_url}/{file_path}"
    
    db.commit()
    return {"url": user.profile_image}

@router.put("/update-profile")
def update_profile(data: schemas.ProfileUpdate, db: Session = Depends(database.get_db)):
    user = db.query(database.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if data.description is not None:
        user.description = data.description
        
    if data.password:
        user.password = data.password
        
    db.commit()
    db.refresh(user)
    return {"message": "Profile updated successfully", "description": user.description}