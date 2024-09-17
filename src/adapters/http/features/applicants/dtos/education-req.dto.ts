import { IsDateString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { genPastDate, getRandomDegree, getRandomFieldOfStudy } from '../../../../data/fakers';
import * as dayjs from 'dayjs';

const { company } = faker;

export class EducationReqDto {
  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'Institution Name',
    description: 'Name of the institution where the applicant studied',
    example: company.name(),
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MinLength(3, { message: 'Institution Name must be at least 1 character long' })
  @MaxLength(100, { message: 'Institution Name must not exceed 100 characters' })
  institutionName: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'Degree',
    description: 'Degree obtained by the applicant',
    example: getRandomDegree(),
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MinLength(3, { message: 'Degree must be at least 1 character long' })
  @MaxLength(100, { message: 'Degree must not exceed 100 characters' })
  degree: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'Field Of Study',
    description: 'Field of study of the applicant',
    example: getRandomFieldOfStudy(),
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MinLength(3, { message: 'Field of Study must be at least 1 character long' })
  @MaxLength(100, { message: 'Field of Study must not exceed 100 characters' })
  fieldOfStudy: string;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'Start Date',
    description: 'Applicant education start date',
    example: dayjs(genPastDate(3, 5)).format('YYYY-MM-DD'),
  })
  @IsNotEmpty()
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    type: 'string',
    nullable: true,
    required: false,
    title: 'End Date',
    description: 'Applicant education end date',
    example: dayjs(genPastDate(1, 3)).format('YYYY-MM-DD'),
  })
  @IsDateString()
  endDate: Date;
}
