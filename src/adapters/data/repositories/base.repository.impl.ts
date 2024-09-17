import { EntityTarget, Repository } from 'typeorm';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { BaseRepository } from '../../../core/commons/base.repository';
import { CustomEntityManager } from '../custom-entity.manager';
import { Pagination, PaginationRequest } from '../../../core/commons/pagination';
import { LoadRelation } from '../../../core/commons/utils/load-relation';

type ResulSetTuple<DbEntity> = [DbEntity[], number];

export abstract class BaseRepositoryImpl<DbEntity, DomainEntity> implements BaseRepository<DomainEntity> {
  protected readonly repository: Repository<DbEntity>;

  protected constructor(private readonly manager: CustomEntityManager, entity: EntityTarget<DbEntity>) {
    this.repository = this.manager.getRepository(entity);
  }

  async findAll(): Promise<DomainEntity[]> {
    const entities = await this.repository.find();

    return await Promise.all(entities.map((e) => this.mapToDomain(e)));
  }

  async findOneBy(attrs: FindOptionsWhere<DbEntity>): Promise<DomainEntity> {
    const record = await this.repository.findOneBy(attrs);

    if (record) return this.mapToDomain(record);

    return null;
  }

  async findBy(attrs: Partial<DbEntity>): Promise<DomainEntity[]> {
    const entities = await this.repository.findBy(attrs as any);

    return await Promise.all(entities.map((e) => this.mapToDomain(e)));
  }

  async findById(id: any): Promise<DomainEntity> {
    const repository = this.repository as Repository<unknown>;
    const record = (await repository.findOneBy({ id })) as DbEntity;

    if (record) return this.mapToDomain(record);

    return null;
  }

  async getEntities(pag: PaginationRequest): Promise<ResulSetTuple<DbEntity>> {
    const { skip, size: take } = pag;
    const order: FindOptionsOrder<DbEntity> = {};

    pag.order?.forEach((orderBy) => {
      const [field, direction] = orderBy.split(':') as [string, 'ASC' | 'DESC'];
      order[field] = direction;
    });

    const totalCount = await this.repository.count();
    const entities = await this.repository.find({ skip, take, order });

    return [entities, totalCount];
  }

  async findMany(pag: PaginationRequest): Promise<Pagination<DomainEntity>> {
    const [entities, totalCount] = await this.getEntities(pag);
    if (totalCount === 0) return Pagination.of(pag, 0, []);

    const mappedEntities = await Promise.all(entities.map((e) => this.mapToDomain(e)));

    return Pagination.of(pag, totalCount, mappedEntities);
  }

  buildOrderByMap(order: string[]): Map<string, 'ASC' | 'DESC'> {
    return order.reduce((map, orderBy) => {
      const [field, direction] = orderBy.split(':') as [string, 'ASC' | 'DESC'];
      map.set(field, direction.toUpperCase());

      return map;
    }, new Map());
  }

  abstract mapToDomain(be: DbEntity, load?: LoadRelation<DbEntity>): Promise<DomainEntity>;

  abstract mapToEntity(e: DomainEntity): DbEntity;
}
