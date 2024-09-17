import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, RolesMetadata } from '../../../../../main/features/auth/decorators/roles.decorator';
import { User } from '../../../../../core/features/users/domain/user';
import { ErrorType } from '../../../../../core/commons/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  canActivate(context: ExecutionContext): boolean {
    const metadata = this.reflector.getAllAndOverride<RolesMetadata>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    const { roles, errMsg } = metadata || {};
    if (!roles?.length) return true;

    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    const hasPermissions = roles.some((role) => {
      return !!user.roles?.includes(role);
    });

    if (!hasPermissions) {
      throw new ForbiddenException({
        errorType: ErrorType.InsufficientPermissions,
        message: errMsg || 'You do not have the necessary permissions to perform this action.'
      });
    }

    return true;
  }
}
