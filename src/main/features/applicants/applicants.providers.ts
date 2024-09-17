import { Provider } from '@nestjs/common';
import { CreateApplicantsUseCase } from '../../../core/features/applicants/use-cases/create-applicants.use-case';
import { LoggingServiceToken } from '../../commons/logging/logging.providers';
import { LoggingService } from '../../../core/commons/logging';
import { ApplicantsRepositoryImpl } from '../../../adapters/data/repositories/applicants.repository.impl';
import { ApplicantsRepository } from '../../../core/features/applicants/repositories/applicants.repository';
import { GetApplicantsUseCase } from '../../../core/features/applicants/use-cases/get-applicants.use-case';
import { UpdateApplicantsUseCase } from '../../../core/features/applicants/use-cases/update-applicants.use-case';

export const applicantsProviders: Provider[] = [
  {
    provide: CreateApplicantsUseCase,
    useFactory: (logger: LoggingService, repository: ApplicantsRepository) => {
      return new CreateApplicantsUseCase(logger, repository);
    },
    inject: [LoggingServiceToken, ApplicantsRepositoryImpl],
  },
  {
    provide: GetApplicantsUseCase,
    useFactory: (repository: ApplicantsRepository) => {
      return new GetApplicantsUseCase(repository);
    },
    inject: [ApplicantsRepositoryImpl],
  },
  {
    provide: UpdateApplicantsUseCase,
    useFactory: (logger: LoggingService, repository: ApplicantsRepository) => {
      return new UpdateApplicantsUseCase(logger, repository);
    },
    inject: [LoggingServiceToken, ApplicantsRepositoryImpl],
  },
];
