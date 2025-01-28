<script setup lang="ts">
import { onMounted, PropType, ref } from "vue";
import { formatDate } from "@vueuse/core";
import { BlogArticle } from "../../interface/BlogArticle.ts";

const props = defineProps({
  article: {
    type: {} as PropType<BlogArticle>,
    required: true,
  },
});

const a = ref({} as typeof props.article);

onMounted(() => format());

const format = () => {
  a.value = props.article;
  a.value.createdAt = formatDate(new Date(a.value.createdAt), "YYYY-MM-DD");
};
</script>

<template>
  <div
    class="uk-card uk-card-body uk-card-default hover:bg-gray-900 hover:text-white transition-all active:bg-gray-500"
  >
    <h3 class="uk-card-title">{{ a.title }}</h3>
    <p class="text-sm italic">{{ a.createdAt }}</p>
  </div>
</template>
