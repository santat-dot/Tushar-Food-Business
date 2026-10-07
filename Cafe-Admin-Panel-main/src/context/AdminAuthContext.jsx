import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { AdminAuthContext } from "./adminAuth";

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem("tushar-admin-token"));
  const isAuthenticated = import.meta.env.DEV || Boolean(token);

  useEffect(() => {
    const expireSession = () => setToken(null);
    window.addEventListener("tushar-admin-session-expired", expireSession);
    return () => window.removeEventListener("tushar-admin-session-expired", expireSession);
  }, []);

  const signIn = useCallback(async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    sessionStorage.setItem("tushar-admin-token", data.token);
    setToken(data.token);
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem("tushar-admin-token");
    setToken(null);
  }, []);

  const value = useMemo(() => ({ isAuthenticated, signIn, signOut }), [isAuthenticated, signIn, signOut]);
  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
