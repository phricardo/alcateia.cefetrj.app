export interface NewsItem {
  title: string;
  link: string;
  description: string;
  guid: string;
  pubDate: string;
  campus: string | null;
  isEveryone: boolean;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface NewsResponse {
  items: NewsItem[];
  pagination: Pagination;
}
