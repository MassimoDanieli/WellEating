const recipes = [
  {
    id: "frittata",
    title: "Zucchini, Onion & Emmental Frittata",
    category: "Dinner",
    status: "Production ready",
    version: "1.1",
    time: 25,
    icon: "🍳",
    summary: "Caramelised onion, tender courgette and enough cheese to make added salt optional.",
    ingredients: ["3 eggs", "1 courgette, thinly sliced", "1 medium onion, thinly sliced", "30–40 g Emmental, grated", "1 tsp extra virgin olive oil", "½ tsp honey", "Black pepper"],
    method: ["Cook the onion in the oil for four minutes.", "Add honey and continue gently, using small splashes of water if the pan dries.", "Add the courgette and cook until tender.", "Beat the eggs with pepper and most of the cheese.", "Pour into the pan, cover and cook on low until nearly set.", "Turn briefly or finish under a grill if the pan is oven-safe."],
    note: "Good hot or cold. Water works better than extra oil when the onion catches."
  },
  {
    id: "couscous",
    title: "Chickpea & Harissa Couscous",
    category: "Couscous",
    status: "Tested",
    version: "1.1",
    time: 25,
    icon: "🥣",
    summary: "Warm, spicy couscous balanced with lemon, parsley and Greek yoghurt.",
    ingredients: ["80 g dry couscous", "120 g chickpeas", "1 medium onion", "1 tsp harissa", "1 tsp olive oil", "½ tsp honey", "½ lemon", "1 garlic clove", "Greek yoghurt", "Parsley and black pepper"],
    method: ["Prepare and fluff the couscous.", "Cook the onion in the oil, adding splashes of water as needed.", "Add honey after four minutes, then garlic for 30 seconds.", "Add chickpeas, harissa and a little water.", "Fold in the couscous.", "Finish with lemon, parsley, pepper and yoghurt."],
    note: "The yoghurt balances the harissa beautifully."
  },
  {
    id: "salmon",
    title: "Air-Fryer Salmon & Vegetables",
    category: "Fish",
    status: "Tested",
    version: "1.1",
    time: 20,
    icon: "🐟",
    summary: "A simple working-day dinner with crisp vegetables and properly juicy salmon.",
    ingredients: ["180–200 g salmon fillet", "Courgette", "Red pepper", "Onion", "Up to 1 tbsp olive oil", "Lemon", "Black pepper", "Smoked paprika, optional"],
    method: ["Cut the vegetables into fairly thick pieces.", "Start them in the air fryer at 190°C.", "Add the salmon later so it cooks for only 8–10 minutes.", "Remove it as soon as it is just cooked.", "Finish with lemon and black pepper."],
    note: "Thin courgette slices overcook quickly. Remove the salmon slightly early."
  },
  {
    id: "tofu",
    title: "Dijon, Honey & Lemon Tofu",
    category: "Vegetarian",
    status: "Tested",
    version: "1.1",
    time: 30,
    icon: "🌱",
    summary: "A sharp-sweet marinade that gives super-firm tofu real flavour without drying it out.",
    ingredients: ["180–200 g super-firm tofu", "2 tsp smooth Dijon", "1 tsp honey", "½ lemon", "1 tsp olive oil", "Black pepper", "Chilli flakes"],
    method: ["Cut the tofu into 2 cm cubes.", "Mix the marinade and coat the tofu.", "Leave for 15–20 minutes.", "Air fry at 190°C for eight minutes.", "Check immediately and add only one or two minutes if needed."],
    note: "Super-firm tofu dries quickly. Smooth Dijon coats better than wholegrain."
  },
  {
    id: "tuna-salad",
    title: "Tuna & Mustard Salad",
    category: "Salad",
    status: "Tested",
    version: "1.0",
    time: 10,
    icon: "🥗",
    summary: "A fast lunch with protein, acidity and crunch, built from whatever is actually in the fridge.",
    ingredients: ["Mixed leaves or rocket", "80 g tinned tuna", "Thinly sliced onion", "Olives", "Chickpeas, optional", "1 tsp olive oil", "½ lemon", "½ tsp English mustard", "Honey and black pepper"],
    method: ["Combine the salad ingredients.", "Whisk oil, lemon, mustard, honey and pepper.", "Dress immediately before eating."],
    note: "Sauerkraut is a surprisingly good optional addition."
  },
  {
    id: "bresaola",
    title: "Bresaola, Rocket & Parmesan",
    category: "Lunch",
    status: "Tested",
    version: "1.0",
    time: 8,
    icon: "🥩",
    summary: "Minimal preparation, strong flavours and a sensible portion of bread on the side.",
    ingredients: ["80 g bresaola", "Rocket", "20 g Parmesan", "Cherry tomatoes", "1 slice wholemeal bread", "1 tbsp olive oil", "Lemon and black pepper"],
    method: ["Arrange the rocket and bresaola.", "Add shaved Parmesan and tomatoes.", "Finish with oil, lemon and pepper.", "Serve with wholemeal bread."],
    note: "A dependable no-cook dinner."
  },
  {
    id: "eggs-tomato",
    title: "Eggs in Tomato Sauce",
    category: "Dinner",
    status: "To test",
    version: "1.0",
    time: 25,
    icon: "🍅",
    summary: "Three eggs gently cooked in a reduced tomato sauce, with bread for the inevitable scarpetta.",
    ingredients: ["3 eggs", "200–250 ml passata", "½ onion", "1 garlic clove", "1 tsp olive oil", "Chilli flakes", "Oregano", "1 slice bread"],
    method: ["Soften the onion, using water if needed.", "Add garlic for 30 seconds.", "Add passata and seasoning; simmer 10–15 minutes.", "Make three wells and crack in the eggs.", "Cover and cook for 5–7 minutes."],
    note: "Still awaiting its first production test."
  },
  {
    id: "dressing",
    title: "Mustard & Lemon Dressing",
    category: "Sauce",
    status: "Production ready",
    version: "1.1",
    time: 3,
    icon: "🍋",
    summary: "A bright everyday dressing that works with salads, fish and warm vegetables.",
    ingredients: ["1 tsp smooth Dijon", "½ lemon", "1 tsp olive oil", "Black pepper", "½ tsp honey, optional", "Chives, optional"],
    method: ["Whisk everything until emulsified.", "Add a teaspoon of water for a thinner dressing."],
    note: "For English mustard, use only half a teaspoon and include honey."
  }
];

const state = { query: "", category: "All", status: "All" };
const grid = document.querySelector("#recipeGrid");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const dialog = document.querySelector("#recipeDialog");
const dialogContent = document.querySelector("#dialogContent");

function unique(field) {
  return ["All", ...new Set(recipes.map(r => r[field]))];
}

function buildChips(targetId, values, field) {
  const target = document.querySelector(targetId);
  values.forEach(value => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip${value === "All" ? " selected" : ""}`;
    button.textContent = value;
    button.addEventListener("click", () => {
      state[field] = value;
      [...target.children].forEach(child => child.classList.toggle("selected", child === button));
      render();
    });
    target.appendChild(button);
  });
}

function filteredRecipes() {
  const q = state.query.toLowerCase().trim();
  return recipes.filter(recipe => {
    const haystack = `${recipe.title} ${recipe.summary} ${recipe.category} ${recipe.status} ${recipe.ingredients.join(" ")}`.toLowerCase();
    return (!q || haystack.includes(q)) &&
      (state.category === "All" || recipe.category === state.category) &&
      (state.status === "All" || recipe.status === state.status);
  });
}

function card(recipe) {
  const article = document.createElement("article");
  article.className = "recipe-card library-card";
  article.innerHTML = `
    <div class="card-top"><div class="recipe-icon">${recipe.icon}</div><span class="status ${recipe.status.toLowerCase().replaceAll(" ", "-")}">${recipe.status}</span></div>
    <p class="tag">${recipe.category}</p>
    <h2>${recipe.title}</h2>
    <p>${recipe.summary}</p>
    <div class="recipe-meta"><span>⏱ ${recipe.time} min</span><span>v${recipe.version}</span></div>
    <button class="card-action" type="button">Open recipe <span>→</span></button>`;
  article.querySelector("button").addEventListener("click", () => openRecipe(recipe));
  return article;
}

function render() {
  const items = filteredRecipes();
  grid.replaceChildren(...items.map(card));
  resultCount.textContent = items.length;
  emptyState.hidden = items.length !== 0;
}

function openRecipe(recipe) {
  dialogContent.innerHTML = `
    <div class="dialog-hero"><div class="dialog-icon">${recipe.icon}</div><div><p class="tag">${recipe.category} · v${recipe.version}</p><h2>${recipe.title}</h2><p>${recipe.summary}</p></div></div>
    <div class="dialog-meta"><span>⏱ ${recipe.time} minutes</span><span>${recipe.status}</span></div>
    <div class="recipe-detail-grid">
      <section><h3>Ingredients</h3><ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul></section>
      <section><h3>Method</h3><ol>${recipe.method.map(step => `<li>${step}</li>`).join("")}</ol></section>
    </div>
    <aside class="recipe-note"><strong>Kitchen note</strong><p>${recipe.note}</p></aside>`;
  dialog.showModal();
}

document.querySelector("#search").addEventListener("input", event => {
  state.query = event.target.value;
  render();
});
document.querySelector("#clearFilters").addEventListener("click", () => {
  state.query = ""; state.category = "All"; state.status = "All";
  document.querySelector("#search").value = "";
  document.querySelectorAll(".chips").forEach(group => [...group.children].forEach((chip, index) => chip.classList.toggle("selected", index === 0)));
  render();
});
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

buildChips("#categoryFilters", unique("category"), "category");
buildChips("#statusFilters", unique("status"), "status");
render();
