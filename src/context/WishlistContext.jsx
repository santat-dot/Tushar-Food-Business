import { createContext, useContext, useState, useEffect, useCallback } from "react";

const WishlistContext = createContext(null);
const KEY = "tfb_wishlist";

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(ids)); }, [ids]);

  const toggle = useCallback((id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isWishlisted = useCallback((id) => ids.includes(id), [ids]);
  const remove = useCallback((id) => setIds((prev) => prev.filter((x) => x !== id)), []);

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted, remove }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
