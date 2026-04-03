export enum Role {
    ADMIN = 'ADMIN',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
    MEMBER = 'MEMBER',
    QA = 'QA',
}

export interface IUser {
    id: string;
    email: string;
    role: Role;
    createdAt: Date;
}