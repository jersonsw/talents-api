import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { authProviders } from './auth.providers';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [...authProviders],
  exports: [...authProviders],
})
export class AuthModule {}
