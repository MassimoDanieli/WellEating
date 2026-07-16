const SOURCE_URL = "https://raw.githubusercontent.com/MassimoDanieli/WellEating/main/meal-plans/current-week.md";

const statusEl = document.querySelector("#planStatus");
const grid = document.querySelector("#planGrid");

const TODAY = new Date().toLocaleDateString("en-GB", { weekday: "long" });

function parseTable(markdown) {
  const rows = markdown
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.startsWith("|"));
  if (rows.length < 3) return [];

  const parseRow = line => line.split("|").slice(1, -1).map(cell => cell.trim());
  const header = parseRow(rows[0]).map(h => h.toLowerCase());
  const dataRows = rows.slice(2); // skip header + separator

  return dataRows.map(line => {
    const cells = parseRow(line);
    const get = name => cells[header.indexOf(name)] || "";
    return { day: get("day"), lunch: get("lunch"), dinner: get("dinner"), notes: get("notes") };
  }).filter(row => row.day);
}

function renderDays(days) {
  grid.replaceChildren(...days.map(entry => {
    const article = document.createElement("article");
    const isToday = entry.day === TODAY;
    article.className = `recipe-card day-card${isToday ? " today" : ""}`;
    article.innerHTML = `
      <p class="tag">${entry.day}${isToday ? " · today" : ""}</p>
      <div class="meal"><span class="meal-label">Lunch</span><p>${entry.lunch || "—"}</p></div>
      <div class="meal"><span class="meal-label">Dinner</span><p>${entry.dinner || "—"}</p></div>
      ${entry.notes ? `<p class="day-note">${entry.notes}</p>` : ""}`;
    return article;
  }));
}

fetch(SOURCE_URL)
  .then(response => {
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    return response.text();
  })
  .then(markdown => {
    const days = parseTable(markdown);
    if (!days.length) {
      statusEl.textContent = "No plan found for this week. Time to plan one.";
      return;
    }
    statusEl.hidden = true;
    renderDays(days);
  })
  .catch(() => {
    statusEl.textContent = "Couldn't load the plan right now — open it directly on GitHub instead.";
  });
