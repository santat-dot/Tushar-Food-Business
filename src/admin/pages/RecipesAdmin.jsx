import { useState } from "react";
import { recipes as seed } from "../../data/recipes";
import { products } from "../../data/products";
import { PageHeader, Table, Badge, Modal } from "../components/AdminUI";

export default function RecipesAdmin() {
  const [recipes, setRecipes] = useState(seed.map((r) => ({ ...r, status: "published", relatedProduct: products[0]?.name || "" })));
  const [form, setForm] = useState(null);

  function setStatus(id, status) { setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r))); }
  function openCreate() { setForm({ title: "", category: "Recipe", relatedProduct: products[0]?.name || "", seoTitle: "", seoDescription: "" }); }
  function save(e) {
    e.preventDefault();
    setRecipes((prev) => [{
      id: "rc" + Date.now(), slug: form.title.toLowerCase().replace(/\s+/g, "-"), title: form.title, time: "20 min",
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800", intro: form.seoDescription,
      ingredients: [], steps: [], status: "draft", relatedProduct: form.relatedProduct,
    }, ...prev]);
    setForm(null);
  }

  return (
    <>
      <PageHeader title="Recipes & Blog" action={<button className="a-btn" onClick={openCreate}>+ New Recipe / Article</button>} />
      <div className="admin-content">
        <div className="a-panel">
          <Table
            columns={["Title", "Slug", "Related Product", "Status", "Actions"]}
            rows={recipes}
            renderRow={(r) => (
              <tr key={r.id}>
                <td>{r.title}</td><td>{r.slug}</td><td>{r.relatedProduct}</td>
                <td><Badge tone={r.status === "published" ? "good" : "warn"}>{r.status}</Badge></td>
                <td style={{ display: "flex", gap: 6 }}>
                  {r.status !== "published" && <button className="a-btn a-btn-sm" onClick={() => setStatus(r.id, "published")}>Publish</button>}
                  {r.status === "published" && <button className="a-btn a-btn-outline a-btn-sm" onClick={() => setStatus(r.id, "unpublished")}>Unpublish</button>}
                  <button className="a-btn a-btn-outline a-btn-sm" onClick={() => setStatus(r.id, "archived")}>Archive</button>
                </td>
              </tr>
            )}
          />
        </div>
      </div>

      {form && (
        <Modal onClose={() => setForm(null)}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>New Recipe / Article</h3>
          <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label>Title<input required className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
            <label>Related Product<select className="a-select" style={{ width: "100%", marginTop: 4 }} value={form.relatedProduct} onChange={(e) => setForm({ ...form, relatedProduct: e.target.value })}>
              {products.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select></label>
            <label style={{ gridColumn: "1 / -1" }}>SEO Title<input className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} /></label>
            <label style={{ gridColumn: "1 / -1" }}>SEO Description<textarea className="a-input" rows={2} style={{ width: "100%", marginTop: 4 }} value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} /></label>
            <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
              <button className="a-btn" type="submit">Save as Draft</button>
              <button className="a-btn a-btn-outline" type="button" onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
