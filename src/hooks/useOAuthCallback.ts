import { useEffect, useState } from 'react';
import { useAdminAuth } from './useAdminAuth';
import { isOAuthCallback } from '../util/discord-oauth';

/**
 * Hook for handling OAuth callback processing
 */
export const useOAuthCallback = () => {
  const { handleOAuthCallback } = useAdminAuth();
  const [callbackState, setCallbackState] = useState<{
    isProcessing: boolean;
    error: string | null;
    success: boolean;
  }>({
    isProcessing: false,
    error: null,
    success: false
  });

  useEffect(() => {
    const processCallback = async () => {
      // Only process if we're on a callback URL
      if (!isOAuthCallback()) {
        return;
      }

      setCallbackState({
        isProcessing: true,
        error: null,
        success: false
      });

      try {
        await handleOAuthCallback();
        setCallbackState({
          isProcessing: false,
          error: null,
          success: true
        });
      } catch (error) {
        setCallbackState({
          isProcessing: false,
          error: error instanceof Error ? error.message : 'Authentication failed',
          success: false
        });
      }
    };

    processCallback();
  }, [handleOAuthCallback]);

  return {
    isProcessingCallback: callbackState.isProcessing,
    callbackError: callbackState.error,
    callbackSuccess: callbackState.success,
    isCallback: isOAuthCallback()
  };
};