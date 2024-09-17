import { applyDecorators, Type } from '@nestjs/common';
import {
  getSchemaPath,
  ApiExtraModels,
  ApiOperation,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiUnprocessableEntityResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { SuccessResponse } from '../dtos';
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

export const ApiUpdatedResp = <TModel extends Type>(props: Props<TModel>) => {
  const additionalApiDecorators = props.additionalApiDecorators || [];
  const entityName = props.entityName || 'Element';
  const model = props.model;
  const summary = props.summary || `Updates the ${entityName.toLowerCase()}`;
  const description = props.description || summary;

  const $ref = getSchemaPath(model);
  const payload = props.isArray ? { type: 'array', items: { $ref } } : { $ref };

  return applyDecorators(
    ApiExtraModels(SuccessResponse, model, InputValidationError),
    ApiOperation({ summary, description }),
    ApiConflictResponse({
      description: 'Conflict',
      schema: {
        properties: {
          errorType: {
            type: 'string',
            example: ErrorType.AlreadyExists,
            enum: Object.values(ErrorType),
          },
          message: {
            type: 'string',
            example: `You're trying to update the ${entityName.toLowerCase()} to a value that already exists, so it causes a conflict`,
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
            example: `You don't have access to update the ${entityName.toLowerCase()}`,
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
            example: `Validation errors occurred trying to update the ${entityName.toLowerCase()}`,
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
            example: 'The request sent could not be understood',
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
            example: `Unexpected error trying to the ${entityName.toLowerCase()}`,
          },
          timestamp: {
            type: 'number',
            example: Date.now(),
          },
        },
      },
    }),
    ApiOkResponse({
      description: `${entityName} updated successfully`,
      schema: {
        allOf: [{ $ref: getSchemaPath(SuccessResponse) }, { properties: { payload } }],
      },
    }),
    ...additionalApiDecorators
  );
};
