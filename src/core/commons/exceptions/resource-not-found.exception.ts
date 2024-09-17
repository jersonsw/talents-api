import { BaseException } from './base.exception';
import { ErrorType } from '../enums';

export class ResourceNotFoundException extends BaseException {
  constructor(message?: string, errorType: ErrorType = ErrorType.NotFound) {
    super(errorType, message);
  }
}
