<script lang="ts" setup>
import Button from "../atoms/Button.vue";
import {
  BIconArrowDownShort,
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
import { computed, Ref, ref } from "vue";
import { useI18n } from "vue-i18n";
import data from "../../model/data.json";

const email: Ref<string> = ref(data.author.email);
const { copy, copied, isSupported } = useClipboard({ source: email });

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
  <section class="container mx-auto px-4">
    <Button
      :label="currentLocale?.code === 'fr' ? '🇺🇸' : '🇫🇷'"
      class="float-end"
      variant="ghost"
      @click.prevent="switchLocale(currentLocale?.code === 'fr' ? 'en' : 'fr')"
    />
    <div class="w-full flex justify-center items-center flex-col">
      <h1 class="text-2xl py-2">Maxdlr</h1>

      <p class="text-center">
        {{ $t("this-is-the-website-of") }}
        <a :href="data['social-links'].linkedin" class="uk-link max-sm:block">{{
          data.author.name
        }}</a
        ><span class="max-sm:hidden">.</span>
      </p>

      <div class="py-5 max-sm:py-1">
        <p class="text-center max-sm:hidden">{{ $t("context") }}</p>

        <div class="flex justify-center items-center py-5">
          <div
            v-for="(item, _, index) in data['work-links']"
            :key="index"
            class="inline"
          >
            <p v-if="index !== 0" class="inline px-2">{{ $t("or") }}</p>
            <Button :label="item.name" :url="item.url" />
          </div>
          <p class="sm:hidden ps-2">?</p>
        </div>
        <p
          v-if="currentLocale?.code === 'en'"
          class="text-center max-sm:hidden"
        >
          services.
        </p>

        <div class="text-center pt-3">
          <span class="max-sm:hidden">
            {{ $t("or-say-hello") }}
            <BIconArrowRightShort class="inline" />
          </span>
          <a :href="`mailto:${email}`" class="uk-link inline">{{ email }}</a>
          <Button
            v-if="isSupported"
            :icon="!copied ? BIconCopy : BIconCheck"
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
          variant="ghost"
        />
      </div>
    </div>
  </section>
  <section class="mt-5">
    <div class="text-center">
      <a
        :href="data['footer-wip'].url"
        class="text-center uk-link"
        target="_blank"
      >
        <p class="my-2">
          <BIconArrowDownShort class="inline" />
          <small>{{ $t("wip") }}</small>
          <BIconArrowDownShort class="inline" />
        </p>
      </a>
    </div>
    <div class="flex justify-center">
      <a :href="data['footer-wip'].url" class="text-center" target="_blank">
        <img
          :class="`rounded-2xl`"
          :src="data['footer-wip'].gif.path"
          :style="`max-width: ${gifSize}px; height: auto;`"
          alt="maxime de la rocheterie maxorbe example gif"
        />
      </a>
    </div>
  </section>
  <div class="text-center my-5">
    <p>{{ $t("bye") }}</p>
  </div>
</template>
