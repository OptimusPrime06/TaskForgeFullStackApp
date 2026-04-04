import { User } from '../../data/entities/user.entity';

export abstract class IUserRepository {
    abstract findByEmail(email: string): Promise<User | null>;
    abstract findById(userId: string): Promise<User | null>;
    abstract createNewUserWith(userData: Partial<User>): Promise<User>;
    abstract findAllUsers(): Promise<User[]>;  // Return all users (without passwords).
}
