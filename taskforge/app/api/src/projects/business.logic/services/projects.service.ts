import { Injectable, NotFoundException, ForbiddenException, NotAcceptableException } from '@nestjs/common';
import { IProjectRepository } from '../interfaces/i.project.repository';
import { UsersService } from '../../../users/business.logic/services/users.service';
import { CreateProjectDto } from '../../presentation/dto/create.project.dto';
import { UpdateProjectDto } from '../../presentation/dto/update.project.dto';
import { Role } from '@taskforge/shared';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly projectRepository: IProjectRepository,
    private readonly usersService: UsersService,
  ) { }

  async createProject(createProjectDto: CreateProjectDto, userId: string) {
    const owner = await this.usersService.findById(userId);
    if (!owner) throw new NotFoundException('User not found');

    return this.projectRepository.createProject({
      name: createProjectDto.name,
      description: createProjectDto.description,
    }, owner);
  }

  async findAllForUser(userId: string, role: string) {
    return await this.projectRepository.findAllForUser(userId);
  }

  async findOne(id: string, userId: string, role: string) {
    const project = await this.projectRepository.findById(id);
    if (!project) throw new NotFoundException('Project not found');

    const isMember = project.members.some((m) => m.id === userId);
    if (!isMember && role !== Role.ADMIN) {
      throw new ForbiddenException('You do not have access to this project');
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string, role: string) {
    const project = await this.findOne(id, userId, role);

    if (role !== Role.ADMIN && project.ownerId !== userId) {
      throw new ForbiddenException('Project Managers can only update their own projects');
    }

    return this.projectRepository.updateProject(id, updateProjectDto);
  }

  async remove(id: string, userId: string, role: string) {
    const project = await this.findOne(id, userId, role);

    if (role !== Role.ADMIN && project.ownerId !== userId) {
      throw new ForbiddenException('Project Managers can only delete their own projects');
    }

    return this.projectRepository.deleteProject(id);
  }

  async addMember(projectId: string, memberEmail: string, requestUserId: string, role: string) {
    const project = await this.findOne(projectId, requestUserId, role);

    if (role !== Role.ADMIN && project.ownerId !== requestUserId) {
      throw new ForbiddenException('Project Managers can only add members to their own projects');
    }

    const userToAdd = await this.usersService.findByEmail(memberEmail);
    if (!userToAdd) {
      throw new NotFoundException('User with that email does not exist');
    }

    await this.projectRepository.addMember(projectId, userToAdd);
    return { message: 'Member added successfully' };
  }

  async removeMember(projectId: string, memberId: string, requestUserId: string, role: string) {
    const project = await this.findOne(projectId, requestUserId, role);

    if (role !== Role.ADMIN && project.ownerId !== requestUserId) {
      throw new ForbiddenException('Project Managers can only remove members from their own projects');
    }

    const isMember = project.members.some((m) => m.id === memberId);
    if (!isMember) {
      throw new NotAcceptableException('User is not a member');
    }

    if (project.ownerId === memberId) {
      throw new ForbiddenException('Cannot remove the project owner');
    }

    await this.projectRepository.removeMember(projectId, memberId);
    return { message: 'Member removed successfully' };
  }
}
