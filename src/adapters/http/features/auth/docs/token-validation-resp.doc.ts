import { ApiProperty } from '@nestjs/swagger';

export class TokenValidationRespDoc {
  @ApiProperty({ example: true })
  valid: boolean;
}
