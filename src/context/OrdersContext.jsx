import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "./AuthContext";

const OrdersContext = createContext(null);
const key = (email) => `tfb_orders:${email}`;
const load = (email) => { try { return JSON.parse(localStorage.getItem(key(email))) || []; } catch { return []; } };

export function OrdersProvider({ children }) {
  const { user } = useAuth();
  const email = user?.email;
  const [orders, setOrders] = useState(() => (email ? load(email) : []));
  useEffect(() => { setOrders(email ? load(email) : []); }, [email]);

  const addOrder = useCallback((order) => {
    setOrders((prev) => {
      const next = [order, ...prev];
      if (email) localStorage.setItem(key(email), JSON.stringify(next));
      return next;
    });
    // legacy global list so "Track Order" by ID works for guests too
    try {
      const all = JSON.parse(localStorage.getItem("tfb_new_orders") || "[]");
      localStorage.setItem("tfb_new_orders", JSON.stringify([order, ...all]));
    } catch { /* ignore */ }
  }, [email]);

  const getOrder = useCallback((id) => orders.find((o) => o.id === id), [orders]);
  const value = useMemo(() => ({ orders, addOrder, getOrder }), [orders, addOrder, getOrder]);
  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}
export const useOrders = () => useContext(OrdersContext);
