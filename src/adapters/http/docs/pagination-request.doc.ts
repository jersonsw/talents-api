import { ApiProperty } from '@nestjs/swagger';
import { PaginationRequest } from '../../../core/commons/pagination';

export class PaginationRequestDoc implements PaginationRequest {
  skip: number;

  @ApiProperty({
    type: 'number',
    name: 'currentPage',
    example: 0,
    required: false,
    description: 'Index of the current page',
  })
  currentPage: number;

  @ApiProperty({
    type: 'number',
    name: 'size',
    example: 10,
    required: false,
    description: 'Number of elements per page',
  })
  size: number;

  @ApiProperty({
    type: 'string',
    name: 'order',
    required: false,
    title: 'Sort order',
    isArray: true,
    example: ['createdAt:DESC'],
  })
  order?: string[];

  params: any;
}
