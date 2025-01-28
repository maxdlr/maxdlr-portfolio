<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import ArticleCard from "../molecule/ArticleCard.vue";

const token = import.meta.env.VITE_DOCS_TOKEN;
const shareId = import.meta.env.VITE_DOCS_SHAREID;
const collectionId = import.meta.env.VITE_DOCS_COLLECTIONID;

const isLoading = ref(false);
const articles: Ref<
  {
    id: string;
    url: string;
    template: boolean;
    parentDocumentId: string | null;
  }[]
> = ref([]);

const getArticles = async () => {
  isLoading.value = true;
  const response = await fetch(`/api/documents.list`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      collectionId: collectionId,
    }),
  });
  const { data } = await response.json();
  articles.value = data.filter(
    (doc: {
      id: string;
      url: string;
      template: boolean;
      parentDocumentId: string | null;
    }) => {
      const isNotTemplate: boolean = !doc.template;
      const isArticle: boolean = !!doc.parentDocumentId;
      return isNotTemplate && isArticle;
    },
  );
  isLoading.value = false;
};

const refresh = async () => {
  await getArticles();
};
onMounted(async () => {
  await refresh();
});
</script>

<template>
  <hr class="uk-divider-icon" />

  <p class="text-sm italic text-gray-800 text-center py-4">
    {{ $t("blog-title") }}
  </p>

  <section
    class="flex flex-col items-center justify-center container mx-auto px-4 mb-10"
  >
    <div v-if="isLoading">
      <div
        class="m-12 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status"
      >
        <span
          class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
          >Loading...</span
        >
      </div>
    </div>

    <div
      v-else
      v-for="article in articles"
      :key="article.id"
      class="w-[50%] max-md:w-full mb-3"
    >
      <a
        :href="'https://docs.maxdlr.com/s/' + shareId + article.url"
        target="_blank"
      >
        <ArticleCard :article="article" />
      </a>
    </div>
  </section>
</template>
