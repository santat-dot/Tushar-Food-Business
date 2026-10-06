import { useState } from "react";
import api from "../api/api";

function CategoryForm({ onCategoryAdded }) {
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      setError("Category name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await api.post("/category", { categoryName, imageUrl });
      setSuccess(true);
      setCategoryName("");
      setImageUrl("");
      setTimeout(() => setSuccess(false), 3000);
      if (onCategoryAdded) {
        onCategoryAdded(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add category");
      console.error("Error adding category:", err);
    } finally {
      setLoading(false);
    }
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  };

  const headingStyle = {
    fontSize: "1.25rem",
    fontWeight: "800",
    color: "#2B2118",
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  };

  const subheadingStyle = {
    fontSize: "0.85rem",
    color: "#66714A",
    fontWeight: "500",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.625rem",
    fontWeight: "700",
    color: "#2B2118",
    fontSize: "0.9rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem 1rem",
    border: "2px solid #E2D7C3",
    borderRadius: "10px",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    backgroundColor: "#F8F3E9",
    boxSizing: "border-box",
    color: "#2B2118",
  };

  const buttonStyle = {
    padding: "0.875rem 1.5rem",
    background: "linear-gradient(135deg, #C68E17 0%, #66714A 100%)",
    color: "#F8F3E9",
    border: "2px solid #C68E17",
    borderRadius: "10px",
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: "0.95rem",
    fontWeight: "700",
    transition: "all 0.3s ease",
    opacity: loading ? 0.7 : 1,
    width: "100%",
    boxShadow: "0 6px 16px rgba(43, 33, 24, 0.25)",
  };

  const errorStyle = {
    padding: "1rem",
    backgroundColor: "#F4DEDA",
    color: "#8A3B2E",
    borderRadius: "10px",
    fontSize: "0.9rem",
    border: "2px solid #EAC7C0",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  };

  const successStyle = {
    padding: "1rem",
    backgroundColor: "#E7EEDC",
    color: "#4C7A3D",
    borderRadius: "10px",
    fontSize: "0.9rem",
    border: "2px solid #D4E2C7",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <div>
        <h2 style={headingStyle}>
          <span>➕</span>
          <span>Add New Category</span>
        </h2>
        <p style={subheadingStyle}>Create a new food category for your menu</p>
      </div>
      
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Category Name *</label>
        <input
          type="text"
          placeholder="e.g., Beverages, Desserts, Main Course"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = "#2B2118";
            e.target.style.backgroundColor = "#fff";
            e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E2D7C3";
            e.target.style.backgroundColor = "#FFFDF9";
            e.target.style.boxShadow = "none";
          }}
          style={inputStyle}
          disabled={loading}
          required
        />
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Image URL (Optional)</label>
        <input
          type="url"
          placeholder="https://example.com/image.jpg"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = "#2B2118";
            e.target.style.backgroundColor = "#fff";
            e.target.style.boxShadow = "0 0 0 3px rgba(37, 99, 235, 0.1)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E2D7C3";
            e.target.style.backgroundColor = "#FFFDF9";
            e.target.style.boxShadow = "none";
          }}
          style={inputStyle}
          disabled={loading}
        />
      </div>

      {error && (
        <div style={errorStyle}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div style={successStyle}>
          <span>✅</span>
          <span>Category added successfully!</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={buttonStyle}
        onMouseEnter={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = "linear-gradient(135deg, #40342A 0%, #3A1F14 100%)";
            e.target.style.boxShadow = "0 10px 15px -3px rgba(37, 99, 235, 0.4)";
            e.target.style.transform = "translateY(-2px)";
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "linear-gradient(135deg, #2B2118 0%, #40342A 100%)";
          e.target.style.boxShadow = "0 4px 6px -1px rgba(37, 99, 235, 0.3)";
          e.target.style.transform = "translateY(0)";
        }}
      >
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <span style={{ animation: "spin 1s linear infinite" }}>⚙️</span>
            Adding...
          </span>
        ) : (
          "Add Category"
        )}
      </button>
    </form>
  );
}

export default CategoryForm;
