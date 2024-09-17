import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Gender } from '../../../core/features/users/enums/gender';
import { WorkExperienceEntity } from './work-experience.entity';
import { EducationEntity } from './education.entity';
import { ApplicantStatus } from '../../../core/features/applicants/enums/applicant-status';
import { UserEntity } from './user.entity';

@Entity({ name: 'applicants' })
export class ApplicantEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ name: 'email', type: 'varchar', length: 60, nullable: false, unique: true })
  email: string;

  @Column({ name: 'mobile_number', type: 'varchar', length: 15 })
  mobileNumber: string;

  @Column({ name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date;

  @Column({ name: 'linkedin_profile', type: 'varchar' })
  linkedinProfile: string;

  @Column({ name: 'github_profile', type: 'varchar' })
  githubProfile: string;

  @Column({ name: 'status', type: 'enum', enum: ApplicantStatus })
  status: ApplicantStatus;

  @Column({ name: 'status_reason', type: 'varchar', length: 255 })
  statusReason: string;

  @OneToMany(() => EducationEntity, (experience) => experience.applicant, {
    lazy: true,
    cascade: true,
  })
  educations: Promise<EducationEntity[]>;

  @OneToMany(() => WorkExperienceEntity, (experience) => experience.applicant, {
    lazy: true,
    cascade: true,
  })
  workExperiences: Promise<WorkExperienceEntity[]>;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy: Promise<UserEntity>;

  @ManyToOne(() => UserEntity, (user) => user.id, {
    lazy: true,
  })
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updatedBy: Promise<UserEntity>;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'now()' })
  updatedAt: Date;

  static builder(): ApplicantEntityBuilder {
    return new ApplicantEntityBuilder();
  }
}

class ApplicantEntityBuilder {
  private readonly entity: ApplicantEntity;

  constructor() {
    this.entity = new ApplicantEntity();
  }

  withId(id: string): ApplicantEntityBuilder {
    this.entity.id = id;
    return this;
  }

  withFirstName(firstName: string): ApplicantEntityBuilder {
    this.entity.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): ApplicantEntityBuilder {
    this.entity.lastName = lastName;
    return this;
  }

  withEmail(email: string): ApplicantEntityBuilder {
    this.entity.email = email;
    return this;
  }

  withMobileNumber(mobileNumber: string): ApplicantEntityBuilder {
    this.entity.mobileNumber = mobileNumber;
    return this;
  }

  withGender(gender: Gender): ApplicantEntityBuilder {
    this.entity.gender = gender;
    return this;
  }

  withBirthDate(birthDate: Date): ApplicantEntityBuilder {
    this.entity.birthDate = birthDate;
    return this;
  }

  withLinkedinProfile(linkedinProfile: string): ApplicantEntityBuilder {
    this.entity.linkedinProfile = linkedinProfile;
    return this;
  }

  withGithubProfile(githubProfile: string): ApplicantEntityBuilder {
    this.entity.githubProfile = githubProfile;
    return this;
  }

  withStatus(status: ApplicantStatus) {
    this.entity.status = status;
    return this;
  }

  withStatusReason(statusReason: string) {
    this.entity.statusReason = statusReason;
    return this;
  }

  withWorkExperiences(workExperiences: WorkExperienceEntity[]): ApplicantEntityBuilder {
    this.entity.workExperiences = Promise.resolve(workExperiences);
    return this;
  }

  withEducations(educations: EducationEntity[]): ApplicantEntityBuilder {
    this.entity.educations = Promise.resolve(educations);
    return this;
  }

  withCreatedAt(createdAt: Date): ApplicantEntityBuilder {
    this.entity.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): ApplicantEntityBuilder {
    this.entity.updatedAt = updatedAt;
    return this;
  }

  withCreatedBy(createdBy: UserEntity): ApplicantEntityBuilder {
    this.entity.createdBy = Promise.resolve(createdBy);

    return this;
  }

  withUpdatedBy(updatedBy: UserEntity): ApplicantEntityBuilder {
    this.entity.updatedBy = Promise.resolve(updatedBy);

    return this;
  }

  build(): ApplicantEntity {
    return this.entity;
  }
}
