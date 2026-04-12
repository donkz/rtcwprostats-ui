import { useMutation, useQuery, useQueryClient } from 'react-query';
import { StatsApi } from '../api';
import { AuthRequest, AuthState, User } from '../types/admin';
import { 
  generateDiscordOAuthUrl, 
  validateOAuthState, 
  extractOAuthParams,
  clearOAuthParams,
  validateOAuthConfig
} from '../util/discord-oauth';

/**
 * Local storage key for admin authentication token
 */
const ADMIN_TOKEN_KEY = 'admin_auth_token';

/**
 * Local storage key for admin user data
 */
const ADMIN_USER_KEY = 'admin_user_data';

/**
 * Get stored admin token from localStorage
 */
const getStoredToken = (): string | null => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

/**
 * Store admin token in localStorage
 */
const setStoredToken = (token: string): void => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

/**
 * Remove admin token from localStorage
 */
const removeStoredToken = (): void => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

/**
 * Get stored admin user data from localStorage
 */
const getStoredUser = (): User | null => {
  try {
    const userData = localStorage.getItem(ADMIN_USER_KEY);
    if (!userData) {
      return null;
    }
    
    const parsedUser = JSON.parse(userData) as User;
    return parsedUser;
  } catch (error) {
    console.error("Failed to parse stored user data:", error);
    // Remove corrupted data
    localStorage.removeItem(ADMIN_USER_KEY);
    return null;
  }
};

/**
 * Store admin user data in localStorage
 */
const setStoredUser = (user: User): void => {
  try {
    const userData = JSON.stringify(user);
    localStorage.setItem(ADMIN_USER_KEY, userData);
  } catch (error) {
    console.error("Failed to store user data:", error);
  }
};

/**
 * Remove admin user data from localStorage
 */
const removeStoredUser = (): void => {
  localStorage.removeItem(ADMIN_USER_KEY);
};

/**
 * Hook for managing admin authentication state
 */
export const useAdminAuth = () => {
  const queryClient = useQueryClient();
  const storedToken = getStoredToken();
  const storedUser = getStoredUser();

  // Query to verify current authentication status - DISABLED, just use stored data
  const {
    data: user,
    isLoading: isVerifying,
    error: verifyError,
    refetch: refetchAuth
  } = useQuery(
    ['admin-auth', storedToken],
    async () => {
      // Skip verification, just return stored user if we have a token
      return storedUser;
    },
    {
      enabled: !!storedToken && !!storedUser,
      retry: false,
      staleTime: Infinity, // Never refetch
      cacheTime: Infinity, // Keep in cache forever
    }
  );

  // Mutation for Discord OAuth authentication
  const discordAuthMutation = useMutation(
    async (authRequest: AuthRequest) => {
      const response = await StatsApi.Admin.auth.discord(authRequest);
      return response;
    },
    {
      onSuccess: (data) => {
        if (data?.token) {
          setStoredToken(data.token);
          setStoredUser(data.user);
          queryClient.setQueryData(['admin-auth', data.token], data.user);
          queryClient.invalidateQueries(['admin-auth']);
        }
      },
      onError: (error) => {
        console.error('Discord authentication failed:', error);
        removeStoredToken();
      }
    }
  );

  // Mutation for logout
  const logoutMutation = useMutation(
    async () => {
      if (storedToken) {
        await StatsApi.Admin.auth.logout(storedToken);
      }
    },
    {
      onSuccess: () => {
        removeStoredToken();
        removeStoredUser();
        queryClient.setQueryData(['admin-auth'], null);
        queryClient.removeQueries(['admin-auth']);
        queryClient.removeQueries(['admin-tasks']);
      },
      onError: (error) => {
        console.error('Logout failed:', error);
        // Still remove token and user locally even if server logout fails
        removeStoredToken();
        removeStoredUser();
        queryClient.setQueryData(['admin-auth'], null);
        queryClient.removeQueries(['admin-auth']);
      }
    }
  );

  // Computed authentication state
  const authState: AuthState = {
    isAuthenticated: (!!user || !!storedUser) && !!storedToken,
    user: user || storedUser,
    token: storedToken,
    loading: isVerifying || discordAuthMutation.isLoading || logoutMutation.isLoading,
    error: (verifyError as Error)?.message || 
           (discordAuthMutation.error as Error)?.message || 
           (logoutMutation.error as Error)?.message || null
  };

  return {
    ...authState,
    
    // Actions
    initiateDiscordAuth: () => {
      if (!validateOAuthConfig()) {
        throw new Error('Discord OAuth configuration is invalid');
      }
      
      const authUrl = generateDiscordOAuthUrl();
      window.location.href = authUrl;
    },
    
    handleOAuthCallback: async (url?: string) => {
      const { code, state, error, errorDescription } = extractOAuthParams(url);

      if (error) {
        throw new Error(errorDescription || `OAuth error: ${error}`);
      }
      
      if (!code || !state) {
        if (!storedToken) {
          throw new Error('Missing OAuth parameters');
        }
        else {
          return;
        }
      }
      
      if (!validateOAuthState(state)) {
        if (!storedToken) {
          throw new Error('Invalid OAuth state parameter - possible CSRF attack');
        }
        else {
          return;
        }
      }
      
      clearOAuthParams();
      
      return discordAuthMutation.mutateAsync({ code, state });
    },
    
    logout: () => logoutMutation.mutateAsync(),
    
    refetchAuth,
    
    // Mutation states for UI feedback
    isAuthenticating: discordAuthMutation.isLoading,
    isLoggingOut: logoutMutation.isLoading,
    authError: discordAuthMutation.error as Error | null,
    logoutError: logoutMutation.error as Error | null,
    
    // Helper methods
    clearAuthData: () => {
      removeStoredToken();
      removeStoredUser();
      queryClient.setQueryData(['admin-auth'], null);
      queryClient.removeQueries(['admin-auth']);
      queryClient.removeQueries(['admin-tasks']);
    }
  };
};