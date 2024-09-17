import { DbConstraint } from './enums';

export const throwConstraintException = (error: Error & { constraint: DbConstraint }) => {
  console.log('error', error);
};
