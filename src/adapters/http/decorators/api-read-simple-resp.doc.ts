import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationResponse, SuccessResponse } from '../dtos';
import { InputValidationError } from '../commons/input-validation.error';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import 'reflect-metadata';
import { ErrorType } from '../../../core/commons/enums';

type Props<T> = {
  model: T;
  entityName?: string;
  gender?: 'M' | 'F';
  isArray?: boolean;
  summary?: string;
  description?: string;
  additionalApiDecorators?: (MethodDecorator & ClassDecorator)[];
};

export const ApiReadSimpleRespDoc = <TModel extends Type>(props: Props<TModel>) => {
  const additionalApiDecorators = props.additionalApiDecorators || [];
  const entityName = props.entityName || 'Element';
  const model = props.model;
  const pronoun = 'The';
  const summary = props.summary || `Gets a ${entityName.toLowerCase()}`;
  const description = props.description || summary;

  return applyDecorators(
    ApiExtraModels(SuccessResponse, PaginationResponse, model, InputValidationError),
    ApiOperation({ summary, description }),
    ApiForbiddenResponse({
      description: 'Access denied',
      schema: {
        properties: {
          errorType: {
            type: 'string',
            example: ErrorType.Forbidden,
            enum: Object.values(ErrorType),
          },
          message: {
            type: 'string',
            example: `Don't have access to read ${pronoun.toLowerCase()} ${entityName.toLowerCase()}`,
          },
          timestamp: {
            type: 'number',
            example: Date.now(),
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        properties: {
          errorType: {
            type: 'string',
            example: ErrorType.AccessTokenExpired,
            enum: Object.values(ErrorType),
          },
          message: {
            type: 'string',
            example: 'The user is not authenticated',
          },
          timestamp: {
            type: 'number',
            example: Date.now(),
          },
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        properties: {
          errorType: {
            type: 'string',
            example: ErrorType.Unexpected,
            enum: Object.values(ErrorType),
          },
          message: {
            type: 'string',
            example: `Unexpected error trying to get ${pronoun.toLowerCase()} ${entityName.toLowerCase()}`,
          },
          timestamp: {
            type: 'number',
            example: Date.now(),
          },
        },
      },
    }),
    ApiOkResponse({
      description: `${entityName} obtained successfully`,
      schema: {
        allOf: [
          { $ref: getSchemaPath(SuccessResponse) },
          {
            properties: {
              payload: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
    ...additionalApiDecorators
  );
};
