import { Gender } from '../enums/gender';
import { UserLocale } from '../enums/user-locale';
import { Role } from '../enums/role';
import { UserStatus } from '../enums/user-status';
import { DocType } from '../enums/doc-type';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  picture: string;
  email: string;
  emailVerified: boolean;
  gender: Gender;
  birthDate: string;
  zoneInfo: string;
  locale: UserLocale;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  roles: Role[];
  status: UserStatus;
  documentType: DocType;
  documentId: string;

  constructor(attrs: Partial<User> = {}) {
    Object.assign(this, attrs);
  }

  static builder(): UserBuilder {
    return new UserBuilder();
  }

  isPlatformAdmin(): boolean {
    return this.roles.includes(Role.PlatformAdmin);
  }

  isActive(): boolean {
    return this.status === UserStatus.Active;
  }

  isInactive(): boolean {
    return this.status === UserStatus.Inactive;
  }

  isSuspended(): boolean {
    return this.status === UserStatus.Suspended;
  }
}

class UserBuilder {
  private readonly user: User;

  constructor() {
    this.user = new User();
  }

  withId(id: string): UserBuilder {
    this.user.id = id;
    return this;
  }

  withFirstName(firstName: string): UserBuilder {
    this.user.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): UserBuilder {
    this.user.lastName = lastName;
    return this;
  }

  withUsername(username: string): UserBuilder {
    this.user.username = username;
    return this;
  }

  withPicture(picture: string): UserBuilder {
    this.user.picture = picture;
    return this;
  }

  withEmail(email: string): UserBuilder {
    this.user.email = email;
    return this;
  }

  withEmailVerified(emailVerified: boolean): UserBuilder {
    this.user.emailVerified = emailVerified;
    return this;
  }

  withGender(gender: Gender) {
    this.user.gender = gender;
    return this;
  }

  withBirthDate(birthDate: string) {
    this.user.birthDate = birthDate;
    return this;
  }

  withZoneInfo(zoneInfo: string) {
    this.user.zoneInfo = zoneInfo;
    return this;
  }

  withLocale(locale: UserLocale) {
    this.user.locale = locale;
    return this;
  }

  withPhoneNumber(phoneNumber: string) {
    this.user.phoneNumber = phoneNumber;
    return this;
  }

  withPhoneNumberVerified(phoneNumberVerified: boolean) {
    this.user.phoneNumberVerified = phoneNumberVerified;
    return this;
  }

  withRoles(roles: Role[]) {
    this.user.roles = roles;
    return this;
  }

  withStatus(status: UserStatus) {
    this.user.status = status;
    return this;
  }

  withDocumentType(documentType: DocType) {
    this.user.documentType = documentType;
    return this;
  }

  withDocumentId(documentId: string) {
    this.user.documentId = documentId;
    return this;
  }

  build() {
    return this.user;
  }
}
