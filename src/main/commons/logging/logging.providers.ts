import { ConfigService } from '@nestjs/config';
import { FactoryProvider } from '@nestjs/common';
import { LoggingServiceAdapter } from './logging.service.adapter';

export const LoggingServiceToken = Symbol('LOGGING_SERVICE');
export const loggingProviders: FactoryProvider[] = [
  {
    provide: LoggingServiceToken,
    useFactory: (config: ConfigService) => {
      return new LoggingServiceAdapter(config);
    },
    inject: [ConfigService],
  },
];
