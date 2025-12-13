// import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

import { cloudflare } from '@cloudflare/vite-plugin';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
	optimizeDeps: {
		exclude: ['format', 'editor.all'],
		include: ['monaco-editor/esm/vs/editor/editor.api'],
		force: true,
		rolldownOptions: {
			output: {
				minify: false, // Development builds
			},
			// Monaco Editor and special dependencies handling
			external: (id) => {
				// Keep Monaco workers and language files external
				if (id.includes('monaco-editor')) {
					return id.includes('worker') ||
						   id.includes('language') ||
						   id.includes('vs/basic-languages');
				}
				return false;
			},
			// Preserve module side effects for certain packages
			treeshake: {
				moduleSideEffects: (id) => {
					return id.includes('monaco-editor') ||
						   id.includes('format');
				},
			},
		},
	},

	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					// Separate vendor libraries
					if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
						return 'vendor';
					}
					if (id.includes('@radix-ui') || id.includes('lucide-react')) {
						return 'ui';
					}
					if (id.includes('date-fns') || id.includes('clsx') || id.includes('tailwind-merge')) {
						return 'utils';
					}
					// Monaco core vs language workers
					if (id.includes('monaco-editor/esm/vs/editor/editor.api')) {
						return 'monaco-core';
					}
					// Separate heavy language workers
					if (id.includes('monaco-editor/esm/vs/language/')) {
						return 'monaco-languages';
					}
				}
			}
		},
		chunkSizeWarningLimit: 1000
	},
	plugins: [
		react(),
		svgr(),
		cloudflare({
			configPath: 'wrangler.jsonc',
		}),
		tailwindcss(),
		// sentryVitePlugin({
		// 	org: 'cloudflare-0u',
		// 	project: 'javascript-react',
		// }),
	],

	resolve: {
		alias: {
			debug: 'debug/src/browser',
			'@': path.resolve(__dirname, './src'),
			'shared': path.resolve(__dirname, './shared'),
			'worker': path.resolve(__dirname, './worker'),
		},
	},

	// Configure for Prisma + Cloudflare Workers compatibility
	define: {
		// Ensure proper module definitions for Cloudflare Workers context
		'process.env.NODE_ENV': JSON.stringify(
			process.env.NODE_ENV || 'development',
		),
		global: 'globalThis',
		// '__filename': '""',
		// '__dirname': '""',
	},

	worker: {
		// Handle Prisma in worker context for development
		format: 'es',
	},

	server: {
		allowedHosts: true,
	},

	// Clear cache more aggressively
	cacheDir: 'node_modules/.vite',
});
