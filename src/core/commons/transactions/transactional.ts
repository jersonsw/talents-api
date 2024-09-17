import 'reflect-metadata';

export interface Transactional {
  beginTransaction(): Promise<void>;

  commitTransaction(): Promise<void>;

  rollbackTransaction(): Promise<void>;

  isTransactionActive(): boolean;

  isTransactionReleased(): boolean;
}
