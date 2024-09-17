import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse<T> {
  @ApiProperty({
    description: 'The data fetched from the database whether it is paginated or not',
  })
  payload: T;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: Date.now(),
  })
  timestamp: number;
}
