import { IsEnum, IsNotEmpty } from 'class-validator';
import { TaskStatus } from '@taskforge/shared';

export class UpdateTaskStatusDto {
    @IsEnum(TaskStatus)
    @IsNotEmpty()
    status: TaskStatus;
}
