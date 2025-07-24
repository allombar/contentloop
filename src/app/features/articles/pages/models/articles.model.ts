export interface AllArticlesDto {
  items: ArticleDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ArticleDto {
  id: string;
  title: string;
  content: string;
  authorName: string;
  viewsCount: number;
  createdAt: string;
}
