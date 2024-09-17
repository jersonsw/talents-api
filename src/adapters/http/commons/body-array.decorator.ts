import { Body, ParseArrayPipe, Type, UnprocessableEntityException, ValidationError } from '@nestjs/common';
import { mapValidationErrors } from './exceptions/exceptions.helper';

export const BodyArray = <TModel extends Type>(model: TModel) => {
  return Body(
    new ParseArrayPipe({
      items: model,
      exceptionFactory: (errors: ValidationError[]) => {
        const validationErrors = mapValidationErrors(errors);

        throw new UnprocessableEntityException({
          validationErrors,
          message: 'Se encontraron errores al validar los datos',
        });
      },
    })
  );
};
