import { faker } from '@faker-js/faker';
import { randomUUID } from 'node:crypto';
import { User } from '../../../core/features/users/domain/user';
import { UserLocale } from '../../../core/features/users/enums/user-locale';
import { DocType } from '../../../core/features/users/enums/doc-type';
import { Role } from '../../../core/features/users/enums/role';
import { UserStatus } from '../../../core/features/users/enums/user-status';
import * as dayjs from 'dayjs';
import { Gender } from '../../../core/features/users/enums/gender';
import { Applicant, Education, WorkExperience } from '../../../core/features/applicants/domain';
import { ApplicantStatus } from '../../../core/features/applicants/enums/applicant-status';

const { internet, person, image, string, company, date, helpers, number, location } = faker;

const degrees = [
  'Bachelor of Arts',
  'Bachelor of Science',
  'Master of Arts',
  'Master of Science',
  'Doctor of Philosophy',
  'Associate Degree',
  'MBA',
  'MFA',
  'MD',
  'JD',
];

const fieldsOfStudy = [
  'Computer Science',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Engineering',
  'Economics',
  'Psychology',
  'Philosophy',
  'Literature',
  'Art History',
  'Business Administration',
  'Political Science',
  'Sociology',
  'Education',
];

export const fakeDominicanPhoneNumber = (): string => helpers.fromRegExp(/8[024]9[0-9]{7}/);

export const fakeDocumentId = (docType: DocType): string => {
  if (docType === DocType.NationalId) return string.numeric(11);

  const letters = string.alpha({ length: 2, casing: 'upper' });
  const numbers = string.numeric(7);

  return `${letters}${numbers}`;
};

export const genPastDate = (minYearsBack: number, maxYearsBack: number) => {
  return date.past({ years: number.int({ min: minYearsBack, max: maxYearsBack }) });
};

export const getRandomDegree = () => {
  return helpers.arrayElement(degrees);
};

export const getRandomFieldOfStudy = () => {
  return helpers.arrayElement(fieldsOfStudy);
};

export const fakeUser = (user?: Partial<User>): User => {
  const firstName = user?.firstName || person.firstName();
  const lastName = user?.lastName || person.lastName();
  const username = user?.username || internet.userName({ firstName, lastName });
  const roles = user?.roles?.length ? user.roles : [Role.PlatformAdmin];
  const docType = user?.documentType || helpers.enumValue(DocType);
  const documentId = user?.documentId || fakeDocumentId(docType);
  const birthDate = user?.birthDate || dayjs(genPastDate(20, 70)).format('YYYY-MM-DD');

  return User.builder()
    .withId(user?.id || randomUUID())
    .withUsername(username)
    .withFirstName(firstName)
    .withLastName(lastName)
    .withLocale(user?.locale || UserLocale.Es)
    .withEmail(user?.email || internet.email())
    .withEmailVerified(user?.emailVerified || true)
    .withPicture(user?.picture || image.avatarLegacy())
    .withZoneInfo(user?.zoneInfo || 'America/Santo_Domingo')
    .withPhoneNumber(user?.phoneNumber || fakeDominicanPhoneNumber())
    .withDocumentType(docType)
    .withDocumentId(documentId)
    .withStatus(user?.status || UserStatus.Active)
    .withBirthDate(birthDate)
    .withGender(user?.gender || helpers.enumValue(Gender))
    .withPhoneNumberVerified(user?.phoneNumberVerified || true)
    .withRoles(roles as Role[])
    .build();
};

export const fakeEducation = (education?: Partial<Education>): Education => {
  return Education.builder()
    .withId(education?.id || number.int({ min: 1, max: 1000 }))
    .withDegree(education?.degree || getRandomDegree())
    .withInstitutionName(education?.institutionName || company.name())
    .withStartDate(genPastDate(10, 20))
    .withEndDate(genPastDate(5, 10))
    .withFieldOfStudy(education?.fieldOfStudy || getRandomFieldOfStudy())
    .withCreatedAt(education?.createdAt || new Date())
    .withUpdatedAt(education?.updatedAt || new Date())
    .withCreatedBy(education?.createdBy || fakeUser())
    .build();
};

export const fakeWorkExperience = (workExperience?: Partial<WorkExperience>): WorkExperience => {
  return WorkExperience.builder()
    .withId(workExperience?.id || number.int({ min: 1, max: 1000000 }))
    .withCompanyName(workExperience?.companyName || company.name())
    .withJobTitle(workExperience?.jobTitle || person.jobTitle())
    .withDescription(workExperience?.description || person.jobDescriptor())
    .withStartDate(genPastDate(10, 20))
    .withEndDate(genPastDate(5, 10))
    .withCreatedAt(workExperience?.createdAt || new Date())
    .withUpdatedAt(workExperience?.updatedAt || new Date())
    .withRemote(workExperience?.remote || helpers.arrayElement([true, false]))
    .withCountryName(workExperience?.countryName || location.country())
    .withCreatedBy(workExperience?.createdBy || fakeUser())
    .build();
};

export const fakeApplicant = (applicant?: Partial<Applicant>): Applicant => {
  const gender = applicant?.gender || helpers.arrayElement(Object.values(Gender));
  const sex = gender === Gender.Female ? 'female' : 'male';

  return Applicant.builder()
    .withId(applicant?.id || randomUUID())
    .withEmail(applicant?.email || internet.email())
    .withFirstName(applicant?.firstName || person.firstName(sex))
    .withLastName(applicant?.lastName || person.lastName(sex))
    .withMobileNumber(applicant?.mobileNumber || fakeDominicanPhoneNumber())
    .withGithubProfile(applicant?.githubProfile || internet.url())
    .withLinkedinProfile(applicant?.linkedinProfile || internet.url())
    .withBirthDate(applicant?.birthDate || genPastDate(20, 40))
    .withGender(gender)
    .withStatus(applicant?.status || ApplicantStatus.Pending)
    .build();
};
