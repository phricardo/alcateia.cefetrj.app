interface EventsItem {
  guid: string;
  link: string;
  title: string;
  description: string;
  pubDate: string;
  campus: string;
  isEveryone: boolean;
  imageUrl: string | null;
}

interface Pagination {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface EventsResponse {
  items: EventsItem[];
  pagination: Pagination;
}
