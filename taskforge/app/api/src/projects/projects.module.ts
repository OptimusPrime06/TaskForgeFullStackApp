import { Module } from '@nestjs/common';
import { ProjectsService } from '../projects/business.logic/services/projects.service';
import { ProjectsController } from './presentation/controllers/projects.controller';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule { }
