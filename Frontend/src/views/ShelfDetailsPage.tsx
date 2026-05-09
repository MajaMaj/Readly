import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookService } from "../services/books";
import type { Shelf } from "../types";

export const ShelfDetailsPage = () => {
  const { shelfId } = useParams();
  const navigate = useNavigate();

  const [shelf, setShelf] = useState<Shelf | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!shelfId) return;
      const data = await bookService.getShelf(shelfId);
      setShelf(data);
    };

    load();
  }, [shelfId]);

  if (!shelf) return null;

  return (
    <div
      className="min-vh-100 py-5"
      style={{ background: "var(--readly-gray)" }}
    >
      <div className="container py-5">
        <button
          className="btn btn-link mb-4 text-decoration-none fw-bold p-0"
          style={{ color: "var(--readly-primary)" }}
          onClick={() => navigate("/dashboard/shelves")}
        >
          <i className="bi bi-arrow-left me-2"></i> Back to Shelves
        </button>

        <h1 className="mb-4" style={{ color: "var(--readly-primary)" }}>
          {shelf.name}
        </h1>

        <div className="row g-4 content-wrapper" style={{ minHeight: "400px" }}>
          {shelf.books && shelf.books.length > 0 ? (
            shelf.books.map((book) => (
              <div
                key={book.id}
                className="col-6 col-md-4 col-lg-3"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  // ZMIANA: Nawigujemy po tytule, aby pasowało do /books/:title
                  // Dodatkowo przekazujemy book_id w state, żeby BookDetailsPage wiedziało co pobrać
                  navigate(`/books/${encodeURIComponent(book.title)}`, {
                    state: { bookId: book.book_id || book.id },
                  })
                }
              >
                <div className="bg-white p-3 rounded-5 shadow-sm h-100">
                  <img
                    src={book.image_url?.replace("http://", "https://") || ""}
                    alt={book.title}
                    style={{
                      width: "100%",
                      height: "280px",
                      objectFit: "cover",
                      borderRadius: "20px",
                    }}
                  />
                  <h6 className="mt-3 mb-1 text-truncate">{book.title}</h6>
                  <p className="text-muted small mb-0">{book.author}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="bg-white p-5 rounded-5 shadow-sm">
                <i className="bi bi-book-half fs-1 text-muted mb-3 d-block"></i>
                <p className="text-muted">This shelf is empty.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
