import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PaginationRequest } from '../../../core/commons/pagination';

const defaultPage = 0;
const defaultSize = 20;

/**
 * Decorator intended for building a PaginationRequest object based on the query string parameters
 */
export const PaginationParams = createParamDecorator<Partial<PaginationRequest>>(
  (data: Partial<PaginationRequest>, ctx: ExecutionContext) => {
    const { query } = ctx.switchToHttp().getRequest();
    const { currentPage, size, order, ...params } = query || {};
    const pageFrom = +(currentPage || data?.currentPage || defaultPage);
    const pageSize = +(size || data?.size || defaultSize);
    const skip = (currentPage || 0) * pageSize;
    const queryParams = params || {};

    let orderArray: string[] = [];

    if (typeof order === 'string') {
      orderArray = order.split(',');
    } else if (typeof order === 'object' && !Array.isArray(order)) {
      Object.keys(order).forEach((key) => {
        orderArray.push(`${key}:${order[key]}`);
      });
    } else if (Array.isArray(order)) {
      orderArray = order;
    }

    return Object.assign(data || {}, {
      skip,
      currentPage: pageFrom,
      size: pageSize,
      order: orderArray.filter((o) => !!o),
      params: queryParams,
    });
  }
);
