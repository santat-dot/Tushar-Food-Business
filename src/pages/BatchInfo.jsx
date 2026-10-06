import { useParams, Link } from "react-router-dom";
import { batches } from "../admin/data/adminData";
import { products } from "../data/products";
import { batchTimelineSteps } from "../admin/data/adminData";
import { useCart } from "../context/CartContext";

export default function BatchInfo() {
  const { batchId } = useParams();
  const batch = batches.find((b) => b.id === batchId) || batches[0];
  const product = products.find((p) => p.name === batch.product) || products[0];
  const { addItem } = useCart();

  return (
    <div className="container section" style={{ maxWidth: 760 }}>
      <div style={{ fontSize: 13, color: "var(--ink-soft)", marginBottom: 10 }}>
        <Link to="/">Home</Link> / Batch Story
      </div>
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <span className="eyebrow">Batch {batch.id}</span>
        <h1 style={{ fontSize: 28, margin: "6px 0 14px" }}>{product.name}</h1>
        <img src={product.images?.[0]} alt={product.name} style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 12, marginBottom: 16 }} />
        <p style={{ color: "var(--ink-soft)", marginBottom: 14 }}>{product.story}</p>

        <h3 style={{ fontSize: 16, marginBottom: 8 }}>Batch Timeline</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {batchTimelineSteps.map((s) => <span key={s} className="badge badge-available">{s}</span>)}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 14, marginBottom: 18 }}>
          <div><strong>Packed on</strong><div style={{ color: "var(--ink-soft)" }}>{batch.packingDate}</div></div>
          <div><strong>Best before</strong><div style={{ color: "var(--ink-soft)" }}>{batch.bestBefore}</div></div>
          <div><strong>Storage</strong><div style={{ color: "var(--ink-soft)" }}>{product.storage}</div></div>
          <div><strong>Shelf life</strong><div style={{ color: "var(--ink-soft)" }}>{product.shelfLife}</div></div>
        </div>

        <div style={{ background: "var(--cream)", borderRadius: 10, padding: 16, marginBottom: 18 }}>
          <h4 style={{ fontSize: 14, marginBottom: 6 }}>How it's made</h4>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)" }}>
            Watch the making process in Kitchen Stories to see this product prepared from scratch.
          </p>
          <Link to="/kitchen-stories" className="link-more" style={{ display: "inline-block", marginTop: 8 }}>Watch the making video →</Link>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to={`/product/${product.slug}`} className="btn btn-outline">View Product</Link>
          <button className="btn btn-primary" onClick={() => addItem(product, 1)}>Reorder This</button>
        </div>
      </div>
    </div>
  );
}
