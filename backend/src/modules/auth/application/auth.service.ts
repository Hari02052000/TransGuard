import { randomUUID } from 'crypto';
import { SafeUser, User, UserRepositoryInterface } from "../domain";
import { AuthServiceInterface, AuthTokens, LoginInput, RegisterInput,PasswordHasherInterface,TokenServiceInterface } from "./interfaces";
import { ValidationError,ConflictError,InternalServerError } from "@src/shared/errors";

export class AuthService implements AuthServiceInterface {
    constructor(
        private readonly userRepo: UserRepositoryInterface,
        private readonly hasher: PasswordHasherInterface,
        private readonly tokenService: TokenServiceInterface
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
   const  savedUser = await this.userRepo.create(user);
    return savedUser.toSafeObject();

     } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError) {
      throw error;
    }
    throw new InternalServerError('Failed to register user');
     }
    }
    login(input: LoginInput): Promise<AuthTokens> {
        throw new Error("Method not implemented.");
    }
    refreshToken(token: string): Promise<AuthTokens> {
        throw new Error("Method not implemented.");
    }
    logout(userId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getMe(userId: string): Promise<User | null> {
        throw new Error("Method not implemented.");
    }
}