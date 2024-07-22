interface NewsItem {
  guid: string;
  title: string;
  description: string;
  pubDate: string;
  channel: string;
  campus: string;
  isAllCampusNews: boolean;
}

interface Pagination {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface NewsResponse {
  news: NewsItem[];
  pagination: Pagination;
}
