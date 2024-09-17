import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { Gender } from '../../../../../core/features/users/enums/gender';
import { ApplicantStatus } from '../../../../../core/features/applicants/enums/applicant-status';
import { fakeDominicanPhoneNumber } from '../../../../data/fakers';
import { EducationReqDto } from './education-req.dto';
import { ExperienceReqDto } from './experience-req.dto';

const { person, internet, date, number, lorem } = faker;

const firstName = person.firstName();
const lastName = person.lastName();
const email = internet.email({ firstName: firstName.toLowerCase(), lastName: lastName.toLowerCase() });

export class ApplicantReqDto {
  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'First Name',
    description: "Applicant's first name",
    example: person.firstName(),
    minLength: 1,
    maxLength: 30,
  })
  @IsNotEmpty()
  @MinLength(1, { message: 'First name must be at least 1 character long' })
  @MaxLength(30, { message: 'First name must not exceed 30 characters' })
  firstName: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'Last Name',
    description: "Applicant's last name",
    example: person.lastName(),
    minLength: 1,
    maxLength: 35,
  })
  @IsNotEmpty()
  @MinLength(1, { message: 'Last name must be at least 1 character long' })
  @MaxLength(35, { message: 'Last name must not exceed 35 characters' })
  lastName: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    title: 'Email',
    description: "Applicant's email",
    example: email,
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    title: 'Mobile Number',
    description: "Applicant's mobile number",
    example: fakeDominicanPhoneNumber(),
    required: true,
  })
  @Matches(/^(\+1)?8[024]9\d{7}$/)
  @IsNotEmpty()
  mobileNumber: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    title: 'Gender',
    description: "Applicant's gender",
    enum: Gender,
    required: true,
  })
  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @ApiProperty({
    type: 'string',
    nullable: false,
    title: 'Birth Date',
    description: "Applicant's birth date",
    required: true,
    example: date.past({ years: number.int({ min: 18, max: 65 }) }).toISOString(),
  })
  @IsDateString()
  @IsNotEmpty()
  birthDate: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    title: 'LinkedIn Profile',
    description: 'URL to the applicant LinkedIn profile',
    example: internet.url({ protocol: 'https' }),
    required: false,
  })
  @IsUrl({ require_host: true })
  linkedinProfile: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    title: 'GitHub Profile',
    description: 'URL to the applicant GitHub profile',
    example: internet.url({ protocol: 'https' }),
    required: false,
  })
  @IsUrl({ require_host: true })
  githubProfile: string;

  @ApiProperty({
    type: 'string',
    nullable: true,
    title: 'Status',
    description: 'Applicant status. It can only be set by an admin',
    required: false,
    enum: ApplicantStatus,
  })
  @IsEnum(ApplicantStatus)
  @IsNotEmpty()
  status: ApplicantStatus;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'Description',
    description: "Applicant's job description",
    example: lorem.words(20).substring(0, 254),
    minLength: 10,
    maxLength: 255,
  })
  @IsOptional()
  @MinLength(10, { message: 'The status reason should have at least 10 characters long' })
  @MaxLength(255, { message: 'The status reason should not have more than 255 characters long' })
  statusReason: string;

  @ApiProperty({
    type: EducationReqDto,
    isArray: true,
    nullable: true,
    title: 'Educations',
    description: 'Applicant educations',
    required: false,
  })
  @IsArray()
  @IsOptional()
  educations: EducationReqDto[];

  @ApiProperty({
    type: ExperienceReqDto,
    isArray: true,
    nullable: true,
    title: 'Work Experiences',
    description: 'Applicant work experiences',
    required: false,
  })
  @IsArray()
  @IsOptional()
  workExperiences: ExperienceReqDto[];
}
