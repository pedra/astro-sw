import { defineConfig } from 'astro/config';

import sw from "astro-sw";

// https://astro.build/config
export default defineConfig({
	server: {
		port: 80,
		host: true
	},
	integrations: [sw()]
});