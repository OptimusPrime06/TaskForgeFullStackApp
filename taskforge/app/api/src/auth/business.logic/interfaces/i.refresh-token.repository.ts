import { RefreshToken } from '../../data/entities/refresh.token.entity';

export abstract class IRefreshTokenRepository {
    abstract findByToken(token: string): Promise<RefreshToken | null>;
    abstract saveToken(refreshToken: RefreshToken): Promise<RefreshToken>;
    abstract createToken(data: Partial<RefreshToken>): RefreshToken;
    abstract revokeToken(refreshToken: RefreshToken): Promise<RefreshToken>;
}
