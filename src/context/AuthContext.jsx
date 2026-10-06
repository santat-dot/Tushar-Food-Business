import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);
const USERS_KEY = "tfb_users";      // demo "database" of registered customers (browser only)
const SESSION_KEY = "tfb_session";  // email of the logged-in customer

// NOTE: this is a front-end prototype — accounts live in this browser's localStorage.
// Replace with a real backend (hashed passwords server-side) before going live.
async function hash(text) {
  try {
    if (window.crypto?.subtle) {
      const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch { /* fall through */ }
  return "plain:" + text;
}

const readUsers = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch { return {}; } };
const writeUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));
const strip = ({ passHash, ...rest }) => rest;
const norm = (e) => e.trim().toLowerCase();

function newProfile({ name, email, phone, address }) {
  const code = "TUSHAR-" + name.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase() + Math.floor(100 + Math.random() * 899);
  return {
    name, email, phone,
    addresses: [{ id: "a" + Date.now(), label: address.label || "Home", name, phone, line: address.line, landmark: address.landmark || "", pincode: address.pincode, city: address.city, state: address.state, isDefault: true }],
    foodDNA: null,
    loyalty: { points: 0, tier: "Bronze", history: [{ id: "l0", label: "Welcome bonus", points: 50, date: new Date().toISOString().slice(0, 10) }] },
    referral: { code, link: `https://tusharfoodbusiness.example/r/${code}`, successfulReferrals: 0, rewardsEarned: 0 },
    subscriptions: [], templates: [], createdAt: new Date().toISOString(),
  };
}
const tierFor = (pts) => (pts >= 1000 ? "Gold" : pts >= 300 ? "Silver" : "Bronze");

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const email = localStorage.getItem(SESSION_KEY);
    const u = email && readUsers()[email];
    return u ? strip(u) : null;
  });

  // persist profile changes
  useEffect(() => {
    if (!user) return;
    const users = readUsers();
    if (users[user.email]) writeUsers({ ...users, [user.email]: { ...users[user.email], ...user } });
  }, [user]);

  const register = useCallback(async ({ name, email, phone, password, address }) => {
    const key = norm(email);
    const users = readUsers();
    if (users[key]) return { ok: false, error: "An account with this email already exists. Please log in." };
    const profile = newProfile({ name: name.trim(), email: key, phone, address });
    users[key] = { ...profile, passHash: await hash(password) };
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, key);
    setUser(profile);
    return { ok: true };
  }, []);

  const login = useCallback(async (email, password) => {
    const key = norm(email);
    const u = readUsers()[key];
    if (!u) return { ok: false, error: "No account found for this email. Please sign up first." };
    if (u.passHash !== (await hash(password))) return { ok: false, error: "Incorrect password. Please try again." };
    localStorage.setItem(SESSION_KEY, key);
    setUser(strip(u));
    return { ok: true };
  }, []);

  const logout = useCallback(() => { localStorage.removeItem(SESSION_KEY); setUser(null); }, []);
  const patch = useCallback((fn) => setUser((u) => (u ? fn(u) : u)), []);

  const updateFoodDNA = useCallback((dna) => patch((u) => ({ ...u, foodDNA: dna })), [patch]);
  const addSubscription = useCallback((sub) => patch((u) => ({ ...u, subscriptions: [...u.subscriptions, sub] })), [patch]);
  const updateSubscription = useCallback((id, ch) => patch((u) => ({ ...u, subscriptions: u.subscriptions.map((s) => (s.id === id ? { ...s, ...ch } : s)) })), [patch]);

  // ---- addresses (entered once at sign-up, reused for every delivery) ----
  const addAddress = useCallback((a) => patch((u) => {
    const isDefault = a.isDefault || u.addresses.length === 0;
    const list = isDefault ? u.addresses.map((x) => ({ ...x, isDefault: false })) : u.addresses;
    return { ...u, addresses: [...list, { ...a, id: "a" + Date.now(), isDefault }] };
  }), [patch]);
  const updateAddress = useCallback((id, ch) => patch((u) => ({ ...u, addresses: u.addresses.map((a) => (a.id === id ? { ...a, ...ch } : a)) })), [patch]);
  const removeAddress = useCallback((id) => patch((u) => {
    const rest = u.addresses.filter((a) => a.id !== id);
    if (rest.length && !rest.some((a) => a.isDefault)) rest[0] = { ...rest[0], isDefault: true };
    return { ...u, addresses: rest };
  }), [patch]);
  const setDefaultAddress = useCallback((id) => patch((u) => ({ ...u, addresses: u.addresses.map((a) => ({ ...a, isDefault: a.id === id })) })), [patch]);

  // ---- loyalty + saved reorder lists ----
  const earnPoints = useCallback((points, label) => patch((u) => {
    const total = u.loyalty.points + points;
    return { ...u, loyalty: { points: total, tier: tierFor(total), history: [{ id: "l" + Date.now(), label, points, date: new Date().toISOString().slice(0, 10) }, ...u.loyalty.history] } };
  }), [patch]);
  const saveTemplate = useCallback((t) => patch((u) => ({ ...u, templates: [{ ...t, id: "t" + Date.now() }, ...(u.templates || [])] })), [patch]);
  const deleteTemplate = useCallback((id) => patch((u) => ({ ...u, templates: (u.templates || []).filter((t) => t.id !== id) })), [patch]);

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || null;

  return (
    <AuthContext.Provider value={{ user, defaultAddress, login, register, logout, updateFoodDNA, addSubscription, updateSubscription,
      addAddress, updateAddress, removeAddress, setDefaultAddress, earnPoints, saveTemplate, deleteTemplate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
