import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
          'vendor-router': ['react-router-dom'],
          'vendor-query': ['@tanstack/react-query', '@tanstack/query-core'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-tooltip', '@radix-ui/react-popover', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'vendor-pdf': ['jspdf'],
          'vendor-charts': ['recharts', 'lucide-react'],
          'vendor-utils': ['date-fns', 'zod'],
        },
      },
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
});
