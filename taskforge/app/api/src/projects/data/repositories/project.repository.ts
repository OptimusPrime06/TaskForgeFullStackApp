import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { User } from '../../../users/data/entities/user.entity';
import { IProjectRepository } from '../../business.logic/interfaces/i.project.repository';

@Injectable()
export class ProjectRepository implements IProjectRepository {
    constructor(
        @InjectRepository(Project)
        private readonly typeOrmRepo: Repository<Project>,
    ) {}

    async createProject(data: Partial<Project>, owner: User): Promise<Project> {
        const project = this.typeOrmRepo.create({
            ...data,
            owner,
            members: [owner],
        });
        return this.typeOrmRepo.save(project);
    }

    async findById(projectId: string): Promise<Project | null> {
        return this.typeOrmRepo.findOne({
            where: { id: projectId },
            relations: ['owner', 'members', 'tasks'],
        });
    }

    async findAll(): Promise<Project[]> {
        return this.typeOrmRepo.find({
            relations: ['owner'],
        });
    }

    async findAllForUser(userId: string): Promise<Project[]> {
        return this.typeOrmRepo.find({
            where: {members: { id: userId }},
            relations: ['owner'],
        });
    }

    async updateProject(projectId: string, data: Partial<Project>): Promise<Project> {
        const project = await this.findById(projectId);
        if (!project) throw new NotFoundException('Project not found');
        
        Object.assign(project, data);
        return this.typeOrmRepo.save(project);
    }

    async deleteProject(projectId: string): Promise<void> {
        await this.typeOrmRepo.delete({ id: projectId });
    }

    async addMember(projectId: string, user: User): Promise<void> {
        const project = await this.findById(projectId);
        if (!project) throw new NotFoundException('Project not found');

        const isMember = project.members.some((m) => m.id === user.id);
        if (!isMember) {
            project.members.push(user);
            await this.typeOrmRepo.save(project);
        }
    }

    async removeMember(projectId: string, userId: string): Promise<void> {
        const project = await this.findById(projectId);
        if (!project) throw new NotFoundException('Project not found');

        if (project.ownerId === userId) {
            throw new Error('Cannot remove the project owner');
        }

        project.members = project.members.filter((m) => m.id !== userId);
        await this.typeOrmRepo.save(project);
    }
}
