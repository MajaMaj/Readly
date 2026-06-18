import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookService } from "../services/books";
import type { Shelf } from "../types";

export const ShelvesPage = () => {
  const navigate = useNavigate();
  const [shelves, setShelves] = useState<Shelf[]>([]);

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  useEffect(() => {
    const load = async () => {
      const data = await bookService.getShelves(user.id);
      setShelves(data);
    };
    load();
  }, [user.id]);

  return (
    <div
      className="min-vh-100 py-5"
      style={{ background: "var(--readly-gray)" }}
    >
      <div className="container py-5">
        <div className="row g-4">
          {shelves.map((shelf) => (
            <div key={shelf.id} className="col-md-4">
              <div
                className="bg-white p-4 rounded-5 shadow-sm h-100 d-flex flex-column"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/dashboard/shelves/${shelf.id}`)}
              >
                <h4 style={{ color: "var(--readly-primary)" }}>{shelf.name}</h4>

                <p className="text-muted mb-auto">
                  {shelf.books?.length || 0} books
                </p>

                <div
                  className="d-flex gap-2 mt-4"
                  style={{ minHeight: "70px" }}
                >
                  {shelf.books && shelf.books.length > 0 ? (
                    shelf.books.slice(0, 3).map((b) => (
                      <img
                        key={b.id}
                        src={b.image_url?.replace("http://", "https://") || ""}
                        alt=""
                        style={{
                          width: 50,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                    ))
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center border border-dashed rounded-3 text-muted opacity-25"
                      style={{ width: 50, height: 70 }}
                    >
                      <i className="bi bi-plus-lg"></i>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
