import * as dotenv from 'dotenv';
import datasource from '../../../main/commons/config/typeorm.config';

dotenv.config();

async function rollbackAll() {
  const connection = await datasource.initialize();
  const queryRunner = connection.createQueryRunner();
  await queryRunner.connect();

  const tables = await queryRunner.query(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public';
  `);

  const sequences = await queryRunner.query(`
    SELECT sequence_name
    FROM information_schema.sequences
    WHERE sequence_schema = 'public';
  `);

  const indexes = await queryRunner.query(`
    SELECT indexname
    FROM pg_indexes
    WHERE schemaname = 'public';
  `);

  // Dropping tables
  for (const table of tables) {
    await queryRunner.query(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`);
  }

  // Dropping sequences
  for (const sequence of sequences) {
    await queryRunner.query(`DROP SEQUENCE IF EXISTS "${sequence.sequence_name}" CASCADE;`);
  }

  // Dropping indexes
  for (const index of indexes) {
    await queryRunner.query(`DROP INDEX IF EXISTS "${index.indexname}" CASCADE;`);
  }

  // Dropping enums
  const enums = await queryRunner.query(`
    SELECT t.typname as enum_name
    FROM pg_type t 
    JOIN pg_enum e ON t.oid = e.enumtypid 
    JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace 
    WHERE n.nspname = 'public'
    GROUP BY enum_name;
  `);

  for (const enumType of enums) {
    await queryRunner.query(`DROP TYPE IF EXISTS "${enumType.enum_name}" CASCADE;`);
  }

  await queryRunner.release();
  await connection.destroy();
}

rollbackAll()
  .then(() => {
    console.log('All tables, constraints, indexes, and sequences have been deleted.');
  })
  .catch((error) => {
    console.error('Error deleting tables, constraints, indexes, and sequences:', error);
  });
