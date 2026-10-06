import { useState, cloneElement } from "react";
import { products as seedProducts } from "../../data/products";
import { categories } from "../../data/categories";
import { PageHeader, Table, Badge, statusTone, Modal } from "../components/AdminUI";

const blankForm = {
  id: null, nameEn: "", nameMr: "", nameHi: "", description: "", price: "", originalPrice: "",
  weight: "", category: categories[0]?.slug || "", stock: "", availability: "available", lowStockThreshold: 5,
  bestseller: false, isNew: false, featured: false, seasonal: false, ingredients: "", allergens: "",
  nutrition: "", storage: "", shelfLife: "", story: "", occasion: "", taste: "", mealType: "", budgetBand: "mid",
};

export default function Products() {
  const [products, setProducts] = useState(seedProducts.map((p) => ({ ...p, archived: false })));
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(null); // null = closed, blankForm = create, object = edit

  const filtered = products.filter((p) => !query || p.name.toLowerCase().includes(query.toLowerCase()));

  function openCreate() { setForm({ ...blankForm }); }
  function openEdit(p) {
    setForm({
      ...blankForm, id: p.id, nameEn: p.name, price: p.price, originalPrice: p.originalPrice || "",
      weight: p.weight, category: p.category, stock: p.stock, availability: p.availability,
      bestseller: p.badge === "Bestseller", isNew: !!p.isNew, description: p.description, story: p.story,
      ingredients: (p.ingredients || []).join(", "), storage: p.storage, shelfLife: p.shelfLife,
    });
  }
  function archive(id) {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, archived: !p.archived } : p)));
  }
  function save(e) {
    e.preventDefault();
    if (form.id) {
      setProducts((prev) => prev.map((p) => (p.id === form.id ? {
        ...p, name: form.nameEn, price: Number(form.price) || p.price, originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        weight: form.weight, category: form.category, stock: Number(form.stock) || 0, availability: form.availability,
        badge: form.bestseller ? "Bestseller" : form.isNew ? "New" : null, isNew: form.isNew,
        description: form.description, story: form.story, storage: form.storage, shelfLife: form.shelfLife,
        ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
      } : p)));
    } else {
      const id = "p" + (Date.now());
      setProducts((prev) => [{
        id, slug: form.nameEn.toLowerCase().replace(/\s+/g, "-"), name: form.nameEn, category: form.category,
        description: form.description, price: Number(form.price) || 0, originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        rating: 0, reviewCount: 0, weight: form.weight, availability: form.availability, stock: Number(form.stock) || 0,
        badge: form.bestseller ? "Bestseller" : form.isNew ? "New" : null, isNew: form.isNew, dietary: [],
        images: ["https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=900"], story: form.story,
        ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean), storage: form.storage, shelfLife: form.shelfLife,
        archived: false,
      }, ...prev]);
    }
    setForm(null);
  }

  return (
    <>
      <PageHeader title="Products" action={<button className="a-btn" onClick={openCreate}>+ New Product</button>} />
      <div className="admin-content">
        <div className="a-toolbar">
          <input className="a-input" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <span style={{ fontSize: 13, color: "var(--a-text-soft)" }}>{filtered.length} products</span>
        </div>
        <div className="a-panel">
          <Table
            columns={["Product", "Category", "Price", "Stock", "Availability", "Tags", "Actions"]}
            rows={filtered}
            renderRow={(p) => (
              <tr key={p.id} style={{ opacity: p.archived ? 0.5 : 1 }}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}{p.originalPrice ? <span style={{ textDecoration: "line-through", color: "var(--a-text-soft)", marginLeft: 6 }}>₹{p.originalPrice}</span> : null}</td>
                <td>{p.stock}</td>
                <td><Badge tone={statusTone(p.availability)}>{p.availability}</Badge></td>
                <td>{p.badge ? <Badge tone="info">{p.badge}</Badge> : "—"}</td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button className="a-btn a-btn-outline a-btn-sm" onClick={() => openEdit(p)}>Edit</button>
                  <button className="a-btn a-btn-outline a-btn-sm" onClick={() => archive(p.id)}>{p.archived ? "Unarchive" : "Archive"}</button>
                </td>
              </tr>
            )}
          />
        </div>
      </div>

      {form && (
        <Modal onClose={() => setForm(null)} width={780}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>{form.id ? "Edit Product" : "New Product"}</h3>
          <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Name (English)"><input className="a-input" required value={form.nameEn} onChange={(v) => setForm({ ...form, nameEn: v })} /></Field>
            <Field label="Name (Marathi)"><input className="a-input" value={form.nameMr} onChange={(v) => setForm({ ...form, nameMr: v })} /></Field>
            <Field label="Name (Hindi)"><input className="a-input" value={form.nameHi} onChange={(v) => setForm({ ...form, nameHi: v })} /></Field>
            <Field label="Category">
              <select className="a-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name.en}</option>)}
              </select>
            </Field>
            <Field label="Price (₹)"><input className="a-input" type="number" required value={form.price} onChange={(v) => setForm({ ...form, price: v })} /></Field>
            <Field label="Original Price (₹)"><input className="a-input" type="number" value={form.originalPrice} onChange={(v) => setForm({ ...form, originalPrice: v })} /></Field>
            <Field label="Weight / Variant"><input className="a-input" value={form.weight} onChange={(v) => setForm({ ...form, weight: v })} /></Field>
            <Field label="Stock"><input className="a-input" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} /></Field>
            <Field label="Availability">
              <select className="a-select" value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })}>
                {["available", "low-stock", "sold-out", "pre-order", "unavailable", "coming-soon"].map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Low Stock Threshold"><input className="a-input" type="number" value={form.lowStockThreshold} onChange={(v) => setForm({ ...form, lowStockThreshold: v })} /></Field>
            <Field label="Occasion"><input className="a-input" value={form.occasion} onChange={(v) => setForm({ ...form, occasion: v })} placeholder="e.g. Festival, Family Dinner" /></Field>
            <Field label="Taste"><input className="a-input" value={form.taste} onChange={(v) => setForm({ ...form, taste: v })} placeholder="e.g. Spicy, Sweet" /></Field>
            <Field label="Meal Type"><input className="a-input" value={form.mealType} onChange={(v) => setForm({ ...form, mealType: v })} /></Field>
            <Field label="Budget Band">
              <select className="a-select" value={form.budgetBand} onChange={(e) => setForm({ ...form, budgetBand: e.target.value })}>
                {["budget", "mid", "premium"].map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </Field>

            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Description" full><textarea className="a-input" rows={2} style={{ width: "100%" }} value={form.description} onChange={(v) => setForm({ ...form, description: v })} /></Field>
              <Field label="Story" full><textarea className="a-input" rows={2} style={{ width: "100%" }} value={form.story} onChange={(v) => setForm({ ...form, story: v })} /></Field>
              <Field label="Ingredients (comma separated)" full><input className="a-input" style={{ width: "100%" }} value={form.ingredients} onChange={(v) => setForm({ ...form, ingredients: v })} /></Field>
              <Field label="Allergens" full><input className="a-input" style={{ width: "100%" }} value={form.allergens} onChange={(v) => setForm({ ...form, allergens: v })} /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <Field label="Storage"><input className="a-input" value={form.storage} onChange={(v) => setForm({ ...form, storage: v })} /></Field>
                <Field label="Shelf Life"><input className="a-input" value={form.shelfLife} onChange={(v) => setForm({ ...form, shelfLife: v })} /></Field>
              </div>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", margin: "10px 0" }}>
                {["bestseller", "isNew", "featured", "seasonal"].map((k) => (
                  <label key={k} style={{ fontSize: 13.5, display: "flex", gap: 6, alignItems: "center" }}>
                    <input type="checkbox" checked={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.checked })} /> {k}
                  </label>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "var(--a-text-soft)", marginBottom: 12 }}>Image/video upload is simulated in this prototype — a placeholder image is used.</p>
            </div>

            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
              <button className="a-btn" type="submit">Save Product</button>
              <button className="a-btn a-btn-outline" type="button" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}

function Field({ label, children, full }) {
  const isPlainInput = children.type === "input" || children.type === "textarea";
  const rendered = isPlainInput && typeof children.props.onChange === "function"
    ? cloneElement(children, { onChange: (e) => children.props.onChange(e.target.value) })
    : children;
  return (
    <label style={{ display: "block", fontSize: 12.5, color: "var(--a-text-soft)", marginBottom: full ? 10 : 0 }}>
      {label}
      <div style={{ marginTop: 4 }}>{rendered}</div>
    </label>
  );
}
