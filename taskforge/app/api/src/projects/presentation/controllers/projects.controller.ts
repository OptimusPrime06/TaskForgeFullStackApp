import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from '../../business.logic/services/projects.service';
import { CreateProjectDto } from '../dto/create.project.dto';
import { UpdateProjectDto } from '../dto/update.project.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { Roles } from '../../../auth/decorators/roles.decorator';
import { Role } from '@taskforge/shared';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req: any) {
    return this.projectsService.createProject(createProjectDto, req.user.id);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.projectsService.findAllForUser(req.user.id, req.user.role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Request() req: any) {
    return this.projectsService.update(id, updateProjectDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.projectsService.remove(id, req.user.id, req.user.role);
  }

  @Post(':id/members')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  addMember(@Param('id') id: string, @Body('email') email: string, @Request() req: any) {
    return this.projectsService.addMember(id, email, req.user.id, req.user.role);
  }

  @Delete(':id/members/:userId')
  @Roles(Role.ADMIN, Role.PROJECT_MANAGER)
  removeMember(@Param('id') id: string, @Param('userId') memberId: string, @Request() req: any) {
    return this.projectsService.removeMember(id, memberId, req.user.id, req.user.role);
  }
}
