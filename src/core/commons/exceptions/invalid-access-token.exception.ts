import { ErrorType } from '../enums';
import { BaseException } from './base.exception';

export class InvalidAccessTokenException extends BaseException {
  constructor(message: string, rootCause: Error) {
    super(ErrorType.InvalidAccessToken, message, [], rootCause);
  }
}
