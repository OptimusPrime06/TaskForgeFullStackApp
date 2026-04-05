import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from '../../business.logic/services/tasks.service';
import { CreateTaskDto } from '../dto/create.task.dto';
import { UpdateTaskStatusDto } from '../dto/update.task.status.dto';
import { AssignTaskDto } from '../dto/assign.task.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '@taskforge/shared';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Roles(Role.ADMIN, Role.PROJECT_MANAGER, Role.MEMBER, Role.QA)
  @Post()
  create(
    @Param('projectId') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Request() req: any
  ) {
    return this.tasksService.createTask(
      { projectId, userId: req.user.id, role: req.user.role },
      createTaskDto,
    );
  }

  // Everyone assigned to the project can view tasks
  @Get()
  findAll(
    @Param('projectId') projectId: string,
    @Request() req: any
  ) {
    return this.tasksService.getTasksInProject({ projectId, userId: req.user.id, role: req.user.role });
  }

  @Roles(Role.ADMIN, Role.PROJECT_MANAGER, Role.MEMBER, Role.QA)
  @Patch(':id/status')
  async updateStatus(
    @Param('projectId') projectId: string,
    @Param('id') taskId: string,
    @Body() updateStatusDto: UpdateTaskStatusDto,
    @Request() req: any
  ) {
    const response = await this.tasksService.updateTaskStatus(
      { projectId, userId: req.user.id, role: req.user.role },
      taskId,
      updateStatusDto.status
    );

    return {
      message: 'Task updated successfully',
      response
    };
  }

  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @Patch(':id/assign')
  async assign(
    @Param('projectId') projectId: string,
    @Param('id') taskId: string,
    @Body() assignDto: AssignTaskDto,
    @Request() req: any
  ) {
    const response = await this.tasksService.assignTask(
      { projectId, userId: req.user.id, role: req.user.role },
      taskId,
      assignDto.assigneeId
    );

    return {
      message: 'Task assigned sucessfully',
      response
    };
  }

  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @Delete(':id')
  removeTask(
    @Param('projectId') projectId: string,
    @Param('id') taskId: string,
    @Request() req: any
  ) {
    const response = this.tasksService.deleteTask(
      { projectId, userId: req.user.id, role: req.user.role }, taskId
    );

    return {
      message: 'Task deleted sucessfully',
      response
    };
  }
}
