import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { LoggingModule } from './logging/logging.module';
import { CustomEntityManager } from '../../adapters/data/custom-entity.manager';

@Module({
  imports: [ConfigModule, LoggingModule, HealthModule],
  exports: [ConfigModule, LoggingModule, HealthModule, CustomEntityManager],
  providers: [CustomEntityManager],
})
export class CommonsModule {}
