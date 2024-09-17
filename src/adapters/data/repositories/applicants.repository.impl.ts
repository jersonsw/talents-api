import { ApplicantsRepository } from '../../../core/features/applicants/repositories/applicants.repository';
import { Applicant } from '../../../core/features/applicants/domain';
import { mapApplicantToDomain, mapApplicantToEntity } from '../mappers/applicant.mappers';
import { throwConstraintException } from '../commons';
import { UnexpectedErrorException } from '../../../core/commons/exceptions/unexpected-error.exception';
import { Injectable } from '@nestjs/common';
import { ApplicantEntity } from '../entities';
import { BaseRepositoryImpl } from './base.repository.impl';
import { CustomEntityManager } from '../custom-entity.manager';
import { LoadRelation } from '../../../core/commons/utils/load-relation';
import { Pagination, PaginationRequest } from '../../../core/commons/pagination';
import { ApplicantsFilterParams } from '../../../core/features/applicants/types/applicants-filter-params';
import { Brackets } from 'typeorm';

@Injectable()
export class ApplicantsRepositoryImpl
  extends BaseRepositoryImpl<ApplicantEntity, Applicant>
  implements ApplicantsRepository
{
  constructor(manager: CustomEntityManager) {
    super(manager, ApplicantEntity);
  }

  async create(applicant: Applicant): Promise<Applicant> {
    try {
      const entity = this.mapToEntity(applicant);
      const created = await this.repository.save(entity);

      return this.mapToDomain(created, { educations: true, workExperiences: true });
    } catch (error) {
      if (error.constraint) throwConstraintException(error);

      throw new UnexpectedErrorException('Unexpected error occurred trying to create the applicant', error);
    }
  }

  async update(applicant: Applicant): Promise<Applicant> {
    try {
      const entity = this.mapToEntity(applicant);
      const created = await this.repository.save(entity);

      return this.mapToDomain(created, { educations: true, workExperiences: true });
    } catch (error) {
      if (error.constraint) throwConstraintException(error);

      throw new UnexpectedErrorException('Unexpected error occurred trying to create the applicant', error);
    }
  }

  override async findMany(pag: PaginationRequest<ApplicantsFilterParams>): Promise<Pagination<Applicant>> {
    const { term, startDate, endDate, statuses, gender } = pag.params;

    try {
      const builder = this.repository.createQueryBuilder('apl');

      if (startDate && endDate) {
        builder.where('apl.created_at BETWEEN :startDate AND :endDate', {
          startDate,
          endDate,
        });
      } else if (startDate) {
        builder.where('apl.created_at >= :startDate', { startDate });
      } else if (endDate) {
        builder.where('apl.created_at <= :endDate', { endDate });
      }

      if (statuses?.length) {
        const statusValues = typeof statuses === 'string' ? [statuses] : statuses;
        builder.andWhere('apl.status IN (:...statusValues)', { statusValues });
      }

      if (gender) {
        builder.andWhere('apl.gender = :gender', { gender });
      }

      if (term) {
        builder.andWhere(
          new Brackets((qb) => {
            qb.where('apl.first_name ILIKE :first_name', { first_name: `%${term}%` })
              .orWhere('apl.last_name ILIKE :last_name', { last_name: `%${term}%` })
              .orWhere('apl.email ILIKE :email', { email: `%${term}%` })
              .orWhere('apl.mobile_number ILIKE :mobile_number', { mobile_number: `%${term}%` })
              .orWhere('apl.linkedin_profile ILIKE :linkedin_profile', { linkedin_profile: `%${term}%` })
              .orWhere('apl.github_profile ILIKE :github_profile', { github_profile: `%${term}%` })
              .orWhere('apl.status_reason ILIKE :status_reason', { status_reason: `%${term}%` });
          })
        );
      }

      if (pag.order?.length) {
        pag.order?.forEach((orderBy) => {
          const [field, direction] = orderBy.split(':') as [string, 'ASC' | 'DESC'];

          builder.addOrderBy(`apl.${field}`, direction);
        });
      }

      builder.skip(pag.skip).take(pag.size);

      const [entities, count] = await builder.getManyAndCount();
      const companies = await Promise.all(entities.map((e) => this.mapToDomain(e)));

      return Pagination.of(pag, count, companies);
    } catch (err) {
      throw new UnexpectedErrorException(
        'Error inesperado al intentar obtener las empresass. Favor de intentar de nuevo.',
        err
      );
    }
  }

  override mapToDomain(entity: ApplicantEntity, load?: LoadRelation<ApplicantEntity>): Promise<Applicant> {
    return mapApplicantToDomain(entity, load);
  }

  mapToEntity(domain: Applicant): ApplicantEntity {
    return mapApplicantToEntity(domain);
  }
}
