import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { JwtAccessTokenStrategy, JwtAuthGuard, RolesGuard } from '../../../adapters/http/features/auth';
import { LoggingServiceToken } from '../../commons/logging/logging.providers';
import { LoggingServiceAdapter } from '../../commons/logging/logging.service.adapter';
import { KeycloakAdminService } from './keycloak-admin.service';

export const authProviders: Provider[] = [
  RolesGuard,
  JwtAccessTokenStrategy,
  JwtAuthGuard,
  {
    provide: LoggingServiceToken,
    useFactory: (config: ConfigService) => {
      return new LoggingServiceAdapter(config);
    },
    inject: [ConfigService],
  },
  {
    provide: KeycloakAdminService,
    useFactory: KeycloakAdminService.factory,
    inject: [ConfigService, HttpService, LoggingServiceToken],
  },
];
