import { useEffect, useState } from "react";
import { bookService } from "../../services/books";
import type { Book } from "../../types";

export const DiscoverPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooks = async () => {
      const data = await bookService.getDiscoverBooks();
      setBooks(data);
      setLoading(false);
    };
    loadBooks();
  }, []);

  if (loading) {
    return (
      <div className="pt-5">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-3 fw-bold">Loading trending books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-5">
      <div className="container py-5">
        {books.length > 0 && (
          <div className="row align-items-center mb-5">
            <div className="col-lg-4">
              <h1>
                New &<br />
                Trending
              </h1>
              <p className="text-muted my-4 fs-5">
                Explore newest worlds from top authors
              </p>
              <div
                className={`d-flex align-items-center rounded-pill px-3 py-2 `}
              >
                <i className="bi bi-search text-muted me-2"></i>
                <input
                  type="text"
                  placeholder="Titles, authors, topics..."
                  className="form-control border-0 bg-transparent p-0 shadow-none"
                />
              </div>
            </div>

            <div className="col-lg-4 text-center">
              <img src={books[0].image_url} alt="Featured Book" />
            </div>

            <div className="col-lg-4 d-flex justify-content-end">
              <div className={`rounded-4 p-4 `}>
                <span className="text-uppercase small fw-bold text-muted d-block mb-3">
                  Top Author
                </span>
                <div className={`rounded-4 p-3 `}>
                  <span className="fw-bold d-block mb-1 text-truncate">
                    {books[0].author}
                  </span>
                  <p className="small text-muted mb-0">Discover more works</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BESTSELLERS GRID */}
        <div className="row">
          <div className="col-12 mb-4">
            <h5 className="fw-bold text-muted text-uppercase small">
              Recent Releases
            </h5>
          </div>
          {books.slice(1, 9).map((book) => (
            <div key={book.id} className="col-6 col-md-3 mb-5">
              <div className="card border-0 bg-transparent h-100">
                <img src={book.image_url} alt={book.title} />
                <div className="mt-3">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div className="overflow-hidden">
                      <h6 className="fw-bold mb-1 text-truncate">
                        {book.title}
                      </h6>
                      <p className="small text-muted mb-0 text-truncate">
                        {book.author}
                      </p>
                    </div>
                    <div className="small d-flex align-items-center">
                      <i className="bi bi-star-fill text-warning me-1"></i>
                      <span className="fw-bold">{book.rating}</span>
                    </div>
                  </div>
                  <button className={`btn w-100 mt-3 rounded-pill`}>
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
