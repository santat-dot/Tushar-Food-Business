import { useMemo, useState } from "react";

export function useFilteredProducts(baseProducts) {
  const [sort, setSort] = useState("featured");
  const [priceMax, setPriceMax] = useState(1200);
  const [availability, setAvailability] = useState("all");
  const [dietary, setDietary] = useState("all");
  const [onlyBestseller, setOnlyBestseller] = useState(false);
  const [onlyNew, setOnlyNew] = useState(false);

  const filtered = useMemo(() => {
    let list = baseProducts.filter((p) => p.price <= priceMax);
    if (availability !== "all") list = list.filter((p) => p.availability === availability);
    if (dietary !== "all") list = list.filter((p) => p.dietary?.includes(dietary));
    if (onlyBestseller) list = list.filter((p) => p.badge === "Bestseller");
    if (onlyNew) list = list.filter((p) => p.isNew);

    switch (sort) {
      case "price-low": list = [...list].sort((a, b) => a.price - b.price); break;
      case "price-high": list = [...list].sort((a, b) => b.price - a.price); break;
      case "rating": list = [...list].sort((a, b) => b.rating - a.rating); break;
      case "newest": list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case "bestselling": list = [...list].sort((a, b) => (b.badge === "Bestseller" ? 1 : 0) - (a.badge === "Bestseller" ? 1 : 0)); break;
      default: break;
    }
    return list;
  }, [baseProducts, sort, priceMax, availability, dietary, onlyBestseller, onlyNew]);

  const reset = () => { setPriceMax(1200); setAvailability("all"); setDietary("all"); setOnlyBestseller(false); setOnlyNew(false); };

  return { filtered, sort, setSort, priceMax, setPriceMax, availability, setAvailability, dietary, setDietary, onlyBestseller, setOnlyBestseller, onlyNew, setOnlyNew, reset };
}
