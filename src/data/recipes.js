const img = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&fit=crop&w=800&h=600`;

export const recipes = [
  { id: "rc1", slug: "quick-poha", title: "Quick Morning Poha", time: "15 min", image: img("1640777"), intro: "A light, tangy flattened-rice breakfast ready in under 15 minutes.", ingredients: ["Poha", "Onion", "Curry leaves", "Peanuts", "Turmeric", "Lemon"], steps: ["Rinse poha until soft, drain well.", "Temper mustard seeds, curry leaves and onion.", "Add turmeric and peanuts, mix.", "Fold in poha, season, finish with lemon and coriander."] },
  { id: "rc2", slug: "simple-dal-tadka", title: "Simple Dal Tadka", time: "30 min", image: img("3026808"), intro: "A comforting everyday lentil curry finished with a hot ghee tempering.", ingredients: ["Toor dal", "Tomato", "Garlic", "Cumin", "Ghee", "Coriander"], steps: ["Pressure-cook dal with turmeric until soft.", "Mash lightly and simmer with tomato.", "Prepare a tempering of ghee, cumin and garlic.", "Pour over dal and garnish with coriander."] },
  { id: "rc3", slug: "coconut-chutney", title: "Fresh Coconut Chutney", time: "10 min", image: img("1279330"), intro: "A five-minute chutney that pairs with almost anything from our menu.", ingredients: ["Fresh coconut", "Green chilli", "Roasted gram", "Curry leaves", "Mustard seeds"], steps: ["Blend coconut, chilli, roasted gram with water.", "Season with salt.", "Temper mustard seeds and curry leaves in oil.", "Pour tempering over chutney."] },
];

export function getRecipeBySlug(slug) {
  return recipes.find((r) => r.slug === slug);
}
