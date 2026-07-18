// Renders the homepage recipe grid from recipes.json, so the page reflects
// whatever cookbook this deployment actually contains.

const LANG = document.documentElement.lang === "it" ? "it" : "en";
const T = {
  en: { browseTag: "All recipes", browseTitle: "Open the library",
        browseText: "Every tested recipe and experiment.",
        emptyTag: "Empty cookbook", emptyTitle: "No recipes yet",
        emptyText: "Add markdown files to the recipes folder and rebuild — this page fills itself." },
  it: { browseTag: "Tutte le ricette", browseTitle: "Apri il ricettario",
        browseText: "Tutte le ricette testate e gli esperimenti.",
        emptyTag: "Ricettario vuoto", emptyTitle: "Ancora nessuna ricetta",
        emptyText: "Aggiungi file markdown nella cartella recipes e ricostruisci — questa pagina si riempie da sola." },
}[LANG];

const grid = document.querySelector("#homeRecipes");

function card({ href, icon, tag, title, text }) {
  const a = document.createElement("a");
  a.className = "recipe-card";
  a.href = href;
  a.innerHTML = `<div class="recipe-icon">${icon}</div><p class="tag">${tag}</p><h3>${title}</h3><p>${text}</p>`;
  return a;
}

fetch("recipes.json")
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(data => {
    // recipes.json is already sorted best-first (production ready, then tested)
    const top = data.recipes.slice(0, 5).map(recipe => card({
      href: `recipes.html?open=${recipe.id}`,
      icon: recipe.icon,
      tag: recipe.category,
      title: recipe.title,
      text: recipe.summary,
    }));
    const browse = card({ href: "recipes.html", icon: "📖", tag: T.browseTag, title: T.browseTitle, text: T.browseText });
    if (top.length === 0) {
      grid.replaceChildren(card({ href: "recipes.html", icon: "🍽️", tag: T.emptyTag, title: T.emptyTitle, text: T.emptyText }));
    } else {
      grid.replaceChildren(...top, browse);
    }
  })
  .catch(() => {
    grid.replaceChildren(card({ href: "recipes.html", icon: "📖", tag: T.browseTag, title: T.browseTitle, text: T.browseText }));
  });
