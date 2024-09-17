import { IsBoolean, IsDateString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { genPastDate } from '../../../../data/fakers';

const { person, date, company, lorem, location } = faker;

export class ExperienceReqDto {
  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'Job Title',
    description: "Applicant's job title",
    example: person.jobTitle(),
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MinLength(3, { message: 'Job Title must be at least 1 character long' })
  @MaxLength(100, { message: 'Job Title must not exceed 100 characters' })
  jobTitle: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'Company Name',
    description: "Applicant's company name",
    example: company.name(),
    minLength: 1,
    maxLength: 160,
  })
  @IsNotEmpty()
  @MinLength(1, { message: 'Company Name must be at least 1 character long' })
  @MaxLength(160, { message: 'Company Name must not exceed 160 characters' })
  companyName: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'Country Name',
    description: "Job's country name",
    example: location.country(),
    minLength: 4,
    maxLength: 60,
  })
  @IsNotEmpty()
  @MinLength(4, { message: 'Country Name must be at least 4 character long' })
  @MaxLength(60, { message: 'Country Name must not exceed 60 characters' })
  countryName: string;

  @ApiProperty({
    type: 'boolean',
    nullable: false,
    required: true,
    title: 'Remote',
    description: 'If the job was remote',
    example: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  remote: boolean;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'Description',
    description: "Applicant's job description",
    example: lorem.words(20),
    minLength: 160,
  })
  @IsNotEmpty()
  @MinLength(160, { message: 'The description should have at least 160 characters long' })
  description: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'Start Date',
    description: "Applicant's job start date",
    example: genPastDate(1, 3),
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    type: 'string',
    nullable: true,
    required: false,
    title: 'End Date',
    description: "Applicant's job end date",
    example: date.past().toISOString(),
  })
  @IsNotEmpty()
  @IsDateString()
  endDate: Date;
}
