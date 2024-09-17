import { IsEnum, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { ApplicantStatus } from '../../../../../core/features/applicants/enums/applicant-status';

const { lorem } = faker;

export class ApplicantUpdateStatusReqDto {
  @ApiProperty({
    type: 'string',
    nullable: true,
    title: 'Status',
    description: 'Applicant status',
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
}
