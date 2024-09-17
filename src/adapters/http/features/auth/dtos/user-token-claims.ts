import { Gender } from '../../../../../core/features/users/enums/gender';
import { Role } from '../../../../../core/features/users/enums/role';

export interface UserTokenClaims {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  scope: string;
  sid: string;
  email_verified: boolean;
  phone_number: string;
  phone_number_verified: boolean;
  birthdate: string;
  gender: Gender;
  preferred_username: string;
  given_name: string;
  picture: string;
  realm_roles: Role[];
  client_roles: Role[];
  address: UserAddressClaims;
  company_branch?: UserCompanyBranchClaims;
  name: string;
  family_name: string;
  email: string;
}

export interface UserCompanyBranchClaims {
  branch_id: string;
  company_id: string;
}

export interface UserAddressClaims {
  street: string;
  locality: string;
  region: string;
  postal_code: number;
  country: string;
}
