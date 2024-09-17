import { BaseException } from './base.exception';
import { ErrorType } from '../enums';

export class UnexpectedErrorException extends BaseException {
  constructor(message: string, rootError?: Error) {
    super(ErrorType.Unexpected, message, [], rootError);
  }
}
