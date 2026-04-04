import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn
} from 'typeorm';
import { User } from '../../../users/data/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    token: string;

    @Column({type: 'timestamp'})
    expiresAt: Date;

    @Column({ default: false })
    isRevoked: boolean;

    @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @CreateDateColumn()
    createdAt: Date;
}