import { ApplicantsRepository } from '../repositories/applicants.repository';
import { Applicant } from '../domain';
import { LoggingService } from '../../../commons/logging';
import { AlreadyExistsException } from '../../../commons/exceptions';
import { ErrorType } from '../../../commons/enums';
import { ApplicantStatus } from '../enums/applicant-status';

export class CreateApplicantsUseCase {
  constructor(private readonly logger: LoggingService, private readonly repository: ApplicantsRepository) {}

  async create(applicant: Applicant): Promise<Applicant> {
    const existing = await this.repository.findOneBy({ email: applicant.email });

    if (existing) {
      this.logger.error(`Applicant already exists with email: ${applicant.email}`);

      throw new AlreadyExistsException('Applicant already exists', ErrorType.ApplicantAlreadyExists);
    }

    applicant.status = ApplicantStatus.Pending;
    applicant.statusReason = 'Applicant created and pending for review';

    return this.repository.create(applicant);
  }
}
