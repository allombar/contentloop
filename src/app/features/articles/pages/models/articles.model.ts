export interface ArticleDto {
  id: string;
  title: string;
  description: string;
  content: string;
  authorName: string;
  viewsCount: number;
  createdAt: string;
}

export interface ArticleCommentDto {
  id: string;
  articleId: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface PagedResultDto<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateArticleDto {
  title: string;
  description: string;
  content: string;
}

export interface UpdateArticleDto {
  title: string;
  description: string;
  content: string;
}
