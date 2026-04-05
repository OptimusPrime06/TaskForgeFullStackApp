import { TaskStatus } from '@taskforge/shared';
import { Task } from '../../data/entities/task.entity';
import { User } from '../../../users/data/entities/user.entity';
import { Project } from '../../../projects/data/entities/project.entity';

export abstract class ITaskRepository {
    abstract createTask(data: Partial<Task>, project: Project, creator: User): Promise<Task>;
    abstract findById(taskId: string): Promise<Task | null>;
    abstract findAllTasksInProject(projectId: string): Promise<Task[]>;
    abstract updateStatus(taskId: string, status: TaskStatus): Promise<Task>;
    abstract assignTask(taskId: string, assignee: User): Promise<Task>;
    abstract deleteTask(taskId: string): Promise<void>;
}
