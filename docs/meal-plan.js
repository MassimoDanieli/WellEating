const SOURCE_URL = (window.WELLEATING && window.WELLEATING.mealplan) ||
  "https://raw.githubusercontent.com/MassimoDanieli/WellEating/main/meal-plans/current-week.md";

const LANG = document.documentElement.lang === "it" ? "it" : "en";
const T = {
  en: { lunch: "Lunch", dinner: "Dinner", today: "today",
        empty: "No plan found for this week. Time to plan one.",
        error: "Couldn't load the plan right now \u2014 open it directly on GitHub instead." },
  it: { lunch: "Pranzo", dinner: "Cena", today: "oggi",
        empty: "Nessun piano trovato per questa settimana. Ora di farne uno.",
        error: "Impossibile caricare il piano in questo momento \u2014 aprilo direttamente su GitHub." },
}[LANG];
const DAY_IT = { Monday: "Luned\u00ec", Tuesday: "Marted\u00ec", Wednesday: "Mercoled\u00ec",
  Thursday: "Gioved\u00ec", Friday: "Venerd\u00ec", Saturday: "Sabato", Sunday: "Domenica" };
const dayLabel = day => (LANG === "it" ? DAY_IT[day] || day : day);

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
      <p class="tag">${dayLabel(entry.day)}${isToday ? ` · ${T.today}` : ""}</p>
      <div class="meal"><span class="meal-label">${T.lunch}</span><p>${entry.lunch || "—"}</p></div>
      <div class="meal"><span class="meal-label">${T.dinner}</span><p>${entry.dinner || "—"}</p></div>
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
      statusEl.textContent = T.empty;
      return;
    }
    statusEl.hidden = true;
    renderDays(days);
  })
  .catch(() => {
    statusEl.textContent = T.error;
  });
