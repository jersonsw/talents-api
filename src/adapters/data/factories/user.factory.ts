import { setSeederFactory } from 'typeorm-extension';
import { mapUserToDbEntity } from '../mappers';
import { fakeUser } from '../fakers';
import { UserEntity } from '../entities';

export default setSeederFactory(UserEntity, () => {
  return mapUserToDbEntity(fakeUser());
});
