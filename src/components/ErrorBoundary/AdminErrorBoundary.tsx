import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  VStack,
  Text,
  Code,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component specifically for admin components
 * Catches JavaScript errors anywhere in the admin component tree
 */
export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('AdminErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent 
            error={this.state.error!} 
            resetError={this.resetError} 
          />
        );
      }

      // Default error UI
      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Box p={6} maxW="600px" mx="auto">
      <Alert status="error" borderRadius="md" flexDirection="column" alignItems="flex-start">
        <Box display="flex" alignItems="center" mb={4}>
          <AlertIcon />
          <AlertTitle>Something went wrong in the admin panel!</AlertTitle>
        </Box>
        
        <AlertDescription mb={4}>
          An unexpected error occurred while loading the admin interface. 
          This might be a temporary issue.
        </AlertDescription>

        <VStack spacing={4} align="stretch" w="100%">
          <Button colorScheme="red" onClick={resetError}>
            Try Again
          </Button>
          
          <Button variant="outline" onClick={onToggle} size="sm">
            {isOpen ? 'Hide' : 'Show'} Error Details
          </Button>
          
          <Collapse in={isOpen}>
            <Box mt={4} p={4} bg="gray.50" borderRadius="md">
              <Text fontSize="sm" fontWeight="bold" mb={2}>
                Error Message:
              </Text>
              <Code fontSize="sm" p={2} display="block" whiteSpace="pre-wrap">
                {error.message}
              </Code>
              
              {error.stack && (
                <>
                  <Text fontSize="sm" fontWeight="bold" mt={4} mb={2}>
                    Stack Trace:
                  </Text>
                  <Code fontSize="xs" p={2} display="block" whiteSpace="pre-wrap" maxH="200px" overflowY="auto">
                    {error.stack}
                  </Code>
                </>
              )}
            </Box>
          </Collapse>
        </VStack>
      </Alert>
    </Box>
  );
};

/**
 * Higher-order component to wrap components with error boundary
 */
export const withAdminErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) => {
  const WrappedComponent = (props: P) => (
    <AdminErrorBoundary fallback={fallback}>
      <Component {...props} />
    </AdminErrorBoundary>
  );

  WrappedComponent.displayName = `withAdminErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};