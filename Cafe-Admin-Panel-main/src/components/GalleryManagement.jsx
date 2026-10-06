import { useState, useEffect } from "react";
import api from "../api/api";

function GalleryManagement() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    mediaType: "image",
    file: null,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const response = await api.get("/gallery");
      setGalleryItems(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch gallery items");
      console.error("Error fetching gallery items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.file) {
      setError("Title and file are required");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("title", formData.title);
      uploadFormData.append("mediaType", formData.mediaType);
      uploadFormData.append("file", formData.file);

      await api.post("/gallery/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFormData({ title: "", mediaType: "image", file: null });
      fetchGalleryItems();
      alert("✅ Media uploaded successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload media");
      console.error("Error uploading media:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this gallery item?")) {
      try {
        await api.delete(`/gallery/${itemId}`);
        alert("Gallery item deleted successfully!");
        fetchGalleryItems();
      } catch (err) {
        alert("Failed to delete gallery item");
        console.error("Error deleting gallery item:", err);
      }
    }
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem",
  };

  const headingStyle = {
    fontSize: "1.75rem",
    color: "#2B2118",
    marginBottom: 10,
    fontWeight: "800",
  };

  const formContainerStyle = {
    background: "#ffffff",
    border: "2px solid #E2D7C3",
    borderRadius: "14px",
    padding: "2rem",
    boxShadow: "0 8px 20px rgba(43, 33, 24, 0.12)",
    marginBottom: "2rem",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "700",
    color: "#2B2118",
    fontSize: "0.95rem",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.875rem",
    border: "2px solid #E2D7C3",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    backgroundColor: "#F8F3E9",
    color: "#2B2118",
    boxSizing: "border-box",
  };

  const selectStyle = {
    ...inputStyle,
  };

  const buttonStyle = {
    padding: "0.875rem 1.5rem",
    background: "linear-gradient(135deg, #C68E17 0%, #66714A 100%)",
    color: "#F8F3E9",
    border: "2px solid #C68E17",
    borderRadius: "8px",
    cursor: uploading ? "not-allowed" : "pointer",
    fontSize: "1rem",
    fontWeight: "700",
    transition: "all 0.3s ease",
    opacity: uploading ? 0.7 : 1,
    boxShadow: "0 6px 16px rgba(43, 33, 24, 0.25)",
  };

  const errorStyle = {
    padding: "1rem",
    backgroundColor: "#F4DEDA",
    color: "#8A3B2E",
    borderRadius: "8px",
    fontSize: "0.95rem",
    border: "1px solid #EAC7C0",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
  };

  const cardStyle = {
    border: "2px solid #E2D7C3",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(43, 33, 24, 0.12)",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
  };

  const mediaStyle = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    backgroundColor: "#F8F3E9",
  };

  const cardContentStyle = {
    padding: "1rem",
  };

  const cardTitleStyle = {
    margin: "0 0 0.5rem 0",
    fontSize: "1rem",
    fontWeight: "700",
    color: "#2B2118",
  };

  const cardTypeStyle = {
    fontSize: "0.85rem",
    color: "#66714A",
    marginBottom: "1rem",
  };

  const deleteButtonStyle = {
    width: "100%",
    padding: "0.625rem",
    backgroundColor: "#8A3B2E",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "700",
    transition: "all 0.3s ease",
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading gallery items...</div>;
  }

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>🎬 Gallery Management</h2>

      <div style={formContainerStyle}>
        <h3 style={{ margin: "0 0 1.5rem 0", color: "#2B2118", fontSize: "1.2rem" }}>
          📤 Upload New Media
        </h3>
        <form onSubmit={handleSubmit} style={formStyle}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Cozy Ambiance, Coffee Counter"
              value={formData.title}
              onChange={handleInputChange}
              style={inputStyle}
              disabled={uploading}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Media Type *</label>
            <select
              name="mediaType"
              value={formData.mediaType}
              onChange={handleInputChange}
              style={selectStyle}
              disabled={uploading}
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Upload File *</label>
            <input
              type="file"
              onChange={handleFileChange}
              accept={formData.mediaType === "image" ? "image/*" : "video/*"}
              style={{
                ...inputStyle,
                padding: "0.5rem",
              }}
              disabled={uploading}
              required
            />
            <p style={{ fontSize: "0.85rem", color: "#66714A", marginTop: "0.5rem" }}>
              Max file size: 10MB
            </p>
          </div>

          {error && <div style={errorStyle}>⚠️ {error}</div>}

          <button
            type="submit"
            disabled={uploading}
            style={buttonStyle}
            onMouseEnter={(e) => {
              if (!uploading) e.target.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
            }}
          >
            {uploading ? "Uploading..." : "Upload Media"}
          </button>
        </form>
      </div>

      <div>
        <h3 style={{ marginBottom: "1.5rem", color: "#2B2118", fontSize: "1.2rem" }}>
          📸 Gallery Items ({galleryItems.length})
        </h3>

        {galleryItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#5B5044" }}>
            <p style={{ fontSize: "1.1rem" }}>📭 No gallery items yet. Upload your first media!</p>
          </div>
        ) : (
          <div style={gridStyle}>
            {galleryItems.map((item) => (
              <div key={item.id} style={cardStyle}>
                {item.mediaType === "image" ? (
                  <img src={item.mediaUrl} alt={item.title} style={mediaStyle} />
                ) : (
                  <video style={mediaStyle} controls>
                    <source src={item.mediaUrl} />
                    Your browser does not support the video tag.
                  </video>
                )}
                <div style={cardContentStyle}>
                  <h4 style={cardTitleStyle}>{item.title}</h4>
                  <p style={cardTypeStyle}>
                    Type: {item.mediaType === "image" ? "🖼️ Image" : "🎥 Video"}
                  </p>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={deleteButtonStyle}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#bb2d3b";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#8A3B2E";
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryManagement;
