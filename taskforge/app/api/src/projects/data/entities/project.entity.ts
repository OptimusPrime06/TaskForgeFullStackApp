import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    ManyToMany,
    JoinTable,
    OneToMany,
    CreateDateColumn,
    JoinColumn
} from 'typeorm';
import { User } from '../../../users/data/entities/user.entity';
import { Task } from '../../../tasks/data/entities/task.entity';

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @ManyToOne(() => User, (user) => user.ownedProjects)
    @JoinColumn({ name: 'ownerId' })
    owner: User;

    @Column()
    ownerId: string;

    @ManyToMany(() => User, (user) => user.projects)
    @JoinTable({
        name: 'project_members',
        joinColumn: { name: 'projectId' },
        inverseJoinColumn: { name: 'userId' },
    })
    members: User[];

    @OneToMany(() => Task, (task) => task.project)
    tasks: Task[];

    @CreateDateColumn()
    createdAt: Date;
}