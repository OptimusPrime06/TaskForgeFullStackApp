import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../data/entities/user.entity';
import { IUserRepository } from '../interfaces/i.user.repository';

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: IUserRepository) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    async findById(userId: string): Promise<User | null> {
        return this.userRepository.findById(userId);
    }

    async addNewUser(userData: Partial<User>): Promise<User> {
        return this.userRepository.createNewUserWith(userData);
    }

    async findAllUsers(): Promise<User[]> {
        return this.userRepository.findAllUsers();
    }

    async deleteUserById(userId: string): Promise<void> {
        const userExist = await this.findById(userId);
        if(!userExist) throw new NotFoundException('User not found');

        await this.userRepository.deleteUserWithId(userId);
        return;
    }

}
