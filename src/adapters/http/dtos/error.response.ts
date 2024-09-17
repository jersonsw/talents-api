import { ApiProperty } from '@nestjs/swagger';
import { ErrorType } from '../../../core/commons/enums';

export class ErrorResponse {
  @ApiProperty({
    description: 'Identifier that works as a more specific error code',
    enum: ErrorType,
    example: ErrorType.AccessTokenExpired,
  })
  errorType: ErrorType;

  @ApiProperty({
    example: 'Access token expired',
  })
  message: string;
}
