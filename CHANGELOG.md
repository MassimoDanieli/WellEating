# Changelog

## 0.6.0 - 2026-07-16

Self-hosted distribution.

- Dockerfile and entrypoint: the container builds the site at startup
  from user-provided content (volume mount at /content or CONTENT_REPO
  git clone), falling back to a sample cookbook that documents the
  format. Shopping list and meal plan are served locally from the
  container instead of GitHub.
- Four selectable themes (forest, ocean, terracotta, slate) via THEME
  env var plus optional ACCENT_COLOR override; the stylesheet palette
  was fully promoted to CSS variables to make this possible.
- Helm chart under chart/welleating with content, theme, ingress and
  resource configuration.
- Homepage favourites are now rendered dynamically from recipes.json,
  so fresh installs show their own recipes (or a friendly empty state)
  instead of hardcoded cards.
- Deployment guide in DEPLOY.md.

## 0.5.0 - 2026-07-16

Recipe library expansion.

- Library grown from 8 to 17 recipes: the full ideas backlog promoted as
  "To test" (mushroom and Gruyère pasta, mushroom risotto, French onion
  soup, salmon and herb couscous, mushroom frittata, courgette and lemon
  pasta, harissa shakshuka) plus two breakfasts.
- New Breakfast and Soup categories.
- Every new recipe ships with its Italian translation.
- Ideas backlog cleared; promoted entries now live in `recipes/`.

## 0.4.0 - 2026-07-16

Italian version of the site.

- Full Italian site at `it/` with translated homepage, recipe library,
  meal plan and shopping list pages, plus a language switcher (top nav
  and mobile tab bar) and hreflang alternates.
- All eight recipes translated as `*.it.md` files next to the English
  sources. The build pipeline emits `docs/it/recipes.json`, anchoring
  metadata (version, status, time, icon) to the English base and falling
  back to English content when a translation is missing.
- Shared JavaScript localised via a per-page language dictionary
  (interface strings, status labels, day names).
- Italian web app manifest; service worker precache extended to the
  Italian pages.

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
