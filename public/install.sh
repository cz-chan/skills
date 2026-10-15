#!/bin/sh
# Instala una skill de cz-chan/skills en el proyecto actual.
#   curl -fsSL https://skills.c12z.io/install.sh | sh -s <skill> [carpeta]
# <skill>: ruta dentro de skills/ ("code-mentor", "frontend/react-hooks").
# [carpeta]: destino, por defecto .claude/skills. Si la skill ya existe, la reemplaza.
set -eu

REPO="cz-chan/skills"
BRANCH="main"

skill="${1:?uso: sh -s <skill> [carpeta]}"
dir="${2:-.claude/skills}"

case "$skill" in
	"" | /* | *..*) echo "skill no válida: $skill" >&2; exit 1 ;;
esac

name="${skill##*/}"
# El tarball tiene raíz "skills-<rama>/skills/"; se quitan esas 2 más los segmentos de categoría.
strip=$(($(printf '%s' "$skill" | tr -cd / | wc -c) + 2))

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

curl -fsSL "https://codeload.github.com/$REPO/tar.gz/$BRANCH" |
	tar -xz -C "$tmp" --strip-components="$strip" "skills-$BRANCH/skills/$skill" 2>/dev/null ||
	{ echo "skill no encontrada: $skill" >&2; exit 1; }
[ -f "$tmp/$name/SKILL.md" ] || { echo "skill no encontrada: $skill" >&2; exit 1; }

mkdir -p "$dir"
rm -rf "${dir:?}/$name"
mv "$tmp/$name" "$dir/"
echo "✓ $name → $dir/$name"
