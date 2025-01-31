import { BlogArticle } from "../interface/BlogArticle.ts";
import { BeforeFetchContext, createFetch } from "@vueuse/core";

const token = import.meta.env.VITE_DOCS_TOKEN;
const collectionId = import.meta.env.VITE_DOCS_COLLECTIONID;
const docsBaseUrl = import.meta.env.VITE_DOCS_BASE_API_URL;

const blogFetch = createFetch({
  baseUrl: docsBaseUrl,
  options: {
    async beforeFetch({ options, url }: BeforeFetchContext) {
      options.headers = {
        ...options.headers,
        Authorization: "Bearer " + token,
      };
      return { options, url };
    },
  },
});

const getArticleList = async (): Promise<BlogArticle[]> => {
  let articles: BlogArticle[];

  const fetched = await blogFetch(`${docsBaseUrl}/documents.list`)
    .post({
      collectionId: collectionId,
    })
    .json();

  if (!fetched.response.value?.ok) {
    const body = await fetched.response.value?.json();
    console.error(body.message);
    return [];
  }

  articles = fetched.data.value.data.filter((article: BlogArticle) => {
    const isNotTemplate: boolean = !article.template;
    const isArticle: boolean = !!article.parentDocumentId;
    return isNotTemplate && isArticle;
  });
  return articles;
};

const getArticle = async (articleId: string) => {
  const fetched = await blogFetch(`${docsBaseUrl}/documents.info`)
    .post({ id: articleId })
    .json();

  if (!fetched.response.value?.ok) {
    const body = await fetched.response.value?.json();
    console.error(body.message);
    return [];
  }

  return fetched.data.value.data;
};

export const BlogService = {
  getArticleList,
  getArticle,
};
