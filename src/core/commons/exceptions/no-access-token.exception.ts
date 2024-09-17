import { ErrorType } from '../enums';
import { BaseException } from './base.exception';

export class NoAccessTokenException extends BaseException {
  constructor(message: string, rootCause: Error) {
    super(ErrorType.NoAccessToken, message, [], rootCause);
  }
}
