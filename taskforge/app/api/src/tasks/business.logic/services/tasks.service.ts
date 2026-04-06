import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ITaskRepository } from '../interfaces/i.task.repository';
import { ProjectsService } from '../../../projects/business.logic/services/projects.service';
import { UsersService } from '../../../users/business.logic/services/users.service';
import { CreateTaskDto } from '../../presentation/dto/create.task.dto';
import { TaskStatus } from '@taskforge/shared';
import { Role } from '@taskforge/shared';
import { TaskServiceDto } from '../dto/task.service.dto';

@Injectable()
export class TasksService {
    constructor(
        private readonly taskRepository: ITaskRepository,
        private readonly projectsService: ProjectsService,
        private readonly usersService: UsersService,
    ) { }

    private verifyStateTransition(currentStatus: TaskStatus, newStatus: TaskStatus, role: Role) {
        let allowedTransitions: TaskStatus[] = [];

        if (role === Role.MEMBER) {
            switch (currentStatus) {
                case TaskStatus.BACKLOG:
                    allowedTransitions = [TaskStatus.TODO];
                    break;
                case TaskStatus.TODO:
                    allowedTransitions = [TaskStatus.IN_PROGRESS];
                    break;
                case TaskStatus.IN_PROGRESS:
                    allowedTransitions = [TaskStatus.IN_REVIEW];
                    break;
                case TaskStatus.REOPENED:
                    allowedTransitions = [TaskStatus.IN_PROGRESS];
                    break;
                default:
                    allowedTransitions = [];
            }
        } else if (role === Role.QA) {
            switch (currentStatus) {
                case TaskStatus.IN_REVIEW:
                    allowedTransitions = [TaskStatus.QA];
                    break;
                case TaskStatus.QA:
                    allowedTransitions = [TaskStatus.DONE, TaskStatus.REOPENED];
                    break;
                default:
                    allowedTransitions = [];
            }
        }

        if (!allowedTransitions.includes(newStatus)) {
            throw new ForbiddenException(`Role ${role} cannot transition task from ${currentStatus} to ${newStatus}`);
        }
    }

    private isAdmin(role: string): boolean {
        return (role as Role === Role.ADMIN);
    }

    private isProjectManager(role: string): boolean {
        return (role as Role === Role.PROJECT_MANAGER);
    }

    private projectIsOwned(userId: string, projectOwnerId: string): boolean {
        return (userId === projectOwnerId);
    }

    async getProjectWithAccess(dto: TaskServiceDto) {
        return this.projectsService.findOne(dto.projectId, dto.userId, dto.role);
    }

    async createTask(dto: TaskServiceDto, createTaskDto: CreateTaskDto) {
        const project = await this.getProjectWithAccess(dto);

        let assignee: any = null;
        const isAdmin: boolean = this.isAdmin(dto.role);
        const projectIsOwned: boolean = this.projectIsOwned(dto.userId, project.ownerId);

        if (createTaskDto.assigneeId) {
            if (!isAdmin && projectIsOwned) {
                throw new ForbiddenException('Only Admins or Project Managers can assign tasks at creation');
            }
            assignee = await this.usersService.findById(createTaskDto.assigneeId);
            if (!assignee) throw new NotFoundException('Assignee not found');
        }

        const creator = await this.usersService.findById(dto.userId);

        return this.taskRepository.createTask({
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: createTaskDto.status ?? TaskStatus.TODO,
        }, project, creator!);
        // No danger in forced unwrapping because UserService.findById throws Not found exception if there is no user with the provided id
    }

    async getTasksInProject(dto: TaskServiceDto) {
        await this.getProjectWithAccess(dto); // Checks if project exists and if user has the accesss
        return this.taskRepository.findAllTasksInProject(dto.projectId);
    }

    async updateTaskStatus(dto: TaskServiceDto, taskId: string, newStatus: TaskStatus) {
        const project = await this.getProjectWithAccess(dto);
        const task = await this.taskRepository.findById(taskId);
        if (!task || task.projectId !== project.id) {
            throw new NotFoundException('Task not found in this project');
        }

        const isAdmin: boolean = this.isAdmin(dto.role);
        const isProjectManager: boolean = this.isProjectManager(dto.role);
        const projectIsOwned: boolean = this.projectIsOwned(dto.userId, project.ownerId);

        if (isAdmin || (isProjectManager && projectIsOwned)) {
            return this.taskRepository.updateStatus(taskId, newStatus);
        }

        if (task.assigneeId !== dto.userId) {
            throw new ForbiddenException('You can only update the status of tasks assigned to you');
        }

        const currentStatus = task.status;
        this.verifyStateTransition(currentStatus, newStatus, dto.role as Role);

        return this.taskRepository.updateStatus(taskId, newStatus);
    }

    async assignTask(dto: TaskServiceDto, taskId: string, assigneeId: string) {
        const project = await this.getProjectWithAccess(dto);

        const isAdmin: boolean = this.isAdmin(dto.role);
        const projectIsOwned: boolean = this.projectIsOwned(dto.userId, project.ownerId);

        if (!isAdmin && projectIsOwned) {
            throw new ForbiddenException('Only Admins or Project Managers can assign tasks');
        }

        const task = await this.taskRepository.findById(taskId);
        if (!task || task.projectId !== project.id) {
            throw new NotFoundException('Task not found in this project');
        }

        const newAssignee = await this.usersService.findById(assigneeId);
        if (!newAssignee) {
            throw new NotFoundException('Assignee user not found');
        }

        const isMember = project.members.some(m => m.id === assigneeId);
        if (!isMember) {
            throw new BadRequestException('Cannot assign to a user who is not a member of the project');
        }

        return this.taskRepository.assignTask(taskId, newAssignee);
    }

    async deleteTask(dto: TaskServiceDto, taskId: string) {
        const project = await this.getProjectWithAccess(dto);

        const isAdmin: boolean = this.isAdmin(dto.role);
        const projectIsOwned: boolean = this.projectIsOwned(dto.userId, project.ownerId);

        if (!isAdmin && projectIsOwned) {
            throw new ForbiddenException('Only Admins or Project Managers can delete tasks');
        }

        const task = await this.taskRepository.findById(taskId);
        if (!task || task.projectId !== project.id) {
            throw new NotFoundException('Task not found in this project');
        }

        return this.taskRepository.deleteTask(taskId);
    }
}
