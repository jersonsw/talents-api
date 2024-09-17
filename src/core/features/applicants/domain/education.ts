import { Applicant } from './applicant';
import { User } from '../../users/domain/user';

export class Education {
  id: number;
  institutionName: string;
  degree: string;
  fieldOfStudy?: string;
  applicant: Applicant;
  createdBy: User;
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;

  static builder(): EducationBuilder {
    return new EducationBuilder();
  }
}

class EducationBuilder {
  private readonly entity: Education;

  constructor() {
    this.entity = new Education();
  }

  withId(id: number): EducationBuilder {
    this.entity.id = id;
    return this;
  }

  withInstitutionName(institutionName: string): EducationBuilder {
    this.entity.institutionName = institutionName;
    return this;
  }

  withDegree(degree: string): EducationBuilder {
    this.entity.degree = degree;
    return this;
  }

  withFieldOfStudy(fieldOfStudy: string): EducationBuilder {
    this.entity.fieldOfStudy = fieldOfStudy;
    return this;
  }

  withApplicant(applicant: Applicant): EducationBuilder {
    this.entity.applicant = applicant;
    return this;
  }

  withCreatedBy(createdBy: User): EducationBuilder {
    this.entity.createdBy = createdBy;
    return this;
  }

  withStartDate(startDate: Date): EducationBuilder {
    this.entity.startDate = startDate;
    return this;
  }

  withEndDate(endDate: Date): EducationBuilder {
    this.entity.endDate = endDate;
    return this;
  }

  withCreatedAt(createdAt: Date): EducationBuilder {
    this.entity.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): EducationBuilder {
    this.entity.updatedAt = updatedAt;
    return this;
  }

  build(): Education {
    return this.entity;
  }
}
