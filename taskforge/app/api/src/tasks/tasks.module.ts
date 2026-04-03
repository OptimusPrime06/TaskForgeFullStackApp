import { Module } from '@nestjs/common';
import { TasksService } from './business.logic/services/tasks.service';
import { TasksController } from '../tasks/presentation/controllers/tasks.controller';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule { }
