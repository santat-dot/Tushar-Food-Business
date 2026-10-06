import { createContext, useContext, useState, useCallback } from "react";

const AdminAuthContext = createContext(null);
const KEY = "tfb_admin_auth";

export function AdminAuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(KEY) === "1");

  const login = useCallback((email, password) => {
    // Demo-only auth: any non-empty credentials succeed.
    if (email && password) {
      sessionStorage.setItem(KEY, "1");
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(KEY);
    setIsAdmin(false);
  }, []);

  return <AdminAuthContext.Provider value={{ isAdmin, login, logout }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
