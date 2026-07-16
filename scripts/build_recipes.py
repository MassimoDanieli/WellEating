#!/usr/bin/env python3
"""
Build docs/recipes.json from the markdown recipes in recipes/**.

The markdown files are the single source of truth. The website loads the
generated JSON, so adding a recipe = adding one markdown file.

Recognised structure (all sections optional except title):

    # Recipe Title

    Version: 1.1
    Status: Production ready
    Icon: 🍳            (optional override; default comes from the category)
    Category: Dinner    (optional override; default comes from the folder name)

    ## Summary
    One or two lines shown on the recipe card.

    ## Rating
    ★★★★★

    ## Time
    25 minutes

    ## Ingredients
    - 3 eggs

    ## Method
    1. Do the thing.

    ## Notes
    - Good hot or cold.

Any unrecognised H2 section (e.g. "## English mustard variation") is
appended to the notes so nothing written by a human is silently dropped.

Usage:
    python3 scripts/build_recipes.py            # writes docs/recipes.json
    python3 scripts/build_recipes.py --check    # exits non-zero if json is stale
"""

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RECIPES_DIR = ROOT / "recipes"
OUTPUT = ROOT / "docs" / "recipes.json"

CATEGORY_BY_FOLDER = {
    "fish": "Fish",
    "dinner": "Dinner",
    "couscous": "Couscous",
    "vegetarian": "Vegetarian",
    "salads": "Salad",
    "sauces": "Sauce",
    "breakfast": "Breakfast",
    "soups": "Soup",
    "lunch": "Lunch",
}

ICON_BY_CATEGORY = {
    "Fish": "🐟",
    "Dinner": "🍳",
    "Couscous": "🥣",
    "Vegetarian": "🌱",
    "Salad": "🥗",
    "Sauce": "🍋",
    "Breakfast": "🥐",
    "Soup": "🍲",
    "Lunch": "🥪",
}

STATUS_ORDER = {"Production ready": 0, "Tested": 1, "To test": 2}


def parse_sections(text):
    """Split markdown into (preamble, {heading: body}) keeping section order."""
    parts = re.split(r"^## +(.+)$", text, flags=re.MULTILINE)
    preamble = parts[0]
    sections = {}
    for heading, body in zip(parts[1::2], parts[2::2]):
        sections[heading.strip()] = body.strip()
    return preamble, sections


def list_items(body):
    """Extract '-' or numbered list items from a section body."""
    items = []
    for line in body.splitlines():
        line = line.strip()
        m = re.match(r"^(?:[-*]|\d+\.)\s+(.*)$", line)
        if m:
            items.append(m.group(1).strip())
    return items


def parse_recipe(path):
    text = path.read_text(encoding="utf-8")
    preamble, sections = parse_sections(text)

    title_match = re.search(r"^# +(.+)$", preamble, flags=re.MULTILINE)
    if not title_match:
        raise ValueError(f"{path}: missing H1 title")
    title = title_match.group(1).strip()

    def field(name, default=""):
        m = re.search(rf"^{name}:\s*(.+?)\s*$", preamble, flags=re.MULTILINE)
        return m.group(1).strip() if m else default

    folder = path.parent.name
    category = field("Category") or CATEGORY_BY_FOLDER.get(folder, folder.capitalize())
    icon = field("Icon") or ICON_BY_CATEGORY.get(category, "🍽️")

    time_minutes = None
    time_body = sections.get("Time", "")
    m = re.search(r"(\d+)", time_body)
    if m:
        time_minutes = int(m.group(1))

    rating = sections.get("Rating", "").count("★") or None

    known = {"Summary", "Rating", "Time", "Ingredients", "Method", "Notes"}
    notes = list_items(sections.get("Notes", "")) or (
        [sections["Notes"]] if sections.get("Notes") else []
    )
    for heading, body in sections.items():
        if heading not in known:
            notes.append(f"{heading}: {body}")

    return {
        "id": path.stem,
        "title": title,
        "category": category,
        "status": field("Status", "To test"),
        "version": field("Version", "1.0"),
        "time": time_minutes,
        "icon": icon,
        "summary": sections.get("Summary", ""),
        "rating": rating,
        "ingredients": list_items(sections.get("Ingredients", "")),
        "method": list_items(sections.get("Method", "")),
        "note": " ".join(notes),
        "source": str(path.relative_to(ROOT)),
    }


CATEGORY_IT = {
    "Fish": "Pesce",
    "Dinner": "Cena",
    "Couscous": "Couscous",
    "Vegetarian": "Vegetariano",
    "Salad": "Insalata",
    "Sauce": "Salsa",
    "Breakfast": "Colazione",
    "Soup": "Zuppa",
    "Lunch": "Pranzo",
}


def build(lang="en"):
    paths = sorted(p for p in RECIPES_DIR.glob("**/*.md") if not p.name.endswith(".it.md"))
    recipes = []
    for path in paths:
        recipe = parse_recipe(path)
        if lang == "it":
            recipe["category"] = CATEGORY_IT.get(recipe["category"], recipe["category"])
            it_path = path.with_name(path.stem + ".it.md")
            if it_path.exists():
                # Content (title, summary, ingredients, method, notes) from the
                # translation; metadata (id, version, status, time, icon, rating)
                # stays anchored to the English base so the two never drift.
                translated = parse_recipe(it_path)
                for field in ("title", "summary", "ingredients", "method", "note"):
                    if translated[field]:
                        recipe[field] = translated[field]
                recipe["translated"] = True
            else:
                recipe["translated"] = False  # falls back to English content
        recipes.append(recipe)
    recipes.sort(key=lambda r: (STATUS_ORDER.get(r["status"], 9), r["title"]))
    return json.dumps({"recipes": recipes}, indent=2, ensure_ascii=False) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="verify docs/recipes.json is up to date")
    args = parser.parse_args()

    outputs = {
        OUTPUT: build("en"),
        ROOT / "docs" / "it" / "recipes.json": build("it"),
    }

    if args.check:
        stale = [path for path, generated in outputs.items()
                 if (path.read_text(encoding="utf-8") if path.exists() else "") != generated]
        if stale:
            names = ", ".join(str(p.relative_to(ROOT)) for p in stale)
            print(f"Stale: {names}. Run: python3 scripts/build_recipes.py")
            sys.exit(1)
        print("recipes.json files are up to date.")
        return

    for path, generated in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(generated, encoding="utf-8")
        count = generated.count('"id":')
        print(f"Wrote {path.relative_to(ROOT)} with {count} recipes.")


if __name__ == "__main__":
    main()
