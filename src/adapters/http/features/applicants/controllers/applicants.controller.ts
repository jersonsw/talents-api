import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../../general/base.controller';
import { CreateApplicantsUseCase } from '../../../../../core/features/applicants/use-cases/create-applicants.use-case';
import { UpdateApplicantsUseCase } from '../../../../../core/features/applicants/use-cases/update-applicants.use-case';
import { GetApplicantsUseCase } from '../../../../../core/features/applicants/use-cases/get-applicants.use-case';
import { Roles } from '../../../../../main/features/auth/decorators/roles.decorator';
import { Role } from '../../../../../core/features/users/enums/role';
import { ApiCreatedRespDoc } from '../../../decorators/api-created-resp.doc';
import { CurrentUser } from '../../../decorators/current-user';
import { User } from '../../../../../core/features/users/domain/user';
import { Applicant } from '../../../../../core/features/applicants/domain';
import { ApplicantRespDoc } from '../docs/applicant.resp.doc';
import { ApplicantReqDto } from '../dtos/applicant-req.dto';
import { mapApplicantReqToDomain, mapApplicationUpdateStatusReqToDomain } from '../mappers/applicants-dto.mappers';
import { ApiReadSimpleRespDoc } from '../../../decorators/api-read-simple-resp.doc';
import { ApiUpdatedResp } from '../../../decorators/api-updated-resp';
import { ApplicantUpdateStatusReqDto } from '../dtos/applicant-update-status-req.dto';
import { QueryApplicantsDto } from '../dtos/query-applicants.dto';
import { ApiPaginatedRespDoc } from '../../../decorators/api-paginated-resp.doc';
import { PaginationParams } from '../../../decorators/pagination-params.decorator';
import { Pagination, PaginationRequest } from '../../../../../core/commons/pagination';
import { ApplicantsFilterParams } from '../../../../../core/features/applicants/types/applicants-filter-params';

@Controller({ path: 'applicants', version: '1' })
@ApiTags('Applicants')
export class ApplicantsController extends BaseController {
  constructor(
    private readonly createApplicants: CreateApplicantsUseCase,
    private readonly updateApplicants: UpdateApplicantsUseCase,
    private readonly getApplicants: GetApplicantsUseCase
  ) {
    super();
  }

  @Get(':id')
  @Roles([Role.HumanResourcesReadApplicant])
  @ApiParam({ name: 'id', type: 'string', description: 'Applicant ID' })
  @ApiReadSimpleRespDoc({
    model: ApplicantRespDoc,
    entityName: 'Applicant',
    summary: 'Get an applicant',
    description: 'Get an applicant and its associated data (education, experience, etc.)',
  })
  findOne(@Param('id') id: string): Promise<Applicant> {
    return this.getApplicants.findById(id);
  }

  @Get()
  @ApiQuery({ type: QueryApplicantsDto })
  @ApiPaginatedRespDoc({
    model: ApplicantRespDoc,
    entityName: 'Applicants',
    summary: 'Gets a list of applicants based on the query parameters',
    description: 'Returns paginated results of the matched applicants',
  })
  findMany(
    @PaginationParams({ currentPage: 0, size: 10 }) pag: PaginationRequest<ApplicantsFilterParams>
  ): Promise<Pagination<Applicant>> {
    return this.getApplicants.findMany(pag);
  }

  @Post()
  @Roles([Role.HumanResourcesCreateApplicant])
  @ApiCreatedRespDoc({
    model: ApplicantRespDoc,
    entityName: 'Applicant',
    summary: 'Creates a new applicant',
    description: 'Creates a new applicant and its associated data (education, experience, etc.)',
  })
  create(@Body() request: ApplicantReqDto, @CurrentUser() user: User): Promise<Applicant> {
    const domain = mapApplicantReqToDomain(request, user);

    return this.createApplicants.create(domain);
  }

  @Put(':id')
  @Roles([Role.HumanResourcesCreateApplicant])
  @ApiParam({ name: 'id', type: 'string', description: 'Applicant ID' })
  @ApiCreatedRespDoc({
    model: ApplicantRespDoc,
    entityName: 'Applicant',
    summary: 'Updates an applicant',
    description: 'Updates applicant and its associated data (education, experience, etc.)',
  })
  update(@Body() request: ApplicantReqDto, @Param('id') id: string, @CurrentUser() user: User): Promise<Applicant> {
    const domain = mapApplicantReqToDomain(request, user, id);

    return this.updateApplicants.update(domain);
  }

  @Patch(':id/status')
  @ApiParam({
    type: 'string',
    name: 'id',
    description: 'Applicant ID',
  })
  @ApiUpdatedResp({
    model: ApplicantRespDoc,
    entityName: 'Applicant',
    summary: 'Updates applicant status',
  })
  @Roles([Role.HumanResourcesUpdateApplicant])
  updateStatus(
    @Body() dto: ApplicantUpdateStatusReqDto,
    @Param('id') id: string,
    @CurrentUser() user: User
  ): Promise<Applicant> {
    const domain = mapApplicationUpdateStatusReqToDomain(dto, user, id);

    return this.updateApplicants.updateStatus(domain);
  }
}
