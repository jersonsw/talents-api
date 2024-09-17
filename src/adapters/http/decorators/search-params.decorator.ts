import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SearchRequest } from '../../../core/commons/pagination/search-request';
import { PaginationRequest } from '../../../core/commons/pagination';

export const SearchParams = createParamDecorator<Partial<SearchRequest>>(
  (data: Partial<PaginationRequest>, ctx: ExecutionContext) => {
    const { query } = ctx.switchToHttp().getRequest();
    const { term, order, ...params } = query || {};

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
      term,
      order: orderArray.filter((o) => !!o),
      params,
    });
  }
);
