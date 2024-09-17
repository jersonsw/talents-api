import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { defaultConnection } from './commons/config/typeorm.config';
import { HttpResponseInterceptor } from '../adapters/http/interceptors/response.interceptor';
import { ApplicantsModule } from './features/applicants/applicants.module';
import { AuthModule } from './features/auth/auth.module';

const envFilePath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath }),
    TypeOrmModule.forRoot(defaultConnection),
    ApplicantsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpResponseInterceptor,
    },
  ],
})
export class MainModule {}
