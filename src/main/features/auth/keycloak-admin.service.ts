import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { error } from 'winston';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { LoggingService } from '../../../core/commons/logging';
import { convertToPemFormat, createAdminClient } from '../../../scripts/keycloak-helpers';

@Injectable()
export class KeycloakAdminService {
  private readonly kc: KcAdminClient;
  private readonly publicKey: string;
  private readonly http: HttpService;
  private readonly config: ConfigService;
  private readonly logger: LoggingService;

  constructor(kc: any, publicKey: string, http: HttpService, config: ConfigService, logger: LoggingService) {
    this.kc = kc;
    this.publicKey = publicKey;
    this.http = http;
    this.config = config;
    this.logger = logger;
  }

  public getRsaPublicKey(): string {
    return this.publicKey;
  }

  public client(): KcAdminClient {
    return this.kc;
  }

  public static async factory(
    config: ConfigService,
    http: HttpService,
    logger: LoggingService
  ): Promise<KeycloakAdminService> {
    try {
      const kc = await createAdminClient(config);
      const realm = config.get('KEYCLOAK_REALM');
      const keys = await kc.realms.getKeys({ realm });
      const rsaKey = keys.keys.find((key) => key.type === 'RSA' && key.algorithm === 'RS256');
      const pem = convertToPemFormat(rsaKey.publicKey, 'PUBLIC KEY');

      return new KeycloakAdminService(kc, pem, http, config, logger);
    } catch (error) {
      if (error.cause.code === 'ECONNREFUSED') throw new Error('Keycloak server is not reachable');
    }

    throw error;
  }

  async introspect(token: string): Promise<{ valid: boolean }> {
    try {
      const params = this.buildParams(token);
      const headers = this.headers;
      const response$ = this.http.post(this.introspectUrl, params, { headers });
      const response = await firstValueFrom(response$);

      return { valid: response.data.active };
    } catch (error) {
      this.logger.error('Error trying to introspect the token', error);
    }

    return { valid: true };
  }

  private get introspectUrl() {
    return `${this.kc.baseUrl}/realms/applicants/protocol/openid-connect/token/introspect`;
  }

  private buildParams(token: string): URLSearchParams {
    const params = new URLSearchParams();

    params.append('token', token);
    params.append('client_id', this.config.get('KC_APPLICANTS_ADMIN_CLIENT_ID'));
    params.append('client_secret', this.config.get('KC_APPLICANTS_ADMIN_SECRET'));

    return params;
  }

  private get headers() {
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }
}
