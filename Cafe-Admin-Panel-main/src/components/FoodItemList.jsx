import { useState, useEffect } from "react";
import api from "../api/api";

function FoodItemList() {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    foodName: "",
    description: "",
    price: "",
    imageUrl: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    setLoading(true);
    try {
      const response = await api.get("/food");
      setFoodItems(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch food items");
      console.error("Error fetching food items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await api.delete(`/food/${itemId}`);
        alert("Food item deleted successfully!");
        fetchFoodItems();
      } catch (err) {
        alert("Failed to delete food item");
        console.error("Error deleting food item:", err);
      }
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditFormData({
      foodName: item.foodName,
      description: item.description || "",
      price: item.price || "",
      imageUrl: item.imageUrl || "",
    });
    setEditError("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (itemId) => {
    if (!editFormData.foodName.trim()) {
      setEditError("Food name cannot be empty");
      return;
    }

    setEditLoading(true);
    setEditError("");

    try {
      const updatedData = {
        foodName: editFormData.foodName,
        description: editFormData.description,
        price: parseFloat(editFormData.price) || 0,
        imageUrl: editFormData.imageUrl,
      };

      await api.put(`/food/${itemId}`, updatedData);
      alert("Food item updated successfully!");
      setEditingId(null);
      fetchFoodItems();
    } catch (err) {
      setEditError(err.response?.data?.message || "Failed to update food item");
      console.error("Error updating food item:", err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditError("");
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading food items...</div>;
  }

  if (error) {
    return <div style={{ padding: 20, color: "red" }}>{error}</div>;
  }

  // Group items by category
  const groupedItems = foodItems.reduce((groups, item) => {
    const categoryName = item.category?.categoryName || "Uncategorized";
    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(item);
    return groups;
  }, {});

  const containerStyle = {
    padding: 20,
  };

  const categoryHeaderStyle = {
    marginTop: 30,
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: "3px solid #C68E17",
    fontSize: "1.5rem",
    fontWeight: "800",
    color: "#2B2118",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
    marginBottom: 30,
  };

  const cardStyle = {
    border: "2px solid #E2D7C3",
    borderRadius: 8,
    padding: 15,
    boxShadow: "0 4px 12px rgba(43, 33, 24, 0.12)",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
  };

  const cardHoverStyle = {
    ...cardStyle,
    boxShadow: "0 8px 20px rgba(43, 33, 24, 0.25)",
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: "1.75rem", color: "#2B2118", marginBottom: 10, fontWeight: "800" }}>📋 Food Items</h2>
      <p style={{ color: "#66714A", marginBottom: 20, fontWeight: "500" }}>
        {foodItems.length} items across {Object.keys(groupedItems).length} categories
      </p>

      {foodItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "#5B5044" }}>
          <p style={{ fontSize: "1.1rem" }}>📭 No food items found. Add one to get started!</p>
        </div>
      ) : (
        Object.keys(groupedItems)
          .sort()
          .map((categoryName) => (
            <div key={categoryName}>
              <h3 style={categoryHeaderStyle}>{categoryName}</h3>
              <div style={gridStyle}>
                {groupedItems[categoryName].map((item) => (
                  <div
                    key={item.id}
                    style={cardStyle}
                    onMouseEnter={(e) => {
                      Object.assign(e.currentTarget.style, cardHoverStyle);
                    }}
                    onMouseLeave={(e) => {
                      Object.assign(e.currentTarget.style, cardStyle);
                    }}
                  >
                    {editingId === item.id ? (
                      // Edit Form
                      <div style={{ backgroundColor: "#f0f0f0", padding: 15, borderRadius: 4 }}>
                        <h4 style={{ margin: "0 0 15px 0", color: "#2B2118", fontSize: "1.1rem" }}>
                          Edit Food Item
                        </h4>

                        <div style={{ marginBottom: 10 }}>
                          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                            Food Name
                          </label>
                          <input
                            type="text"
                            name="foodName"
                            value={editFormData.foodName}
                            onChange={handleEditChange}
                            style={{
                              width: "100%",
                              padding: 8,
                              border: "1px solid #ccc",
                              borderRadius: 4,
                              fontSize: 14,
                              boxSizing: "border-box",
                            }}
                            disabled={editLoading}
                          />
                        </div>

                        <div style={{ marginBottom: 10 }}>
                          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditChange}
                            style={{
                              width: "100%",
                              padding: 8,
                              border: "1px solid #ccc",
                              borderRadius: 4,
                              fontSize: 14,
                              minHeight: 60,
                              boxSizing: "border-box",
                            }}
                            disabled={editLoading}
                          />
                        </div>

                        <div style={{ marginBottom: 10 }}>
                          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                            Price
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={editFormData.price}
                            onChange={handleEditChange}
                            step="0.01"
                            style={{
                              width: "100%",
                              padding: 8,
                              border: "1px solid #ccc",
                              borderRadius: 4,
                              fontSize: 14,
                              boxSizing: "border-box",
                            }}
                            disabled={editLoading}
                          />
                        </div>

                        <div style={{ marginBottom: 10 }}>
                          <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                            Image URL
                          </label>
                          <input
                            type="url"
                            name="imageUrl"
                            value={editFormData.imageUrl}
                            onChange={handleEditChange}
                            style={{
                              width: "100%",
                              padding: 8,
                              border: "1px solid #ccc",
                              borderRadius: 4,
                              fontSize: 14,
                              boxSizing: "border-box",
                            }}
                            disabled={editLoading}
                          />
                        </div>

                        {editError && <p style={{ color: "red", marginBottom: 10 }}>{editError}</p>}

                        <div style={{ display: "flex", gap: 10 }}>
                          <button
                            onClick={() => handleEditSubmit(item.id)}
                            disabled={editLoading}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#66714A",
                              color: "white",
                              border: "none",
                              borderRadius: 4,
                              cursor: editLoading ? "not-allowed" : "pointer",
                              opacity: editLoading ? 0.6 : 1,
                              flex: 1,
                            }}
                          >
                            {editLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            disabled={editLoading}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#5B5044",
                              color: "white",
                              border: "none",
                              borderRadius: 4,
                              cursor: editLoading ? "not-allowed" : "pointer",
                              opacity: editLoading ? 0.6 : 1,
                              flex: 1,
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <>
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl}
                            alt={item.foodName}
                            style={{
                              width: "100%",
                              height: 200,
                              objectFit: "cover",
                              borderRadius: 4,
                              marginBottom: 10,
                            }}
                          />
                        )}
                        <h3 style={{ margin: "10px 0" }}>{item.foodName}</h3>
                        <p style={{ color: "#666", marginBottom: 10 }}>
                          {item.description || "No description"}
                        </p>
                        <p style={{ fontSize: 18, fontWeight: "bold", color: "#66714A" }}>
                          ₹{item.price?.toFixed(2) || "0.00"}
                        </p>
                        {item.category && (
                          <p style={{ fontSize: 12, color: "#999" }}>
                            Category: {item.category.categoryName}
                          </p>
                        )}
                        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                          <button
                            onClick={() => handleEditClick(item)}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#007bff",
                              color: "white",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                              flex: 1,
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#8A3B2E",
                              color: "white",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                              flex: 1,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
}

export default FoodItemList;

