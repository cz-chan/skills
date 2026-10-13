import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/** Enlace externo: recurso relacionado. */
const link = z.object({
  title: z.string(),
  url: z.url(),
});

const skills = defineCollection({
  loader: glob({
    // Admite subcarpetas: skills/<categoría>/.../<skill>/SKILL.md
    pattern: "**/SKILL.md",
    base: "./skills",
    generateId: ({ entry }) => entry.replace(/\/?SKILL\.md$/, ""),
  }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    /** Estándar Agent Skills: mapa de string a string. Las fechas van entre comillas. */
    metadata: z
      .object({
        created: z.iso.date().transform((date) => new Date(date)),
        updatedAt: z.iso
          .date()
          .transform((date) => new Date(date))
          .optional(),
      })
      .catchall(z.string()),
    /** Recursos relacionados. */
    links: z.array(link).default([]),
  }),
});

/** Agradecimientos: CREDITS.md junto al SKILL.md, sin frontmatter. El agente no lo carga. */
const credits = defineCollection({
  loader: glob({
    pattern: "**/CREDITS.md",
    base: "./skills",
    generateId: ({ entry }) => entry.replace(/\/?CREDITS\.md$/, ""),
  }),
  schema: z.object({}),
});

/** Ficheros extra de una skill (references/, domains/…): cualquier .md salvo SKILL.md y CREDITS.md. */
const files = defineCollection({
  loader: glob({
    pattern: ["**/*.md", "!**/SKILL.md", "!**/CREDITS.md"],
    base: "./skills",
    generateId: ({ entry }) => entry,
  }),
  schema: z.object({}),
});

/**
 * Pruebas de una skill: evals/<id>/TESTING.md. Viven fuera de skills/ para que no se
 * descarguen con la skill; el frontmatter es el resumen que muestra el visor.
 */
const tests = defineCollection({
  loader: glob({
    pattern: "**/TESTING.md",
    base: "./evals",
    generateId: ({ entry }) => entry.replace(/\/?TESTING\.md$/, ""),
  }),
  schema: z.object({
    date: z.iso.date().transform((date) => new Date(date)),
    model: z.string(),
    harness: z.string(),
    passed: z.number().int().nonnegative(),
    total: z.number().int().positive(),
    /** Vacío mientras no se fije la versión probada. */
    skillCommit: z.string().default(""),
  }),
});

export const collections = { skills, credits, files, tests };
