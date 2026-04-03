export enum TaskStatus {
    BACKLOG = 'BACKLOG',
    TODO = 'TODO',
    IN_PROGRESS = 'IN_PROGRESS',
    IN_REVIEW = 'IN_REVIEW',
    QA = 'QA',
    DONE = 'DONE',
    REOPENED = 'REOPENED',
}

export interface ITask {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    assigneeId: string | null;
    projectId: string;
    createdAt: Date;
}