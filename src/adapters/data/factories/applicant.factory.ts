import { setSeederFactory } from 'typeorm-extension';
import { fakeApplicant } from '../fakers';
import { ApplicantEntity } from '../entities';
import { mapApplicantToEntity } from '../mappers/applicant.mappers';

export default setSeederFactory(ApplicantEntity, () => {
  return mapApplicantToEntity(fakeApplicant());
});
