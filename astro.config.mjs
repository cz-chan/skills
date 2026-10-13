// @ts-check
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

export default defineConfig( {
  // URL pública del sitio: canonical y enlaces absolutos. Sobrescríbela con SITE_URL al desplegar.
  site: "https://skills.c12z.io",

  markdown: {
    // Tema claro/oscuro vía variables CSS; el fondo lo pone Prose.module.css con los tokens del sitio.
    shikiConfig: {
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    },
  },

  integrations: [sitemap()],
} );