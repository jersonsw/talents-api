import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { BaseSeed } from './base-seed';
import { UserEntity } from '../entities';

export default class InternalUserSeeder extends BaseSeed implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
    const usersRepository = dataSource.getRepository(UserEntity);

    const keycloakUsers = await this.getKeycloakUsers();
    const keycloakUserEntities = keycloakUsers.map(this.buildUserFromKeycloakDto);
    const syncedFromKeycloak = await usersRepository.save(keycloakUserEntities);

    syncedFromKeycloak.forEach((user) => {
      console.log(`✔ User ${user.username} created successfully!`);
    });

    // TODO: Uncomment below ↓ to add other users than the ones from Keycloak (if needed)
    /*
    const userFactory = factoryManager.get(UserEntity);
    const consumerUsers = await userFactory.saveMany(10);
    */

    console.log(`✔ ${syncedFromKeycloak.length} users have been synced🔄 successfully from Keycloak!`);
  }
}
