import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // If using React
import path from 'path';

export default defineConfig({
  plugins: [react()], // Add any necessary plugins here
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: 'src/main.tsx', // Entry point for your React app
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
