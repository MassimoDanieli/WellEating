// Generated from CHANGELOG.md by scripts/build_recipes.py - do not edit.
window.WELLEATING_VERSION = "0.6.1";
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-version]").forEach(el => {
    el.textContent = "v" + window.WELLEATING_VERSION;
  });
});
