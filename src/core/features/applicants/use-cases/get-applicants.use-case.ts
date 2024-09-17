import { Applicant } from '../domain';
import { ApplicantsRepository } from '../repositories/applicants.repository';
import { ResourceNotFoundException } from '../../../commons/exceptions/resource-not-found.exception';
import { ErrorType } from '../../../commons/enums';
import { Pagination, PaginationRequest } from '../../../commons/pagination';
import { ApplicantsFilterParams } from '../types/applicants-filter-params';

export class GetApplicantsUseCase {
  constructor(private readonly repository: ApplicantsRepository) {}

  async findById(id: string): Promise<Applicant> {
    const applicant = await this.repository.findById(id);

    if (!applicant) {
      throw new ResourceNotFoundException('Applicant not found', ErrorType.ApplicantNotFound);
    }

    return applicant;
  }

  async findMany(pag: PaginationRequest<ApplicantsFilterParams>): Promise<Pagination<Applicant>> {
    return this.repository.findMany(pag);
  }
}
