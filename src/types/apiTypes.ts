export interface Entity {
  id: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  hasMore: boolean;
}
