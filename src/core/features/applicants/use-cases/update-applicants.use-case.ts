import { ApplicantsRepository } from '../repositories/applicants.repository';
import { Applicant } from '../domain';
import { LoggingService } from '../../../commons/logging';
import { ResourceNotFoundException } from '../../../commons/exceptions/resource-not-found.exception';

export class UpdateApplicantsUseCase {
  constructor(private readonly logger: LoggingService, private readonly repository: ApplicantsRepository) {}

  async update(applicant: Applicant): Promise<Applicant> {
    const existing = await this.repository.findById(applicant.id);

    if (!existing) {
      this.logger.error(`Applicant with id ${applicant.id} does not exist`);

      throw new ResourceNotFoundException('The applicant you are trying to update does not exist');
    }

    return this.repository.update(applicant);
  }

  async updateStatus(applicant: Applicant): Promise<Applicant> {
    const existing = await this.repository.findById(applicant.id);

    if (!existing) {
      this.logger.error(`Applicant with id ${applicant.id} does not exist`);

      throw new ResourceNotFoundException('The applicant you are trying to update does not exist');
    }

    const { status, statusReason, updatedBy } = applicant;
    const toUpdate = { ...existing, status, statusReason, updatedBy };

    return this.repository.update(toUpdate);
  }
}
