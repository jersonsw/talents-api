import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { KeycloakAdminService } from '../../../main/features/auth/keycloak-admin.service';
import { LoggingServiceAdapter } from '../../../main/commons/logging/logging.service.adapter';
import { UserEntity } from '../entities';
import { UserStatus } from '../../../core/features/users/enums/user-status';
import { UserLocale } from '../../../core/features/users/enums/user-locale';

export class BaseSeed {
  protected buildUserFromKeycloakDto(user: UserRepresentation): UserEntity {
    return UserEntity.builder()
      .withId(user.id)
      .withFirstName(user.firstName)
      .withLastName(user.lastName)
      .withUsername(user.username)
      .withEmail(user.email)
      .withEmailVerified(!!user.emailVerified)
      .withStatus(UserStatus.Active)
      .withZoneInfo('America/Santo_Domingo')
      .withBirthDate(user.attributes.birthdate[0])
      .withPhoneNumber(user.attributes.phoneNumber[0])
      .withPhoneNumberVerified(!!user.attributes.phoneNumberVerified)
      .withPicture(user.attributes.picture[0])
      .withLocale(UserLocale.En)
      .withGender(user.attributes.gender[0])
      .build();
  }

  protected async getKeycloakUsers(): Promise<UserRepresentation[]> {
    const configService = new ConfigService();
    const kcService = await KeycloakAdminService.factory(
      configService,
      new HttpService(),
      new LoggingServiceAdapter(configService)
    );
    const client = kcService.client();

    const realm = configService.get('KEYCLOAK_REALM');

    return client.users.find({ realm });
  }
}
