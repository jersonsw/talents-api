import { ApiProperty } from '@nestjs/swagger';

export class ValidateTokenDto {
  @ApiProperty({
    type: 'string',
    name: 'token',
    required: false,
    description: 'Token de acceso',
  })
  token: string;
}
