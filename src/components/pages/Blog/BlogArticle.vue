<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, Ref } from "vue";
import { BlogArticle } from "../../../interface/BlogArticle.ts";
import { BlogService } from "../../../services/BlogService.ts";
import router from "../../../router";
import { usePageHead } from "../../../composables/usePageHead.ts";
import { formatDate } from "@vueuse/core";
import Loader from "../../atoms/Loader.vue";
import { ImgProcessor } from "../../../composables/ImgProcessor.ts";
import { BlogArticleTextProcessor } from "../../../composables/BlogArticleTextProcessor.ts";
import TransitionSlideUp from "../../atoms/TransitionSlideUp.vue";

const article: Ref<BlogArticle> = ref({} as BlogArticle);
const id: Ref<string | null> = ref(null);
const isLoading = ref(false);
const imageProcessor = new ImgProcessor();
// const blogArticlesShareUrl = import.meta.env.VITE_BLOG_ARTICLES_SHARE_URL;

usePageHead("article", {
  title: article.value.title,
  author: "Maxdlr",
  description: article.value.title,
  image: "/photo.jpg",
  publishDate: formatDate(new Date(article.value.publishedAt), "YYYY-MM-DD"),
  slug: article.value.title,
});

onBeforeMount(() => (id.value = router.currentRoute.value.params.id as string));
onMounted(async () => {
  if (!id.value) return;
  isLoading.value = true;
  await getArticle();
  await styleArticle();
  isLoading.value = false;
});
const getArticle = async () => {
  article.value = await BlogService.getArticleInfo(id.value as string);
};

const styleArticle = async () => {
  article.value.text = new BlogArticleTextProcessor(
    article.value.text,
  ).process();
  article.value.text = await imageProcessor.processText(article.value.text);
};
</script>

<template>
  <TransitionSlideUp>
    <div
      class="w-full h-[40vh] flex justify-center items-center"
      v-if="isLoading"
    >
      <Loader />
    </div>
    <main v-else>
      <article class="uk-container max-w-[800px]">
        <div v-html="article.text" />
      </article>
    </main>
  </TransitionSlideUp>
</template>
