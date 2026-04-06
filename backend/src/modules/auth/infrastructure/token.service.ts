import { injectable } from 'tsyringe';
import type { TokenServiceInterface } from '@src/modules/auth/application/interfaces';

export interface TokenPayload {
  userId: string;
  role: string;
}

@injectable()
export class JwtTokenService implements TokenServiceInterface {
  generateAccessToken(payload: TokenPayload): string {
    throw new Error('Not implemented - requires jsonwebtoken dependency');
  }

  generateRefreshToken(payload: TokenPayload): string {
    throw new Error('Not implemented - requires jsonwebtoken dependency');
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    throw new Error('Not implemented - requires jsonwebtoken dependency');
  }
}
