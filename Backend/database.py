import datetime
from sqlalchemy import DateTime, Text, create_engine, Column, Integer, String, ForeignKey, func
from sqlalchemy.orm import sessionmaker, relationship, declarative_base

DATABASE_URL = "sqlite:///./readly.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    profile_image = Column(String, nullable=True)
    description = Column(String, nullable=True)

    books = relationship("UserBook", back_populates="user")


class UserBook(Base):
    __tablename__ = "user_books"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    author = Column(String)
    cover_id = Column(String, nullable=True)
    rating = Column(Integer, default=0)

    user = relationship("User", back_populates="books")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(String, index=True)
    user_id = Column(String, index=True)
    username = Column(String)
    rating = Column(Integer)
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Shelf(Base):
    __tablename__ = "shelves"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    books = relationship("ShelfBook", back_populates="shelf", cascade="all, delete")


class ShelfBook(Base):
    __tablename__ = "shelf_books"

    id = Column(Integer, primary_key=True, index=True)
    shelf_id = Column(Integer, ForeignKey("shelves.id"))
    book_id = Column(String, nullable=False)
    title = Column(String)
    author = Column(String)
    image_url = Column(String)

    shelf = relationship("Shelf", back_populates="books")


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()