export enum ErrorType {
  // Generic error types
  Unexpected = 'unexpectedError',
  Forbidden = 'forbidden',
  Unauthorized = 'unauthorized',
  NotFound = 'notFound',
  BadRequest = 'badRequest',
  ValidationErrors = 'validationErrors',
  AlreadyExists = 'alreadyExists',

  // Authorization specific error types
  InsufficientPermissions = 'insufficientPermissions',

  AccessTokenExpired = 'accessTokenExpired',
  InvalidAccessToken = 'invalidAccessToken',
  NoAccessToken = 'noAccessToken',

  // Authorization error types
  ForbiddenUser = 'forbiddenUser',
  ApplicantNotFound = 'applicantNotFound',
  ApplicantAlreadyExists = 'applicantAlreadyExists',
}
