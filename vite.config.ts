import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://docs.maxdlr.com",
  // changeOrigin: true,
  // secure: true,
  // },
  // },
  // },
});
