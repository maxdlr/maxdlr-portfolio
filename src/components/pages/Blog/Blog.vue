<script lang="ts" setup>
import { onBeforeMount, onMounted, Ref, ref } from "vue";
import ArticleCard from "../../atoms/ArticleCard.vue";
import { BlogService } from "../../../services/BlogService.ts";
import { BlogArticle } from "../../../interface/BlogArticle.ts";
import Loader from "../../atoms/Loader.vue";
import { usePageHead } from "../../../composables/usePageHead.ts";

onBeforeMount(() => usePageHead("blog"));

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
  <div
    v-if="isLoading"
    class="flex flex-col items-center justify-center container mx-auto px-4 mb-10"
  >
    <Loader />
  </div>

  <main v-else>
    <h1 class="text-sm italic text-gray-800 text-center py-4">
      {{ $t("blog-title") }}
    </h1>

    <div v-if="!articles || articles.length === 0">
      {{ $t("no-articles") }}
    </div>

    <section
      v-else
      class="flex flex-col items-center justify-center container mx-auto px-4 mb-10"
    >
      <div
        v-for="article in articles"
        :key="article.id"
        class="w-[50%] max-md:w-full mb-3"
      >
        <a :href="`/article/${article.id}`" @click="createView(article.id)">
          <ArticleCard :article="article" />
        </a>
      </div>
    </section>
  </main>
</template>
