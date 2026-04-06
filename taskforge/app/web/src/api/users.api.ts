import { apiClient } from './client';
import { Role } from '@taskforge/shared';

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
}

export const usersApi = {
  fetchAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },
};
