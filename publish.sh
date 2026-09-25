#!/usr/bin/env bash
set -euo pipefail
SECRET=/run/secrets/github-token
OWNER=lovingthenhk-cpu
REPO=github-pages-test

if [[ ! -r "$SECRET" ]]; then
  echo "missing: $SECRET" >&2
  exit 2
fi

export GH_TOKEN
GH_TOKEN="$(cat "$SECRET")"

api() {
  curl -fsSL     -H "Authorization: Bearer $GH_TOKEN"     -H "Accept: application/vnd.github+json"     -H "X-GitHub-Api-Version: 2022-11-28"     "$@"
}

if ! curl -fsS -o /dev/null "https://api.github.com/repos/$OWNER/$REPO"; then
  api -X POST https://api.github.com/user/repos     -d '{"name":"github-pages-test","description":"Minimal GitHub Pages test site created via Computer Full","private":false,"auto_init":false}' >/dev/null
fi

ASKPASS="$(mktemp)"
trap 'rm -f "$ASKPASS"' EXIT
cat >"$ASKPASS" <<'EOF'
#!/bin/sh
case "$1" in
  *Username*) printf '%s\n' x-access-token ;;
  *Password*) printf '%s\n' "$GH_TOKEN" ;;
esac
EOF
chmod 700 "$ASKPASS"
GIT_ASKPASS="$ASKPASS" GIT_TERMINAL_PROMPT=0 git push -u origin main

status="$(curl -sS -o /tmp/pages.json -w '%{http_code}'   -H "Authorization: Bearer $GH_TOKEN"   -H "Accept: application/vnd.github+json"   -H "X-GitHub-Api-Version: 2022-11-28"   "https://api.github.com/repos/$OWNER/$REPO/pages")"
if [[ "$status" == 404 ]]; then
  api -X POST "https://api.github.com/repos/$OWNER/$REPO/pages"     -d '{"source":{"branch":"main","path":"/"}}' >/dev/null
fi
rm -f /tmp/pages.json
printf 'https://%s.github.io/%s/\n' "$OWNER" "$REPO"
