import { SetMetadata } from '@nestjs/common';
import { Role } from '../../../../core/features/users/enums/role';

export const ROLES_KEY = 'roles';

export type RolesMetadata = {
  roles: Role[];
  errMsg?: string;
};

export const Roles = (roles: Role[], errMsg?: string) => SetMetadata(ROLES_KEY, { roles, errMsg });
