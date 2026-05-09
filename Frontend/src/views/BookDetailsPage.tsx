import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { bookService } from "../services/books";
import { ReviewModal } from "../components/books/ReviewModal";
import { ShelfModal } from "../components/books/ShelfModal";
import type { Book, Review, Shelf } from "../types";

export const BookDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isShelfModalOpen, setIsShelfModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const [shelves, setShelves] = useState<Shelf[]>([]);

  const storedUser = sessionStorage.getItem("user");
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;

  const currentUserId = loggedInUser?.id ? String(loggedInUser.id) : "";
  const currentUsername = loggedInUser?.username || "";

  useEffect(() => {
    const fetchDetails = async () => {
      const bookId = location.state?.bookId;

      if (!bookId) {
        navigate("/dashboard/discover");
        return;
      }

      try {
        const [bookData, reviewsData] = await Promise.all([
          bookService.getBookDetails(bookId),
          bookService.getReviews(bookId),
        ]);

        setBook(bookData);
        setReviews(reviewsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [location.state, navigate]);

  const fetchShelves = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "{}");
      if (!user?.id) return;

      const data = await bookService.getShelves(user.id);
      setShelves(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchShelves();
  }, []);

  const handleSubmitReview = async (rating: number, content: string) => {
    if (!book) return;

    try {
      if (editingReview) {
        const updated = await bookService.updateReview(editingReview.id, {
          rating,
          content,
        });

        setReviews((prev) =>
          prev.map((r) => (r.id === updated.id ? updated : r))
        );
      } else {
        const created = await bookService.addReview(book.id, {
          userId: currentUserId,
          username: currentUsername,
          rating,
          content,
        });

        setReviews((prev) => [created, ...prev]);
      }

      setIsReviewModalOpen(false);
      setEditingReview(null);
    } catch (error) {
      console.error(error);
      alert("Nie udało się zapisać opinii.");
    }
  };

  const getStats = () => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const index = Math.floor(r.rating) - 1;
      if (index >= 0 && index < 5) counts[index]++;
    });
    const total = reviews.length || 1;
    return counts.map((count) => (count / total) * 100).reverse();
  };

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, index) => {
      if (rating >= index + 1) {
        return <i key={index} className="bi bi-star-fill text-warning me-1" />;
      }
      if (rating >= index + 0.5) {
        return <i key={index} className="bi bi-star-half text-warning me-1" />;
      }
      return <i key={index} className="bi bi-star text-warning me-1" />;
    });

  if (loading) {
    return (
      <div
        className="pt-5 d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="spinner-border"
          style={{ color: "var(--readly-gold)" }}
        />
      </div>
    );
  }

  if (!book) return null;

  const imageUrl = book.image_url?.replace("http://", "https://");
  const userReview = reviews.find((r) => r.userId === currentUserId);
  const otherReviews = reviews.filter((r) => r.userId !== currentUserId);
  const averageRating = (
    reviews.reduce((a, b) => a + b.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div
      className="pt-5"
      style={{ minHeight: "100vh", background: "var(--readly-gray)" }}
    >
      <div className="container py-5">
        <button
          className="btn btn-link p-0 mb-4 text-decoration-none fw-bold text-primary"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i> Back
        </button>

        <div className="row bg-white rounded-5 shadow-sm p-4 mb-5 align-items-start">
          <div className="col-lg-5 text-center">
            {!imageError && imageUrl ? (
              <img
                src={imageUrl}
                alt={book.title}
                className="img-fluid rounded-4 shadow-sm w-100"
                style={{
                  maxHeight: "750px",
                  objectFit: "contain",
                  display: "block",
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="p-5 bg-light rounded-4 d-flex align-items-center justify-content-center"
                style={{ minHeight: "500px" }}
              >
                <i className="bi bi-book fs-1 text-warning" />
              </div>
            )}
          </div>

          <div className="col-lg-7 ps-lg-5 mt-4 mt-lg-0">
            <div className="d-flex text-primary justify-content-between">
              <h1>{book.title}</h1>
              <button
                className="btn rounded-circle d-flex align-items-center justify-content-center p-0 flex-shrink-0"
                style={{
                  width: "50px",
                  height: "50px",
                  background: "var(--readly-gold)",
                  color: "#fff",
                  border: "none",
                }}
                onClick={() => setIsShelfModalOpen(true)}
              >
                <i
                  className="bi bi-plus-lg"
                  style={{ fontSize: "1.5rem", lineHeight: 0 }}
                />
              </button>
            </div>
            <h5 className="text-muted">by {book.author}</h5>
            <div className="mb-3">{renderStars(book.rating)}</div>
            <p className="lead">{book.description}</p>
          </div>
        </div>

        <div className="row bg-white rounded-5 shadow-sm p-4">
          <div className="col-md-5 border-end pe-md-5">
            <h4 className="mb-4">Rating Summary</h4>
            <div className="d-flex align-items-center mb-4">
              <div className="me-4 text-center">
                <h1 className="display-3 fw-bold mb-0">
                  {averageRating.replace(".", ",")}
                </h1>
                <div className="mb-1">
                  {renderStars(parseFloat(averageRating))}
                </div>
                <small className="text-muted">{reviews.length} reviews</small>
              </div>
              <div className="flex-grow-1">
                {getStats().map((percent, idx) => (
                  <div key={idx} className="d-flex align-items-center mb-1">
                    <span className="me-2 small" style={{ width: "10px" }}>
                      {5 - idx}
                    </span>
                    <div
                      className="progress flex-grow-1 bg-light"
                      style={{ height: "8px", borderRadius: "10px" }}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: "#FBBC04",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-7 ps-md-5">
            <div className="d-flex justify-content-between mb-3">
              <h4>Reviews</h4>
              {!userReview && (
                <button
                  className="btn"
                  style={{
                    border: "2px solid var(--readly-gold)",
                    color: "var(--readly-gold)",
                    borderRadius: "10px",
                  }}
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  Write Review
                </button>
              )}
            </div>

            {userReview && (
              <div className="p-3 bg-light rounded-4 mb-3 border-start border-4 border-warning">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <strong>Your review</strong>
                    <div className="mb-1">{renderStars(userReview.rating)}</div>
                  </div>

                  <button
                    className="btn btn-outline-secondary btn-sm rounded-circle shadow-sm"
                    style={{ width: "32px", height: "32px", padding: "0" }}
                    onClick={() => {
                      setEditingReview(userReview);
                      setIsReviewModalOpen(true);
                    }}
                  >
                    <i className="bi bi-pencil small"></i>
                  </button>
                </div>
                <p className="mb-0 mt-2">{userReview.content}</p>
              </div>
            )}

            {otherReviews.length > 0
              ? otherReviews.map((r) => (
                  <div key={r.id} className="p-3 mb-2 bg-light rounded-4">
                    <strong>{r.username}</strong>
                    <div>{renderStars(r.rating)}</div>
                    <p className="mb-0 small">{r.content}</p>
                  </div>
                ))
              : !userReview && (
                  <p className="text-muted">
                    No reviews yet. Be the first to rate!
                  </p>
                )}
          </div>
        </div>
      </div>

      {isReviewModalOpen && (
        <ReviewModal
          onClose={() => setIsReviewModalOpen(false)}
          onSubmit={handleSubmitReview}
          initialRating={editingReview?.rating || 5}
          initialContent={editingReview?.content || ""}
          isEditing={!!editingReview}
        />
      )}

      {isShelfModalOpen && book && (
        <ShelfModal
          shelves={shelves}
          book={book}
          onClose={() => setIsShelfModalOpen(false)}
          onSuccess={async () => {
            await fetchShelves();
          }}
        />
      )}
    </div>
  );
};
