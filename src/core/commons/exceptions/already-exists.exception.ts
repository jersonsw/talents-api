import { BaseException } from './base.exception';
import { ErrorType } from '../enums';

export class AlreadyExistsException extends BaseException {
  constructor(message?: string, errorType: ErrorType = ErrorType.AlreadyExists, rootCause?: Error) {
    super(errorType, message, [], rootCause);
  }
}
