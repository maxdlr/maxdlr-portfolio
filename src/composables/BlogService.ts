import { BlogArticle } from "../interface/BlogArticle.ts";

const token = import.meta.env.VITE_DOCS_TOKEN;
const collectionId = import.meta.env.VITE_DOCS_COLLECTIONID;
const docsBaseUrl = import.meta.env.VITE_DOCS_BASE_API_URL;

const getArticles = async (): Promise<BlogArticle[]> => {
  let articles: BlogArticle[];
  const response = await fetch(`${docsBaseUrl}/documents.list`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      collectionId: collectionId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error(error.message);
    return [];
  }

  const fetched = await response.json();
  articles = fetched.data.filter((article: BlogArticle) => {
    const isNotTemplate: boolean = !article.template;
    const isArticle: boolean = !!article.parentDocumentId;
    return isNotTemplate && isArticle;
  });
  return articles;
};

export const BlogService = {
  getArticles,
};
