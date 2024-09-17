import 'reflect-metadata';

export function InTransaction(): MethodDecorator {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (
      !(target.beginTransaction && target.commitTransaction && target.rollbackTransaction && target.isTransactionActive)
    ) {
      throw new Error(`
        @Transactional decorator must be used only in a class that extends TransactionBase.
        
        Ensure that the class where the method ${propertyKey} resides is extending TransactionBase.`);
    }
    const origMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const currentProp = propertyKey;

      try {
        if (!this.isTransactionActive()) {
          await this.beginTransaction();

          this.transactionStartedBy = currentProp;

          console.info(`[${currentProp}] ->`.padEnd(15, ' '), 'Transaction started >');
        } else {
          console.info(`[${currentProp}] ->`.padEnd(15, ' '), 'On transaction...');
        }

        const result = await origMethod.apply(this, args);

        if (this.isTransactionActive() && this.transactionStartedBy === currentProp) {
          await this.commitTransaction();

          console.info(`[${currentProp}] <-`.padEnd(15, ' '), 'Transaction committed ✓');
        }

        return result;
      } catch (e) {
        if (this.isTransactionActive()) {
          await this.rollbackTransaction();

          console.info(`[${currentProp}] <-`.padEnd(15, ' '), 'Transaction rolled back x');
        }

        throw e;
      }
    };

    return descriptor;
  };
}
