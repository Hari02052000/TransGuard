import { injectable } from 'tsyringe';

export interface PasswordHasherInterface {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

@injectable()
export class BcryptHasher implements PasswordHasherInterface {
  async hash(password: string): Promise<string> {
    throw new Error('Not implemented - requires bcrypt dependency');
  }

  async compare(password: string, hash: string): Promise<boolean> {
    throw new Error('Not implemented - requires bcrypt dependency');
  }
}
