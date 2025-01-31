<script setup lang="ts">
import { onMounted, PropType, Ref, ref } from "vue";
import { formatDate } from "@vueuse/core";
import { BlogArticle } from "../../interface/BlogArticle.ts";
import { Utils } from "../../composables/Utils.ts";

const props = defineProps({
  article: {
    type: {} as PropType<BlogArticle>,
    required: true,
  },
});

const a = ref({} as typeof props.article);
const readingTime: Ref<number | undefined> = ref(undefined);

onMounted(async () => {
  format();
  readingTime.value = Math.round(Utils.calculateReadingTime(a.value.text));
});

const format = () => {
  a.value = props.article;
  a.value.createdAt = formatDate(new Date(a.value.createdAt), "YYYY-MM-DD");
};
</script>

<template>
  <div
    class="uk-card uk-card-body uk-card-default hover:bg-gray-900 hover:text-white transition-all active:bg-gray-500"
  >
    <div class="flex justify-between items-center">
      <div>
        <h3 class="uk-card-title">{{ a.title }}</h3>
        <p class="text-sm italic">{{ a.createdAt }}</p>
      </div>
      <p>{{ $t("minute-read", { minutes: readingTime }) }}</p>
    </div>
  </div>
</template>
