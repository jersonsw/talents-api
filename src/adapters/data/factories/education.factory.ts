import { setSeederFactory } from 'typeorm-extension';
import { fakeEducation } from '../fakers';
import { EducationEntity } from '../entities';
import { mapEducationToEntity } from '../mappers/applicant.mappers';

export default setSeederFactory(EducationEntity, () => {
  return mapEducationToEntity(fakeEducation());
});
