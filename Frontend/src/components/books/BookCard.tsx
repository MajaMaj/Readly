import React from "react";
import { useNavigate } from "react-router-dom";
import type { Book } from "../../types";

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const slug = book.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    navigate(`/books/${slug}`, { state: { bookId: book.id } });
  };

  return (
    <div
      className="card border-0 bg-transparent h-100"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
    >
      <div className="text-center mb-3" style={{ minHeight: "220px" }}>
        {book.image_url ? (
          <img
            src={book.image_url}
            alt={book.title}
            className="img-fluid rounded-4 shadow-sm"
            style={{
              aspectRatio: "2/3",
              objectFit: "cover",
              width: "90%",
              height: "auto",
            }}
          />
        ) : (
          <div
            className="rounded-4 shadow-sm d-flex flex-column align-items-center justify-content-center mx-auto p-2"
            style={{
              aspectRatio: "2/3",
              width: "90%",
              backgroundColor: "var(--readly-light-gold)",
              color: "var(--readly-primary)",
            }}
          >
            <i
              className="bi bi-book mb-2 opacity-50"
              style={{ fontSize: "3rem" }}
            ></i>
            <span className="small fw-bold text-truncate w-100 px-2">
              {book.title}
            </span>
          </div>
        )}
      </div>
      <div className="d-flex flex-column flex-grow-1 px-2">
        <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
          <div className="overflow-hidden">
            <h6
              className="fw-bold mb-1 text-truncate"
              style={{ color: "var(--readly-primary)" }}
            >
              {book.title}
            </h6>
            <p className="small text-muted mb-0 text-truncate">{book.author}</p>
          </div>
          <div className="small d-flex align-items-center bg-white px-2 py-1 rounded-pill shadow-sm">
            <i
              className="bi bi-star-fill me-1"
              style={{ color: "var(--readly-gold)" }}
            ></i>
            <span className="fw-bold">{book.rating || "5.0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
