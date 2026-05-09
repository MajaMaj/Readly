import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookService } from "../services/books";
import type { Review, Book } from "../types";

interface ReviewWithBook extends Review {
  bookDetails?: Book;
}

export const ReviewsPage = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewWithBook[]>([]);
  const [loading, setLoading] = useState(true);

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const loadReviews = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await bookService.getUserReviews(String(user.id));

        const enhancedReviews = await Promise.all(
          data.map(async (rev) => {
            try {
              const bookDetails = await bookService.getBookDetails(rev.bookId);
              return { ...rev, bookDetails };
            } catch {
              return rev;
            }
          })
        );

        setReviews(enhancedReviews);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [user?.id]);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, index) => (
      <i
        key={index}
        className={`bi bi-star-fill me-1 ${
          index < rating ? "text-warning" : "text-light"
        }`}
        style={{ fontSize: "0.9rem" }}
      />
    ));

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: "var(--readly-gray)" }}
      >
        <div className="spinner-border text-warning" />
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-5"
      style={{ background: "var(--readly-gray)" }}
    >
      <div className="container py-5">
        <h1 className="fw-bold mb-5" style={{ color: "var(--readly-primary)" }}>
          My Reviews
        </h1>

        <div className="row g-4">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div key={rev.id} className="col-12">
                <div
                  className="bg-white p-4 rounded-5 shadow-sm d-flex align-items-center gap-4"
                  style={{ cursor: "pointer", transition: "transform 0.2s" }}
                  onClick={() =>
                    navigate(
                      `/books/${encodeURIComponent(rev.bookDetails?.title || rev.bookId)}`,
                      {
                        state: { bookId: rev.bookId },
                      }
                    )
                  }
                >
                  <img
                    src={
                      rev.bookDetails?.image_url?.replace(
                        "http://",
                        "https://"
                      ) || ""
                    }
                    alt=""
                    style={{
                      width: "80px",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "15px",
                    }}
                  />

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h5
                          className="fw-bold mb-1"
                          style={{ color: "var(--readly-primary)" }}
                        >
                          {rev.bookDetails?.title || "Book " + rev.bookId}
                        </h5>
                        <div className="mb-2">{renderStars(rev.rating)}</div>
                      </div>
                      <small className="text-muted">
                        {rev.createdAt
                          ? new Date(rev.createdAt).toLocaleDateString()
                          : ""}
                      </small>
                    </div>
                    <p className="mb-0" style={{ fontStyle: "italic" }}>
                      "{rev.content}"
                    </p>
                  </div>
                  <i className="bi bi-chevron-right text-muted opacity-50"></i>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="bg-white p-5 rounded-5 shadow-sm">
                <i className="bi bi-chat-left-text fs-1 text-muted mb-3 d-block"></i>
                <p className="text-muted mb-0">
                  You haven't written any reviews yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
