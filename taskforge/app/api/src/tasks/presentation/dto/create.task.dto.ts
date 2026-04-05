import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '@taskforge/shared';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @IsString()
    @IsOptional()
    assigneeId?: string;
}
