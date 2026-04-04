import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvKeys } from '../../../common/constants/env.keys';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../../users/business.logic/services/users.service';
import { IRefreshTokenRepository } from '../interfaces/i.refresh-token.repository';
import { RegisterDto } from '../../presentation/dto/register.dto';
import { LoginDto } from '../../presentation/dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly refreshTokenRepository: IRefreshTokenRepository,
    ) {}

    private generateAccessToken(payload: {sub: string, email: string}): string {
      const accessToken: string = this.jwtService.sign(payload, {
          secret: this.configService.get(EnvKeys.JWT_SECRET),
          expiresIn: this.configService.get(EnvKeys.JWT_EXPIRES_IN),
      });

      return accessToken;
    }

    private async generateRefreshToken(payload: {sub: string, email: string}): Promise<string> {
      const refreshTokenValue: string = this.jwtService.sign(payload, {
          secret: this.configService.get(EnvKeys.JWT_REFRESH_SECRET),
          expiresIn: this.configService.get(EnvKeys.JWT_REFRESH_EXPIRES_IN),
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const refreshToken = this.refreshTokenRepository.createToken({
          token: refreshTokenValue,
          expiresAt,
          user: { id: payload.sub } as any,
      });
      await this.refreshTokenRepository.saveToken(refreshToken);

      return refreshTokenValue
    }

    private async generateTokens(userId: string, email: string) {
      const payload = { sub: userId, email };

      const accessToken = this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);

      return { accessToken, refreshToken };
    }

    async register(dto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 12);

        const user = await this.usersService.addNewUser({
            email: dto.email,
            password: hashedPassword,
            role: dto.role,
        });

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordMatch = await bcrypt.compare(dto.password, user.password);
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = await this.generateTokens(user.id, user.email);

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
    }

    async refresh(token: string) {
        const storedToken = await this.refreshTokenRepository.findByToken(token);

        if (!storedToken || storedToken.isRevoked || storedToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        await this.refreshTokenRepository.revokeToken(storedToken);

        const newTokens = await this.generateTokens(storedToken.user.id, storedToken.user.email);

        return newTokens
    }

    async logout(token: string) {
        const storedToken = await this.refreshTokenRepository.findByToken(token);
        if (!storedToken) {
            throw new NotFoundException('Token not found');
        }

        await this.refreshTokenRepository.revokeToken(storedToken);
        return { message: 'Logged out successfully' };
    }

    async getProfile(userId: string) {
        const user = await this.usersService.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

}
