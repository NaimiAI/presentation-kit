import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' is mandatory — the bundle is served from
// /api/presentation-bundles/<revisionId>/, so all asset URLs must be relative.
// assetsInlineLimit: 0 keeps images/fonts as files (no data: URIs).
// server.port honors the PORT env var injected by preview tooling (e.g. the
// Claude Code preview proxy). strictPort in that case: failing loudly beats
// Vite silently hopping to another port while the proxy still expects PORT.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    strictPort: Boolean(process.env.PORT),
  },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 1500,
  },
})
