import { ArgumentsHost, ExceptionFilter, HttpException, Inject, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { translateException } from './exceptions.helper';
import { ErrorType } from '../../../../core/commons/enums';
import { LoggingServiceToken } from '../../../../main/commons/logging/logging.providers';
import { LoggingService } from '../../../../core/commons/logging';
import { BaseException } from '../../../../core/commons/exceptions/base.exception';

type ErrorTypeMap = { [statusCode: number]: ErrorType };
export type HttpExceptionPayload = {
  errorType: ErrorType;
  payload: any;
  message: any;
  validationErrors: any;
};
const errorTypesMapping: ErrorTypeMap = {
  400: ErrorType.BadRequest,
  422: ErrorType.ValidationErrors,
  401: ErrorType.Unauthorized,
  403: ErrorType.Forbidden,
  404: ErrorType.NotFound,
};

export class HttpExceptionHandler implements ExceptionFilter<HttpException> {
  constructor(@Inject(LoggingServiceToken) private readonly logger: LoggingService) {}

  catch(ex: Error, host: ArgumentsHost): void {
    this.logError(ex);
    const exception = this.getException(ex);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = +exception.getStatus();
    const { errorType, payload, message, validationErrors } = exception.getResponse() as HttpExceptionPayload;

    response.status(status).json({
      errorType: errorType || errorTypesMapping[status] || ErrorType.Unexpected,
      message,
      payload,
      timestamp: new Date().getTime(),
      validationErrors,
    });
  }

  private logError(error: Error): void {
    if (error instanceof BaseException) {
      this.logger.error(error.rootCause || error);
      return;
    }

    this.logger.error(error);
  }

  private getException(ex: Error): HttpException {
    const ExType = translateException(ex);

    const exception = !ExType ? ex : Reflect.construct(ExType, [ex]);
    if (!(exception instanceof HttpException)) {
      this.logger.warn(
        `[${exception.constructor.name}] does not have any translation ` +
          `yet, please add a translation to assoc this one with its equivalent in the ` +
          `HTTP layer. For now, an InternalServerErrorException will be thrown.`
      );
      return new InternalServerErrorException();
    }
    return exception;
  }
}
