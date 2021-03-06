import { EntityRepository, Repository } from 'typeorm';
import { User } from 'src/entities/User';

@EntityRepository(User)
export class UserRespository extends Repository<User> {}
