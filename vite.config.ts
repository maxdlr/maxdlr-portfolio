import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      "/api": {
        target: "https://docs.maxdlr.com",
        changeOrigin: true, // Rewrite the origin of the request to the target URL
        secure: true, // Disable SSL verification if the target uses a self-signed certificate
      },
    },
  },
});
