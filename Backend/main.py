from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import database
from routers.auth import router as auth_router
from routers.books import router as books_router
from routers.users import router as users_router
from routers.shelves import router as shelves_router
import os

os.makedirs("static/profiles", exist_ok=True)

app = FastAPI()

database.init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(auth_router)
app.include_router(books_router)
app.include_router(users_router)
app.include_router(shelves_router)