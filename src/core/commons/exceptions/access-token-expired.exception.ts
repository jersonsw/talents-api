import { BaseException } from './base.exception';
import { ErrorType } from '../enums';

export class AccessTokenExpiredException extends BaseException {
  constructor(message: string, rootCause: Error) {
    super(ErrorType.AccessTokenExpired, message, [], rootCause);
  }
}
