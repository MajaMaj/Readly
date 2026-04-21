interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}

export const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
}: FormTextareaProps) => {
  return (
    <div className="mb-4">
      <h5 className="fw-bold mb-3 text-primary">{label}</h5>
      <div className="position-relative">
        <textarea
          className="form-control bg-light border-0 py-3 shadow-none"
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          style={{
            borderRadius: "12px",
            fontSize: "0.95rem",
            resize: "none",
            paddingBottom: maxLength ? "2rem" : "1rem",
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {maxLength && (
          <div
            className="position-absolute bottom-0 end-0 p-3 small"
            style={{
              pointerEvents: "none",
              color:
                value.length >= maxLength
                  ? "var(--bs-danger)"
                  : "var(--bs-gray-500)",
            }}
          >
            {value.length}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
};
