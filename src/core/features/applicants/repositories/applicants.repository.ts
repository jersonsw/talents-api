import { BaseRepository } from '../../../commons/base.repository';
import { Applicant } from '../domain';

export interface ApplicantsRepository extends BaseRepository<Applicant> {
  create(applicant: Applicant): Promise<Applicant>;
  update(applicant: Applicant): Promise<Applicant>;
}
