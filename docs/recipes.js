// Recipes are loaded from recipes.json, generated from recipes/**.md
// by scripts/build_recipes.py (run automatically by a GitHub Action).
// The markdown files are the single source of truth — edit those, not this file.

let recipes = [];

const LANG = document.documentElement.lang === "it" ? "it" : "en";
const T = {
  en: {
    all: "All", open: "Open recipe", ingredients: "Ingredients", method: "Method",
    note: "Kitchen note", source: "View source on GitHub \u2192", minutes: "minutes",
    outOf: "out of 5",
    error: "Couldn't load the recipe library right now. Try refreshing, or browse the recipes folder on GitHub.",
    status: { "Production ready": "Production ready", "Tested": "Tested", "To test": "To test" },
  },
  it: {
    all: "Tutte", open: "Apri ricetta", ingredients: "Ingredienti", method: "Preparazione",
    note: "Nota di cucina", source: "Vedi il sorgente su GitHub \u2192", minutes: "minuti",
    outOf: "su 5",
    error: "Impossibile caricare il ricettario in questo momento. Riprova, oppure sfoglia la cartella recipes su GitHub.",
    status: { "Production ready": "Production ready", "Tested": "Testata", "To test": "Da provare" },
  },
}[LANG];


const state = { query: "", category: "All", status: "All" };
const grid = document.querySelector("#recipeGrid");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const dialog = document.querySelector("#recipeDialog");
const dialogContent = document.querySelector("#dialogContent");

const REPO_BLOB = "https://github.com/MassimoDanieli/WellEating/blob/main/";

function unique(field) {
  return ["All", ...new Set(recipes.map(r => r[field]))];
}

function buildChips(targetId, values, field) {
  const target = document.querySelector(targetId);
  target.replaceChildren();
  values.forEach(value => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `chip${value === "All" ? " selected" : ""}`;
    button.textContent = value === "All" ? T.all : (field === "status" ? (T.status[value] || value) : value);
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
    <div class="card-top"><div class="recipe-icon">${recipe.icon}</div><span class="status ${recipe.status.toLowerCase().replaceAll(" ", "-")}">${T.status[recipe.status] || recipe.status}</span></div>
    <p class="tag">${recipe.category}</p>
    <h2>${recipe.title}</h2>
    <p>${recipe.summary}</p>
    <div class="recipe-meta"><span>⏱ ${recipe.time} min</span><span>v${recipe.version}</span></div>
    <button class="card-action" type="button">${T.open} <span>→</span></button>`;
  article.querySelector("button").addEventListener("click", () => openRecipe(recipe, { updateUrl: true }));
  return article;
}

function render() {
  const items = filteredRecipes();
  grid.replaceChildren(...items.map(card));
  resultCount.textContent = items.length;
  emptyState.hidden = items.length !== 0;
}

function openRecipe(recipe, { updateUrl = false } = {}) {
  const stars = recipe.rating ? `<span class="rating" title="${recipe.rating} ${T.outOf}">${"★".repeat(recipe.rating)}${"☆".repeat(5 - recipe.rating)}</span>` : "";
  dialogContent.innerHTML = `
    <div class="dialog-hero"><div class="dialog-icon">${recipe.icon}</div><div><p class="tag">${recipe.category} · v${recipe.version}</p><h2>${recipe.title}</h2><p>${recipe.summary}</p></div></div>
    <div class="dialog-meta"><span>⏱ ${recipe.time} ${T.minutes}</span><span>${T.status[recipe.status] || recipe.status}</span>${stars ? `<span>${stars}</span>` : ""}</div>
    <div class="recipe-detail-grid">
      <section><h3>${T.ingredients}</h3><ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join("")}</ul></section>
      <section><h3>${T.method}</h3><ol>${recipe.method.map(step => `<li>${step}</li>`).join("")}</ol></section>
    </div>
    ${recipe.note ? `<aside class="recipe-note"><strong>${T.note}</strong><p>${recipe.note}</p></aside>` : ""}
    <p class="dialog-source"><a href="${REPO_BLOB}${recipe.source}">${T.source}</a></p>`;
  dialog.showModal();

  if (updateUrl) {
    const url = new URL(window.location);
    url.searchParams.set("open", recipe.id);
    history.pushState({ open: recipe.id }, "", url);
  }
}

function closeDialog({ updateUrl = true } = {}) {
  dialog.close();
  if (updateUrl && new URLSearchParams(window.location.search).has("open")) {
    const url = new URL(window.location);
    url.searchParams.delete("open");
    history.pushState({}, "", url);
  }
}

function openFromUrl() {
  const requestedId = new URLSearchParams(window.location.search).get("open");
  if (!requestedId) {
    if (dialog.open) dialog.close();
    return;
  }
  const requested = recipes.find(r => r.id === requestedId);
  if (requested) openRecipe(requested);
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
document.querySelector(".dialog-close").addEventListener("click", () => closeDialog());
dialog.addEventListener("click", event => { if (event.target === dialog) closeDialog(); });
dialog.addEventListener("cancel", () => closeDialog());
window.addEventListener("popstate", openFromUrl);

fetch("recipes.json")
  .then(response => {
    if (!response.ok) throw new Error(`recipes.json returned ${response.status}`);
    return response.json();
  })
  .then(data => {
    recipes = data.recipes;
    buildChips("#categoryFilters", unique("category"), "category");
    buildChips("#statusFilters", unique("status"), "status");
    render();
    openFromUrl();
  })
  .catch(() => {
    emptyState.hidden = false;
    emptyState.textContent = T.error;
  });
