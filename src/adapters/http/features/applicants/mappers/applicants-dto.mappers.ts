import { Applicant, Education, WorkExperience } from '../../../../../core/features/applicants/domain';
import { ApplicantReqDto } from '../dtos/applicant-req.dto';
import * as dayjs from 'dayjs';
import { EducationReqDto } from '../dtos/education-req.dto';
import { ExperienceReqDto } from '../dtos/experience-req.dto';
import { User } from '../../../../../core/features/users/domain/user';
import { ApplicantUpdateStatusReqDto } from '../dtos/applicant-update-status-req.dto';

export const mapApplicantReqToDomain = (dto: ApplicantReqDto, user: User, id?: string): Applicant => {
  const educations = dto.educations.map((education) => mapEducationReqToDomain(education, user));
  const experiences = dto.workExperiences.map((experience) => mapExperienceReqToDomain(experience, user));

  return Applicant.builder()
    .withId(id)
    .withFirstName(dto.firstName)
    .withLastName(dto.lastName)
    .withEmail(dto.email)
    .withStatus(dto.status)
    .withStatusReason(dto.statusReason)
    .withMobileNumber(dto.mobileNumber)
    .withGithubProfile(dto.githubProfile)
    .withLinkedinProfile(dto.linkedinProfile)
    .withGender(dto.gender)
    .withBirthDate(dayjs(dto.birthDate).toDate())
    .withEducations(educations)
    .withWorkExperiences(experiences)
    .withCreatedBy(user)
    .build();
};

export const mapApplicationUpdateStatusReqToDomain = (
  dto: ApplicantUpdateStatusReqDto,
  user: User,
  id: string
): Applicant => {
  return Applicant.builder()
    .withId(id)
    .withStatus(dto.status)
    .withStatusReason(dto.statusReason)
    .withUpdatedBy(user)
    .build();
};

export const mapEducationReqToDomain = (dto: EducationReqDto, user: User, id?: number): Education => {
  return Education.builder()
    .withId(id)
    .withDegree(dto.degree)
    .withFieldOfStudy(dto.fieldOfStudy)
    .withInstitutionName(dto.institutionName)
    .withStartDate(dayjs(dto.startDate).toDate())
    .withEndDate(dayjs(dto.endDate).toDate())
    .withCreatedBy(user)
    .build();
};

export const mapExperienceReqToDomain = (dto: ExperienceReqDto, user: User, id?: number): WorkExperience => {
  return WorkExperience.builder()
    .withId(id)
    .withCompanyName(dto.companyName)
    .withJobTitle(dto.jobTitle)
    .withDescription(dto.description)
    .withStartDate(dayjs(dto.startDate).toDate())
    .withEndDate(dayjs(dto.endDate).toDate())
    .withRemote(dto.remote)
    .withCountryName(dto.countryName)
    .withCreatedBy(user)
    .build();
};
