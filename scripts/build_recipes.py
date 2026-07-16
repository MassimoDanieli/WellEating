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


def build():
    paths = sorted(RECIPES_DIR.glob("**/*.md"))
    recipes = [parse_recipe(p) for p in paths]
    recipes.sort(key=lambda r: (STATUS_ORDER.get(r["status"], 9), r["title"]))
    return json.dumps({"recipes": recipes}, indent=2, ensure_ascii=False) + "\n"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="verify docs/recipes.json is up to date")
    args = parser.parse_args()

    generated = build()

    if args.check:
        current = OUTPUT.read_text(encoding="utf-8") if OUTPUT.exists() else ""
        if current != generated:
            print("docs/recipes.json is stale. Run: python3 scripts/build_recipes.py")
            sys.exit(1)
        print("docs/recipes.json is up to date.")
        return

    OUTPUT.write_text(generated, encoding="utf-8")
    count = generated.count('"id":')
    print(f"Wrote {OUTPUT.relative_to(ROOT)} with {count} recipes.")


if __name__ == "__main__":
    main()
