import { Module } from '@nestjs/common';
import { applicantsProviders } from './applicants.providers';
import { CommonsModule } from '../../commons/commons.module';
import { ApplicantsRepositoryImpl } from '../../../adapters/data/repositories/applicants.repository.impl';
import { ApplicantsController } from '../../../adapters/http/features/applicants/controllers/applicants.controller';

@Module({
  imports: [CommonsModule],
  providers: [...applicantsProviders, ApplicantsRepositoryImpl],
  exports: [...applicantsProviders, ApplicantsRepositoryImpl],
  controllers: [ApplicantsController],
})
export class ApplicantsModule {}
