import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import { createI18n } from "vue-i18n";
import { messages } from "./locale";
import "franken-ui/js/core.iife";
import "franken-ui/js/icon.iife";

const app = createApp(App);

const i18n = createI18n({
  locale: "fr",
  fallbackLocale: "en",
  messages: {
    en: {
      ...messages.en,
    },
    fr: {
      ...messages.fr,
    },
  },
});
app.use(i18n);
app.mount("#app");
