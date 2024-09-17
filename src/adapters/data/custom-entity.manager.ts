import { DataSource, EntityManager } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Transactional } from '../../core/commons/transactions/transactional';

@Injectable()
export class CustomEntityManager extends EntityManager implements Transactional {
  constructor(connection: DataSource) {
    super(connection, connection.createQueryRunner());
  }

  async beginTransaction(): Promise<void> {
    await this.queryRunner.startTransaction();
  }

  async commitTransaction(): Promise<void> {
    await this.queryRunner.commitTransaction();
  }

  async rollbackTransaction(): Promise<void> {
    await this.queryRunner.rollbackTransaction();
  }

  public isTransactionActive(): boolean {
    return this.queryRunner.isTransactionActive;
  }

  public isTransactionReleased(): boolean {
    return this.queryRunner.isReleased;
  }
}
