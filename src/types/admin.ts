// Admin-specific type definitions for the admin page feature

/**
 * Task status enumeration
 */
export type TaskStatus = 'pending' | 'approved' | 'rejected';

/**
 * Task interface representing a task in the admin system
 */
export interface Task {
  id: string;
  name: string;
  description: string;
  approval_status: TaskStatus;
  createdAt: string;
  createdBy?: string;
  isAdmin?: boolean;
}

export interface User {
  discordId: string;
  username: string;
  avatar: string;
}

/**
 * Authentication state interface for managing admin authentication
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Discord OAuth configuration interface
 */
export interface DiscordOAuthConfig {
  clientId: string;
  redirectUri: string;
  scope: string[];
  responseType: 'code';
  state?: string;
}

/**
 * Discord user information returned from OAuth
 */
export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  email: string;
}

/**
 * OAuth token response interface
 */
export interface OAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface AdminApiResponse<T = any> {
  user: User;
  token: any;
  data?: T;
}

export interface TaskUpdateRequest {
  taskId: string;
  approval_status: TaskStatus;
  discordToken: string;
}

export interface AuthRequest {
  code: string;
  state?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}