const SOURCE_URL = "https://raw.githubusercontent.com/MassimoDanieli/WellEating/main/pantry/shopping-list.md";
const TICKS_KEY = "welleating-shopping-ticks";

const LANG = document.documentElement.lang === "it" ? "it" : "en";
const T = {
  en: { toBuy: "to buy", empty: "The list is currently empty. Time to plan a shop.",
        error: "Couldn't load the live list right now \u2014 open it directly on GitHub instead." },
  it: { toBuy: "da comprare", empty: "La lista al momento \u00e8 vuota. Ora di pianificare una spesa.",
        error: "Impossibile caricare la lista in questo momento \u2014 aprila direttamente su GitHub." },
}[LANG];


const statusEl = document.querySelector("#shoppingStatus");
const grid = document.querySelector("#shoppingGrid");
const toolbar = document.querySelector("#shoppingToolbar");

// Local ticks are overrides on top of the repo state, stored on this device:
// tick items off at the supermarket without touching the repo.
function loadTicks() {
  try { return JSON.parse(localStorage.getItem(TICKS_KEY)) || {}; }
  catch { return {}; }
}
function saveTicks(ticks) {
  try { localStorage.setItem(TICKS_KEY, JSON.stringify(ticks)); } catch {}
}

let ticks = loadTicks();
let sections = [];

function parseShoppingList(markdown) {
  const lines = markdown.split("\n");
  const parsed = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      current = { title: line.replace("## ", ""), items: [] };
      parsed.push(current);
    } else if (/^- \[( |x)\]/i.test(line) && current) {
      const repoChecked = /^- \[x\]/i.test(line);
      const text = line.replace(/^- \[( |x)\]\s*/i, "");
      current.items.push({ text, repoChecked });
    }
  }
  return parsed;
}

function isChecked(item) {
  return ticks[item.text] !== undefined ? ticks[item.text] : item.repoChecked;
}

function toggle(item) {
  ticks[item.text] = !isChecked(item);
  saveTicks(ticks);
  render();
}

function render() {
  const anyTicks = Object.keys(ticks).length > 0;
  toolbar.hidden = !anyTicks;

  grid.replaceChildren(...sections.map(section => {
    const article = document.createElement("article");
    article.className = "recipe-card shopping-card";
    const remaining = section.items.filter(i => !isChecked(i)).length;

    const heading = document.createElement("div");
    heading.innerHTML = `<p class="tag">${remaining} ${T.toBuy}</p><h3>${section.title}</h3>`;
    article.appendChild(heading);

    const list = document.createElement("ul");
    list.className = "shopping-items";
    section.items.forEach(item => {
      const li = document.createElement("li");
      li.className = isChecked(item) ? "checked" : "";
      li.innerHTML = `<span class="box" aria-hidden="true"></span>${item.text}`;
      li.setAttribute("role", "checkbox");
      li.setAttribute("aria-checked", isChecked(item));
      li.tabIndex = 0;
      li.addEventListener("click", () => toggle(item));
      li.addEventListener("keydown", e => {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(item); }
      });
      list.appendChild(li);
    });
    article.appendChild(list);
    return article;
  }));
}

document.querySelector("#clearTicks").addEventListener("click", () => {
  ticks = {};
  saveTicks(ticks);
  render();
});

fetch(SOURCE_URL)
  .then(response => {
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    return response.text();
  })
  .then(markdown => {
    sections = parseShoppingList(markdown);
    if (!sections.length) {
      statusEl.textContent = T.empty;
      return;
    }
    statusEl.hidden = true;
    render();
  })
  .catch(() => {
    statusEl.textContent = T.error;
  });
