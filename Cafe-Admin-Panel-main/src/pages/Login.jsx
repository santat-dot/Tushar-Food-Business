import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/useAdminAuth";

export default function Login() {
  const { isAuthenticated, signIn } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await signIn(username.trim(), password);
      navigate(location.state?.from?.pathname || "/", { replace: true });
    } catch (loginError) {
      setError(loginError.response?.data?.message || "Unable to sign in. Check that the API server is running.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="admin-login">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-brand-mark" aria-hidden="true">TF</div>
        <p className="admin-brand-label">Tushar Food Business</p>
        <h1>Admin sign in</h1>
        <p className="admin-login-description">Sign in to manage the live storefront catalog, orders, and gallery.</p>
        <label>
          Username
          <input autoComplete="username" required value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label>
          Password
          <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        {error && <p className="admin-login-error" role="alert">{error}</p>}
        <button className="admin-login-submit" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
