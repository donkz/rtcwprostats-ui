import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Avatar,
  Badge,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';

import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useAdminTasks } from '../../hooks/useAdminTasks';
import { useAdminToast } from '../../hooks/useAdminToast';
import { AdminErrorBoundary } from '../ErrorBoundary/AdminErrorBoundary';
import { AdminLoadingSpinner } from '../Loading/AdminLoadingSpinner';
import TasksTable from '../TasksTable/TasksTable';
import { TaskStatus } from '../../types/admin';

const AdminDashboard: React.FC = () => {
  const toast = useAdminToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Authentication state
  const {
    isAuthenticated,
    user,
    token,
    loading: authLoading,
    error: authError,
    initiateDiscordAuth,
    logout,
    isAuthenticating,
    isLoggingOut,
    authError: discordAuthError,
    logoutError,
  } = useAdminAuth();

  // Tasks state
  const {
    tasks,
    isLoading: tasksLoading,
    error: tasksError,
    updateTaskStatus,
    isUpdating,
    updateError,
    updatingTaskId,
  } = useAdminTasks(token || undefined);

  // Handle Discord authentication
  const handleDiscordAuth = () => {
    try {
      initiateDiscordAuth();
    } catch (error) {
      toast.showAuthError(error instanceof Error ? error : 'Failed to initiate Discord authentication');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.showSuccess('Logged Out', 'You have been successfully logged out');
    } catch (error) {
      toast.showError('Logout Error', error instanceof Error ? error : 'Failed to logout');
    }
  };

  // Handle task status change with optimistic updates
  const handleTaskStatusChange = async (taskId: string, status: TaskStatus) => {
    if (!token) {
      toast.showWarning(
        'Authentication Required',
        'Please authenticate with Discord to perform this action'
      );
      return;
    }

    try {
      await updateTaskStatus(taskId, status, token);
      toast.showTaskUpdateSuccess(taskId, status);
    } catch (error) {
      toast.showTaskUpdateError(taskId, error instanceof Error ? error : null);
    }
  };

  // Check if user has admin permissions based on tasks
  const isAdmin = React.useMemo(() => {
    return tasks.some(task => task.isAdmin === true);
  }, [tasks]);

  // Show loading state for initial authentication check
  if (authLoading) {
    return (
      <AdminLoadingSpinner 
        message="Loading admin dashboard..."
        details="Checking authentication status"
        minHeight="400px"
      />
    );
  }

  return (
    <AdminErrorBoundary>
      <Box maxW="1200px" mx="auto" p={6}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2}>
              Admin Dashboard
            </Heading>
            <Text color="gray.600">
              Manage tasks and administrative functions
            </Text>
          </Box>

          {/* Authentication Status */}
          <Box
            bg={bgColor}
            borderRadius="md"
            border="1px"
            borderColor={borderColor}
            p={6}
          >
            <Heading size="md" mb={4}>
              Authentication Status
            </Heading>

            {authError && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                <AlertTitle>Authentication Error!</AlertTitle>
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}

            {discordAuthError && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                <AlertTitle>Discord Authentication Failed!</AlertTitle>
                <AlertDescription>{discordAuthError.message}</AlertDescription>
              </Alert>
            )}

            {logoutError && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                <AlertTitle>Logout Error!</AlertTitle>
                <AlertDescription>{logoutError.message}</AlertDescription>
              </Alert>
            )}

            {isAuthenticated && user ? (
              <VStack align="start" spacing={4}>
                <HStack spacing={4}>
                  <Avatar
                    size="md"
                    src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png` : undefined}
                    name={user.username}
                  />
                  <VStack align="start" spacing={1}>
                    <HStack>
                      <Text fontWeight="bold">
                        {user.username}
                      </Text>
                      {isAdmin && (
                        <Badge colorScheme="green" variant="solid">
                          Admin
                        </Badge>
                      )}
                    </HStack>
                  </VStack>
                </HStack>

                <Button
                  colorScheme="red"
                  variant="outline"
                  onClick={handleLogout}
                  isLoading={isLoggingOut}
                  loadingText="Logging out..."
                >
                  Logout
                </Button>
              </VStack>
            ) : (
              <VStack align="start" spacing={4}>
                <Text color="gray.600">
                  You are not authenticated. Please authenticate with Discord to access administrative functions.
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={handleDiscordAuth}
                  isLoading={isAuthenticating}
                  loadingText="Redirecting to Discord..."
                  isDisabled={isAuthenticated}
                >
                  Authenticate with Discord
                </Button>
              </VStack>
            )}
          </Box>

          <Divider />

          {/* Tasks Section */}
          <Box>
            <Heading size="md" mb={4}>
              Tasks Management
            </Heading>

            {updateError && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                <AlertTitle>Task Update Failed!</AlertTitle>
                <AlertDescription>{updateError.message}</AlertDescription>
              </Alert>
            )}

            <TasksTable
              tasks={tasks}
              user={user}
              isAuthenticated={isAuthenticated}
              isLoading={tasksLoading}
              error={tasksError?.message || null}
              onStatusChange={handleTaskStatusChange}
              isUpdating={isUpdating}
              updatingTaskId={updatingTaskId}
            />
          </Box>
        </VStack>
      </Box>
    </AdminErrorBoundary>
  );
};

export default AdminDashboard;