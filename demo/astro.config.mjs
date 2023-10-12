import { defineConfig } from 'astro/config';
import sw from "astro-sw";

import netlify from "@astrojs/netlify/functions";

// https://astro.build/config
export default defineConfig({
  server: {
    port: 80,
    host: true
  },
  integrations: [
	sw()
],
  output: "server",
  adapter: netlify()
});