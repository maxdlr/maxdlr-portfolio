<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, Ref } from "vue";
import { BlogArticle } from "../../../interface/BlogArticle.ts";
import { BlogService } from "../../../services/BlogService.ts";
import router from "../../../router";
import { usePageHead } from "../../../composables/usePageHead.ts";
import { formatDate } from "@vueuse/core";
import { marked } from "marked";
import Loader from "../../atoms/Loader.vue";
import { Utils } from "../../../composables/Utils.ts";
import { ImgProcessor } from "../../../composables/ImgProcessor.ts";

const article: Ref<BlogArticle> = ref({} as BlogArticle);
const id: Ref<string | null> = ref(null);
const isLoading = ref(false);
const imageProcessor = new ImgProcessor();
const blogArticlesShareUrl = import.meta.env.VITE_BLOG_ARTICLES_SHARE_URL;

usePageHead("article", {
  title: "Blog Article",
  author: "Maxdlr",
  description: article.value.title,
  image: "/photo.jpg",
  publishDate: formatDate(new Date(article.value.publishedAt), "YYYY-MM-DD"),
  slug: article.value.title,
});

onBeforeMount(() => (id.value = router.currentRoute.value.params.id as string));
onMounted(async () => {
  if (!id.value) return;
  await getArticle();
  await styleArticle();
});
const getArticle = async () => {
  isLoading.value = true;
  article.value = await BlogService.getArticleInfo(id.value as string);
  isLoading.value = false;
};

const styleArticle = async () => {
  article.value.text = marked(article.value.text) as string;
  article.value.text = article.value.text.replace(
    /<a href/g,
    "<a target='_blank' href",
  );

  article.value.text = Utils.updateDocsAnchorLinks(article.value.text);

  const rules: { [key: string]: string } = {
    h1: "uk-h1 pt-10",
    h2: "uk-h2 pt-8",
    h3: "uk-h3 pt-5",
    p: "uk-paragraph mt-2",
    ul: "uk-list uk-list-bullet",
    img: "rounded-2xl h-[300px] w-[300px] mx-auto",
    a: "uk-link hover:text-gray-400",
  };
  for (const key in rules) {
    article.value.text = Utils.styleHtml(article.value.text, key, rules[key]);
  }

  article.value.text = article.value.text.replace(/\\n/g, "<br/>");
  article.value.text = article.value.text.replace(/\\/g, "");
  article.value.text = await imageProcessor.processText(article.value.text);
  article.value.text = article.value.text.replace(
    /<hr>/g,
    `
<div class='uk-divider-icon text-center'>
  <img
    class="uk-icon-image w-7 h-7 m-auto"
    src="/logo.png"
    alt="Maxime de la Rocheterie - FullStack Developer logo"
  />
</div>
`,
  );
};
</script>

<template>
  <Loader v-if="isLoading" />
  <section v-else class="uk-container max-w-[800px]">
    <div v-html="article.text" />
  </section>
</template>
