import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/userService";
import { FormTextarea } from "../../components/common/FormTextarea";
import styles from "./ProfilePage.module.css";

interface User {
  username: string;
  email: string;
  profile_image?: string;
  description?: string;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState({ msg: "", type: "" });
  const [imgError, setImgError] = useState(false);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getMe();
      setUser(data);
      setDescription(data.description || "");
    } catch {
      sessionStorage.clear();
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (status.msg && status.type === "success") {
      const timer = setTimeout(() => setStatus({ msg: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [status.msg, status.type]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await userService.uploadAvatar(file);
      setUser((prev) => (prev ? { ...prev, profile_image: url } : null));
      setImgError(false);

      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        parsed.user = { ...parsed.user, profile_image: url };
        sessionStorage.setItem("user", JSON.stringify(parsed));
        window.dispatchEvent(new Event("avatarUpdated"));
      }

      setStatus({ msg: "Avatar updated successfully!", type: "success" });
    } catch {
      setStatus({ msg: "Upload failed.", type: "danger" });
    }
  };

  const handleUpdate = async () => {
    if (passwords.new && passwords.new !== passwords.confirm) {
      setStatus({ msg: "Passwords do not match!", type: "danger" });
      return;
    }

    setUpdating(true);
    setStatus({ msg: "", type: "" });
    try {
      await userService.updateProfile({
        description: description,
        password: passwords.new || undefined,
      });
      setUser((prev) => (prev ? { ...prev, description } : null));
      setStatus({ msg: "Profile updated successfully!", type: "success" });
      setPasswords({ new: "", confirm: "" });
    } catch {
      setStatus({ msg: "Update failed.", type: "danger" });
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="pt-5">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  return (
    <div key={user.username} className={`${styles.profilePage} pt-5`}>
      <div
        className="toast-container position-fixed top-0 end-0 p-4 mt-5"
        style={{ zIndex: 1100 }}
      >
        {status.msg && status.type === "success" && (
          <div
            className={`toast show ${styles.customToast} border-0 shadow-lg`}
            role="alert"
          >
            <div
              className={`d-flex align-items-center p-3 ${styles.successAccent}`}
            >
              <div className={`${styles.iconWrapper} bg-success me-3`}>
                <i className="bi bi-check-lg text-white" />
              </div>
              <div className="flex-grow-1">
                <h6 className="mb-0 text-dark fw-bold">Success</h6>
                <p className="mb-0 text-muted small">{status.msg}</p>
              </div>
              <button
                type="button"
                className="btn-close shadow-none ms-2"
                onClick={() => setStatus({ msg: "", type: "" })}
              />
            </div>
          </div>
        )}
      </div>

      <div className="justify-content-center mt-5">
        <div className="p-5 text-center border-end d-flex flex-column align-items-center justify-content-center">
          <div className="position-relative mb-4">
            {imgError || !user.profile_image ? (
              <div
                className="rounded-circle shadow-sm d-flex align-items-center justify-content-center bg-light"
                style={{
                  width: "180px",
                  height: "180px",
                  border: "4px solid var(--readly-gold)",
                }}
              >
                <i
                  className="bi bi-person-fill text-secondary"
                  style={{ fontSize: "5rem" }}
                ></i>
              </div>
            ) : (
              <img
                src={user.profile_image}
                alt="Profile"
                onError={() => setImgError(true)}
                className="rounded-circle shadow-sm object-fit-cover"
                style={{
                  width: "180px",
                  height: "180px",
                  border: "4px solid var(--readly-gold)",
                }}
              />
            )}
            <label
              className={`position-absolute bottom-0 end-0 btn rounded-circle shadow-sm d-flex align-items-center justify-content-center p-2 ${styles.avatarEditBtn}`}
            >
              <i className="bi bi-camera-fill text-white" />
              <input type="file" hidden onChange={handleFileChange} />
            </label>
          </div>
          <h2 className="fw-bold mb-1">{user.username}</h2>
          <p className="small mb-2 text-muted">{user.email}</p>
        </div>

        <div className="container px-5 pb-5">
          {status.msg && status.type === "danger" && (
            <div
              className="alert alert-danger py-2 small border-0 mb-3"
              style={{ borderRadius: "12px" }}
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {status.msg}
            </div>
          )}

          <FormTextarea
            label="About Me"
            value={description}
            onChange={(value: string) => setDescription(value)}
            maxLength={250}
            placeholder="Tell others about your reading journey..."
          />

          <h5 className="fw-bold mb-3 text-primary">Security</h5>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">
              New Password
            </label>
            <input
              type="password"
              className="form-control bg-light border-0 py-2 shadow-none"
              style={{ borderRadius: "10px" }}
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control bg-light border-0 py-2 shadow-none"
              style={{ borderRadius: "10px" }}
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
            />
          </div>

          <div className="d-flex justify-content-center mt-4">
            <button
              className="btn btn-primary px-5 rounded-pill fw-bold text-white shadow-sm"
              onClick={handleUpdate}
              disabled={updating}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
