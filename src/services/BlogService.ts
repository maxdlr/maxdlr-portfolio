import { BlogArticle, BlogArticleView } from "../interface/BlogArticle.ts";
import { OutlineService } from "./OutlineService.ts";
import { formatDate } from "@vueuse/core";

const blogArticlesCollectionId = import.meta.env.VITE_DOCS_COLLECTIONID;

const getArticleViewCount = async (documentId: string): Promise<number> => {
  const fetched = await OutlineService.outlineFetch<BlogArticleView[]>(
    `/views.list`,
  )
    .post({
      documentId: documentId,
    })
    .json();
  return fetched.data.value.data.reduce(
    (acc: number, v: BlogArticleView) => acc + v.count,
    0,
  );
};

const createArticleView = async (documentId: string): Promise<void> => {
  await OutlineService.outlineFetch<BlogArticleView>(`/views.create`)
    .post({
      documentId: documentId,
    })
    .json();
};

const getArticleList = async (): Promise<BlogArticle[]> => {
  let articles: BlogArticle[];
  const fetched = await OutlineService.outlineFetch(`/documents.list`)
    .post({
      collectionId: blogArticlesCollectionId,
    })
    .json();

  console.log(fetched.data.value);

  articles = fetched.data.value.data.filter((article: BlogArticle) => {
    const isNotTemplate: boolean = !article.template;
    const isArticle: boolean = !!article.parentDocumentId;
    return isNotTemplate && isArticle;
  });

  articles = articles.map((article: BlogArticle) => {
    return transform(article);
  });

  return articles;
};

const getArticleInfo = async (documentId: string): Promise<BlogArticle> => {
  const fetched = await OutlineService.outlineFetch(`/documents.info`)
    .post({ id: documentId })
    .json();
  return transform(fetched.data.value.data);
};

const transform = (article: BlogArticle): BlogArticle => {
  article.publishedAt = formatDate(new Date(article.publishedAt), "YYYY-MM-DD");
  return article;
};

export const BlogService = {
  getArticleList,
  getArticleInfo,
  createArticleView,
  getArticleViewCount,
};
