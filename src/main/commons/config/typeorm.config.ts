import { DataSource, LoggerOptions } from 'typeorm';
import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { SeederOptions } from 'typeorm-extension';
import { CustomNamingStrategy } from '../../../adapters/data/commons';

config();

const {
  TYPEORM_HOST,
  TYPEORM_PORT,
  TYPEORM_DATABASE,
  TYPEORM_USERNAME,
  TYPEORM_PASSWORD,
  TYPEORM_MIGRATIONS,
  TYPEORM_ENTITIES,
  TYPEORM_SYNCHRONIZE,
  TYPEORM_LOGGING,
  TYPEORM_AUTORUN_MIGRATIONS,
  TYPEORM_AUTOLOAD,
  TYPEORM_SEEDERS_DIR,
  TYPEORM_FACTORIES_DIR,
} = process.env;

export const defaultConnection: DataSourceOptions &
  SeederOptions & {
    autoLoadEntities: boolean;
  } = {
  type: 'postgres',
  host: TYPEORM_HOST,
  port: +TYPEORM_PORT,
  database: TYPEORM_DATABASE,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  entities: [TYPEORM_ENTITIES],
  migrations: [TYPEORM_MIGRATIONS],
  uuidExtension: 'uuid-ossp',
  migrationsTransactionMode: 'each',
  synchronize: TYPEORM_SYNCHRONIZE === 'true',
  logging: TYPEORM_LOGGING as LoggerOptions,
  migrationsRun: TYPEORM_AUTORUN_MIGRATIONS === 'true',
  useUTC: true,
  autoLoadEntities: TYPEORM_AUTOLOAD === 'true',
  namingStrategy: new CustomNamingStrategy(),
  seeds: [TYPEORM_SEEDERS_DIR],
  factories: [TYPEORM_FACTORIES_DIR],
};

export default new DataSource(defaultConnection);
