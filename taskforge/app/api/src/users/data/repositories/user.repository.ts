import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../../business.logic/interfaces/i.user.repository';

@Injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @InjectRepository(User)
        private readonly typeOrmRepo: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.typeOrmRepo.findOne({ where: { email } });
    }

    async findById(userId: string): Promise<User | null> {
        return this.typeOrmRepo.findOne({ where: { id: userId } });
    }

    async createNewUserWith(userData: Partial<User>): Promise<User> {
        const user: User = this.typeOrmRepo.create(userData);
        return this.typeOrmRepo.save(user);
    }

    async findAllUsers(): Promise<User[]> {
        return this.typeOrmRepo.find({select: ['id', 'email', 'role', 'createdAt'],})
    }

    async deleteUserWithId(userId: string): Promise<void> {
        await this.typeOrmRepo.delete({id: userId});
        return
    }
}
