export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  hasMore: boolean;
}
