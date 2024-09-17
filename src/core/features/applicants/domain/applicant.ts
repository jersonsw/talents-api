import { Education } from './education';
import { WorkExperience } from './work-experience';
import { Gender } from '../../users/enums/gender';
import { ApplicantStatus } from '../enums/applicant-status';
import { User } from '../../users/domain/user';

export class Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: Gender;
  birthDate: Date;
  linkedinProfile: string;
  githubProfile: string;
  status: ApplicantStatus;
  statusReason: string;
  educations: Education[];
  workExperiences: WorkExperience[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  updatedBy: User;

  static builder(): ApplicantBuilder {
    return new ApplicantBuilder();
  }
}

class ApplicantBuilder {
  private readonly entity: Applicant;

  constructor() {
    this.entity = new Applicant();
  }

  withId(id: string): ApplicantBuilder {
    this.entity.id = id;
    return this;
  }

  withFirstName(firstName: string): ApplicantBuilder {
    this.entity.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): ApplicantBuilder {
    this.entity.lastName = lastName;
    return this;
  }

  withEmail(email: string): ApplicantBuilder {
    this.entity.email = email;
    return this;
  }

  withMobileNumber(mobileNumber: string): ApplicantBuilder {
    this.entity.mobileNumber = mobileNumber;
    return this;
  }

  withGender(gender: Gender): ApplicantBuilder {
    this.entity.gender = gender;
    return this;
  }

  withBirthDate(birthDate: Date): ApplicantBuilder {
    this.entity.birthDate = birthDate;
    return this;
  }

  withLinkedinProfile(linkedinProfile: string): ApplicantBuilder {
    this.entity.linkedinProfile = linkedinProfile;
    return this;
  }

  withGithubProfile(githubProfile: string): ApplicantBuilder {
    this.entity.githubProfile = githubProfile;
    return this;
  }

  withStatus(status: ApplicantStatus) {
    this.entity.status = status;
    return this;
  }

  withStatusReason(statusReason: string): ApplicantBuilder {
    this.entity.statusReason = statusReason;
    return this;
  }

  withWorkExperiences(workExperiences: WorkExperience[]): ApplicantBuilder {
    this.entity.workExperiences = workExperiences;
    return this;
  }

  withEducations(educations: Education[]): ApplicantBuilder {
    this.entity.educations = educations;
    return this;
  }

  withCreatedBy(createdBy: User): ApplicantBuilder {
    this.entity.createdBy = createdBy;
    return this;
  }

  withUpdatedBy(updatedBy: User): ApplicantBuilder {
    this.entity.updatedBy = updatedBy;
    return this;
  }

  withCreatedAt(createdAt: Date): ApplicantBuilder {
    this.entity.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): ApplicantBuilder {
    this.entity.updatedAt = updatedAt;
    return this;
  }

  build(): Applicant {
    return this.entity;
  }
}
