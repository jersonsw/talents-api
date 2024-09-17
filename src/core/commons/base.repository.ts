import { Pagination, PaginationRequest } from './pagination';

export interface HasId {
  id: unknown;
}

export interface BaseRepository<T> {
  findById(id: unknown): Promise<T>;
  findOneBy(params: unknown): Promise<T>;
  findBy(pa: unknown): Promise<T[]>;
  findMany(pag: PaginationRequest): Promise<Pagination<T>>;
  mapToDomain(e: unknown): Promise<T>;
}
