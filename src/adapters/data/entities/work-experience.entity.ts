import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApplicantEntity } from './applicant.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'work_experiences' })
export class WorkExperienceEntity {
  @PrimaryGeneratedColumn('identity')
  id: number;

  @Column({ name: 'job_title', type: 'varchar', length: 100 })
  jobTitle: string;

  @Column({ name: 'company_name', type: 'varchar', length: 100 })
  companyName: string;

  @Column({ name: 'country_name', type: 'varchar', length: 100 })
  countryName: string;

  @Column({ name: 'remote', type: 'boolean', default: false })
  remote: boolean;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate?: Date;

  @ManyToOne(() => ApplicantEntity, (applicant) => applicant.workExperiences, {
    lazy: true,
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'applicant_id', referencedColumnName: 'id' })
  applicant: Promise<ApplicantEntity>;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: Promise<UserEntity>;

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;

  static builder(): WorkExperienceEntityBuilder {
    return new WorkExperienceEntityBuilder();
  }
}

class WorkExperienceEntityBuilder {
  private readonly entity: WorkExperienceEntity;

  constructor() {
    this.entity = new WorkExperienceEntity();
  }

  withId(id: number): WorkExperienceEntityBuilder {
    this.entity.id = id;
    return this;
  }

  withJobTitle(jobTitle: string): WorkExperienceEntityBuilder {
    this.entity.jobTitle = jobTitle;
    return this;
  }

  withCompanyName(companyName: string): WorkExperienceEntityBuilder {
    this.entity.companyName = companyName;
    return this;
  }

  withCountryName(countryName: string): WorkExperienceEntityBuilder {
    this.entity.countryName = countryName;
    return this;
  }

  withRemote(remote: boolean): WorkExperienceEntityBuilder {
    this.entity.remote = remote;
    return this;
  }

  withDescription(description: string): WorkExperienceEntityBuilder {
    this.entity.description = description;
    return this;
  }

  withStartDate(startDate: Date): WorkExperienceEntityBuilder {
    this.entity.startDate = startDate;
    return this;
  }

  withEndDate(endDate: Date): WorkExperienceEntityBuilder {
    this.entity.endDate = endDate;
    return this;
  }

  withApplicant(applicant: ApplicantEntity): WorkExperienceEntityBuilder {
    this.entity.applicant = Promise.resolve(applicant);
    return this;
  }

  withCreatedBy(createdBy: UserEntity): WorkExperienceEntityBuilder {
    this.entity.createdBy = Promise.resolve(createdBy);
    return this;
  }

  withCreatedAt(createdAt: Date): WorkExperienceEntityBuilder {
    this.entity.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): WorkExperienceEntityBuilder {
    this.entity.updatedAt = updatedAt;
    return this;
  }

  build(): WorkExperienceEntity {
    return this.entity;
  }
}
