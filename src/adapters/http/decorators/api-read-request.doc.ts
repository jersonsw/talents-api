import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import 'reflect-metadata';
import { ApiQueryOptions } from '@nestjs/swagger/dist/decorators/api-query.decorator';

export const ApiReadRequestDoc = (queries: ApiQueryOptions[]) => {
  return applyDecorators(...queries.map((query) => ApiQuery(query)));
};
