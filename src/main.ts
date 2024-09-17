import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { MainModule } from './main/main.module';
import { setGlobalSettings } from './main/commons/config/global.settings';
import { configSwagger } from './main/commons/config/swagger.config';

async function bootstrap(): Promise<string> {
  const app = await NestFactory.create(MainModule);
  const config = app.get(ConfigService);
  const port = config.get('API_PORT', 8080);
  await setGlobalSettings(app);
  await configSwagger(app, config);
  await app.listen(port);

  return `Application running on port ${port}`;
}

bootstrap().then((resp) => Logger.log(resp, 'Main'));
