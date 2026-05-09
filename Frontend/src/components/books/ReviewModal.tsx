import { useState } from "react";

interface ReviewModalProps {
  onClose: () => void;
  onSubmit: (rating: number, content: string) => void;
  initialRating?: number;
  initialContent?: string;
  isEditing?: boolean;
}

export const ReviewModal = ({
  onClose,
  onSubmit,
  initialRating = 5,
  initialContent = "",
  isEditing = false,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(initialRating);
  const [content, setContent] = useState(initialContent);
  const MAX_CHARS = 500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, content);
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-5 border-0 shadow p-4 p-md-5">
          <div className="modal-header border-0 pb-0">
            <h4 className="modal-title fw-bold text-primary">
              {isEditing ? "Edit Review" : "Write a Review"}
            </h4>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-center fs-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <i
                    key={idx}
                    className={`bi bi-star-fill mx-1 ${
                      idx < rating
                        ? "text-warning"
                        : "text-secondary opacity-25"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setRating(idx + 1)}
                  ></i>
                ))}
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control rounded-4 p-4 bg-light border-0 fs-5"
                  rows={5}
                  placeholder="What did you think about this book?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  maxLength={MAX_CHARS}
                  style={{ resize: "none" }}
                  required
                ></textarea>
                <div className="text-end mt-2 text-muted small fw-bold">
                  {content.length} / {MAX_CHARS}
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill py-3 fw-bold mt-2 fs-5"
              >
                {isEditing ? "Save Changes" : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
