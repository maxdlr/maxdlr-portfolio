<script lang="ts" setup>
import Button from "./Button.vue";
import { useI18n } from "vue-i18n";
import { onBeforeMount, Ref, ref } from "vue";
import router from "../../router";
import TransitionSlideUp from "./transitions/TransitionSlideUp.vue";
import TransitionSlideDown from "./transitions/TransitionSlideDown.vue";

const { locale } = useI18n({ useScope: "global" });
const locales = ref([
  { name: "🇺🇸", code: "en" },
  { name: "🇫🇷", code: "fr" },
]);
const currentLocale = ref(
  locales.value.find((lang) => lang.code === locale.value),
);
const switchLocale = (e: string) => {
  currentLocale.value = locales.value.filter((l) => l.code === e)[0];
  locale.value = currentLocale.value.code;
};

const isCurrentRouteBlog: Ref<boolean> = ref(false);

onBeforeMount(() => {
  const currentRoute = router.currentRoute.value.fullPath;
  isCurrentRouteBlog.value = currentRoute === "/blog";
});

const links: {
  label: string;
  url: string;
  target?: "_blank";
}[] = [
  {
    label: "CV",
    url: "/cv.pdf",
    target: "_blank",
  },
  {
    label: "Blog",
    url: "/blog",
  },
  {
    label: "Photos",
    url: "/photos",
  },
];
</script>

<template>
  <TransitionSlideDown>
    <nav class="md:mx-10">
      <div
        class="max-w-screen-xl flex items-center justify-center md:justify-between mx-auto p-4"
      >
        <a class="md:hidden" href="/">
          <img alt="Maxdlr logo" class="h-8 w-auto px-2" src="/logo.png" />
        </a>
        <a
          class="flex max-md:hidden items-center space-x-3 rtl:space-x-reverse"
          href="/"
        >
          <img alt="Maxdlr logo" class="h-8" src="/logo.png" />
          <span
            class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
            >Maxdlr</span
          >
          <span class="py-3 italic">{{ $t("job-title") }}</span>
        </a>
        <ul class="font-medium flex p-0 md:mt-0">
          <li v-for="(link, index) in links" :key="index">
            <Button
              :label="link.label"
              :target="link.target"
              :url="link.url"
              :variant="isCurrentRouteBlog ? 'primary' : 'ghost'"
              aria-current="page"
              extra-class="px-2 md:p-5"
            />
          </li>
          <li>
            <Button
              :label="currentLocale?.code === 'fr' ? '🇫🇷' : '🇺🇸'"
              class="float-end"
              extra-class="px-2 md:p-5"
              variant="ghost"
              @click.prevent="
                switchLocale(currentLocale?.code === 'fr' ? 'en' : 'fr')
              "
            />
          </li>
        </ul>
      </div>
    </nav>
  </TransitionSlideDown>
  <TransitionSlideUp>
    <slot />
  </TransitionSlideUp>
</template>
