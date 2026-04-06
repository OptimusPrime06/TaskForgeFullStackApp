import { useState, useEffect, useCallback } from 'react';
import { projectsApi, type Project } from '../api/projects.api';
import toast from 'react-hot-toast';

export const useProjects = (autoFetch = true) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectsApi.fetchProjects();
      setProjects(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to load projects';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = async (name: string, description?: string) => {
    setIsLoading(true);
    try {
      const newProject = await projectsApi.createProject(name, description);
      setProjects((prev) => [newProject, ...prev]);
      toast.success('Project created');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create project');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await projectsApi.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success('Project deleted');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete project');
      return false;
    }
  };

  const addMembersToProject = async (projectId: string, memberEmails: string[]) => {
    try {
      for (const email of memberEmails) {
        await projectsApi.addMember(projectId, email);
      }
      if (memberEmails.length > 0) {
        toast.success(`Added ${memberEmails.length} member(s) to project`);
      }
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add members to project');
      return false;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchProjects();
    }
  }, [autoFetch, fetchProjects]);

  return { projects, isLoading, error, fetchProjects, createProject, deleteProject, addMembersToProject };
};
