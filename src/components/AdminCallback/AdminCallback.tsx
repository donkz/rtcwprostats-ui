import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  Box, 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription,
  VStack,
  Button,
  Text
} from '@chakra-ui/react';
import { useAdminAuth } from '../../hooks/useAdminAuth';
import { useAdminToast } from '../../hooks/useAdminToast';
import { AdminErrorBoundary } from '../ErrorBoundary/AdminErrorBoundary';
import { AdminLoadingSpinner } from '../Loading/AdminLoadingSpinner';

/**
 * AdminCallback component handles Discord OAuth callback
 * Processes authorization code and redirects to admin dashboard
 */
export const AdminCallback: React.FC = () => {
  const history = useHistory();
  const toast = useAdminToast();
  const { handleOAuthCallback, isAuthenticating, authError, clearAuthData } = useAdminAuth();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Handle the OAuth callback with current URL
        await handleOAuthCallback();
        
        // Show success message
        toast.showAuthSuccess();
        
        // Redirect to admin dashboard on successful authentication
        history.replace('/admin');
      } catch (error) {
        console.error('OAuth callback processing failed:', error);
        toast.showAuthError(error instanceof Error ? error : 'OAuth callback processing failed');
      }
    };

    // Only process if we're not already authenticating
    if (!isAuthenticating) {
      processOAuthCallback();
    }
  }, [handleOAuthCallback, history, isAuthenticating, toast]);

  // Show loading state while processing OAuth callback
  if (isAuthenticating) {
    return (
      <AdminErrorBoundary>
        <AdminLoadingSpinner
          message="Authenticating with Discord..."
          details="Please wait while we verify your credentials"
          minHeight="50vh"
          size="xl"
        />
      </AdminErrorBoundary>
    );
  }

  // Show error state if authentication failed
  if (authError) {
    return (
      <AdminErrorBoundary>
        <Box p={8} maxWidth="600px" mx="auto">
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Authentication Failed!</AlertTitle>
              <AlertDescription>
                {authError || 'An unexpected error occurred during Discord authentication.'}
              </AlertDescription>
            </Box>
          </Alert>
          
          <VStack spacing={4} mt={6}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              You can try authenticating again or return to the admin page.
            </Text>
            
            <Box>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  clearAuthData();
                  history.push('/admin');
                }}
              >
                Try Again
              </Button>
              
              <Button
                variant="outline"
                onClick={() => history.push('/')}
              >
                Return Home
              </Button>
            </Box>
          </VStack>
        </Box>
      </AdminErrorBoundary>
    );
  }

  // This should not normally be reached as the component redirects on success
  // But provide a fallback just in case
  return (
    <AdminErrorBoundary>
      <AdminLoadingSpinner
        message="Completing authentication..."
        minHeight="50vh"
        size="lg"
      />
    </AdminErrorBoundary>
  );
};