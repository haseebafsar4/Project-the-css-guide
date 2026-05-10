import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Simplified config for successful deployment
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // This tells Vite where your public files are
  publicDir: 'public',
});
