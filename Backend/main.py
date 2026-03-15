from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database
from routers import auth, books

app = FastAPI(title="Readly API")
database.init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(books.router)