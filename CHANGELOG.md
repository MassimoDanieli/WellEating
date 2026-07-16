# Changelog

## 0.3.0 - 2026-07-16

Mobile app experience.

- Installable PWA: web app manifest, icons and a service worker with
  offline support (network-first, cache fallback) — the cookbook, meal
  plan and shopping list all work without a connection once visited.
- App-style bottom tab bar on small screens (the desktop nav links were
  previously hidden on mobile with no replacement).
- Shopping list items are now tappable: tick things off at the
  supermarket, with ticks stored locally on the device and a
  "clear ticks" action. Repo checkboxes remain the shared source.
- Larger touch targets and iPhone safe-area handling.

## 0.2.0 - 2026-07-16

Website and pipeline improvements.

- Recipes are now generated from `recipes/**.md` into `docs/recipes.json` by
  `scripts/build_recipes.py`, run automatically by a GitHub Action. The
  markdown files are the single source of truth; adding a recipe means
  adding one markdown file.
- Recipe markdown files enriched with Summary and Time sections, plus icon
  overrides where the category default does not fit.
- New in-site Shopping list and Meal plan pages, rendered live from
  `pantry/shopping-list.md` and `meal-plans/current-week.md`.
- Recipe dialogs now have shareable URLs (`recipes.html?open=<id>`), show
  the star rating and link back to the markdown source on GitHub.
- Added Open Graph tags, social preview image and favicon.

## 0.1.0 - 2026-07-16

Initial repository structure.

Added tested recipes:

- Zucchini, caramelised onion and Emmental frittata
- Moroccan-style couscous with chickpeas and harissa
- Salmon with air-fried vegetables
- Tofu with Dijon, honey and lemon
- Tuna salad with mustard dressing
- Bresaola, rocket and Parmesan plate

Added pantry, shopping, meal-plan and progress templates.
