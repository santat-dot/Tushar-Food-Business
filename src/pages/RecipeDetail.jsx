import { useParams, Navigate, Link } from "react-router-dom";
import { getRecipeBySlug } from "../data/recipes";

export default function RecipeDetail() {
  const { slug } = useParams();
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return <Navigate to="/recipes" replace />;

  return (
    <div className="container section" style={{ maxWidth: 720 }}>
      <Link to="/recipes" className="link-more" style={{ fontSize: 13 }}>← All Recipes</Link>
      <h1 style={{ fontSize: 30, marginTop: 14 }}>{recipe.title}</h1>
      <p style={{ color: "var(--ink-soft)", marginTop: 6 }}>{recipe.time}</p>
      <img src={recipe.image} alt={recipe.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", borderRadius: 16, margin: "24px 0" }} />
      <p style={{ lineHeight: 1.7, color: "var(--ink-soft)" }}>{recipe.intro}</p>

      <h3 style={{ fontSize: 19, marginTop: 32, marginBottom: 12 }}>Ingredients</h3>
      <ul style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {recipe.ingredients.map((i) => <li key={i} className="badge badge-available">{i}</li>)}
      </ul>

      <h3 style={{ fontSize: 19, marginTop: 32, marginBottom: 12 }}>Steps</h3>
      <ol style={{ display: "flex", flexDirection: "column", gap: 14, paddingLeft: 20 }}>
        {recipe.steps.map((s, i) => (
          <li key={i} style={{ lineHeight: 1.6, color: "var(--ink-soft)" }}>{s}</li>
        ))}
      </ol>
    </div>
  );
}
