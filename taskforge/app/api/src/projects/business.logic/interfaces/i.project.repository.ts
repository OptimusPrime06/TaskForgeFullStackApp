import { Project } from '../../data/entities/project.entity';
import { User } from '../../../users/data/entities/user.entity';

export abstract class IProjectRepository {
    abstract createProject(data: Partial<Project>, owner: User): Promise<Project>;
    abstract findById(projectId: string): Promise<Project | null>;
    abstract findAll(): Promise<Project[]>;
    abstract findAllForUser(userId: string): Promise<Project[]>;
    abstract updateProject(projectId: string, data: Partial<Project>): Promise<Project>;
    abstract deleteProject(projectId: string): Promise<void>;
    abstract addMember(projectId: string, user: User): Promise<void>;
    abstract removeMember(projectId: string, userId: string): Promise<void>;
}
