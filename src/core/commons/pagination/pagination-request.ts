export interface PaginationRequest<T = unknown> {
  // Amount of records to skip
  skip: number;

  // The index of the page where the pagination should start from
  currentPage: number;

  // Page size
  size: number;

  // Sort order
  order?: string[];

  // Other params of type T
  params: T;
}
