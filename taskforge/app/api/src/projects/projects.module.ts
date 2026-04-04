import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './business.logic/services/projects.service';
import { ProjectsController } from './presentation/controllers/projects.controller';
import { Project } from './data/entities/project.entity';
import { ProjectRepository } from './data/repositories/project.repository';
import { IProjectRepository } from './business.logic/interfaces/i.project.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    UsersModule,
  ],
  controllers: [ProjectsController],
  providers: [
    {
      provide: IProjectRepository,
      useClass: ProjectRepository,
    },
    ProjectsService,
  ],
  exports: [ProjectsService],
})
export class ProjectsModule { }
