import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { KeycloakAdminClient } from '@keycloak/keycloak-admin-client/lib/client';
import { dynamicImport } from '../main/commons/utils/import.util';

const convertToPemFormat = (inputString: string, pemLabel: string): string => {
  const chunks = inputString.match(/.{1,64}/g);
  if (!chunks) {
    throw new Error('Invalid input string');
  }

  return `-----BEGIN ${pemLabel}-----\n${chunks.join('\n')}\n-----END ${pemLabel}-----\n`;
};

const createAdminClient = async (config: ConfigService): Promise<KeycloakAdminClient> => {
  const KcAdminClient = await dynamicImport('@keycloak/keycloak-admin-client');
  const host = config.get('KC_HOSTNAME');
  const prefixedHost = host.startsWith('http') ? host : `http://${host}`;
  const port = config.get('KEYCLOAK_PORT');
  const baseUrl = `${prefixedHost}:${port}`;
  const client = new KcAdminClient.default({ baseUrl, realmName: 'master' });
  const username = config.get('KEYCLOAK_ADMIN');
  const password = config.get('KEYCLOAK_ADMIN_PASSWORD');
  const clientId = config.get('KC_ADMIN_CLI_CLIENT_ID');
  const grantType = config.get('KC_ADMIN_CLI_GRANT_TYPE');

  await client.auth({
    username,
    password,
    grantType,
    clientId,
    totp: uuidv4(),
  });

  return client;
};

export { convertToPemFormat, dynamicImport, createAdminClient };
