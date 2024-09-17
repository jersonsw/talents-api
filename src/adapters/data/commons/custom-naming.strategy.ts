import { DefaultNamingStrategy, Table } from 'typeorm';

export class CustomNamingStrategy extends DefaultNamingStrategy {
  override indexName(tableOrName: Table | string, columnNames: string[]): string {
    const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;

    return `idx_${tableName}_${columnNames.join('_')}`;
  }

  override primaryKeyName(tableOrName: Table | string, columnNames: string[]): string {
    const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;

    return `pk_${tableName}_${columnNames.join('_')}`;
  }

  override uniqueConstraintName(tableOrName: Table | string, columnNames: string[]): string {
    const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;

    return `unique_${tableName}_${columnNames.join('_')}`;
  }

  override foreignKeyName(tableOrName: Table | string, columnNames: string[]): string {
    const tableName = tableOrName instanceof Table ? tableOrName.name : tableOrName;

    return `fk_${tableName}_${columnNames.join('_')}`;
  }
}
