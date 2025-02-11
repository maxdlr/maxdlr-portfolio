<script lang="ts" setup>
import { onMounted, PropType, Ref, ref } from "vue";
import { BlogArticle } from "../../interface/BlogArticle.ts";
import { Utils } from "../../composables/Utils.ts";
import { formatDate } from "@vueuse/core";
import { BlogService } from "../../services/BlogService.ts";

const props = defineProps({
  article: {
    type: {} as PropType<BlogArticle>,
    required: true,
  },
});

const blogArticle: Ref<BlogArticle> = ref({} as BlogArticle);
const readingTime: Ref<number | undefined> = ref(undefined);
const viewCount: Ref<number | undefined> = ref(undefined);
const isFetchingViews: Ref<boolean> = ref(false);

onMounted(async () => await init());

const init = async () => {
  blogArticle.value = props.article;
  readingTime.value = Math.round(Utils.getReadTime(blogArticle.value.text));
  await getViews();
};

const getViews = async () => {
  isFetchingViews.value = true;
  viewCount.value = await BlogService.getArticleViewCount(blogArticle.value.id);
  isFetchingViews.value = false;
};
</script>

<template>
  <div
    class="uk-card uk-card-body uk-card-default hover:bg-gray-900 hover:text-white transition-all active:bg-gray-500 uk-padding"
  >
    <div class="flex justify-between items-center">
      <div>
        <h3 class="uk-card-title">{{ blogArticle.title }}</h3>
        <p class="text-sm italic">
          {{ blogArticle.publishedAt }}
          <span v-if="viewCount" class="text-sm italic text-gray-500"
            >- {{ viewCount }}</span
          >
        </p>
      </div>
      <p>{{ $t("minute-read", { minutes: readingTime }) }}</p>
    </div>
  </div>
</template>
