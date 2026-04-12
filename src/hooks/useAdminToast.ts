import { useToast, UseToastOptions } from '@chakra-ui/react';
import { useCallback } from 'react';

/**
 * Enhanced toast hook specifically for admin operations
 * Provides consistent toast notifications with proper error handling
 */
export const useAdminToast = () => {
  const toast = useToast();

  // Success toast for admin operations
  const showSuccess = useCallback((
    title: string,
    description?: string,
    options?: Partial<UseToastOptions>
  ) => {
    return toast({
      title,
      description,
      status: 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
      ...options,
    });
  }, [toast]);

  // Error toast for admin operations
  const showError = useCallback((
    title: string,
    error?: Error | string | null,
    options?: Partial<UseToastOptions>
  ) => {
    let description = 'An unexpected error occurred';
    
    if (error) {
      if (typeof error === 'string') {
        description = error;
      } else if (error instanceof Error) {
        description = error.message;
      }
    }

    return toast({
      title,
      description,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
      ...options,
    });
  }, [toast]);

  // Warning toast for admin operations
  const showWarning = useCallback((
    title: string,
    description?: string,
    options?: Partial<UseToastOptions>
  ) => {
    return toast({
      title,
      description,
      status: 'warning',
      duration: 4000,
      isClosable: true,
      position: 'top-right',
      ...options,
    });
  }, [toast]);

  // Info toast for admin operations
  const showInfo = useCallback((
    title: string,
    description?: string,
    options?: Partial<UseToastOptions>
  ) => {
    return toast({
      title,
      description,
      status: 'info',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
      ...options,
    });
  }, [toast]);

  // Loading toast for long-running operations
  const showLoading = useCallback((
    title: string,
    description?: string,
    options?: Partial<UseToastOptions>
  ) => {
    return toast({
      title,
      description,
      status: 'info',
      duration: null, // Don't auto-dismiss loading toasts
      isClosable: false,
      position: 'top-right',
      ...options,
    });
  }, [toast]);

  // Authentication-specific toasts
  const showAuthError = useCallback((error?: Error | string | null) => {
    return showError(
      'Authentication Failed',
      error || 'Please try authenticating again',
      { duration: 6000 }
    );
  }, [showError]);

  const showAuthSuccess = useCallback((username?: string) => {
    return showSuccess(
      'Authentication Successful',
      username ? `Welcome back, ${username}!` : 'You have been successfully authenticated'
    );
  }, [showSuccess]);

  const showTokenExpired = useCallback(() => {
    return showWarning(
      'Session Expired',
      'Your authentication session has expired. Please authenticate again to continue.',
      { duration: 8000 }
    );
  }, [showWarning]);

  // Task-specific toasts
  const showTaskUpdateSuccess = useCallback((taskId: string, status: string) => {
    return showSuccess(
      'Task Updated',
      `Task ${taskId.slice(0, 8)}... has been ${status}`,
      { duration: 4000 }
    );
  }, [showSuccess]);

  const showTaskUpdateError = useCallback((taskId: string, error?: Error | string | null) => {
    return showError(
      'Task Update Failed',
      error || `Failed to update task ${taskId.slice(0, 8)}...`,
      { duration: 6000 }
    );
  }, [showError]);

  // Network-specific toasts
  const showNetworkError = useCallback((operation?: string) => {
    return showError(
      'Network Error',
      operation 
        ? `Failed to ${operation}. Please check your connection and try again.`
        : 'Network request failed. Please check your connection and try again.',
      { duration: 6000 }
    );
  }, [showError]);

  const showServerError = useCallback((operation?: string) => {
    return showError(
      'Server Error',
      operation 
        ? `Server error occurred while ${operation}. Please try again later.`
        : 'A server error occurred. Please try again later.',
      { duration: 6000 }
    );
  }, [showError]);

  // Permission-specific toasts
  const showPermissionDenied = useCallback((action?: string) => {
    return showWarning(
      'Permission Denied',
      action 
        ? `You don't have permission to ${action}. Please contact an administrator.`
        : 'You don\'t have permission to perform this action.',
      { duration: 6000 }
    );
  }, [showWarning]);

  // Update existing toast
  const updateToast = useCallback((id: string | number, options: UseToastOptions) => {
    return toast.update(id, options);
  }, [toast]);

  // Close toast
  const closeToast = useCallback((id?: string | number) => {
    if (id) {
      toast.close(id);
    } else {
      toast.closeAll();
    }
  }, [toast]);

  // Check if toast is active
  const isToastActive = useCallback((id: string | number) => {
    return toast.isActive(id);
  }, [toast]);

  return {
    // Basic toast methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    
    // Authentication-specific methods
    showAuthError,
    showAuthSuccess,
    showTokenExpired,
    
    // Task-specific methods
    showTaskUpdateSuccess,
    showTaskUpdateError,
    
    // Network-specific methods
    showNetworkError,
    showServerError,
    
    // Permission-specific methods
    showPermissionDenied,
    
    // Toast management methods
    updateToast,
    closeToast,
    isToastActive,
    
    // Direct access to underlying toast hook
    toast,
  };
};