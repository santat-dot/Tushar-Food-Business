import FoodItemForm from "../components/FoodItemForm";
import FoodItemList from "../components/FoodItemList";

function FoodItems() {
  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0",
    background: "linear-gradient(135deg, #F8F3E9 0%, #EEE4D0 100%)",
    minHeight: "100vh",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "3rem",
    marginTop: "0",
    padding: "2rem",
  };

  const formContainerStyle = {
    background: "#ffffff",
    border: "2px solid #E2D7C3",
    borderRadius: "14px",
    padding: "1.25rem",
    boxShadow: "0 8px 20px rgba(43, 33, 24, 0.12)",
    height: "fit-content",
    maxHeight: "70vh",
    overflowY: "auto",
    position: "sticky",
    top: "120px",
  };

  const listContainerStyle = {
    background: "#ffffff",
    border: "2px solid #E2D7C3",
    borderRadius: "14px",
    padding: "2rem",
    boxShadow: "0 8px 20px rgba(43, 33, 24, 0.12)",
  };

  return (
    <div className="admin-page food-items-page" style={containerStyle}>
      <div>
        <h1>🍽️ Manage Food Items</h1>
        <p style={{ fontSize: "1.1rem", color: "#5B5044", marginTop: "0.5rem" }}>
          Create and manage your Tushar Food Business menu
        </p>
      </div>

      <div className="food-items-layout" style={gridStyle}>
        <div style={formContainerStyle}>
          <FoodItemForm />
        </div>
        <div style={listContainerStyle}>
          <FoodItemList />
        </div>
      </div>
    </div>
  );
}

export default FoodItems;
