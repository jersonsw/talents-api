import 'reflect-metadata';
import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { InputValidationError } from '../commons/input-validation.error';
import { SuccessResponse } from '../dtos';
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

export const ApiCreatedRespDoc = <TModel extends Type>(props: Props<TModel>) => {
  const isArray = props.isArray || false;
  const additionalApiDecorators = props.additionalApiDecorators || [];
  const entityName = props.entityName || 'Element';
  const model = props.model;

  const createdWord = 'created';
  const newWord = 'new';
  const pronoun = 'The';
  const $ref = getSchemaPath(model);
  const payload = isArray ? { type: 'array', items: { $ref } } : { $ref };

  const summary = props.summary || `Create ${newWord} ${entityName.toLowerCase()}`;
  const description = props.description || summary;

  return applyDecorators(
    ApiExtraModels(SuccessResponse, model, InputValidationError),
    ApiOperation({ summary, description }),
    ApiConflictResponse({
      description: `${pronoun} ${entityName.toLowerCase()} already exists`,
      schema: {
        properties: {
          errorType: {
            type: 'string',
            example: ErrorType.AlreadyExists,
            enum: Object.values(ErrorType),
          },
          message: {
            type: 'string',
            example: `${pronoun} ${entityName.toLowerCase()} you are trying to create already exists`,
          },
          timestamp: {
            type: 'number',
            example: Date.now(),
          },
        },
      },
    }),
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
            example: `You do not have permission to create ${pronoun.toLowerCase()} ${entityName.toLowerCase()}`,
          },
          timestamp: {
            type: 'number',
            example: Date.now(),
          },
        },
      },
    }),
    ApiUnprocessableEntityResponse({
      description: 'Validation errors',
      schema: {
        type: 'object',
        properties: {
          errorType: {
            type: 'string',
            example: ErrorType.ValidationErrors,
            enum: Object.values(ErrorType),
          },
          message: {
            type: 'string',
            example: `Validation errors found while trying to create ${pronoun.toLowerCase()} ${entityName.toLowerCase()}`,
          },
          timestamp: {
            type: 'number',
            example: Date.now(),
          },
          validationErrors: {
            type: 'array',
            items: {
              type: 'object',
              $ref: getSchemaPath(InputValidationError),
            },
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Bad request',
      schema: {
        properties: {
          errorType: {
            type: 'string',
            example: ErrorType.BadRequest,
            enum: Object.values(ErrorType),
          },
          message: {
            type: 'string',
            example: 'Could not process the request due to a malformed request',
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
            example: `Unexpected error trying to create ${pronoun.toLowerCase()} ${entityName.toLowerCase()}`,
          },
          timestamp: {
            type: 'number',
            example: Date.now(),
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: `${entityName} ${createdWord} successfully`,
      schema: {
        allOf: [{ $ref: getSchemaPath(SuccessResponse) }, { properties: { payload } }],
      },
    }),
    ...additionalApiDecorators
  );
};
