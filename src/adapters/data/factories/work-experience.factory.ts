import { setSeederFactory } from 'typeorm-extension';
import { fakeWorkExperience } from '../fakers';
import { WorkExperienceEntity } from '../entities';
import { mapWorkExperienceToEntity } from '../mappers/applicant.mappers';

export default setSeederFactory(WorkExperienceEntity, () => {
  return mapWorkExperienceToEntity(fakeWorkExperience());
});
