import { BaseException } from './base.exception';
import { ErrorType } from '../enums';

export class WrongRequestException extends BaseException {
  constructor(message?: string, rootCause?: Error) {
    super(ErrorType.BadRequest, message, [], rootCause);
  }
}
