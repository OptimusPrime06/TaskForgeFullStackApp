import { useState, useEffect, useCallback } from 'react';
import { tasksApi, TaskStatus, type Task } from '../api/tasks.api';
import toast from 'react-hot-toast';

export const useTasks = (projectId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await tasksApi.fetchTasks(projectId);
      setTasks(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to load tasks';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const createTask = async (title: string, description?: string) => {
    if (!projectId) return false;
    try {
      const newTask = await tasksApi.createTask(projectId, title, description);
      setTasks((prev) => [...prev, newTask]);
      toast.success('Task created');
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task');
      return false;
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    if (!projectId) return false;
    // Optimistic UI Update
    setTasks((prev) => 
      prev.map((t) => t.id === taskId ? { ...t, status: newStatus } : t)
    );
    
    try {
      await tasksApi.updateTaskStatus(projectId, taskId, newStatus);
      return true;
    } catch (err: any) {
      toast.error('Failed to update task status. Reverting.');
      // Revert if API fails
      fetchTasks();
      return false;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
  }, [projectId, fetchTasks]);

  return { tasks, isLoading, error, fetchTasks, createTask, updateTaskStatus };
};
