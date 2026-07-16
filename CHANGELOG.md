# Changelog

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
