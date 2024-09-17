import * as dotenv from 'dotenv';
import * as process from 'node:process';
import { keyBy, merge } from 'lodash';
import { UserProfileAttribute, UserProfileGroup } from '@keycloak/keycloak-admin-client/lib/defs/userProfileMetadata';
import { createAdminClient } from './keycloak-helpers';
import type RealmRepresentation from '@keycloak/keycloak-admin-client/lib/defs/realmRepresentation';
import type ClientRepresentation from '@keycloak/keycloak-admin-client/lib/defs/clientRepresentation';
import type RoleRepresentation from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation';
import { ConfigService } from '@nestjs/config';
import { Gender } from '../core/features/users/enums/gender';
import { Role } from '../core/features/users/enums/role';

const compositeRoles = {
  [Role.PlatformDeveloper]: [Role.PlatformAdmin],
  [Role.PlatformAdmin]: [Role.HumanResourcesManager, Role.DevelopmentManager],
  [Role.HumanResourcesManager]: [
    Role.HumanResourcesApproveApplicant,
    Role.HumanResourcesRecruiter,
    Role.HumanResourcesDeleteApplicant,
  ],
  [Role.HumanResourcesRecruiter]: [
    Role.HumanResourcesEmployee,
    Role.HumanResourcesCreateApplicant,
    Role.HumanResourcesUpdateApplicant,
  ],
  [Role.HumanResourcesEmployee]: [Role.HumanResourcesReadApplicant, Role.PlatformUser],
};

type KeycloakUser = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  attributes: {
    gender: Gender;
    country: string;
    phoneNumber: string;
    phoneNumberVerified: string;
    birthdate: string;
    locality: string;
    region: string;
    street: string;
    postal_code: string;
    picture: string;
    formatted: string;
    role: string;
  };
};

dotenv.config();

const {
  API_NAME,
  KC_HOSTNAME,
  KEYCLOAK_PORT,
  KEYCLOAK_ADMIN,
  KEYCLOAK_ADMIN_PASSWORD,
  DEV_PASSWORD,
  NODE_ENV,
  APP_NAME,
  API_IDENTIFIER,
  KEYCLOAK_REALM,
  SPA_IDENTIFIER,
  SPA_NAME,
  SPA_URI,
  KC_TALENTS_ADMIN_CLIENT_ID,
  KC_TALENTS_ADMIN_SECRET,
  RESOURCE_SERVER_URL,
} = process.env;

if (
  !KC_HOSTNAME ||
  !KEYCLOAK_PORT ||
  !KEYCLOAK_ADMIN ||
  !KEYCLOAK_ADMIN_PASSWORD ||
  !KEYCLOAK_REALM ||
  !APP_NAME ||
  !API_IDENTIFIER ||
  !NODE_ENV ||
  !SPA_IDENTIFIER ||
  !SPA_NAME ||
  !SPA_URI ||
  !KC_TALENTS_ADMIN_CLIENT_ID ||
  !KC_TALENTS_ADMIN_SECRET ||
  !RESOURCE_SERVER_URL
) {
  throw new Error('One or more Keycloak environment variables are not set');
}

console.log('Connected to', KC_HOSTNAME);

const setupKeycloak = async () => {
  const config = new ConfigService();
  const kcClient = await createAdminClient(config);

  const createRealm = async (): Promise<RealmRepresentation> => {
    const applicantsRealm = await kcClient.realms.findOne({ realm: KEYCLOAK_REALM });

    if (!applicantsRealm) {
      await kcClient.realms.create({
        displayName: APP_NAME || KEYCLOAK_REALM,
        realm: KEYCLOAK_REALM,
        enabled: true,
        userManagedAccessAllowed: true,
        registrationAllowed: true,
        resetPasswordAllowed: true,
        rememberMe: true,
        ssoSessionIdleTimeout: 45 * 60,
        ssoSessionMaxLifespan: 8 * 60 * 60,
        accessTokenLifespan: 30 * 60,
      });

      return await kcClient.realms.findOne({
        realm: KEYCLOAK_REALM,
      });
    }

    return applicantsRealm;
  };

  const getRealmRoles = async (realm: string): Promise<RoleRepresentation[]> => {
    return kcClient.roles.find({ realm });
  };

  const createRealmRoles = async (realm: string): Promise<RoleRepresentation[]> => {
    const roles = await getRealmRoles(realm);
    const newRoles = [Role.PlatformUser, Role.PlatformAdmin, Role.PlatformDeveloper];

    if (newRoles.length > 0) {
      for (const name of newRoles) {
        const description = `\$\{${name}\}`;

        await kcClient.roles.create({ realm, name, description });
      }

      return kcClient.roles.find({ realm });
    }

    return roles;
  };

  const createApiClient = async (realm: string): Promise<ClientRepresentation> => {
    return kcClient.clients.create({
      clientId: API_IDENTIFIER,
      realm,
      name: API_NAME,
      enabled: true,
      publicClient: false,
      standardFlowEnabled: true,
      directAccessGrantsEnabled: false,
    });
  };

  const createWebClient = async (realm: string): Promise<ClientRepresentation> => {
    return kcClient.clients.create({
      clientId: SPA_IDENTIFIER,
      name: SPA_NAME,
      description: 'Single Page Application',
      realm,
      enabled: true,
      publicClient: true,
      standardFlowEnabled: true,
      directAccessGrantsEnabled: false,
      redirectUris: [`${SPA_URI}/*`],
      webOrigins: [SPA_URI],
      attributes: {
        'oidc.ciba.grant.enabled': 'false',
        'client.secret.creation.time': '1707198695',
        'backchannel.logout.session.required': 'true',
        'post.logout.redirect.uris': `${SPA_URI}/*`,
        'display.on.consent.screen': 'false',
        'oauth2.device.authorization.grant.enabled': 'false',
        'backchannel.logout.revoke.offline.tokens': 'false',
        'pkce.code.challenge.method': 'S256',
      },
    });
  };

  const createAdminCliClient = async (realm: string): Promise<ClientRepresentation> => {
    return kcClient.clients.create({
      clientId: KC_TALENTS_ADMIN_CLIENT_ID,
      name: 'Admin CLI Client',
      description: 'Admin CLI Client to interact with the Keycloak Admin API',
      realm,
      enabled: true,
      publicClient: false,
      standardFlowEnabled: true,
      directAccessGrantsEnabled: true,
      redirectUris: [`${SPA_URI}/*`, `${RESOURCE_SERVER_URL}/*`],
      webOrigins: [SPA_URI, RESOURCE_SERVER_URL],
      secret: KC_TALENTS_ADMIN_SECRET,
      attributes: {
        'oidc.ciba.grant.enabled': 'false',
        'client.secret.creation.time': '1707198695',
        'backchannel.logout.session.required': 'true',
        'post.logout.redirect.uris': `${SPA_URI}/*##${RESOURCE_SERVER_URL}/*`,
        'display.on.consent.screen': 'false',
        'oauth2.device.authorization.grant.enabled': 'false',
        'backchannel.logout.revoke.offline.tokens': 'false',
      },
    });
  };

  const realm = await kcClient.realms.findOne({ realm: KEYCLOAK_REALM });
  if (realm) return;

  const talents = await createRealm();

  await createApiClient(talents.realm);
  const { id: webClientId } = await createWebClient(talents.realm);
  const { id: adminClientId } = await createAdminCliClient(talents.realm);

  const realmRoles = await createRealmRoles(talents.realm);
  const realmRolesMap = keyBy(realmRoles, 'name');

  for (const name of Object.values(Role)) {
    const composite = !!compositeRoles[name];

    await kcClient.clients.createRole({
      realm: talents.realm,
      id: webClientId,
      name,
      composite,
    });
  }

  const webRoles = await kcClient.clients.listRoles({
    realm: talents.realm,
    id: webClientId,
  });

  const webRolesMap = keyBy(webRoles, 'name');
  const allRolesMap = merge({}, webRolesMap, realmRolesMap);

  for (const role of Object.keys(compositeRoles)) {
    const roleRecord = allRolesMap[role];
    const composites: RoleRepresentation[] = compositeRoles[role].map((name: string) => allRolesMap[name]);

    await kcClient.roles.createComposite({ realm: talents.realm, roleId: roleRecord.id }, composites);
  }

  const existingProfile = await kcClient.users.getProfile({
    realm: talents.realm,
  });

  let allGroups: UserProfileGroup[] = existingProfile.groups;
  let allAttrs: UserProfileAttribute[] = existingProfile.attributes;

  const { groups, attributes } = await kcClient.users.updateProfile({
    realm: talents.realm,
    groups: [...allGroups, { name: 'address', displayHeader: 'Address' }],
    attributes: allAttrs,
  });

  allGroups = groups;
  allAttrs = attributes;

  allAttrs.push({
    name: 'phoneNumber',
    displayName: '${phoneNumber}',
    validations: {
      pattern: {
        pattern: '8(0|2|4)9[0-9]{7}',
        'error-message': 'Invalid Phone Number',
      },
      length: { min: 1, max: 255 },
    },
    required: { roles: ['admin', 'user'] },
    permissions: { view: ['admin', 'user'], edit: ['admin', 'user'] },
  });

  allAttrs.push({
    name: 'phoneNumberVerified',
    displayName: '${phoneNumberVerified}',
    validations: { options: { options: ['true', 'false'] } },
    annotations: {
      inputType: 'select-radiobuttons',
    },
  });

  allAttrs.push({
    name: 'street',
    displayName: '${street}',
    validations: {
      length: { min: 1, max: 500 },
    },
    required: { roles: ['admin', 'user'] },
    permissions: { view: ['admin', 'user'], edit: ['admin', 'user'] },
    group: 'address',
    selector: { scopes: ['address'] },
  });

  allAttrs.push({
    name: 'locality',
    displayName: '${locality}',
    validations: {
      length: { min: 1, max: 500 },
    },
    required: { roles: ['admin', 'user'] },
    permissions: { view: ['admin', 'user'], edit: ['admin', 'user'] },
    group: 'address',
    selector: { scopes: ['address'] },
  });

  allAttrs.push({
    name: 'region',
    displayName: '${region}',
    validations: {
      length: { min: 1, max: 500 },
    },
    required: { roles: ['admin', 'user'] },
    permissions: { view: ['admin', 'user'], edit: ['admin', 'user'] },
    group: 'address',
    selector: { scopes: ['address'] },
  });

  allAttrs.push({
    name: 'postal_code',
    displayName: '${postal_code}',
    validations: {
      length: { min: 1, max: 500 },
    },
    required: { roles: ['admin', 'user'] },
    permissions: { view: ['admin', 'user'], edit: ['admin', 'user'] },
    group: 'address',
    selector: { scopes: ['address'] },
  });

  allAttrs.push({
    name: 'country',
    displayName: '${country}',
    validations: {
      length: { min: 1, max: 500 },
    },
    required: { roles: ['admin', 'user'] },
    permissions: { view: ['admin', 'user'], edit: ['admin', 'user'] },
    group: 'address',
    selector: { scopes: ['address'] },
  });

  allAttrs.push({
    name: 'formatted',
    displayName: '${formatted}',
    validations: {
      length: { min: 1, max: 500 },
    },
    permissions: { view: ['admin'], edit: ['admin'] },
    group: 'address',
    selector: { scopes: ['address'] },
  });

  allAttrs.push({
    name: 'gender',
    displayName: '${gender}',
    validations: { options: { options: Object.values(Gender) } },
    annotations: {
      inputType: 'select-radiobuttons',
    },
    required: { roles: ['admin', 'user'] },
    permissions: { view: ['admin', 'user'], edit: ['admin', 'user'] },
  });

  allAttrs.push({
    name: 'picture',
    displayName: '${picture}',
    validations: {
      length: { min: 1, max: 500 },
    },
    permissions: { view: ['admin'], edit: ['admin'] },
  });

  allAttrs.push({
    name: 'birthdate',
    displayName: '${birthdate}',
    annotations: {
      inputType: 'html5-date',
    },
    required: { roles: ['admin', 'user'] },
    permissions: { view: ['admin', 'user'], edit: ['admin', 'user'] },
  });

  await kcClient.users.updateProfile({
    realm: talents.realm,
    attributes: allAttrs,
    groups: allGroups,
  });

  const rolesClientScope = await kcClient.clientScopes.findOneByName({
    realm: talents.realm,
    name: 'roles',
  });

  const realmRolesProtclMapper = await kcClient.clientScopes.findProtocolMapperByName({
    realm: talents.realm,
    id: rolesClientScope.id,
    name: 'realm roles',
  });

  realmRolesProtclMapper.config['claim.name'] = 'realm_roles';

  await kcClient.clientScopes.updateProtocolMapper(
    {
      realm: talents.realm,
      id: rolesClientScope.id,
      mapperId: realmRolesProtclMapper.id,
    },
    realmRolesProtclMapper
  );

  const clientRolesProtclMapper = await kcClient.clientScopes.findProtocolMapperByName({
    realm: talents.realm,
    id: rolesClientScope.id,
    name: 'client roles',
  });

  clientRolesProtclMapper.config['claim.name'] = 'client_roles';

  await kcClient.clientScopes.updateProtocolMapper(
    {
      realm: talents.realm,
      id: rolesClientScope.id,
      mapperId: clientRolesProtclMapper.id,
    },
    clientRolesProtclMapper
  );

  await kcClient.realms.update(
    {
      realm: talents.realm,
    },
    {
      ssoSessionIdleTimeout: 45 * 60,
      ssoSessionMaxLifespan: 8 * 60 * 60,
      accessTokenLifespan: 30 * 60,
    }
  );

  const users: KeycloakUser[] = [
    {
      username: 'admin',
      email: 'admin@applicants.com',
      firstName: 'Platform Admin',
      lastName: 'User',
      attributes: {
        country: 'Dominican Republic',
        phoneNumber: '8295808091',
        phoneNumberVerified: 'true',
        birthdate: '1990-01-13',
        locality: 'Santo Domingo',
        region: 'Distrito Nacional',
        street: 'Calle 1',
        postal_code: '10101',
        gender: Gender.Male,
        picture: 'http://localhost:3000/assets/images/avatar.png',
        formatted: 'Santo Domingo, Distrito Nacional, Calle 1',
        role: Role.PlatformAdmin,
      },
    },
    {
      username: 'hr_manager',
      email: 'hr_manager@applicants.com',
      firstName: 'HR Manager',
      lastName: 'User',
      attributes: {
        country: 'Dominican Republic',
        phoneNumber: '8295808092',
        phoneNumberVerified: 'true',
        birthdate: '1990-01-01',
        locality: 'Santiago',
        region: 'Gurabo',
        street: 'Calle 1',
        postal_code: '51000',
        gender: Gender.Male,
        picture: 'http://localhost:3000/assets/images/avatar.png',
        formatted: 'Santo Domingo, Distrito Nacional, Calle 1',
        role: Role.HumanResourcesManager,
      },
    },
    {
      username: 'hr_recruiter',
      email: 'hr_recruiter@applicants.com',
      firstName: 'HR Recruiter',
      lastName: 'User',
      attributes: {
        country: 'Dominican Republic',
        phoneNumber: '8295808093',
        phoneNumberVerified: 'true',
        birthdate: '1995-01-01',
        locality: 'Maria Trinidad Sanchez',
        region: 'Cabrera',
        street: 'Calle 1',
        postal_code: '52000',
        gender: Gender.Female,
        picture: 'http://localhost:3000/assets/images/avatar.png',
        formatted: 'Maria Trinidad Sanchez, Cabrera, Calle 1',
        role: Role.HumanResourcesRecruiter,
      },
    },
    {
      username: 'hr_assistant',
      email: 'hr_assistant@applicants.com',
      firstName: 'HR Assistant',
      lastName: 'User',
      attributes: {
        country: 'Dominican Republic',
        phoneNumber: '8295808094',
        phoneNumberVerified: 'true',
        birthdate: '1996-12-11',
        locality: 'La Vega',
        region: 'Constanza',
        street: 'Calle 3',
        postal_code: '51000',
        gender: Gender.Female,
        picture: 'http://localhost:3000/assets/images/avatar.png',
        formatted: 'La Vega, Constanza, Calle 3',
        role: Role.HumanResourcesEmployee,
      },
    },
  ];

  const password = DEV_PASSWORD || 'admin';

  try {
    for (const p of users) {
      const attrs = p.attributes;
      const user = await kcClient.users.create({
        realm: talents.realm,
        username: p.username,
        email: p.email,
        enabled: true,
        emailVerified: true,
        firstName: p.firstName,
        lastName: p.lastName,
        credentials: [
          {
            type: 'password',
            value: password,
            temporary: false,
          },
        ],
        attributes: {
          country: attrs.country,
          phoneNumber: attrs.phoneNumber,
          phoneNumberVerified: attrs.phoneNumberVerified,
          birthdate: attrs.birthdate,
          locality: attrs.locality,
          region: attrs.region,
          street: attrs.street,
          postal_code: attrs.postal_code,
          gender: attrs.gender,
          picture: attrs.picture,
          formatted: attrs.formatted,
        },
      });

      const userRoleMapping = {
        name: attrs.role,
        description: `\$\{${attrs.role}\}`,
        id: allRolesMap[attrs.role].id,
      };

      if ([Role.PlatformUser, Role.PlatformAdmin, Role.PlatformDeveloper].includes(attrs.role as Role)) {
        await kcClient.users.addRealmRoleMappings({
          realm: talents.realm,
          id: user.id,
          roles: [userRoleMapping],
        });
      } else {
        await kcClient.users.addClientRoleMappings({
          realm: talents.realm,
          id: user.id,
          roles: [userRoleMapping],
          clientUniqueId: webClientId,
        });
      }
    }
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }
};

setupKeycloak().then(() => console.log('Keycloak entities created'));
