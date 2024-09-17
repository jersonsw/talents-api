import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

const authOpts: SecuritySchemeObject = {
  type: 'oauth2',
  flows: {
    password: {
      tokenUrl: 'http://localhost:8080/realms/talents/protocol/openid-connect/token',
      authorizationUrl: 'http://localhost:8080/realms/talents/protocol/openid-connect/auth',
      refreshUrl: 'http://localhost:8080/realms/talents/protocol/openid-connect/token',
      scopes: {}
    }
  },
  description: 'Enter the access token',
  bearerFormat: 'JWT',
  in: 'body',
  name: 'JWT',
  scheme: 'bearer'
};

export const configSwagger = async (app: INestApplication, config: ConfigService) => {
  const apiName = config.get('API_NAME');
  const apiDescription = config.get('API_DESCRIPTION');
  const apiVersion = config.get('API_VERSION');
  const keycloakClientId = config.get('KC_TALENTS_ADMIN_CLIENT_ID');
  const keycloakSecret = config.get('KC_TALENTS_ADMIN_SECRET');

  const options = new DocumentBuilder()
    .setTitle(apiName)
    .setDescription(apiDescription)
    .setContact('Jerson Peña', 'https://github.com/jersonsw', 'jersonsw@outlook.com')
    .setVersion(apiVersion)
    .addBearerAuth(authOpts)
    .addTag('API Documentation')
    .build();

  const internal = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/docs', app, internal, {
    customSiteTitle: apiName,
    swaggerOptions: {
      persistAuthorization: true,
      initOAuth: {
        clientId: keycloakClientId,
        clientSecret: keycloakSecret,
        scopes: ['openid', 'roles', 'email', 'address', 'phone'],
        scopeSeparator: ' '
      }
    }
  });
};
