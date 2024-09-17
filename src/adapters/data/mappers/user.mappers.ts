import { UserEntity } from '../entities';
import { User } from '../../../core/features/users/domain/user';

export const mapUserToDomain = async (e: UserEntity): Promise<User> => {
  return User.builder()
    .withId(e.id)
    .withUsername(e.username)
    .withEmail(e.email)
    .withEmailVerified(e.emailVerified)
    .withPhoneNumber(e.phoneNumber)
    .withPhoneNumberVerified(e.phoneNumberVerified)
    .withZoneInfo(e.zoneInfo)
    .withPicture(e.picture)
    .withZoneInfo(e.zoneInfo)
    .withGender(e.gender)
    .withLastName(e.lastName)
    .withFirstName(e.firstName)
    .withEmail(e.email)
    .withStatus(e.status)
    .withLocale(e.locale)
    .withBirthDate(e.birthDate)
    .build();
};

export const mapUserToDbEntity = (e: User): UserEntity => {
  return UserEntity.builder()
    .withId(e?.id)
    .withUsername(e.username)
    .withEmail(e.email)
    .withEmailVerified(e.emailVerified)
    .withPhoneNumber(e.phoneNumber)
    .withPhoneNumberVerified(e.phoneNumberVerified)
    .withZoneInfo(e.zoneInfo)
    .withPicture(e.picture)
    .withZoneInfo(e.zoneInfo)
    .withGender(e.gender)
    .withLastName(e.lastName)
    .withFirstName(e.firstName)
    .withEmail(e.email)
    .withStatus(e.status)
    .withLocale(e.locale)
    .withBirthDate(e.birthDate)
    .build();
};
