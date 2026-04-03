import { IUser } from './user.types';

export interface IProject {
    id: string;
    name: string;
    description: string;
    ownerId: string;
    members: IUser[];
    createdAt: Date;
}