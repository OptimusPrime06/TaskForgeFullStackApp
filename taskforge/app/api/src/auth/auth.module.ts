import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './business.logic/services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshToken } from './data/entities/refresh.token.entity';
import { RefreshTokenRepository } from './data/repositories/refresh-token.repository';
import { IRefreshTokenRepository } from './business.logic/interfaces/i.refresh-token.repository';
import { UsersModule } from '../users/users.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([RefreshToken]),
        PassportModule,
        JwtModule.register({}),
        UsersModule,
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: IRefreshTokenRepository,
            useClass: RefreshTokenRepository,
        },
        AuthService,
        JwtStrategy,
    ],
})
export class AuthModule {}
