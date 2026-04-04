import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/business.logic/services/users.service';
import { EnvKeys } from '../../common/constants/env.keys';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private usersService: UsersService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>(EnvKeys.JWT_SECRET)!,
        });
    }

    async validate(payload: { sub: string; email: string }) {
        const user = await this.usersService.findById(payload.sub);
        if (!user) throw new UnauthorizedException();
        return user;
    }
}