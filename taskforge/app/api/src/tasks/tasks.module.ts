import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './business.logic/services/tasks.service';
import { TasksController } from './presentation/controllers/tasks.controller';
import { Task } from './data/entities/task.entity';
import { TaskRepository } from './data/repositories/task.repository';
import { ITaskRepository } from './business.logic/interfaces/i.task.repository';
import { UsersModule } from '../users/users.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UsersModule,
    ProjectsModule,
  ],
  controllers: [TasksController],
  providers: [
    {
      provide: ITaskRepository,
      useClass: TaskRepository,
    },
    TasksService,
  ],
  exports: [TasksService],
})
export class TasksModule { }
