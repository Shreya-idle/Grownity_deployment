// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import path from "path";
// import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
// import { fileURLToPath } from "url";
// import tsconfigPaths from "vite-tsconfig-paths";

// // __dirname helper for ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default defineConfig({
//   plugins: [
//     react(),
//     runtimeErrorOverlay(),
//     tsconfigPaths(),
//     ...(process.env.NODE_ENV !== "production" &&
//     process.env.REPL_ID !== undefined
//       ? [
//           await import("@replit/vite-plugin-cartographer").then((m) =>
//             m.cartographer(),
//           ),
//           await import("@replit/vite-plugin-dev-banner").then((m) =>
//             m.devBanner(),
//           ),
//         ]
//       : []),
//   ],
//   root: path.resolve(__dirname, "client"),
//   build: {
//     outDir: path.resolve(__dirname, "dist/public"),
//     emptyOutDir: true,
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://indian-community-beta.vercel.app/',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//     fs: {
//       strict: true,
//       deny: ["**/.*"],
//     },
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
import tsconfigPaths from "vite-tsconfig-paths";

// __dirname helper for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    tsconfigPaths(),
    ...(process.env.NODE_ENV !== "production" &&
      process.env.REPL_ID !== undefined
      ? [
        await import("@replit/vite-plugin-cartographer").then((m) =>
          m.cartographer(),
        ),
        await import("@replit/vite-plugin-dev-banner").then((m) =>
          m.devBanner(),
        ),
      ]
      : []),
  ],
  base: process.env.VITE_BASE_PATH || "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'recharts'],
          // etc.
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://indian-community-beta.vercel.app//',
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});