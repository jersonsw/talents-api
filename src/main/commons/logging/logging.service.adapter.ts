import { ConfigService } from '@nestjs/config';
import { createLogger, format, Logger, transports } from 'winston';
import { Environment } from '../config/environment';
import { LoggingService } from '../../../core/commons/logging';

export class LoggingServiceAdapter implements LoggingService {
  private logger: Logger;
  private readonly env: Environment;

  constructor(private config: ConfigService) {
    const service = config.get('API_NAME');
    this.env = config.get<Environment>('NODE_ENV');
    const level = config.get('LOGGING_LEVEL') || 'info';

    this.logger = createLogger({
      level,
      defaultMeta: { service },
      silent: this.env === Environment.TEST,
    });

    this.setTransports();
  }

  debug(message: any, ...optionalParams: any[]): any {
    this.logger.debug(message, optionalParams);
  }

  error(message: any, ...optionalParams: any[]): any {
    this.logger.error(message, optionalParams);
  }

  info(message: any, ...optionalParams: any[]): any {
    this.logger.info(message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): any {
    this.logger.verbose(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): any {
    this.logger.warn(message, optionalParams);
  }

  private setTransports(): void {
    const useFile = this.config.get<boolean>('LOGGING_ENABLE_FILE_TRANSPORT');
    const useConsole = this.config.get<boolean>('LOGGING_ENABLE_CONSOLE_TRANSPORT');

    if (useFile && this.env === Environment.DEV) {
      const filename = this.config.get('LOGGING_FILE_PATH');
      this.logger.add(
        new transports.File({
          filename,
          zippedArchive: false,
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.errors({ stack: true }),
            format.json()
          ),
        })
      );
    }

    if (useConsole || this.env === Environment.PROD) {
      this.logger.add(
        new transports.Console({
          stderrLevels: ['warn', 'error'],
          silent: this.env === Environment.TEST,
          format: format.combine(format.timestamp(), format.splat(), format.errors({ stack: true })),
        })
      );
    }
  }
}
