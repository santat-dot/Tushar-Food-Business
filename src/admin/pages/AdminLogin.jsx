import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../AdminAuthContext";
import "../admin.css";

export default function AdminLogin() {
  const { isAdmin, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@tusharfood.in");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  if (isAdmin) return <Navigate to="/admin" replace />;

  function submit(e) {
    e.preventDefault();
    if (login(email, password)) navigate("/admin");
    else setError("Enter both email and password.");
  }

  return (
    <div className="admin" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
      <form onSubmit={submit} className="a-panel" style={{ width: 340 }}>
        <h2 style={{ fontFamily: "var(--serif)", marginBottom: 4 }}>Admin Login</h2>
        <p style={{ fontSize: 12.5, color: "var(--a-text-soft)", marginBottom: 16 }}>Tushar Food Business — Command Center (demo auth, any credentials work)</p>
        <label style={{ display: "block", fontSize: 12.5, marginBottom: 10 }}>
          Email
          <input className="a-input" style={{ width: "100%", marginTop: 4 }} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label style={{ display: "block", fontSize: 12.5, marginBottom: 14 }}>
          Password
          <input className="a-input" type="password" style={{ width: "100%", marginTop: 4 }} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p style={{ color: "var(--a-bad)", fontSize: 12.5, marginBottom: 10 }}>{error}</p>}
        <button className="a-btn" type="submit" style={{ width: "100%" }}>Log In</button>
      </form>
    </div>
  );
}
