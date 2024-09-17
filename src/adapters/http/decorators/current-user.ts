import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../../core/features/users/domain/user';

export const CurrentUser = createParamDecorator((data, ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();

  return new User(req.user);
});
