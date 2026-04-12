import { useMutation, useQuery, useQueryClient } from 'react-query';
import { StatsApi } from '../api';
import { Task, TaskStatus, TaskUpdateRequest } from '../types/admin';

/**
 * Hook for managing admin tasks
 */
export const useAdminTasks = (token?: string) => {
  const queryClient = useQueryClient();

  // Query to fetch all tasks
  const {
    data: tasks = [],
    isLoading,
    error,
    refetch,
  } = useQuery(
    ['admin-tasks', token],
    async () => {
      const response = await StatsApi.Admin.tasks.getAll(token);
      return response || [];
    },
    {
      enabled: true,
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        // Don't retry on client errors (4xx)
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        // Retry server errors and network errors up to 3 times
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error: any) => {
        console.error('Failed to fetch admin tasks:', error);
        
        // Handle specific error types
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          // Authentication error - invalidate auth queries
          queryClient.invalidateQueries(['admin-auth']);
        }
      },
    }
  );

  // Mutation for updating task status with optimistic updates
  const updateTaskStatusMutation = useMutation(
    async (updateRequest: TaskUpdateRequest): Promise<Task> => {
      const response = await StatsApi.Admin.tasks.updateStatus(updateRequest);
      if (!response) {
        throw new Error('No data returned from task update');
      }
      return response;
    },
    {
      onMutate: async (updateRequest: TaskUpdateRequest) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(['admin-tasks', token]);

        // Snapshot the previous value
        const previousTasks = queryClient.getQueryData<Task[]>(['admin-tasks', token]);

        // Optimistically update the cache
        queryClient.setQueryData<Task[]>(
          ['admin-tasks', token],
          (oldTasks) => {
            if (!oldTasks) return [];
            return oldTasks.map((task) =>
              task.id === updateRequest.taskId 
                ? { ...task, status: updateRequest.approval_status }
                : task
            );
          }
        );

        // Return a context object with the snapshotted value
        return { previousTasks };
      },
      onSuccess: (updatedTask: Task) => {
        // Update the task in the cache with the actual server response
        queryClient.setQueryData<Task[]>(
          ['admin-tasks', token],
          (oldTasks) => {
            if (!oldTasks) return [];
            return oldTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            );
          }
        );

        // Invalidate and refetch to ensure consistency
        queryClient.invalidateQueries(['admin-tasks']);
      },
      onError: (error: any, updateRequest: TaskUpdateRequest, context: any) => {
        console.error('Failed to update task status:', error);
        
        // Rollback to the previous state on error
        if (context?.previousTasks) {
          queryClient.setQueryData<Task[]>(
            ['admin-tasks', token],
            context.previousTasks
          );
        }
        
        // If it's an authentication error, invalidate auth queries
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          queryClient.invalidateQueries(['admin-auth']);
        }
      },
      onSettled: () => {
        // Always refetch after error or success to ensure consistency
        queryClient.invalidateQueries(['admin-tasks', token]);
      },
    }
  );

  return {
    // Data
    tasks,
    isLoading,
    error: error as Error | null,

    // Actions
    refetch,
    updateTaskStatus: (taskId: string, approval_status: TaskStatus, discordToken: string) => {
      return updateTaskStatusMutation.mutateAsync({
        taskId,
        approval_status,
        discordToken,
      });
    },

    // Mutation states
    isUpdating: updateTaskStatusMutation.isLoading,
    updateError: updateTaskStatusMutation.error as Error | null,
    updateSuccess: updateTaskStatusMutation.isSuccess,
    updatingTaskId: updateTaskStatusMutation.variables?.taskId
  };
};