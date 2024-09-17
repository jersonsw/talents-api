import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { KeycloakAdminService } from '../../../../../main/features/auth/keycloak-admin.service';
import { UserTokenClaims } from '../dtos';
import { UserTokenClaimsMapper } from '../mappers';
import { User } from '../../../../../core/features/users/domain/user';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(readonly config: ConfigService, readonly kcAdmin: KeycloakAdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]),
      secretOrKey: kcAdmin.getRsaPublicKey(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserTokenClaims): Promise<User> {
    return UserTokenClaimsMapper.toDomain(payload);
  }
}
