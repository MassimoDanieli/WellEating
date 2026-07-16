const SOURCE_URL = "https://raw.githubusercontent.com/MassimoDanieli/WellEating/main/pantry/shopping-list.md";

const statusEl = document.querySelector("#shoppingStatus");
const grid = document.querySelector("#shoppingGrid");

function parseShoppingList(markdown) {
  const lines = markdown.split("\n");
  const sections = [];
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("## ")) {
      current = { title: line.replace("## ", ""), items: [] };
      sections.push(current);
    } else if (/^- \[( |x)\]/i.test(line) && current) {
      const checked = /^- \[x\]/i.test(line);
      const text = line.replace(/^- \[( |x)\]\s*/i, "");
      current.items.push({ text, checked });
    }
  }
  return sections;
}

function renderSections(sections) {
  grid.replaceChildren(...sections.map(section => {
    const article = document.createElement("article");
    article.className = "recipe-card shopping-card";
    const remaining = section.items.filter(i => !i.checked).length;
    article.innerHTML = `
      <p class="tag">${remaining} to buy</p>
      <h3>${section.title}</h3>
      <ul class="shopping-items">
        ${section.items.map(item => `<li class="${item.checked ? "checked" : ""}"><span class="box" aria-hidden="true"></span>${item.text}</li>`).join("")}
      </ul>`;
    return article;
  }));
}

fetch(SOURCE_URL)
  .then(response => {
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    return response.text();
  })
  .then(markdown => {
    const sections = parseShoppingList(markdown);
    if (!sections.length) {
      statusEl.textContent = "The list is currently empty. Time to plan a shop.";
      return;
    }
    statusEl.hidden = true;
    renderSections(sections);
  })
  .catch(() => {
    statusEl.textContent = "Couldn't load the live list right now — open it directly on GitHub instead.";
  });
