import { apiClient } from './client';
import { TaskStatus } from '@taskforge/shared';

// We explicitly re-export the enum for the hooks to consume so we don't break existing imports
export { TaskStatus };

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigneeId: string | null;
  projectId: string;
  createdAt: string;
  assignee?: {
    id: string;
    email: string;
  };
}

export const tasksApi = {
  fetchTasks: async (projectId: string): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>(`/projects/${projectId}/tasks`);
    return response.data;
  },

  createTask: async (projectId: string, title: string, description?: string): Promise<Task> => {
    const response = await apiClient.post<Task>(`/projects/${projectId}/tasks`, {
      title,
      description,
    });
    return response.data;
  },

  updateTaskStatus: async (projectId: string, taskId: string, status: TaskStatus): Promise<Task> => {
    const response = await apiClient.patch<{ message: string, response: Task }>(`/projects/${projectId}/tasks/${taskId}/status`, {
      status,
    });
    // The NestJS backend nested the updated entity inside `response.response`!
    return response.data.response;
  },

  deleteTask: async (projectId: string, taskId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/tasks/${taskId}`);
  }
};
