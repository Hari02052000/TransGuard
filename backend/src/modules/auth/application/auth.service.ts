import { randomUUID } from 'crypto';
import { injectable, inject } from 'tsyringe';
import type { SafeUser, UserRepositoryInterface } from '@src/modules/auth/domain';
import { User } from '@src/modules/auth/domain/user.entity';
import type {
  AuthServiceInterface,
  LoginOutput,
  LoginInput,
  RegisterInput,
  TokenServiceInterface
} from '@src/modules/auth/application/interfaces';
import type { PasswordHasherInterface } from '@src/modules/auth/infrastructure/password.hasher';
import {
  ValidationError,
  ConflictError,
  InternalServerError,
  UnauthorizedError,
} from '@src/shared/errors';
import { UserRepositoryToken, PasswordHasherToken, TokenServiceToken } from '@src/modules/auth/di/auth.tokens';

@injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @inject(UserRepositoryToken) private readonly userRepo: UserRepositoryInterface,
    @inject(PasswordHasherToken) private readonly hasher: PasswordHasherInterface,
    @inject(TokenServiceToken) private readonly tokenService: TokenServiceInterface,
  ) {}
  async register(input: RegisterInput): Promise<SafeUser> {
    try {
      if (!input || !input.email || !input.password || !input.name) {
        throw new ValidationError('Name, email and password are required');
      }
      const existingUser = await this.userRepo.findByEmail(input.email);
      if (existingUser) {
        throw new ConflictError('Email already exists');
      }
      const passwordHash = await this.hasher.hash(input.password);
      const user = User.create({
        id: randomUUID(),
        name: input.name,
        email: input.email,
        passwordHash,
      });
      const savedUser = await this.userRepo.create(user);

      return savedUser.toSafeObject();
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError) {
        throw error;
      }
      throw new InternalServerError('Failed to register user');
    }
  }
  async login(input: LoginInput): Promise<LoginOutput> {
    try {
      if (!input?.email || !input?.password) {
        throw new ValidationError('Email and password required');
      }

      if (!input.email.includes('@')) {
        throw new ValidationError('Invalid email format');
      }

      const user = await this.userRepo.findByEmail(input.email);
      if (!user) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const isMatch = await this.hasher.compare(input.password, user.passwordHash);

      if (!isMatch) {
        throw new UnauthorizedError('Invalid credentials');
      }

      const accessToken = this.tokenService.generateAccessToken({
        userId: user.id,
        role: user.role,
      });

      const refreshToken = this.tokenService.generateRefreshToken({
        userId: user.id,
        role: user.role,
      });

      return {
        user: user.toSafeObject(),
        accessToken,
        refreshToken,
      };
    } catch (error) {
      if (error instanceof ValidationError || error instanceof UnauthorizedError) {
        throw error;
      }
      throw new InternalServerError('Failed to login');
    }
  }
  refreshToken(token: string): Promise<LoginOutput> {
    console.log(token);
    throw new Error('Method not implemented.');
  }
  logout(userId: string): Promise<void> {
    console.log(userId);
    throw new Error('Method not implemented.');
  }
  getMe(userId: string): Promise<User | null> {
    console.log(userId);
    throw new Error('Method not implemented.');
  }
}
