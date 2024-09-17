import { Transactional } from './transactional';

export class TransactionBase implements Transactional {
  private _transactionStartedBy: string;
  private readonly transaction: Transactional;

  constructor(transaction: Transactional) {
    this.transaction = transaction;
  }

  get transactionStartedBy(): string {
    return this._transactionStartedBy;
  }

  set transactionStartedBy(value: string) {
    this._transactionStartedBy = value;
  }

  public async beginTransaction(): Promise<void> {
    await this.transaction.beginTransaction();
  }

  public async commitTransaction(): Promise<void> {
    await this.transaction.commitTransaction();
  }

  public async rollbackTransaction(): Promise<void> {
    await this.transaction.rollbackTransaction();
  }

  public isTransactionActive(): boolean {
    return this.transaction.isTransactionActive();
  }

  public isTransactionReleased(): boolean {
    return this.transaction.isTransactionReleased();
  }
}
