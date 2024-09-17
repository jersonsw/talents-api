import { randomUUID } from 'node:crypto';
import { ApiProperty } from '@nestjs/swagger';
import { WorkExperience } from '../../../../../core/features/applicants/domain';
import { faker } from '@faker-js/faker';
import { genPastDate } from '../../../../data/fakers';
import * as dayjs from 'dayjs';

const { person, internet, date, company, location, lorem } = faker;

const firstName = person.firstName();
const lastName = person.lastName();
internet.email({ firstName: firstName.toLowerCase(), lastName: lastName.toLowerCase() });

export class ExperienceRespDoc extends WorkExperience {
  @ApiProperty({
    type: 'number',
    title: 'ID',
    description: 'Unique identifier for the experience',
    example: randomUUID(),
  })
  override id: number;

  @ApiProperty({
    type: 'string',
    title: 'Job Title',
    description: "Applicant's job title",
    example: person.jobTitle(),
  })
  override jobTitle: string;

  @ApiProperty({
    type: 'string',
    title: 'Company Name',
    description: "Applicant's company name",
    example: company.name(),
  })
  override companyName: string;

  @ApiProperty({
    type: 'string',
    title: 'Country Name',
    description: "Job's country name",
    example: location.country(),
  })
  override countryName: string;

  @ApiProperty({
    type: 'boolean',
    title: 'Remote',
    description: 'If the job was remote',
    example: false,
  })
  override remote: boolean;

  @ApiProperty({
    type: 'string',
    title: 'Description',
    description: "Applicant's job description",
    example: lorem.words(20),
  })
  override description: string;

  @ApiProperty({
    type: 'string',
    title: 'Start Date',
    description: "Applicant's job start date",
    example: dayjs(genPastDate(1, 3)).format('YYYY-MM-DD'),
  })
  override startDate: Date;

  @ApiProperty({
    type: 'string',
    title: 'End Date',
    description: "Applicant's job end date",
    example: dayjs(genPastDate(3, 5)).format('YYYY-MM-DD'),
  })
  override endDate: Date;

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
