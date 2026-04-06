import { container } from 'tsyringe';
import { UserRepositoryToken, PasswordHasherToken, TokenServiceToken } from '@src/modules/auth/di/auth.tokens';
import { UserRepository,BcryptHasher,JwtTokenService } from '@src/modules/auth/infrastructure';

container.registerSingleton(UserRepositoryToken, UserRepository);
container.registerSingleton(PasswordHasherToken, BcryptHasher);
container.registerSingleton(TokenServiceToken, JwtTokenService);
