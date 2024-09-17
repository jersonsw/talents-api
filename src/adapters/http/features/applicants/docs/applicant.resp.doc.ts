import { Applicant } from '../../../../../core/features/applicants/domain';
import { Gender } from '../../../../../core/features/users/enums/gender';
import { ApplicantStatus } from '../../../../../core/features/applicants/enums/applicant-status';
import { EducationRespDoc } from './education.resp.doc';
import { ExperienceRespDoc } from './experience.resp.doc';
import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'node:crypto';
import { faker } from '@faker-js/faker';
import { fakeDominicanPhoneNumber } from '../../../../data/fakers';
import * as dayjs from 'dayjs';

const { person, internet, date, number } = faker;

const firstName = person.firstName();
const lastName = person.lastName();
const email = internet.email({ firstName: firstName.toLowerCase(), lastName: lastName.toLowerCase() });

export class ApplicantRespDoc extends Applicant {
  @ApiProperty({
    type: 'string',
    title: 'ID',
    description: "Applicant's unique identifier",
    example: randomUUID(),
  })
  override id: string;

  @ApiProperty({
    type: 'string',
    title: 'First Name',
    description: "Applicant's first name",
    example: person.firstName(),
  })
  override firstName: string;

  @ApiProperty({
    type: 'string',
    title: 'Last Name',
    description: "Applicant's last name",
    example: person.lastName(),
  })
  override lastName: string;

  @ApiProperty({
    type: 'string',
    title: 'Email',
    description: "Applicant's email",
    example: email,
  })
  override email: string;

  @ApiProperty({
    type: 'string',
    title: 'Mobile Number',
    description: "Applicant's mobile number",
    example: fakeDominicanPhoneNumber(),
  })
  override mobileNumber: string;

  @ApiProperty({
    type: 'string',
    title: 'Gender',
    description: "Applicant's gender",
    enum: Gender,
  })
  override gender: Gender;

  @ApiProperty({
    type: 'date',
    title: 'Birth Date',
    description: "Applicant's birth date",
    example: dayjs(date.past({ years: number.int({ min: 18, max: 65 }) })).startOf('day'),
  })
  override birthDate: Date;

  @ApiProperty({
    type: 'string',
    title: 'LinkedIn Profile',
    description: 'URL to the applicant LinkedIn profile',
    example: internet.url({ protocol: 'https' }),
  })
  override linkedinProfile: string;

  @ApiProperty({
    type: 'string',
    title: 'GitHub Profile',
    description: 'URL to the applicant GitHub profile',
    example: internet.url({ protocol: 'https' }),
  })
  override githubProfile: string;

  @ApiProperty({
    type: 'string',
    title: 'Status',
    description: 'Applicant status. It can only be set by an admin',
    enum: ApplicantStatus,
  })
  override status: ApplicantStatus;

  @ApiProperty({
    type: EducationRespDoc,
    isArray: true,
    title: 'Educations',
    description: 'Applicant educations',
  })
  override educations: EducationRespDoc[];

  @ApiProperty({
    type: ExperienceRespDoc,
    isArray: true,
    title: 'Work Experiences',
    description: 'Applicant work experiences',
  })
  override workExperiences: ExperienceRespDoc[];

  @ApiProperty({
    type: 'timestamp',
    title: 'Creation Date',
    description: "Record's creation date",
    example: date.recent().toISOString(),
  })
  override createdAt: Date;

  @ApiProperty({
    type: 'timestamp',
    title: 'Update Date',
    description: "Record's update date",
    example: date.recent().toISOString(),
  })
  override updatedAt: Date;
}
