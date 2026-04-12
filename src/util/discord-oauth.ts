import { DiscordOAuthConfig } from '../types/admin';

/**
 * Discord OAuth configuration constants
 */
export const DISCORD_OAUTH_CONFIG: DiscordOAuthConfig = {
  clientId: import.meta.env.VITE_DISCORD_CLIENT_ID || '',
  redirectUri: `${window.location.origin}/admin/callback`,
  scope: ['identify', 'email'],
  responseType: 'code'
};

/**
 * Generate a random state parameter for OAuth security
 */
export const generateOAuthState = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Generate Discord OAuth authorization URL
 */
export const generateDiscordOAuthUrl = (state?: string): string => {
  const oauthState = state || generateOAuthState();
  
  // Store state in sessionStorage for validation
  sessionStorage.setItem('discord_oauth_state', oauthState);
  
  const params = new URLSearchParams({
    client_id: DISCORD_OAUTH_CONFIG.clientId,
    redirect_uri: DISCORD_OAUTH_CONFIG.redirectUri,
    response_type: DISCORD_OAUTH_CONFIG.responseType,
    scope: DISCORD_OAUTH_CONFIG.scope.join(' '),
    state: oauthState
  });

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
};

/**
 * Validate OAuth state parameter to prevent CSRF attacks
 */
export const validateOAuthState = (receivedState: string): boolean => {
  const storedState = sessionStorage.getItem('discord_oauth_state');
  
  if (!storedState || storedState !== receivedState) {
    return false;
  }
  
  // Clear the state after validation
  sessionStorage.removeItem('discord_oauth_state');
  return true;
};

/**
 * Extract OAuth parameters from URL
 */
export const extractOAuthParams = (url: string = window.location.href) => {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  
  return {
    code: params.get('code'),
    state: params.get('state'),
    error: params.get('error'),
    errorDescription: params.get('error_description')
  };
};

/**
 * Check if current URL contains OAuth callback parameters
 */
export const isOAuthCallback = (url: string = window.location.href): boolean => {
  const { code, error } = extractOAuthParams(url);
  return !!(code || error);
};

/**
 * Clear OAuth parameters from URL without page reload
 */
export const clearOAuthParams = (): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete('code');
  url.searchParams.delete('state');
  url.searchParams.delete('error');
  url.searchParams.delete('error_description');
  
  window.history.replaceState({}, document.title, url.toString());
};

/**
 * Validate Discord OAuth configuration
 */
export const validateOAuthConfig = (): boolean => {
  return !!(
    DISCORD_OAUTH_CONFIG.clientId &&
    DISCORD_OAUTH_CONFIG.redirectUri &&
    DISCORD_OAUTH_CONFIG.scope.length > 0
  );
};