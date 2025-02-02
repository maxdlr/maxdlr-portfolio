<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import ArticleCard from "../../atoms/ArticleCard.vue";
import { BlogService } from "../../../composables/BlogService.ts";
import { BlogArticle } from "../../../interface/BlogArticle.ts";
import Loader from "../../atoms/Loader.vue";
import { usePageHead } from "../../../composables/usePageHead.ts";

usePageHead("blog");

const blogArticlesShareUrl = import.meta.env.VITE_BLOG_ARTICLES_SHARE_URL;

const isLoading = ref(false);
const articles: Ref<BlogArticle[]> = ref([]);

const getArticles = async () => {
  isLoading.value = true;
  articles.value = await BlogService.getArticleList();
  isLoading.value = false;
};

const refresh = async () => await getArticles();
onMounted(async () => await refresh());
const createView = async (id: string) => await BlogService.createView(id);
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
      v-else
      v-for="article in articles"
      :key="article.id"
      class="w-[50%] max-md:w-full mb-3"
    >
      <!--      <a-->
      <!--        :href="blogArticlesShareUrl + article.url"-->
      <!--        target="_blank"-->
      <!--        @click="createView(article.id)"-->
      <!--      >-->
      <a :href="`/article/${article.id}`" @click="createView(article.id)">
        <ArticleCard :article="article" />
      </a>
    </div>
  </section>
</template>
