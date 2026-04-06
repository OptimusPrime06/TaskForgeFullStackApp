import { apiClient } from './client';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  owner?: {
    id: string;
    email: string;
  };
}

export const projectsApi = {
  fetchProjects: async (): Promise<Project[]> => {
    // The interceptor automatically attaches the Bearer token
    const response = await apiClient.get<Project[]>('/projects');
    return response.data;
  },

  createProject: async (name: string, description?: string): Promise<Project> => {
    const response = await apiClient.post<Project>('/projects', {
      name,
      description,
    });
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  addMember: async (projectId: string, memberEmail: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      `/projects/${projectId}/members`,
      { email: memberEmail }
    );
    return response.data;
  },
};
