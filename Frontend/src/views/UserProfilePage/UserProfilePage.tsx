import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookService } from "../../services/books";
import { userService } from "../../services/userService";
import type { Book, Review } from "../../types";

interface UserProfile {
  id: number;
  username: string;
  description: string | null;
  profile_image: string | null;
}

interface ReviewWithBook extends Review {
  bookDetails?: Book;
}

export const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<ReviewWithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfileAndReviews = async () => {
      if (!username) return;

      try {
        setLoading(true);
        setError(false);

        const userData = await userService.getUserProfile(username);
        setProfile(userData);

        const reviewsData = await bookService.getUserReviews(
          String(userData.id)
        );

        const enhancedReviews = await Promise.all(
          reviewsData.map(async (rev) => {
            try {
              const bookDetails = await bookService.getBookDetails(rev.bookId);
              return { ...rev, bookDetails };
            } catch {
              return rev;
            }
          })
        );

        setReviews(enhancedReviews);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndReviews();
  }, [username]);

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

  if (error || !profile) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{ background: "var(--readly-gray)" }}
      >
        <div className="text-center bg-white p-5 rounded-5 shadow-sm">
          <i className="bi bi-exclamation-circle text-danger display-4 mb-3 d-block"></i>
          <h4 className="fw-bold mb-3">User not found</h4>
          <button
            className="btn btn-primary rounded-pill px-4"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 py-5"
      style={{ background: "var(--readly-gray)" }}
    >
      <div className="container py-5">
        <button
          className="btn btn-link p-0 mb-4 text-decoration-none fw-bold text-primary"
          onClick={() => navigate(-1)}
        >
          <i className="bi bi-arrow-left me-2"></i> Back
        </button>

        <div className="bg-white p-4 p-md-5 rounded-5 shadow-sm mb-5 text-center text-md-start">
          <div className="row align-items-center g-4">
            <div className="col-md-auto text-center">
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={profile.username}
                  className="rounded-circle object-fit-cover shadow-sm"
                  style={{ width: "150px", height: "150px" }}
                />
              ) : (
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center border mx-auto"
                  style={{ width: "150px", height: "150px" }}
                >
                  <i className="bi bi-person text-secondary display-1"></i>
                </div>
              )}
            </div>
            <div className="col-md">
              <h1
                className="fw-bold mb-2"
                style={{ color: "var(--readly-primary)" }}
              >
                {profile.username}
              </h1>
              <p
                className="fs-5 text-muted mb-0"
                style={{ whiteSpace: "pre-line" }}
              >
                {profile.description || "This user hasn't added a bio yet."}
              </p>
            </div>
          </div>
        </div>

        <h4 className="fw-bold mb-4">
          Reviews by {profile.username} ({reviews.length})
        </h4>

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
                    <p
                      className="mb-0"
                      style={{ fontStyle: "italic", whiteSpace: "pre-line" }}
                    >
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
                  {profile.username} hasn't written any reviews yet.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
