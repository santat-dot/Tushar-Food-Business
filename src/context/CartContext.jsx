import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useLanguage } from "./LanguageContext";
import { getProductById } from "../data/products";
import { coupons, bulkTiers } from "../data/offers";

const CartContext = createContext(null);
const load = (key) => { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : []; } catch { return []; } };
const PURCHASABLE = ["available", "low-stock", "limited"];

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const email = user?.email;
  const cartKey = email ? `tfb_cart:${email}` : null;
  const savedKey = email ? `tfb_saved:${email}` : null;

  const [items, setItems] = useState(() => (cartKey ? load(cartKey) : []));
  const [savedForLater, setSavedForLater] = useState(() => (savedKey ? load(savedKey) : []));
  const [coupon, setCoupon] = useState(null);
  const [toast, setToast] = useState(null);

  // each customer has their own cart; logged-out visitors have none
  useEffect(() => { setItems(cartKey ? load(cartKey) : []); setSavedForLater(savedKey ? load(savedKey) : []); setCoupon(null); }, [cartKey, savedKey]);
  useEffect(() => { if (cartKey) localStorage.setItem(cartKey, JSON.stringify(items)); }, [items, cartKey]);
  useEffect(() => { if (savedKey) localStorage.setItem(savedKey, JSON.stringify(savedForLater)); }, [savedForLater, savedKey]);

  const showToast = useCallback((message) => { setToast(message); setTimeout(() => setToast(null), 2600); }, []);

  // Cart & ordering need an account. Send visitors to login and bring them back.
  const requireLogin = useCallback((message = t("auth_cart_login_prompt")) => {
    if (user) return true;
    navigate("/login", { state: { from: location.pathname + location.search, message } });
    return false;
  }, [user, navigate, location, t]);

  const toLine = (product, qty) => ({ id: product.id, slug: product.slug, name: product.name, image: product.images?.[0], price: product.price, mrp: product.mrp ?? product.price, weight: product.weight, qty });

  const addItem = useCallback((product, qty = 1) => {
    if (!requireLogin()) return false;
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty, price: product.price } : i));
      return [...prev, toLine(product, qty)];
    });
    showToast(t("cart_item_added", { name: product.name }));
    return true;
  }, [requireLogin, showToast, t]);

  // Used by "Reorder": re-adds every item of a past order at TODAY's price/availability.
  const addOrderItems = useCallback((orderItems, { replace = false } = {}) => {
    if (!requireLogin()) return { added: 0, skipped: [] };
    const skipped = []; const lines = [];
    orderItems.forEach((oi) => {
      const p = getProductById(oi.productId);
      if (!p || !PURCHASABLE.includes(p.availability)) { skipped.push(oi.name); return; }
      lines.push(toLine(p, oi.qty));
    });
    setItems((prev) => {
      const base = replace ? [] : prev;
      return lines.reduce((acc, line) => {
        const ex = acc.find((i) => i.id === line.id);
        return ex ? acc.map((i) => (i.id === line.id ? { ...i, qty: i.qty + line.qty, price: line.price } : i)) : [...acc, line];
      }, base);
    });
    return { added: lines.length, skipped };
  }, [requireLogin]);

  const removeItem = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const updateQty = useCallback((id, qty) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i))), []);
  const saveForLater = useCallback((id) => {
    setItems((prev) => { const item = prev.find((i) => i.id === id); if (item) setSavedForLater((s) => [...s, item]); return prev.filter((i) => i.id !== id); });
  }, []);
  const moveToCart = useCallback((id) => {
    setSavedForLater((prev) => { const item = prev.find((i) => i.id === id); if (item) setItems((c) => [...c, item]); return prev.filter((i) => i.id !== id); });
  }, []);

  const applyCoupon = useCallback((code, hasOrders = true) => {
    const c = coupons.find((x) => x.code === code.trim().toUpperCase());
    if (!c) { setCoupon(null); return { ok: false, message: t("coupon_invalid") }; }
    if (c.firstOrderOnly && hasOrders) { setCoupon(null); return { ok: false, message: t("coupon_first_order_only") }; }
    setCoupon(c);
    return { ok: true, message: t("coupon_applied", { percent: c.percent }) };
  }, [t]);
  const clearCoupon = useCallback(() => setCoupon(null), []);
  const clearCart = useCallback(() => { setItems([]); setCoupon(null); }, []);

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const festivalSavings = useMemo(() => items.reduce((s, i) => s + Math.max(0, (i.mrp ?? i.price) - i.price) * i.qty, 0), [items]);
  const bulkTier = useMemo(() => bulkTiers.find((t) => subtotal >= t.min) || null, [subtotal]);
  const bulkDiscount = bulkTier ? Math.round(subtotal * bulkTier.percent / 100) : 0;
  const couponDiscount = coupon ? Math.round(subtotal * coupon.percent / 100) : 0;
  const discount = bulkDiscount + couponDiscount;
  const deliveryFee = subtotal === 0 || subtotal >= 500 ? 0 : 30;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const itemCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);

  return (
    <CartContext.Provider value={{
      items, savedForLater, addItem, addOrderItems, removeItem, updateQty, saveForLater, moveToCart, requireLogin,
      coupon, applyCoupon, clearCoupon, clearCart, subtotal, festivalSavings, bulkTier, bulkDiscount, couponDiscount, discount,
      deliveryFee, total, itemCount, toast, showToast,
    }}>
      {children}
    </CartContext.Provider>
  );
}
export function useCart() { return useContext(CartContext); }
