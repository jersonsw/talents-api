import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { Gender } from '../../../core/features/users/enums/gender';
import { UserLocale } from '../../../core/features/users/enums/user-locale';
import { UserStatus } from '../../../core/features/users/enums/user-status';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @PrimaryColumn({ type: 'uuid', nullable: false, generated: false })
  id: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: false })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: false })
  lastName: string;

  @Column({ type: 'varchar', length: 60, nullable: false, unique: true })
  username: string;

  @Column({ type: 'varchar', nullable: true })
  picture: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email: string;

  @Column({ name: 'email_verified', type: 'boolean', nullable: false })
  emailVerified: boolean;

  @Column({ name: 'gender', type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: string;

  @Column({ name: 'zone_info', type: 'varchar', length: 255 })
  zoneInfo: string;

  @Column({ type: 'enum', enum: UserLocale })
  locale: UserLocale;

  @Column({ name: 'phone_number', type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({ name: 'phone_number_verified', type: 'boolean' })
  phoneNumberVerified: boolean;

  @Column({ type: 'enum', enum: UserStatus })
  status: UserStatus;

  @Column({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'now()',
  })
  updatedAt: Date;

  static builder(): UserEntityBuilder {
    return new UserEntityBuilder();
  }
}

class UserEntityBuilder {
  private readonly user: UserEntity;

  constructor() {
    this.user = new UserEntity();
  }

  withId(id: string): UserEntityBuilder {
    this.user.id = id;
    return this;
  }

  withFirstName(firstName: string): UserEntityBuilder {
    this.user.firstName = firstName;
    return this;
  }

  withLastName(lastName: string): UserEntityBuilder {
    this.user.lastName = lastName;
    return this;
  }

  withUsername(username: string): UserEntityBuilder {
    this.user.username = username;
    return this;
  }

  withPicture(picture: string): UserEntityBuilder {
    this.user.picture = picture;
    return this;
  }

  withEmail(email: string): UserEntityBuilder {
    this.user.email = email;
    return this;
  }

  withEmailVerified(emailVerified: boolean): UserEntityBuilder {
    this.user.emailVerified = emailVerified;
    return this;
  }

  withGender(gender: Gender): UserEntityBuilder {
    this.user.gender = gender;
    return this;
  }

  withBirthDate(birthDate: string): UserEntityBuilder {
    this.user.birthDate = birthDate;
    return this;
  }

  withZoneInfo(zoneInfo: string): UserEntityBuilder {
    this.user.zoneInfo = zoneInfo;
    return this;
  }

  withLocale(locale: UserLocale): UserEntityBuilder {
    this.user.locale = locale;
    return this;
  }

  withPhoneNumber(phoneNumber: string): UserEntityBuilder {
    this.user.phoneNumber = phoneNumber;
    return this;
  }

  withPhoneNumberVerified(phoneNumberVerified: boolean): UserEntityBuilder {
    this.user.phoneNumberVerified = phoneNumberVerified;
    return this;
  }

  withStatus(status: UserStatus): UserEntityBuilder {
    this.user.status = status;
    return this;
  }

  build(): UserEntity {
    return this.user;
  }
}
