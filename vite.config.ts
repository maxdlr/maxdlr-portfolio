import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "https://docs.maxdlr.com",
        changeOrigin: true,
        secure: true,
      },
    },
    cors: {
      origin: ["https://docs.maxdlr.com", "https://www.maxdlr.com"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    },
  },
});
