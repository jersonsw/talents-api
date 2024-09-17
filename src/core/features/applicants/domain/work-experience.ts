import { Applicant } from './applicant';
import { User } from '../../users/domain/user';

export class WorkExperience {
  id: number;
  jobTitle: string;
  companyName: string;
  countryName: string;
  remote: boolean;
  description: string;
  startDate: Date;
  endDate?: Date;
  applicant: Applicant;
  createdBy: User;
  createdAt: Date;
  updatedAt: Date;

  static builder(): WorkExperienceBuilder {
    return new WorkExperienceBuilder();
  }
}

class WorkExperienceBuilder {
  private readonly entity: WorkExperience;

  constructor() {
    this.entity = new WorkExperience();
  }

  withId(id: number): WorkExperienceBuilder {
    this.entity.id = id;
    return this;
  }

  withJobTitle(jobTitle: string): WorkExperienceBuilder {
    this.entity.jobTitle = jobTitle;
    return this;
  }

  withCompanyName(companyName: string): WorkExperienceBuilder {
    this.entity.companyName = companyName;
    return this;
  }

  withCountryName(countryName: string): WorkExperienceBuilder {
    this.entity.countryName = countryName;
    return this;
  }

  withRemote(remote: boolean): WorkExperienceBuilder {
    this.entity.remote = remote;
    return this;
  }

  withDescription(description: string): WorkExperienceBuilder {
    this.entity.description = description;
    return this;
  }

  withApplicant(applicant: Applicant): WorkExperienceBuilder {
    this.entity.applicant = applicant;
    return this;
  }

  withCreatedBy(createdBy: User): WorkExperienceBuilder {
    this.entity.createdBy = createdBy;
    return this;
  }

  withStartDate(startDate: Date): WorkExperienceBuilder {
    this.entity.startDate = startDate;
    return this;
  }

  withEndDate(endDate: Date): WorkExperienceBuilder {
    this.entity.endDate = endDate;
    return this;
  }

  withCreatedAt(createdAt: Date): WorkExperienceBuilder {
    this.entity.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): WorkExperienceBuilder {
    this.entity.updatedAt = updatedAt;
    return this;
  }

  build(): WorkExperience {
    return this.entity;
  }
}
