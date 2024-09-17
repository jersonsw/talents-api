import { randomUUID } from 'node:crypto';
import { ApiProperty } from '@nestjs/swagger';
import { Education } from '../../../../../core/features/applicants/domain';
import { faker } from '@faker-js/faker';
import { genPastDate, getRandomDegree, getRandomFieldOfStudy } from '../../../../data/fakers';
import * as dayjs from 'dayjs';

const { person, internet, date, company } = faker;

const firstName = person.firstName();
const lastName = person.lastName();
internet.email({ firstName: firstName.toLowerCase(), lastName: lastName.toLowerCase() });

export class EducationRespDoc extends Education {
  @ApiProperty({
    type: 'number',
    title: 'ID',
    description: 'Unique identifier for the entry',
    example: randomUUID(),
  })
  override id: number;

  @ApiProperty({
    type: 'string',
    title: 'Institution Name',
    description: "Applicant's institution name",
    example: company.name(),
  })
  override institutionName: string;

  @ApiProperty({
    type: 'string',
    title: 'Degree',
    description: 'Degree obtained by the applicant',
    example: getRandomDegree(),
  })
  override degree: string;

  @ApiProperty({
    type: 'string',
    title: 'Field Of Study',
    description: 'Field of study of the applicant',
    example: getRandomFieldOfStudy(),
  })
  override fieldOfStudy: string;

  @ApiProperty({
    type: 'string',
    title: 'Start Date',
    description: 'Applicant education start date',
    example: dayjs(genPastDate(3, 5)).format('YYYY-MM-DD'),
  })
  override startDate: Date;

  @ApiProperty({
    type: 'string',
    nullable: false,
    required: true,
    title: 'End Date',
    description: 'Applicant education end date',
    example: dayjs(genPastDate(1, 3)).format('YYYY-MM-DD'),
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
