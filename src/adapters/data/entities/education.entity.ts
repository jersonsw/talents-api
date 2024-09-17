import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApplicantEntity } from './applicant.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'educations' })
export class EducationEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'institution_name', type: 'varchar', length: 100 })
  institutionName: string;

  @Column({ name: 'degree', type: 'varchar', length: 100 })
  degree: string;

  @Column({ name: 'field_of_study', type: 'varchar', length: 100 })
  fieldOfStudy?: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: Promise<UserEntity>;

  @ManyToOne(() => ApplicantEntity, (applicant) => applicant.educations, {
    lazy: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'applicant_id', referencedColumnName: 'id' })
  applicant: Promise<ApplicantEntity>;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'new()' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: Date;

  static builder(): EducationEntityBuilder {
    return new EducationEntityBuilder();
  }
}

class EducationEntityBuilder {
  private readonly entity: EducationEntity;

  constructor() {
    this.entity = new EducationEntity();
  }

  withId(id: number): EducationEntityBuilder {
    this.entity.id = id;
    return this;
  }

  withInstitutionName(institutionName: string): EducationEntityBuilder {
    this.entity.institutionName = institutionName;
    return this;
  }

  withDegree(degree: string): EducationEntityBuilder {
    this.entity.degree = degree;
    return this;
  }

  withFieldOfStudy(fieldOfStudy: string): EducationEntityBuilder {
    this.entity.fieldOfStudy = fieldOfStudy;
    return this;
  }

  withStartDate(startDate: Date): EducationEntityBuilder {
    this.entity.startDate = startDate;
    return this;
  }

  withEndDate(endDate: Date): EducationEntityBuilder {
    this.entity.endDate = endDate;
    return this;
  }

  withCreatedBy(createdBy: UserEntity): EducationEntityBuilder {
    this.entity.createdBy = Promise.resolve(createdBy);
    return this;
  }

  withApplicant(applicant: ApplicantEntity): EducationEntityBuilder {
    this.entity.applicant = Promise.resolve(applicant);
    return this;
  }

  build(): EducationEntity {
    return this.entity;
  }
}
