import { Body, Controller, Post } from '@nestjs/common';
import { KeycloakAdminService } from '../../../../../main/features/auth/keycloak-admin.service';
import { ApiCreatedRespDoc } from '../../../decorators/api-created-resp.doc';
import { TokenValidationRespDoc } from '../docs';
import { ValidateTokenDto } from '../dtos';

@Controller('auth')
export class KeycloakAuthController {
  constructor(private readonly kcAdmin: KeycloakAdminService) {}

  @Post('check')
  @ApiCreatedRespDoc({
    model: TokenValidationRespDoc,
    description: 'Token validation response',
  })
  async check(@Body() dto: ValidateTokenDto): Promise<{ valid: boolean }> {
    return this.kcAdmin.introspect(dto.token);
  }
}
