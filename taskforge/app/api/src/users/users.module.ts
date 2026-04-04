import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './data/entities/user.entity';
import { UserRepository } from './data/repositories/user.repository';
import { UsersService } from './business.logic/services/users.service';
import { IUserRepository } from './business.logic/interfaces/i.user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    providers: [
        {
            provide: IUserRepository,
            useClass: UserRepository,
        },
        UsersService,
    ],
    exports: [UsersService],
})
export class UsersModule {}
