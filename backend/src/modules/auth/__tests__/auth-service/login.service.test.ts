import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '@src/modules/auth/application/auth.service';
import type { User, UserRepositoryInterface } from '@src/modules/auth/domain';
import type {
  LoginInput,
  PasswordHasherInterface,
  TokenServiceInterface,
} from '@src/modules/auth/application/interfaces';

describe('AuthService - login', () => {
  let authService: AuthService;

  const mockUserRepo: UserRepositoryInterface = {
    findByEmail: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  const mockHasher: PasswordHasherInterface = {
    hash: vi.fn(),
    compare: vi.fn(),
  };

  const mockTokenService: TokenServiceInterface = {
    generateAccessToken: vi.fn(),
    generateRefreshToken: vi.fn(),
    verifyRefreshToken: vi.fn(),
  };

  const validInput = {
    email: 'hari@test.com',
    password: 'Password@123',
  };

  const mockUser = {
    id: 'user-id',
    email: validInput.email,
    passwordHash: 'hashed-password',
    role: 'ANALYST',
    toSafeObject: () => ({
      id: 'user-id',
      email: validInput.email,
      role: 'ANALYST',
    }),
  } as User;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService(mockUserRepo, mockHasher, mockTokenService);
  });

  it('should login successfully and return tokens', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(mockUser);
    mockHasher.compare = vi.fn().mockResolvedValue(true);
    mockTokenService.generateAccessToken = vi.fn().mockReturnValue('access-token');
    mockTokenService.generateRefreshToken = vi.fn().mockReturnValue('refresh-token');

    const result = await authService.login(validInput);

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(validInput.email);
    expect(mockHasher.compare).toHaveBeenCalledWith(validInput.password, mockUser.passwordHash);

    expect(result).toMatchObject({
      user: {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      },
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('should throw error if user not found', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(null);

    await expect(authService.login(validInput)).rejects.toThrow();
  });

  it('should throw error if password is incorrect', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(mockUser);
    mockHasher.compare = vi.fn().mockResolvedValue(false);

    await expect(authService.login(validInput)).rejects.toThrow();
  });

  it('should throw error if email is invalid', async () => {
    const input = { ...validInput, email: 'invalid-email' };

    await expect(authService.login(input)).rejects.toThrow();
  });

  it('should throw error if required fields missing', async () => {
    await expect(authService.login({} as unknown as LoginInput)).rejects.toThrow();
  });

  it('should generate tokens correctly', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(mockUser);
    mockHasher.compare = vi.fn().mockResolvedValue(true);

    await authService.login(validInput);

    expect(mockTokenService.generateAccessToken).toHaveBeenCalled();
    expect(mockTokenService.generateRefreshToken).toHaveBeenCalled();
  });

  it('should throw if repository fails', async () => {
    mockUserRepo.findByEmail = vi.fn().mockRejectedValue(new Error());

    await expect(authService.login(validInput)).rejects.toThrow();
  });

  it('should throw if hashing compare fails', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(mockUser);
    mockHasher.compare = vi.fn().mockRejectedValue(new Error());

    await expect(authService.login(validInput)).rejects.toThrow();
  });

  it('should not expose sensitive fields', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(mockUser);
    mockHasher.compare = vi.fn().mockResolvedValue(true);

    const result = await authService.login(validInput);

    expect(result.user).not.toHaveProperty('passwordHash');
  });
});
