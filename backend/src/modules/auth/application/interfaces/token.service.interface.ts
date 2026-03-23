export interface TokenPayload {
  userId: string;
  role: string;
}

export interface TokenServiceInterface {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyRefreshToken(token: string): Promise<TokenPayload>;
}