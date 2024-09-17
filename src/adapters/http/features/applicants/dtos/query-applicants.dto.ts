import { ApiProperty } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import { ApplicantStatus } from '../../../../../core/features/applicants/enums/applicant-status';
import { PaginationRequestDoc } from '../../../docs/pagination-request.doc';

export class QueryApplicantsDto extends PaginationRequestDoc {
  @ApiProperty({
    type: 'string',
    name: 'startDate',
    example: dayjs().startOf('month').format('YYYY-MM-DD'),
    required: false,
    title: 'Start Date',
    description: 'Initial date based on the date the applicant was created',
    format: 'date',
  })
  startDate: string;

  @ApiProperty({
    type: 'string',
    name: 'endDate',
    example: dayjs().endOf('day').format('YYYY-MM-DD'),
    required: false,
    title: 'End Date',
    description: 'Final date based on the date the applicant was created',
    format: 'date',
  })
  endDate: string;

  @ApiProperty({
    type: 'enum',
    name: 'statuses',
    required: false,
    title: 'Status',
    description: 'Applicant status',
    enum: ApplicantStatus,
    isArray: true,
  })
  status: ApplicantStatus;

  @ApiProperty({
    type: 'string',
    name: 'term',
    required: false,
    example: '',
    title: 'Search term',
    description: 'Search term used to filter applicants',
  })
  term: string;
}
