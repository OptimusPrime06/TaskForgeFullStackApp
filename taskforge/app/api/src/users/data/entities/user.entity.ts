import {
    Entity, 
    PrimaryGeneratedColumn, 
    Column,
    CreateDateColumn, 
    OneToMany, 
    ManyToMany
} from 'typeorm';
import { Role } from '@taskforge/shared'; 
import { RefreshToken } from '../../../auth/data/entities/refresh.token.entity';
import { Project } from '../../../projects/data/entities/project.entity';
import { Task } from '../../../tasks/data/entities/task.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'enum', enum: Role, default: Role.MEMBER })
    role: Role;

    @OneToMany(() => RefreshToken, (token) => token.user)
    refreshTokens: RefreshToken[];

    @OneToMany(() => Project, (project) => project.owner)
    ownedProjects: Project[];

    @ManyToMany(() => Project, (project) => project.members)
    projects: Project[];

    @OneToMany(() => Task, (task) => task.assignee)
    assignedTasks: Task[];

    @CreateDateColumn()
    createdAt: Date;
}