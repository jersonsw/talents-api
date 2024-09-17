import { ApiProperty } from '@nestjs/swagger';
import { Pagination } from '../../../core/commons/pagination';

export class PaginationResponse<T> extends Pagination<T> {
  @ApiProperty({ description: 'Index of the current page', example: 1 })
  override currentPage: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 5,
  })
  override totalPages: number;

  @ApiProperty({
    description: 'Indicates if there are more pages to be fetched',
    example: true,
  })
  override hasNext: boolean;

  @ApiProperty({
    description: 'The data fetched from the database',
    example: [],
  })
  override data: T[];

  @ApiProperty({
    description: 'Total number of records',
    example: 120,
  })
  override totalRecords: number;
}
