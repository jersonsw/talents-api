import dataSource from '../../../main/commons/config/typeorm.config';
import { Migration } from 'typeorm';

async function rollbackAllMigrations() {
  await dataSource.initialize();
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  const migrations: Migration[] = await queryRunner.query(`SELECT * FROM "migrations" ORDER BY "timestamp" DESC`);

  while (migrations.length > 0) {
    const { name, timestamp } = migrations.shift();
    const migrationName = name.replace(timestamp.toString(), '');
    try {
      await dataSource.undoLastMigration();

      console.info(`✔ Migration ${migrationName} rolled back`);
    } catch (error) {
      if (error.message.includes(`No migration ${name} was found`)) {
        await queryRunner.query(`DELETE FROM migrations WHERE timestamp = '${timestamp}'`);
      } else {
        console.log(`Error rolling back migration ${name}:`, error.message);
        break;
      }
    }
  }

  await queryRunner.release();
  await dataSource.destroy();
}

rollbackAllMigrations()
  .then(() => {
    console.info('\n ✔ All migrations have been rolled back.');
  })
  .catch((error) => {
    console.error('Error rolling back migrations:', error);
  });
