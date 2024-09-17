import { User } from '../domain/user';
import { BaseRepository } from '../../../commons/base.repository';
import { Applicant } from '../../applicants/domain';

export interface ApplicantsRepository extends BaseRepository<Applicant> {
  create(User: User): Promise<User>;
  createMany(Users: User[]): Promise<User[]>;
  update(User: User): Promise<User>;
  updateMany(Users: User[]): Promise<User[]>;
}
