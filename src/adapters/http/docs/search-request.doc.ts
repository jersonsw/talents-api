import { ApiProperty } from '@nestjs/swagger';
import { SearchRequest } from '../../../core/commons/pagination/search-request';

export class SearchRequestDoc implements SearchRequest {
  @ApiProperty({
    type: 'string',
    name: 'term',
    required: false,
    description: 'Search term',
  })
  term: string;

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
