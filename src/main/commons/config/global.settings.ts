import {
  INestApplication,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { LoggingServiceToken } from '../logging/logging.providers';
import { Environment } from './environment';
import { mapValidationErrors } from '../../../adapters/http/commons/exceptions/exceptions.helper';
import { HttpExceptionHandler } from '../../../adapters/http/commons/exceptions/http-exception.handler';

export const setGlobalSettings = async (app: INestApplication) => {
  const config = app.get(ConfigService);
  const apiPrefix = config.get('API_PREFIX', 'api');
  const env = config.get('NODE_ENV', 'dev');
  const defaultVersion = config.get('API_VERSION', 1);
  const loggingService = app.get(LoggingServiceToken);

  app.enableCors({ origin: true, credentials: true });
  app.enableShutdownHooks();
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalFilters(new HttpExceptionHandler(loggingService));
  app.use(cookieParser());
  app.enableVersioning({ type: VersioningType.URI, defaultVersion });
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: env === Environment.DEV,
      transform: true,
      forbidUnknownValues: false,
      validationError: { target: false, value: true },
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrors = mapValidationErrors(errors);

        throw new UnprocessableEntityException({
          validationErrors,
          message: 'Se encontraron errores al validar los datos',
        });
      },
    })
  );
};
