# skills

Repo de skills con visor web (Astro + Bun). El historial sale de git.

## Estructura

```
skills/<id>/SKILL.md            # frontmatter: name, description, created (YYYY-MM-DD)
skills/<categoría>/<id>/SKILL.md  # se admiten subcarpetas
evals/<id>/                     # pruebas de skills/<id>/; no se descargan con la skill
  TESTING.md                    # informe; su frontmatter (date, model, harness, passed, total, skillCommit) alimenta la etiqueta "tested"
  evals.json, fixtures/, scripts/, runs/
public/                         # favicon
src/
  content.config.ts             # colección "skills" (glob **/SKILL.md + esquema)
  container.ts                  # composition root: conecta use cases con implementaciones
  domain/                       # entidades, contratos de repositorio, reglas puras
  application/use-cases/        # ListSkills, ListSkillDetails, ListSkillVersions, GetRecentActivity
  infrastructure/               # adaptadores: git (CLI) y Astro content collections
  presentation/
    components/                 # cada componente: <Nombre>/<Nombre>.astro + <Nombre>.module.css
      ui/                       # genéricos y reutilizables: CopyButton, LinkList, Prose, Section, SectionLabel
      site/                     # estructura del sitio: Header, NotFound
      skills/                   # vistas de skills: SkillIndex, SkillSidebar
      versions/                 # vistas de una versión: VersionHeader, DiffView, Snapshot
      activity/                 # registro de commits: ActivityLog
    layouts/<Nombre>/           # BaseLayout, SkillLayout
    styles/global.css           # solo tokens y estilos base
    format/                     # formateo de fechas
  pages/                        # rutas: getStaticPaths pasa los datos como props
```

Dependencias: `domain` ← `application` ← `infrastructure`/`presentation`. Solo `container.ts` conoce las implementaciones concretas.

## Uso

```sh
bun install
bun run new mi-skill               # crea skills/mi-skill/SKILL.md
bun run new frontend/react-hooks   # skill dentro de una categoría
bun run dev                        # visor en http://localhost:4321
bun run check                      # astro check (tipos)
bun run build                      # astro check + sitio estático en dist/
```

Cada commit que toque `skills/<id>/` aparece como una versión de esa skill, con su diff y snapshot.

Tras probar una skill, pon en `skillCommit` el hash de la versión probada (`git log -1 --format=%h -- skills/<id>`). Si la skill cambia después, la etiqueta pasa a "older version"; sin `skillCommit` dice "version not pinned".
