interface EventsItem {
  guid: string;
  title: string;
  description: string;
  pubDate: string;
  channel: string;
  campus: string;
  isAllCampusEvent: boolean;
  thumbnail: string | null;
}

interface Pagination {
  page: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export interface EventsResponse {
  events: EventsItem[];
  pagination: Pagination;
}
