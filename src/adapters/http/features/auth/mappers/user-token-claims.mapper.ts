import { UserTokenClaims } from '../dtos';
import { User } from '../../../../../core/features/users/domain/user';
import { Role } from '../../../../../core/features/users/enums/role';

export class UserTokenClaimsMapper {
  static toDomain(raw: UserTokenClaims): User {
    const platformRoles = raw.realm_roles || [];
    const clientRoles = raw.client_roles || [];
    const roles: Role[] = platformRoles.concat(clientRoles);

    return User.builder()
      .withId(raw.sub)
      .withUsername(raw.preferred_username)
      .withFirstName(raw.given_name)
      .withLastName(raw.family_name)
      .withEmail(raw.email)
      .withEmailVerified(!!raw.email_verified)
      .withPhoneNumber(raw.phone_number)
      .withPhoneNumberVerified(!!raw.phone_number_verified)
      .withGender(raw.gender)
      .withPicture(raw.picture)
      .withRoles(raw.realm_roles || [])
      .withRoles(roles)
      .withBirthDate(raw.birthdate)
      .build();
  }
}
