<script lang="ts" setup>
import Button from "../atoms/Button.vue";
import {
  BIconArrowRightShort,
  BIconBehance,
  BIconCheck,
  BIconCopy,
  BIconDribbble,
  BIconGithub,
  BIconInstagram,
  BIconLinkedin,
  BIconVimeo,
} from "bootstrap-icons-vue";
import { useClipboard } from "@vueuse/core";
import { computed, onBeforeMount, Ref, ref } from "vue";
import data from "../../model/data.json";
import { usePageHead } from "../../composables/usePageHead.ts";
import { useI18n } from "vue-i18n";

const { locale } = useI18n({ useScope: "global" });

const email: Ref<string> = ref(data.author.email);
const { copy, copied, isSupported } = useClipboard({ source: email });
onBeforeMount(() => usePageHead("home"));

const socials = ref([
  {
    iconComponent: BIconGithub,
    url: data["social-links"].github,
  },
  {
    iconComponent: BIconInstagram,
    url: data["social-links"].instagram,
  },
  {
    iconComponent: BIconLinkedin,
    url: data["social-links"].linkedin,
  },
  {
    iconComponent: BIconBehance,
    url: data["social-links"].behance,
  },
  {
    iconComponent: BIconDribbble,
    url: data["social-links"].dribbble,
  },
  {
    iconComponent: BIconVimeo,
    url: data["social-links"].vimeo,
  },
]);
const gifSize = computed(() => data["footer-wip"].gif.size);
</script>

<template>
  <main>
    <section class="container mx-auto px-8">
      <div class="w-full flex justify-center items-center flex-col mt-10">
        <div class="text-center md:hidden">
          <h1 class="text-2xl">Maxdlr</h1>
          <p class="py-3 italic">{{ $t("job-title") }}</p>
        </div>

        <div class="flex justify-center my-7">
          <a :href="data['footer-wip'].url" class="text-center" target="_blank">
            <img
              :class="`rounded-full`"
              :src="data['footer-wip'].gif.path"
              :style="`max-width: ${gifSize}px; height: auto;`"
              alt="maxime de la rocheterie maxorbe example gif"
            />
          </a>
        </div>

        <p class="text-center">
          {{ $t("this-is-the-website-of") }}
          <a
            :href="data['social-links'].linkedin"
            class="uk-link max-sm:block hover:text-gray-400"
            >{{ data.author.name }}</a
          ><span class="max-sm:hidden">.</span>
        </p>

        <div class="py-5 max-sm:py-5">
          <p class="text-center">
            <span>{{ $t("context") }}</span>
            <span>
              <a
                class="uk-link"
                :href="data['work-links'].developer.url"
                target="_blank"
                >{{ data["work-links"].developer.name }}</a
              >
            </span>
            <span>{{ $t("or") }}</span>
            <span>
              <a
                class="uk-link"
                :href="data['work-links']['motion-designer'].url"
                target="_blank"
                >{{ data["work-links"]["motion-designer"].name }}</a
              >
            </span>
            <span v-if="locale === 'en'" class="text-center"> services.</span>
          </p>

          <div class="text-center pt-3">
            <span class="max-sm:hidden">
              {{ $t("or-say-hello") }}
              <BIconArrowRightShort class="inline" />
            </span>
            <a
              :href="`mailto:${email}`"
              class="uk-link inline hover:text-gray-400"
              >{{ email }}</a
            >
            <Button
              v-if="isSupported"
              :icon="!copied ? BIconCopy : BIconCheck"
              extra-class="hover:text-gray-400 rounded-full"
              variant="ghost"
              @click.prevent="copy(email)"
            />
          </div>
        </div>
      </div>
      <div>
        <div class="flex justify-center items-center flex-wrap">
          <Button
            extra-class="max-sm:px-2"
            label="CV"
            target="_blank"
            url="/cv.pdf"
            variant="ghost"
          />
          <Button
            v-for="(social, index) in socials"
            :key="index"
            :icon="social.iconComponent"
            :url="social.url"
            extra-class="max-sm:px-2"
            target="_blank"
            variant="ghost"
          />
        </div>
      </div>
    </section>
    <div class="text-center my-5">
      <p>{{ $t("bye") }}</p>
    </div>
  </main>
</template>

<style lang="scss" scoped>
@keyframes slideup {
  from {
    opacity: 0;
    transform: translateY(100px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
main {
  animation-name: slideup;
  animation-duration: 2s;
  animation-timing-function: cubic-bezier(0.1, 1, 0, 1);
}
</style>
