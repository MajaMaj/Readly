import { useState } from "react";
import { bookService } from "../../services/books";
import type { Book, Shelf } from "../../types";

interface Props {
  shelves: Shelf[];
  book: Book;
  onClose: () => void;
  onSuccess: () => void;
}

export const ShelfModal = ({ shelves, book, onClose, onSuccess }: Props) => {
  const [selected, setSelected] = useState<string[]>(() =>
    shelves
      .filter((s) => s.books?.some((b) => b.book_id === book.id))
      .map((s) => String(s.id))
  );

  const [newShelfName, setNewShelfName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const initial = new Set(
        shelves
          .filter((s) => s.books?.some((b) => b.book_id === book.id))
          .map((s) => String(s.id))
      );

      const current = new Set(selected);
      const toAdd = [...current].filter((id) => !initial.has(id));
      const toRemove = [...initial].filter((id) => !current.has(id));

      for (const id of toAdd) {
        await bookService.addBookToShelf(id, book);
      }

      for (const id of toRemove) {
        await bookService.removeBookFromShelf(id, book.id);
      }

      if (newShelfName.trim()) {
        const user = JSON.parse(sessionStorage.getItem("user") || "{}");
        const created = await bookService.createShelf(newShelfName, user.id);
        await bookService.addBookToShelf(created.id, book);
      }

      await onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4 border-0 rounded-5 shadow">
          <h4 className="mb-4" style={{ color: "var(--readly-primary)" }}>
            Add to shelf
          </h4>

          <form onSubmit={handleSubmit}>
            <div
              className="mb-3 pe-2"
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                scrollbarWidth: "thin",
              }}
            >
              {shelves.length > 0 ? (
                shelves.map((s) => (
                  <div key={s.id} className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`shelf-${s.id}`}
                      checked={selected.includes(String(s.id))}
                      onChange={() => toggle(String(s.id))}
                    />
                    <label
                      className="form-check-label"
                      htmlFor={`shelf-${s.id}`}
                    >
                      {s.name}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-muted small">No shelves created yet.</p>
              )}
            </div>

            <div className="mb-4 pt-3 border-top">
              <label className="form-label small text-muted">
                Create new shelf
              </label>
              <input
                className="form-control rounded-3"
                placeholder="New shelf name"
                value={newShelfName}
                onChange={(e) => setNewShelfName(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-100 py-2 fw-bold text-white mb-2"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>

          <button
            className="btn btn-link text-muted text-decoration-none w-100"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
