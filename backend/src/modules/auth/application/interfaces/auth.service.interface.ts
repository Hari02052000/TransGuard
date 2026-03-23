import { User,SafeUser } from '@src/modules/auth/domain';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthServiceInterface {
  register(input: RegisterInput): Promise<SafeUser>;

  login(input: LoginInput): Promise<AuthTokens>;

  refreshToken(token: string): Promise<AuthTokens>;

  logout(userId: string): Promise<void>;

  getMe(userId: string): Promise<User | null>;
}