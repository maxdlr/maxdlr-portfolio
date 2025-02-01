import { BlogArticle, BlogArticleView } from "../interface/BlogArticle.ts";
import {
  BeforeFetchContext,
  createFetch,
  OnFetchErrorContext,
} from "@vueuse/core";

const blogArticlesCollectionId = import.meta.env.VITE_DOCS_COLLECTIONID;

const blogFetch = createFetch({
  baseUrl: import.meta.env.VITE_DOCS_BASE_API_URL,
  options: {
    async beforeFetch({ options, url }: BeforeFetchContext) {
      options.headers = {
        ...options.headers,
        Authorization: "Bearer " + import.meta.env.VITE_DOCS_TOKEN,
      };
      return { options, url };
    },
    async onFetchError(ctx: OnFetchErrorContext) {
      console.error(ctx.data.message);
      return ctx;
    },
  },
});

const getArticleViewCount = async (documentId: string): Promise<number> => {
  const fetched = await blogFetch<BlogArticleView[]>(`/views.list`)
    .post({
      documentId: documentId,
    })
    .json();
  return fetched.data.value.data.reduce(
    (acc: number, v: BlogArticleView) => acc + v.count,
    0,
  );
};

const createView = async (documentId: string): Promise<void> => {
  await blogFetch<BlogArticleView>(`/views.create`)
    .post({
      documentId: documentId,
    })
    .json();
};

const getArticleList = async (): Promise<BlogArticle[]> => {
  let articles: BlogArticle[];
  const fetched = await blogFetch(`/documents.list`)
    .post({
      collectionId: blogArticlesCollectionId,
    })
    .json();
  articles = fetched.data.value.data.filter((article: BlogArticle) => {
    const isNotTemplate: boolean = !article.template;
    const isArticle: boolean = !!article.parentDocumentId;
    return isNotTemplate && isArticle;
  });
  return articles;
};

const getArticleInfo = async (documentId: string): Promise<BlogArticle> => {
  const fetched = await blogFetch(`/documents.info`)
    .post({ id: documentId })
    .json();
  return fetched.data.value.data;
};

export const BlogService = {
  getArticleList,
  getArticleInfo,
  createView,
  getArticleViewCount,
};
