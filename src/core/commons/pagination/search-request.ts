export interface SearchRequest<T = unknown> {
  term: string;
  order?: string[];
  params: T;
}
