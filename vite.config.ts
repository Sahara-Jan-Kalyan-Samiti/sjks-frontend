import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Public website only. The admin panel (sjks-admin) and the API (sjks-backend) are separate repositories.
// In development, "/api" is forwarded to the backend running locally (npm run dev in sjks-backend, port 8080).
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  server: { proxy: { "/api": { target: "http://localhost:8080", changeOrigin: true } } }
});
