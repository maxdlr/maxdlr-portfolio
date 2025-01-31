export interface BlogArticle {
  id: string;
  url: string;
  template: boolean;
  parentDocumentId: string | null;
  createdAt: Date | string;
  title: string;
}
