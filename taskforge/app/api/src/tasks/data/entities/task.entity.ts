import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
} from 'typeorm';
import { TaskStatus } from '@taskforge/shared';
import { Project } from '../../../projects/data/entities/project.entity';
import { User } from '../../../users/data/entities/user.entity';

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.BACKLOG })
    status: TaskStatus;

    @ManyToOne(() => Project, (project) => project.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column()
    projectId: string;

    @ManyToOne(() => User, (user) => user.assignedTasks, { nullable: true })
    @JoinColumn({ name: 'assigneeId' })
    assignee: User | null;

    @Column({ nullable: true })
    assigneeId: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}