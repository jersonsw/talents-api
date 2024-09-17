import { ApplicantStatus } from '../enums/applicant-status';
import { Gender } from '../../users/enums/gender';

export type ApplicantsFilterParams = {
  statuses: ApplicantStatus[];
  startDate: string;
  endDate: string;
  gender: Gender;
  term: string;
};
