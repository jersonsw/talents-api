import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { BaseSeed } from './base-seed';
import { ApplicantEntity, EducationEntity, UserEntity, WorkExperienceEntity } from '../entities';

export default class ApplicantsSeeder extends BaseSeed implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const usersRepository = dataSource.getRepository(UserEntity);
    const users = await usersRepository.find();
    const applicantFactory = factoryManager.get(ApplicantEntity);
    const educationFactory = factoryManager.get(EducationEntity);
    const experienceFactory = factoryManager.get(WorkExperienceEntity);

    for (const user of users) {
      const applicants = await applicantFactory.saveMany(5, { createdBy: Promise.resolve(user) });
      for (const a of applicants) {
        const applicant = Promise.resolve(a);
        const createdBy = Promise.resolve(user);

        experienceFactory.saveMany(2, { applicant, createdBy });
        educationFactory.saveMany(2, { applicant, createdBy });
      }
    }
  }
}
