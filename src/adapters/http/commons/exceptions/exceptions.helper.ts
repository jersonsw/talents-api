import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  ValidationError,
} from '@nestjs/common';
import { InputValidationError } from '../input-validation.error';
import { ResourceNotFoundException } from '../../../../core/commons/exceptions/resource-not-found.exception';
import {
  AccessTokenExpiredException,
  AlreadyExistsException,
  InvalidAccessTokenException,
  WrongRequestException,
} from '../../../../core/commons/exceptions';
import { NoAccessTokenException } from '../../../../core/commons/exceptions/no-access-token.exception';
import { UnexpectedErrorException } from '../../../../core/commons/exceptions/unexpected-error.exception';

/**
 * This function is intended to translate business exceptions into NestJS's
 * Http Exceptions.
 *
 * As business exceptions are created they should be added here in this function
 * in order to have the correct mapping and, in fact, the correct status code.
 *
 * @param ex Implementation of Exception interface, which is in the top of all
 * business exceptions.
 * @returns Function
 */
export const translateException = (ex: Error): { new (): HttpException } => {
  if (ex instanceof HttpException) return;
  if (ex instanceof ResourceNotFoundException) return NotFoundException;
  if (ex instanceof WrongRequestException) return BadRequestException;

  if (ex instanceof AlreadyExistsException) return ConflictException;

  if (
    ex instanceof AccessTokenExpiredException ||
    ex instanceof InvalidAccessTokenException ||
    ex instanceof NoAccessTokenException
  ) {
    return UnauthorizedException;
  }

  if (ex instanceof UnexpectedErrorException) {
    return InternalServerErrorException;
  }

  return;
};

export const mapValidationErrors = (errors: ValidationError[]): InputValidationError[] => {
  return errors.map((error: ValidationError) => {
    const { property: field, value, constraints, children } = error;

    return new InputValidationError(field, value, constraints, mapValidationErrors(children));
  });
};
