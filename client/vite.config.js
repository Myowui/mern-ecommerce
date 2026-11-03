import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// While developing, any request starting with /api is forwarded to your Express server.
// So React can simply call fetch("/api/products") with no CORS problems.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5001",
    },
  },
});
