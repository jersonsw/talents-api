import { ErrorType } from '../enums';

export interface Exception {
  errorType: ErrorType;
  message: string;
  errors: any[];
  rootCause: Error | null;
}
