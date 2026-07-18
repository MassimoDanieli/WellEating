# WellEating

A personal, version-controlled cookbook for eating well without turning food into punishment.

🌐 **[Visit the site](https://massimodanieli.github.io/WellEating/)** · [Versione italiana](https://massimodanieli.github.io/WellEating/it/)

## Goals

- Eat enjoyable, repeatable meals.
- Move gradually from 100 kg towards 90 kg.
- Keep preparation mostly within 30 minutes.
- Use ingredients easily found in UK supermarkets.
- Reduce food waste by planning around the current fridge inventory.
- Keep salt moderate without sacrificing flavour.

## Core principles

1. Taste first.
2. Consistency beats perfection.
3. Cooking beats dieting.
4. Leftovers are ingredients, not failures.
5. Olive oil stays; portions are measured sensibly.
6. Pizza and beer still exist.

## How it works

The markdown files in `recipes/` are the single source of truth. A GitHub
Action runs `scripts/build_recipes.py` on every push, generating the JSON
that powers the website — searchable recipe library, live shopping list,
weekly meal plan, installable as an app on your phone (with offline
support), in English and Italian.

**Adding a recipe** means adding one markdown file:

1. Copy a file from `recipes/` (or `templates/`) into the right category folder.
2. Write the recipe: title, `Version`, `Status`, then `## Summary`,
   `## Time`, `## Ingredients`, `## Method`, `## Notes`.
3. Optionally add an Italian translation next to it as `<name>.it.md`
   (the Italian site falls back to English when missing).
4. Push. The pipeline rebuilds the site on its own.

## Recipe lifecycle

Each recipe starts at version `1.0` and changes after real cooking feedback.

- `1.0`: first version — status `To test` until actually cooked
- `1.x`: small improvements
- `2.0`: substantial change
- `Production ready`: reliably good and worth repeating

## Repository layout

- `recipes/` the cookbook, one markdown file per recipe (plus `.it.md` translations)
- `pantry/` current inventory and shopping list
- `meal-plans/` weekly plans
- `progress/` weight and waist tracking
- `templates/` reusable Markdown templates
- `docs/` the website (GitHub Pages) and generated `recipes.json`
- `scripts/` the markdown → JSON build pipeline
- `chart/` Helm chart for self-hosting

## Self-hosting your own cookbook

WellEating also ships as a container that serves **your** recipes, not
mine: mount your cookbook directory (or point it at a git repo) and pick
one of four themes (`forest`, `ocean`, `terracotta`, `slate`).

```bash
docker run -p 8080:80 -v ./my-cookbook:/content -e THEME=ocean welleating
```

A Helm chart is included for Kubernetes. See [DEPLOY.md](DEPLOY.md) for
the full guide.

## Weekly routine

1. Update `pantry/inventory.md`.
2. Build the weekly plan in `meal-plans/current-week.md`.
3. Generate the shop from `pantry/shopping-list.md`.
4. Cook, take notes, bump recipe versions.
5. Record changes in `CHANGELOG.md`.
