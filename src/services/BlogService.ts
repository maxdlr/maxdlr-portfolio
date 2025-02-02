import { BlogArticle, BlogArticleView } from "../interface/BlogArticle.ts";
import { OutlineService } from "./OutlineService.ts";

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
  articles = fetched.data.value.data.filter((article: BlogArticle) => {
    const isNotTemplate: boolean = !article.template;
    const isArticle: boolean = !!article.parentDocumentId;
    return isNotTemplate && isArticle;
  });
  return articles;
};

const getArticleInfo = async (documentId: string): Promise<BlogArticle> => {
  const fetched = await OutlineService.outlineFetch(`/documents.info`)
    .post({ id: documentId })
    .json();
  return fetched.data.value.data;
};

export const BlogService = {
  getArticleList,
  getArticleInfo,
  createArticleView,
  getArticleViewCount,
};
