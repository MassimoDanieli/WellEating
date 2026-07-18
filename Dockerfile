# WellEating — self-hosted, bring-your-own-cookbook image.
#
# The image ships EMPTY (plus one example recipe). At startup the
# entrypoint builds the site from YOUR markdown content, provided either
# as a volume mount at /content or cloned from CONTENT_REPO.
#
#   docker run -p 8080:80 -v ./my-cookbook:/content welleating
#   docker run -p 8080:80 -e CONTENT_REPO=https://github.com/you/cookbook welleating
#
# Theming:
#   -e THEME=forest|ocean|terracotta|slate     (default: forest)
#   -e ACCENT_COLOR="#c2185b"                  (optional accent override)

FROM nginx:alpine

RUN apk add --no-cache python3 git

COPY docs/ /opt/welleating/site/
COPY scripts/build_recipes.py /opt/welleating/scripts/build_recipes.py
COPY docker/sample-content/ /opt/welleating/sample-content/
COPY docker/entrypoint.sh /opt/welleating/entrypoint.sh

RUN chmod +x /opt/welleating/entrypoint.sh

ENV CONTENT_DIR=/content \
    THEME=forest

EXPOSE 80
ENTRYPOINT ["/opt/welleating/entrypoint.sh"]
