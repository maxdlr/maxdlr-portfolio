<script lang="ts" setup>
import { onBeforeMount, onMounted, ref, Ref } from "vue";
import { BlogArticle } from "../../../interface/BlogArticle.ts";
import { BlogService } from "../../../services/BlogService.ts";
import router from "../../../router";
import data from "../../../model/data.json";
import { usePageHead } from "../../../composables/usePageHead.ts";
import { formatDate } from "@vueuse/core";
import Loader from "../../atoms/Loader.vue";
import { BlogArticleTextProcessor } from "../../../composables/processors/BlogArticleTextProcessor.ts";
import _ from "lodash";
import { Attachment } from "../../../services/AttachementService.ts";

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
  const image: Attachment | undefined = blogProcessor.articleImages.find(
    (img) =>
      ["png", "jpeg", "jpg"].includes(
        (img.attachments?.type ?? "").replace("image/", ""),
      ),
  );

  usePageHead("article", {
    title: article.value.title,
    author: "Maxdlr",
    description: _.truncate(blogProcessor.articleDescription, {
      length: 100,
      omission: "...",
    }),
    image: image?.url ?? "/photo.jpg",
    publishDate: formatDate(new Date(article.value.publishedAt), "YYYY-MM-DD"),
    slug: article.value.title,
  });
};
</script>

<template>
  <div
    v-if="isLoading"
    class="w-full h-[40vh] flex justify-center items-center"
  >
    <Loader />
  </div>
  <main v-else class="uk-container max-md:mx-3 max-w-[800px] pb-10">
    <section class="text-sm italic text-gray-700 max-md:text-center">
      <a :href="data['social-links'].linkedin" class="uk-link">
        Maxime de la Rocheterie
      </a>
      <span class="mx-3"> • </span>
      <p class="inline">{{ article.publishedAt }}</p>
    </section>

    <article v-html="article.text" />
  </main>
</template>
