import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { UserStatus } from '../../../core/features/users/enums/user-status';
import { Gender } from '../../../core/features/users/enums/gender';

const tableName = 'users';

export class MigrationCreateUsersTable1726485960196 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userStatuses = Object.values(UserStatus).join("', '");
    const genders = Object.values(Gender).join("', '");

    await queryRunner.query('DROP TYPE IF EXISTS user_status');
    await queryRunner.query('DROP TYPE IF EXISTS gender');

    await queryRunner.query(`CREATE TYPE user_status AS ENUM ('${userStatuses}')`);
    await queryRunner.query(`CREATE TYPE gender AS ENUM ('${genders}')`);

    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isNullable: false,
            isGenerated: false,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'username',
            type: 'varchar',
            length: '60',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'picture',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          { name: 'email_verified', type: 'boolean', isNullable: false },
          {
            name: 'gender',
            type: 'gender',
            isNullable: false,
          },
          {
            name: 'birth_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'user_status',
            isNullable: false,
          },
          {
            name: 'zone_info',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'locale',
            type: 'varchar',
            enum: ['en', 'es'],
            isNullable: false,
          },
          {
            name: 'phone_number',
            type: 'varchar',
            length: '15',
            isNullable: true,
          },
          {
            name: 'phone_number_verified',
            type: 'boolean',
            isNullable: false,
          },
          {
            name: 'address',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName, true, true, true);

    await queryRunner.query('DROP TYPE IF EXISTS user_status');
    await queryRunner.query('DROP TYPE IF EXISTS gender');
  }
}
