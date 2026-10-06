import { useState } from "react";
import { kitchenStories as seed } from "../../data/kitchenStories";
import { PageHeader, Table, Badge, Modal } from "../components/AdminUI";

const CATEGORIES = ["How We Make It", "Behind the Kitchen", "Ingredients", "Packing Orders", "Recipe Stories", "Customer Stories", "New Products", "Festival Specials"];

export default function KitchenStoriesAdmin() {
  const [stories, setStories] = useState(seed.map((s, i) => ({
    ...s, category: CATEGORIES[i % CATEGORIES.length], featured: i === 0, published: true,
    views: 800 - i * 90, completedViews: 500 - i * 60, productClicks: 60 - i * 7, shares: 20 - i * 2, ordersFromStory: 5 - Math.floor(i / 2),
  })));
  const [form, setForm] = useState(null);

  function togglePublish(id) { setStories((prev) => prev.map((s) => (s.id === id ? { ...s, published: !s.published } : s))); }
  function toggleFeatured(id) { setStories((prev) => prev.map((s) => (s.id === id ? { ...s, featured: !s.featured } : s))); }
  function move(id, dir) {
    setStories((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      const swap = idx + dir;
      if (swap < 0 || swap >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[swap]] = [copy[swap], copy[idx]];
      return copy;
    });
  }
  function openCreate() { setForm({ titleEn: "", titleMr: "", titleHi: "", descriptionEn: "", category: CATEGORIES[0], tags: "", relatedProductId: "" }); }
  function save(e) {
    e.preventDefault();
    setStories((prev) => [{
      id: "ks" + Date.now(), slug: form.titleEn.toLowerCase().replace(/\s+/g, "-"), title: form.titleEn,
      caption: form.descriptionEn, duration: "0:40", thumbnail: "https://images.unsplash.com/photo-1601303516361-6a92c66a48cc?q=80&w=700",
      relatedProductId: form.relatedProductId, category: form.category, featured: false, published: false,
      views: 0, completedViews: 0, productClicks: 0, shares: 0, ordersFromStory: 0,
    }, ...prev]);
    setForm(null);
  }

  return (
    <>
      <PageHeader title="Kitchen Stories" action={<button className="a-btn" onClick={openCreate}>+ Upload Story</button>} />
      <div className="admin-content">
        <div className="a-panel">
          <Table
            columns={["Title", "Category", "Views", "Completed", "Product Clicks", "Shares", "Orders", "Featured", "Status", "Actions"]}
            rows={stories}
            renderRow={(s, i) => (
              <tr key={s.id}>
                <td>{s.title}</td><td>{s.category}</td><td>{s.views}</td><td>{s.completedViews}</td>
                <td>{s.productClicks}</td><td>{s.shares}</td><td>{s.ordersFromStory}</td>
                <td>{s.featured ? <Badge tone="good">Featured</Badge> : <button className="a-btn a-btn-outline a-btn-sm" onClick={() => toggleFeatured(s.id)}>Feature</button>}</td>
                <td><Badge tone={s.published ? "good" : "neutral"}>{s.published ? "published" : "unpublished"}</Badge></td>
                <td style={{ display: "flex", gap: 4 }}>
                  <button className="a-btn a-btn-outline a-btn-sm" onClick={() => move(s.id, -1)}>↑</button>
                  <button className="a-btn a-btn-outline a-btn-sm" onClick={() => move(s.id, 1)}>↓</button>
                  <button className="a-btn a-btn-outline a-btn-sm" onClick={() => togglePublish(s.id)}>{s.published ? "Unpublish" : "Publish"}</button>
                </td>
              </tr>
            )}
          />
        </div>
      </div>

      {form && (
        <Modal onClose={() => setForm(null)}>
          <h3 style={{ fontSize: 18, marginBottom: 14 }}>Upload Kitchen Story</h3>
          <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label>Title (English)<input required className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} /></label>
            <label>Category<select className="a-select" style={{ width: "100%", marginTop: 4 }} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select></label>
            <label>Title (Marathi)<input className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.titleMr} onChange={(e) => setForm({ ...form, titleMr: e.target.value })} /></label>
            <label>Title (Hindi)<input className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.titleHi} onChange={(e) => setForm({ ...form, titleHi: e.target.value })} /></label>
            <label style={{ gridColumn: "1 / -1" }}>Description<textarea className="a-input" rows={2} style={{ width: "100%", marginTop: 4 }} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} /></label>
            <label>Tags (comma separated)<input className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></label>
            <label>Related Product ID<input className="a-input" style={{ width: "100%", marginTop: 4 }} value={form.relatedProductId} onChange={(e) => setForm({ ...form, relatedProductId: e.target.value })} placeholder="e.g. p1" /></label>
            <p style={{ gridColumn: "1 / -1", fontSize: 12, color: "var(--a-text-soft)" }}>Video/thumbnail upload is simulated — a demo thumbnail is assigned automatically.</p>
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
