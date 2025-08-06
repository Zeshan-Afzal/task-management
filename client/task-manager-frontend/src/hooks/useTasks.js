import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksAPI } from '../services/api';
import { message } from 'antd';

export const useTasks = () => {
  const queryClient = useQueryClient();

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await tasksAPI.getTasks();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: tasksAPI.createTask,
    onSuccess: () => {
      message.success('Task created successfully');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to create task');
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, taskData }) => tasksAPI.updateTask(taskId, taskData),
    onSuccess: () => {
      message.success('Task updated successfully');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: (error) => {
      message.error(error.response?.data?.message || 'Failed to update task');
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: tasksAPI.deleteTask,
    onSuccess: () => {
      message.success('Task deleted successfully');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: (error) => {
      message.error('Failed to delete task');
    },
  });

  // Update task status mutation
  const updateTaskStatusMutation = useMutation({
    mutationFn: ({ taskId, status }) => tasksAPI.updateTask(taskId, { status }),
    onSuccess: () => {
      message.success('Task status updated');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: (error) => {
      message.error('Failed to update task status');
    },
  });

  return {
    tasks,
    isLoading,
    error,
    refetch,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    updateTaskStatus: updateTaskStatusMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isUpdatingStatus: updateTaskStatusMutation.isPending,
  };
}; 