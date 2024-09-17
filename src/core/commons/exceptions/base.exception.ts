import { ErrorType } from '../enums';
import { Exception } from './exception';

export abstract class BaseException implements Exception {
  private _errorType: ErrorType = ErrorType.Unexpected;
  private _message: string;
  private _errors: any[];
  private _rootCause: Error;

  protected constructor(
    errorType: ErrorType,
    message: string = null,
    errors: string[] = null,
    rootCause: Error = null
  ) {
    this._errorType = errorType;
    this._message = message;
    this._errors = errors;
    this._rootCause = rootCause;
  }

  get errorType(): ErrorType {
    return this._errorType;
  }

  set errorType(value: ErrorType) {
    this._errorType = value;
  }

  get message(): string {
    return this._message;
  }

  set message(value: string) {
    this._message = value;
  }

  get errors(): any[] {
    return this._errors;
  }

  set errors(value: any[]) {
    this._errors = value;
  }

  get rootCause(): Error {
    return this._rootCause;
  }

  set rootCause(value: Error) {
    this._rootCause = value;
  }
}
