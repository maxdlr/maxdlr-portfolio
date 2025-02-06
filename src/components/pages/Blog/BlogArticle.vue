<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, Ref } from "vue";
import { BlogArticle } from "../../../interface/BlogArticle.ts";
import { BlogService } from "../../../services/BlogService.ts";
import router from "../../../router";
import { usePageHead } from "../../../composables/usePageHead.ts";
import { formatDate } from "@vueuse/core";
import Loader from "../../atoms/Loader.vue";
import { BlogArticleTextProcessor } from "../../../composables/processors/BlogArticleTextProcessor.ts";
import TransitionSlideUp from "../../atoms/TransitionSlideUp.vue";
import _ from "lodash";

const article: Ref<BlogArticle> = ref({} as BlogArticle);
const id: Ref<string | null> = ref(null);
const isLoading = ref(false);
let blogProcessor: BlogArticleTextProcessor;

onBeforeMount(() => (id.value = router.currentRoute.value.params.id as string));

onMounted(async () => {
  if (!id.value) return;
  await getArticle();
  buildHead();
});

const getArticle = async () => {
  isLoading.value = true;
  article.value = await BlogService.getArticleInfo(id.value as string);
  blogProcessor = new BlogArticleTextProcessor(article.value.text);
  article.value.text = await blogProcessor.process();
  isLoading.value = false;
};

const buildHead = () => {
  usePageHead("article", {
    title: article.value.title,
    author: "Maxdlr",
    description: _.truncate(blogProcessor.articleDescription, {
      length: 100,
      omission: "...",
    }),
    image: blogProcessor.articleImageLinks[0],
    publishDate: formatDate(new Date(article.value.publishedAt), "YYYY-MM-DD"),
    slug: article.value.title,
  });
};
</script>

<template>
  <TransitionSlideUp>
    <div
      v-if="isLoading"
      class="w-full h-[40vh] flex justify-center items-center"
    >
      <Loader />
    </div>
    <main v-else>
      <article class="uk-container max-w-[800px] pb-10" v-html="article.text" />
    </main>
  </TransitionSlideUp>
</template>
