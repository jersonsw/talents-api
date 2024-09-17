/**
 * Interface intended for Paginating results
 */
import { PaginationRequest } from './pagination-request';

export class Pagination<T> {
  // The number of the current page
  currentPage: number;
  // Total of pages calculated based on the total amount of records
  totalPages: number;
  // Tells if there's a next page (useful for navigation)
  hasNext: boolean;
  // Contains all the records belonging to the current page
  data: T[];
  // Total amount of records we're paginating
  totalRecords: number;

  static of<T>(pag: PaginationRequest, count: number, data: T[]): Pagination<T> {
    const totalPages = Math.floor(count / pag.size) + (count % pag.size > 0 ? 1 : 0);

    const currentPage = pag.currentPage || 0;

    return {
      totalPages: totalPages,
      hasNext: currentPage < totalPages - 1,
      data,
      currentPage,
      totalRecords: count,
    };
  }
}
