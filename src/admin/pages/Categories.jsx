import { useState } from "react";
import { categories as seed } from "../../data/categories";
import { PageHeader, Table } from "../components/AdminUI";

export default function Categories() {
  const [categories, setCategories] = useState(seed);
  const [name, setName] = useState("");

  function addCategory(e) {
    e.preventDefault();
    if (!name.trim()) return;
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");
    setCategories((prev) => [...prev, { slug, name: { en: name, hi: name, mr: name }, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=800", count: 0 }]);
    setName("");
  }
  function remove(slug) { setCategories((prev) => prev.filter((c) => c.slug !== slug)); }

  return (
    <>
      <PageHeader title="Categories" />
      <div className="admin-content">
        <form onSubmit={addCategory} className="a-toolbar">
          <input className="a-input" placeholder="New category name (English)" value={name} onChange={(e) => setName(e.target.value)} />
          <button className="a-btn" type="submit">+ Add Category</button>
        </form>
        <div className="a-panel">
          <Table
            columns={["Name (EN)", "मराठी", "हिन्दी", "Products", "Actions"]}
            rows={categories}
            renderRow={(c) => (
              <tr key={c.slug}>
                <td>{c.name.en}</td>
                <td>{c.name.mr}</td>
                <td>{c.name.hi}</td>
                <td>{c.count}</td>
                <td><button className="a-btn a-btn-outline a-btn-sm" onClick={() => remove(c.slug)}>Remove</button></td>
              </tr>
            )}
          />
        </div>
      </div>
    </>
  );
}
