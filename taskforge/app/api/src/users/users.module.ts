import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './data/entities/user.entity';
import { UserRepository } from './data/repositories/user.repository';
import { UsersService } from './business.logic/services/users.service';
import { IUserRepository } from './business.logic/interfaces/i.user.repository';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [UsersController],
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
