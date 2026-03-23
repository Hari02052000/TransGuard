import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '@src/modules/auth/application/auth.service';
import { UserRepositoryInterface } from '@src/modules/auth/domain';
import {
  PasswordHasherInterface,
  TokenServiceInterface,
} from '@src/modules/auth/application/interfaces';
import { User } from '@src/modules/auth/domain/user.entity';

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


describe('AuthService - register', () => {
  let authService: AuthService;

  const validInput = {
    name: 'Hari',
    email: 'hari@test.com',
    password: 'Password@123',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService(
      mockUserRepo,
      mockHasher,
      mockTokenService
    );
  });

  it('should register a user successfully', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(null);
    mockHasher.hash = vi.fn().mockResolvedValue('hashed-password');
    mockUserRepo.create = vi.fn().mockImplementation(async (user: User) => user);

    const result = await authService.register(validInput);

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(validInput.email);
    expect(mockHasher.hash).toHaveBeenCalledWith(validInput.password);
    expect(mockUserRepo.create).toHaveBeenCalledTimes(1);

    expect(result).toMatchObject({
      name: validInput.name,
      email: validInput.email,
      role: 'ANALYST',
    });

    expect(result).not.toHaveProperty('passwordHash');
  });

  it('should throw ConflictError if email already exists', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue({ id: '1' } as any);

    await expect(authService.register(validInput)).rejects.toThrow('Email already exists');

    expect(mockUserRepo.create).not.toHaveBeenCalled();
    expect(mockHasher.hash).not.toHaveBeenCalled();
  });

  it('should throw ValidationError if required fields are missing', async () => {
    await expect(authService.register({} as any)).rejects.toThrow();
  });

  it('should throw ValidationError if name is empty', async () => {
    const input = { ...validInput, name: '' };

    await expect(authService.register(input)).rejects.toThrow();
  });

  it('should hash password before saving user', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(null);
    mockHasher.hash = vi.fn().mockResolvedValue('hashed-password');
    mockUserRepo.create = vi.fn().mockImplementation(async (user: User) => user);

    await authService.register(validInput);

    expect(mockHasher.hash).toHaveBeenCalledTimes(1);
    expect(mockHasher.hash).toHaveBeenCalledWith(validInput.password);
  });

  it('should persist user using repository', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(null);
    mockHasher.hash = vi.fn().mockResolvedValue('hashed-password');
    mockUserRepo.create = vi.fn().mockImplementation(async (user: User) => user);

    await authService.register(validInput);

    expect(mockUserRepo.create).toHaveBeenCalledTimes(1);
  });

  it('should throw InternalServerError if hashing fails', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(null);
    mockHasher.hash = vi.fn().mockRejectedValue(new Error('hash fail'));

    await expect(authService.register(validInput)).rejects.toThrow('Failed to register user');
  });

  it('should throw InternalServerError if repository create fails', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(null);
    mockHasher.hash = vi.fn().mockResolvedValue('hashed-password');
    mockUserRepo.create = vi.fn().mockRejectedValue(new Error('db fail'));

    await expect(authService.register(validInput)).rejects.toThrow('Failed to register user');
  });

  it('should return a sanitized user object', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(null);
    mockHasher.hash = vi.fn().mockResolvedValue('hashed-password');
    mockUserRepo.create = vi.fn().mockImplementation(async (user: User) => user);

    const result = await authService.register(validInput);

    expect(result).not.toHaveProperty('passwordHash');
    expect(result).not.toHaveProperty('salt');
  });

  it('should include timestamps and id in response', async () => {
    mockUserRepo.findByEmail = vi.fn().mockResolvedValue(null);
    mockHasher.hash = vi.fn().mockResolvedValue('hashed-password');
    mockUserRepo.create = vi.fn().mockImplementation(async (user: User) => user);

    const result = await authService.register(validInput);

    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });
});