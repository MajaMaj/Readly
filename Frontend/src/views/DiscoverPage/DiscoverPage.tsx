import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookService } from "../../services/books";
import { BookCard } from "../../components/books/BookCard";
import type { Book } from "../../types";

const CATEGORIES = [
  "Fiction",
  "Fantasy",
  "Romance",
  "Thriller",
  "History",
  "Science",
];

export const DiscoverPage = () => {
  const navigate = useNavigate();
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [categoryBooks, setCategoryBooks] = useState<Book[]>([]);

  const [loadingTrending, setLoadingTrending] = useState(true);
  const [loadingCategory, setLoadingCategory] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await bookService.getTrendingBooks();
        setTrendingBooks(data);
      } catch {
        setError("Failed to load trending books.");
      } finally {
        setLoadingTrending(false);
      }
    };
    loadTrending();
  }, []);

  useEffect(() => {
    const loadCategory = async () => {
      setLoadingCategory(true);
      try {
        const data = await bookService.getCategoryBooks(activeCategory);
        setCategoryBooks(data);
      } catch {
        setError("Failed to load category books.");
      } finally {
        setLoadingCategory(false);
      }
    };
    loadCategory();
  }, [activeCategory]);

  const handleReadNow = (book: Book) => {
    const slug = book.title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    navigate(`/books/${slug}`, { state: { bookId: book.id } });
  };

  if (loadingTrending) {
    return (
      <div
        className="pt-5 d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh", backgroundColor: "var(--readly-gray)" }}
      >
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 fw-bold text-primary">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error && trendingBooks.length === 0) {
    return (
      <div
        className="pt-5 d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh", backgroundColor: "var(--readly-gray)" }}
      >
        <div className="container text-center py-5">
          <i
            className="bi bi-cloud-slash text-danger"
            style={{ fontSize: "3rem" }}
          ></i>
          <h3 className="mt-3 fw-bold">Oops!</h3>
          <p className="text-muted">{error}</p>
          <button
            className="btn btn-primary mt-3 rounded-pill px-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="pt-5"
      style={{ minHeight: "100vh", backgroundColor: "var(--readly-gray)" }}
    >
      <div className="container py-5">
        {trendingBooks.length > 0 && (
          <div
            className="row align-items-center mb-5 bg-white rounded-5 shadow-sm p-4 p-lg-5 border"
            style={{
              borderColor: "var(--readly-light-gold)",
              minHeight: "480px",
            }}
          >
            <div className="col-lg-6 text-center text-lg-start mb-4 mb-lg-0 pe-lg-5">
              <span
                className="badge rounded-pill px-3 py-2 mb-3 fw-bold"
                style={{
                  backgroundColor: "var(--readly-light-gold)",
                  color: "var(--readly-gold)",
                }}
              >
                Trending Now
              </span>
              <h1
                className="display-4 fw-bolder mb-3"
                style={{ color: "var(--readly-primary)" }}
              >
                {trendingBooks[0].title}
              </h1>
              <p className="text-muted mb-4 fs-5">
                Dive into the masterpiece by{" "}
                <strong className="text-dark">{trendingBooks[0].author}</strong>
                .
              </p>
              <button
                className="btn btn-primary px-5 py-3 rounded-pill fw-bold shadow-sm"
                onClick={() => handleReadNow(trendingBooks[0])}
              >
                Read Now
              </button>
            </div>

            <div
              className="col-lg-6 d-flex justify-content-center align-items-center"
              style={{ minHeight: "350px" }}
            >
              {trendingBooks[0].image_url ? (
                <img
                  src={trendingBooks[0].image_url}
                  alt={trendingBooks[0].title}
                  className="img-fluid rounded-4 shadow-lg"
                  style={{
                    height: "350px",
                    width: "auto",
                    aspectRatio: "2/3",
                    objectFit: "cover",
                    border: "4px solid var(--readly-light-gold)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleReadNow(trendingBooks[0])}
                />
              ) : (
                <div
                  className="rounded-4 shadow-lg d-flex flex-column align-items-center justify-content-center text-center p-3"
                  style={{
                    height: "350px",
                    aspectRatio: "2/3",
                    backgroundColor: "var(--readly-light-gold)",
                    border: "4px solid var(--readly-light-gold)",
                    color: "var(--readly-primary)",
                    cursor: "pointer",
                  }}
                  onClick={() => handleReadNow(trendingBooks[0])}
                >
                  <i
                    className="bi bi-book mb-3"
                    style={{ fontSize: "5rem" }}
                  ></i>
                  <span className="fw-bold fs-5">{trendingBooks[0].title}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="row mt-4 mb-5">
          <div className="col-12 mb-4 d-flex align-items-center">
            <h5
              className="fw-bold text-uppercase mb-0 me-3"
              style={{ color: "var(--readly-primary)", letterSpacing: "1px" }}
            >
              Trending Books
            </h5>
            <div
              className="flex-grow-1 rounded"
              style={{
                height: "2px",
                backgroundColor: "var(--readly-light-gold)",
              }}
            ></div>
          </div>

          {trendingBooks.slice(1, 5).map((book) => (
            <div key={book.id} className="col-6 col-md-3 mb-4">
              <BookCard book={book} />
            </div>
          ))}
        </div>

        <div className="row mt-5">
          <div className="col-12 mb-4 d-flex align-items-center">
            <h5
              className="fw-bold text-uppercase mb-0 me-3"
              style={{ color: "var(--readly-primary)", letterSpacing: "1px" }}
            >
              Explore by Category
            </h5>
            <div
              className="flex-grow-1 rounded"
              style={{
                height: "2px",
                backgroundColor: "var(--readly-light-gold)",
              }}
            ></div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-5 justify-content-center justify-content-md-start">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`btn rounded-pill px-4 py-2 fw-bold shadow-sm ${activeCategory === category ? "btn-primary" : "btn-light text-muted"}`}
              style={
                activeCategory !== category
                  ? { border: "1px solid #dee2e6" }
                  : {}
              }
            >
              {category}
            </button>
          ))}
        </div>

        <div className="row">
          {loadingCategory ? (
            <div className="col-12 text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            categoryBooks.slice(0, 8).map((book) => (
              <div key={book.id} className="col-6 col-md-3 mb-5">
                <BookCard book={book} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
