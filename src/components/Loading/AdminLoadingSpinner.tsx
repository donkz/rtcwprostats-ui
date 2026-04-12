import React from 'react';
import {
  Box,
  Spinner,
  Text,
  VStack,
  HStack,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react';

interface AdminLoadingSpinnerProps {
  /**
   * Loading message to display
   */
  message?: string;
  
  /**
   * Size of the spinner
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Whether to show a progress bar (for determinate loading)
   */
  showProgress?: boolean;
  
  /**
   * Progress value (0-100) when showProgress is true
   */
  progress?: number;
  
  /**
   * Minimum height for the loading container
   */
  minHeight?: string;
  
  /**
   * Whether to center the spinner in the container
   */
  centered?: boolean;
  
  /**
   * Additional details to show below the main message
   */
  details?: string;
  
  /**
   * Color scheme for the spinner
   */
  colorScheme?: string;
}

/**
 * Enhanced loading spinner component for admin operations
 */
export const AdminLoadingSpinner: React.FC<AdminLoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'lg',
  showProgress = false,
  progress = 0,
  minHeight = '200px',
  centered = true,
  details,
  colorScheme = 'blue',
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const detailsColor = useColorModeValue('gray.500', 'gray.400');

  const content = (
    <VStack spacing={4}>
      <Spinner 
        size={size} 
        color={`${colorScheme}.500`}
        thickness="3px"
        speed="0.8s"
      />
      
      <VStack spacing={2}>
        <Text fontSize="md" color={textColor} textAlign="center">
          {message}
        </Text>
        
        {details && (
          <Text fontSize="sm" color={detailsColor} textAlign="center">
            {details}
          </Text>
        )}
      </VStack>
      
      {showProgress && (
        <Box w="200px">
          <Progress 
            value={progress} 
            colorScheme={colorScheme}
            size="sm"
            borderRadius="md"
          />
          <Text fontSize="xs" color={detailsColor} textAlign="center" mt={1}>
            {Math.round(progress)}%
          </Text>
        </Box>
      )}
    </VStack>
  );

  if (centered) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH={minHeight}
        bg={bgColor}
        borderRadius="md"
        p={6}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box p={6}>
      {content}
    </Box>
  );
};

/**
 * Inline loading spinner for buttons and small components
 */
export const AdminInlineSpinner: React.FC<{
  message?: string;
  size?: 'xs' | 'sm' | 'md';
  colorScheme?: string;
}> = ({ 
  message = 'Loading...', 
  size = 'sm',
  colorScheme = 'blue' 
}) => (
  <HStack spacing={2}>
    <Spinner size={size} color={`${colorScheme}.500`} />
    <Text fontSize="sm">{message}</Text>
  </HStack>
);

/**
 * Overlay loading spinner for full-screen loading states
 */
export const AdminLoadingOverlay: React.FC<{
  message?: string;
  isVisible: boolean;
}> = ({ 
  message = 'Processing...', 
  isVisible 
}) => {
  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="blackAlpha.600"
      display="flex"
      justifyContent="center"
      alignItems="center"
      zIndex={9999}
    >
      <Box
        bg="white"
        borderRadius="md"
        p={8}
        boxShadow="xl"
      >
        <AdminLoadingSpinner 
          message={message}
          size="xl"
          centered={false}
          minHeight="auto"
        />
      </Box>
    </Box>
  );
};