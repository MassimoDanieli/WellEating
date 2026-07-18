# Self-hosting WellEating

WellEating can run as a container that serves **your** cookbook. The image
ships empty (one example recipe); you bring the content.

## Content layout

Point the container at a directory (or git repo) with this shape — the
same shape as this repository:

```
recipes/<category>/<recipe>.md        # one markdown file per recipe
recipes/<category>/<recipe>.it.md     # optional Italian translation
pantry/shopping-list.md               # optional
meal-plans/current-week.md            # optional
```

## Docker

```bash
docker build -t welleating .

# Mount a local cookbook:
docker run -p 8080:80 -v /path/to/your-cookbook:/content:ro welleating

# ...or clone one at startup:
docker run -p 8080:80 -e CONTENT_REPO=https://github.com/you/your-cookbook welleating

# No content at all? You get the sample cookbook that shows the format.
```

Or use the provided `docker-compose.yml`.

## Themes

Set `THEME` to `forest` (default), `ocean`, `terracotta` or `slate`.
Optionally override the accent with `ACCENT_COLOR="#c2185b"`.

```bash
docker run -p 8080:80 -e THEME=ocean -e ACCENT_COLOR="#c2185b" welleating
```

## Helm

```bash
helm install cookbook ./chart/welleating \
  --set content.repo=https://github.com/you/your-cookbook \
  --set theme.name=terracotta
```

See `chart/welleating/values.yaml` for content via PVC, ingress and
resources. Content is read at pod start; restart the deployment to pick
up cookbook changes (`kubectl rollout restart deploy/...`).

## Notes

- Recipes are rebuilt from markdown at every container start.
- The shopping list and meal plan are served from the container
  (`/data/*.md`); no external calls at runtime.
- GitHub Pages deployment (this repo's `docs/`) is unaffected by any of
  this and keeps working as before.
