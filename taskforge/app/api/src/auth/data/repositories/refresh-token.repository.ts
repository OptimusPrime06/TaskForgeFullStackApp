import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from '../entities/refresh.token.entity';
import { IRefreshTokenRepository } from '../../business.logic/interfaces/i.refresh-token.repository';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
    constructor(
        @InjectRepository(RefreshToken)
        private readonly typeOrmRepo: Repository<RefreshToken>,
    ) {}

    async findByToken(token: string): Promise<RefreshToken | null> {
        return this.typeOrmRepo.findOne({
            where: { token },
            relations: ['user'],
        });
    }

    async saveToken(refreshToken: RefreshToken): Promise<RefreshToken> {
        return this.typeOrmRepo.save(refreshToken);
    }

    createToken(data: Partial<RefreshToken>): RefreshToken {
        return this.typeOrmRepo.create(data);
    }

    async revokeToken(refreshToken: RefreshToken): Promise<RefreshToken> {
        refreshToken.isRevoked = true;
        return this.typeOrmRepo.save(refreshToken);
    }
}
