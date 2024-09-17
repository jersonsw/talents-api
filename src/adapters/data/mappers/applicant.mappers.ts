import { Applicant, Education, WorkExperience } from '../../../core/features/applicants/domain';
import { ApplicantEntity, EducationEntity, WorkExperienceEntity } from '../entities';
import { LoadRelation } from '../../../core/commons/utils/load-relation';
import { mapUserToDbEntity, mapUserToDomain } from './user.mappers';

export const mapEducationToDomain = async (education: EducationEntity): Promise<Education> => {
  const builder = Education.builder();

  if (education.createdBy) {
    const createdByEntity = await education.createdBy;
    const createdBy = await mapUserToDomain(createdByEntity);

    builder.withCreatedBy(createdBy);
  }

  return builder
    .withId(education.id)
    .withDegree(education.degree)
    .withFieldOfStudy(education.fieldOfStudy)
    .withInstitutionName(education.institutionName)
    .withStartDate(education.startDate)
    .withEndDate(education.endDate)
    .withCreatedAt(education.createdAt)
    .withUpdatedAt(education.updatedAt)
    .build();
};

export const mapEducationToEntity = (education: Education): EducationEntity => {
  return EducationEntity.builder()
    .withId(education.id)
    .withDegree(education.degree)
    .withFieldOfStudy(education.fieldOfStudy)
    .withInstitutionName(education.institutionName)
    .withStartDate(education.startDate)
    .withEndDate(education.endDate)
    .withCreatedBy(mapUserToDbEntity(education.createdBy))
    .build();
};

export const mapWorkExperienceToDomain = async (experience: WorkExperienceEntity): Promise<WorkExperience> => {
  const builder = WorkExperience.builder();

  if (experience.createdBy) {
    const createdByEntity = await experience.createdBy;
    const createdBy = await mapUserToDomain(createdByEntity);

    builder.withCreatedBy(createdBy);
  }

  return builder
    .withId(experience.id)
    .withJobTitle(experience.jobTitle)
    .withDescription(experience.description)
    .withCompanyName(experience.companyName)
    .withCountryName(experience.countryName)
    .withRemote(experience.remote)
    .withStartDate(experience.startDate)
    .withEndDate(experience.endDate)
    .withCreatedAt(experience.createdAt)
    .withUpdatedAt(experience.updatedAt)
    .build();
};

export const mapWorkExperienceToEntity = (experience: WorkExperience): WorkExperienceEntity => {
  const builder = WorkExperienceEntity.builder();

  if (experience.createdBy) {
    const createdBy = mapUserToDbEntity(experience.createdBy);
    builder.withCreatedBy(createdBy);
  }

  return builder
    .withId(experience.id)
    .withJobTitle(experience.jobTitle)
    .withDescription(experience.description)
    .withCompanyName(experience.companyName)
    .withCountryName(experience.countryName)
    .withRemote(experience.remote)
    .withStartDate(experience.startDate)
    .withEndDate(experience.endDate)
    .withCreatedAt(experience.createdAt)
    .withUpdatedAt(experience.updatedAt)
    .build();
};

export const mapApplicantToDomain = async (
  applicant: ApplicantEntity,
  load?: LoadRelation<ApplicantEntity>
): Promise<Applicant> => {
  const builder = Applicant.builder();

  if (load?.educations) {
    const educations = await applicant.educations;
    const mapped = await Promise.all(educations.map((e) => mapEducationToDomain(e)));

    builder.withEducations(mapped);
  }

  if (load?.workExperiences) {
    const workExperiences = await applicant.workExperiences;
    const mapped = await Promise.all(workExperiences.map((e) => mapWorkExperienceToDomain(e)));

    builder.withWorkExperiences(mapped);
  }

  if (load?.createdBy) {
    const createdBy = await applicant.createdBy;
    builder.withCreatedBy(await mapUserToDomain(createdBy));
  }

  if (load?.updatedBy) {
    const updatedBy = await applicant.updatedBy;
    builder.withUpdatedBy(await mapUserToDomain(updatedBy));
  }

  return builder
    .withId(applicant.id)
    .withEmail(applicant.email)
    .withFirstName(applicant.firstName)
    .withLastName(applicant.lastName)
    .withMobileNumber(applicant.mobileNumber)
    .withGithubProfile(applicant.githubProfile)
    .withLinkedinProfile(applicant.linkedinProfile)
    .withBirthDate(applicant.birthDate)
    .withGender(applicant.gender)
    .withStatus(applicant.status)
    .withStatusReason(applicant.statusReason)
    .withCreatedAt(applicant.createdAt)
    .withUpdatedAt(applicant.updatedAt)
    .build();
};

export const mapApplicantToEntity = (applicant: Applicant): ApplicantEntity => {
  const builder = ApplicantEntity.builder();

  if (applicant.workExperiences) {
    const workExperiences = applicant.workExperiences.map((e) => {
      e.applicant = applicant;
      return mapWorkExperienceToEntity(e);
    });

    builder.withWorkExperiences(workExperiences);
  }

  if (applicant.educations) {
    const educations = applicant.educations.map((e) => {
      e.applicant = applicant;
      return mapEducationToEntity(e);
    });

    builder.withEducations(educations);
  }

  if (applicant.createdBy) {
    const createdBy = mapUserToDbEntity(applicant.createdBy);

    builder.withCreatedBy(createdBy);
  }

  if (applicant.updatedBy) {
    const updatedBy = mapUserToDbEntity(applicant.updatedBy);

    builder.withUpdatedBy(updatedBy);
  }

  return builder
    .withId(applicant.id)
    .withEmail(applicant.email)
    .withFirstName(applicant.firstName)
    .withLastName(applicant.lastName)
    .withMobileNumber(applicant.mobileNumber)
    .withGithubProfile(applicant.githubProfile)
    .withLinkedinProfile(applicant.linkedinProfile)
    .withBirthDate(applicant.birthDate)
    .withGender(applicant.gender)
    .withStatus(applicant.status)
    .withStatusReason(applicant.statusReason)
    .build();
};
