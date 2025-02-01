export interface BlogArticle {
  archivedAt: Date | string;
  collaboratorIds: string[];
  collectionId: string[];
  color: string;
  createdAt: string;
  createdBy: BlogArticleUser;
  deletedAt: Date | string;
  fullWidth: boolean;
  icon: string;
  id: string;
  insightsEnabled: boolean;
  isCollectionDeleted: boolean;
  lastViewedAt: Date | string;
  parentDocumentId: string;
  publishedAt: Date | string;
  revision: number;
  tasks: {
    completed: number;
    total: number;
  };
  template: boolean;
  templateId: string;
  text: string;
  title: string;
  updatedAt: Date | string;
  updatedBy: BlogArticleUser;
  url: string;
  urlId: string;
}

export interface BlogArticleUser {
  avatarUrl: string;
  color: string;
  createdAt: Date | string;
  id: string;
  isSuspended: boolean;
  lastActiveAt: Date | string;
  name: string;
  role: string;
  timezone: string;
  updatedAt: Date | string;
}

export interface BlogArticleView {
  count: number;
  documentId: string;
  firstViewedAt: string;
  id: string;
  lastViewedAt: string;
  user: BlogArticleUser;
  userId: string;
}
