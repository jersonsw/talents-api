import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';
import { ApplicantStatus } from '../../../core/features/applicants/enums/applicant-status';

const tableName = 'applicants';

export class MigrationCreateApplicantsTable1726533314147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const applicantStatuses = Object.values(ApplicantStatus).join("', '");
    await queryRunner.query('DROP TYPE IF EXISTS applicant_status');
    await queryRunner.query(`CREATE TYPE applicant_status AS ENUM ('${applicantStatuses}')`);

    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
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
            name: 'email',
            type: 'varchar',
            length: '60',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'mobile_number',
            type: 'varchar',
            length: '15',
            isNullable: false,
          },
          {
            name: 'gender',
            type: 'gender',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'applicant_status',
            isNullable: false,
          },
          {
            name: 'status_reason',
            type: 'varchar',
            isNullable: true,
            length: '255',
          },
          {
            name: 'birth_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'github_profile',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'linkedin_profile',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_by',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'updated_by',
            type: 'uuid',
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
      true,
      true,
      true
    );

    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        columnNames: ['created_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      })
    );

    await queryRunner.createForeignKey(
      tableName,
      new TableForeignKey({
        columnNames: ['updated_by'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName, true, true, true);
  }
}
