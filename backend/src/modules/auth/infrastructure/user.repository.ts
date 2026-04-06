import { injectable } from 'tsyringe';
import type { User } from '@src/modules/auth/domain/user.entity';
import type { UserRepositoryInterface } from '@src/modules/auth/domain';

@injectable()
export class UserRepository implements UserRepositoryInterface {
  async findById(id: string): Promise<User | null> {
    throw new Error('Not implemented');
  }

  async findByEmail(email: string): Promise<User | null> {
    throw new Error('Not implemented');
  }

  async create(user: User): Promise<User> {
    throw new Error('Not implemented');
  }

  async update(user: User): Promise<void> {
    throw new Error('Not implemented');
  }

  async delete(id: string): Promise<void> {
    throw new Error('Not implemented');
  }
}
