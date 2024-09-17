import { TransactionBase } from './transactions/transaction-base';
import { LoggingService } from './logging';
import { Transactional } from './transactions/transactional';

export class BaseUseCase extends TransactionBase {
  protected logger: LoggingService;

  constructor(transactional: Transactional, logger: LoggingService) {
    super(transactional);

    this.logger = logger;
  }
}
