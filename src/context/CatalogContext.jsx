import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { replaceCategories } from "../data/categories";
import { replaceProducts } from "../data/products";
import { fetchCatalog } from "../api/catalogApi";

const CatalogContext = createContext(null);
const REFRESH_INTERVAL = 15000;

export function CatalogProvider({ children }) {
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const latestCatalog = useRef("");
  const latestError = useRef("");

  const refreshCatalog = useCallback(async () => {
    try {
      const catalog = await fetchCatalog();
      if (!Array.isArray(catalog.categories) || !Array.isArray(catalog.products)) {
        throw new Error("Catalog API returned an invalid catalog.");
      }
      const serialized = JSON.stringify(catalog);
      if (serialized !== latestCatalog.current) {
        replaceCategories(catalog.categories);
        replaceProducts(catalog.products);
        latestCatalog.current = serialized;
        setRevision((current) => current + 1);
      }
      latestError.current = "";
      setError("");
    } catch (requestError) {
      if (latestError.current !== requestError.message) {
        console.error("Could not refresh the storefront catalog:", requestError);
      }
      latestError.current = requestError.message;
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") refreshCatalog();
    }, REFRESH_INTERVAL);
    const handleFocus = () => refreshCatalog();
    window.addEventListener("focus", handleFocus);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [refreshCatalog]);

  const value = useMemo(() => ({ revision, loading, error, refreshCatalog }), [revision, loading, error, refreshCatalog]);
  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) throw new Error("useCatalog must be used inside a CatalogProvider.");
  return context;
}
