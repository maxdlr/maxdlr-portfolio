<script lang="ts" setup>
import { onMounted, Ref, ref } from "vue";
import ArticleCard from "../../atoms/ArticleCard.vue";
import { BlogService } from "../../../services/BlogService.ts";
import { BlogArticle } from "../../../interface/BlogArticle.ts";
import Loader from "../../atoms/Loader.vue";
import { usePageHead } from "../../../composables/usePageHead.ts";

usePageHead("blog");

const isLoading = ref(false);
const articles: Ref<BlogArticle[]> = ref([]);

const getArticles = async () => {
  isLoading.value = true;
  articles.value = await BlogService.getArticleList();
  isLoading.value = false;
};

const refresh = async () => await getArticles();
onMounted(async () => await refresh());
const createView = async (id: string) =>
  await BlogService.createArticleView(id);
</script>

<template>
  <p class="text-sm italic text-gray-800 text-center py-4">
    {{ $t("blog-title") }}
  </p>
  <section
    class="flex flex-col items-center justify-center container mx-auto px-4 mb-10"
  >
    <Loader v-if="isLoading" />

    <div v-else-if="!articles || articles.length === 0">
      {{ $t("no-articles") }}
    </div>

    <div
      v-for="article in articles"
      v-else
      :key="article.id"
      class="w-[50%] max-md:w-full mb-3"
    >
      <a :href="`/article/${article.id}`" @click="createView(article.id)">
        <ArticleCard :article="article" />
      </a>
    </div>
  </section>
</template>
