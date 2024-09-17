import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { loggingProviders } from './logging.providers';

@Module({
  imports: [ConfigModule],
  providers: loggingProviders,
  exports: [...loggingProviders],
})
export class LoggingModule {}
