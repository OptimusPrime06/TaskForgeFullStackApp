import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from '@taskforge/shared';
import { Task } from '../entities/task.entity';
import { User } from '../../../users/data/entities/user.entity';
import { Project } from '../../../projects/data/entities/project.entity';
import { ITaskRepository } from '../../business.logic/interfaces/i.task.repository';

@Injectable()
export class TaskRepository implements ITaskRepository {
    constructor(
        @InjectRepository(Task)
        private readonly typeOrmRepo: Repository<Task>,
    ) { }

    async createTask(data: Partial<Task>, project: Project, creator: User): Promise<Task> {
        const task = this.typeOrmRepo.create({
            ...data,
            project,
            assignee: data.assignee ?? creator,
            status: data.status ?? TaskStatus.TODO,
        });
        return this.typeOrmRepo.save(task);
    }

    async findById(taskId: string): Promise<Task | null> {
        return this.typeOrmRepo.findOne({
            where: { id: taskId },
            relations: ['project', 'assignee'],
        });
    }

    async findAllTasksInProject(projectId: string): Promise<Task[]> {
        return this.typeOrmRepo.find({
            where: { projectId },
            relations: ['assignee'],
            order: { createdAt: 'DESC' }
        });
    }

    async updateStatus(taskId: string, status: TaskStatus): Promise<Task> {
        const task = await this.findById(taskId);
        if (!task) throw new NotFoundException('Task not found');

        task.status = status;
        return this.typeOrmRepo.save(task);
    }

    async assignTask(taskId: string, assignee: User): Promise<Task> {
        const task = await this.findById(taskId);
        if (!task) throw new NotFoundException('Task not found');

        task.assignee = assignee;
        return this.typeOrmRepo.save(task);
    }

    async deleteTask(taskId: string): Promise<void> {
        await this.typeOrmRepo.delete({ id: taskId });
    }
}
