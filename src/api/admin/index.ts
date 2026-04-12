import { AxiosInstance } from "axios";
import { pickData } from "../util";
import {
    Task,
    User,
    AuthRequest,
    AuthResponse,
    TaskUpdateRequest,
    AdminApiResponse
} from "../../types/admin";

export const createAdminApi = (agent: AxiosInstance) => {
    return {
        // Authentication endpoints
        auth: {
            /**
             * Exchange Discord OAuth code for admin authentication tokens
             */
            discord: async (authRequest: AuthRequest) => {
                return agent
                    .post<AdminApiResponse<AuthResponse>>('/discordauth/token', authRequest)
                    .then(pickData);
            },

            /**
             * Logout and invalidate admin tokens
             */
            logout: async (token: string) => {
                return agent
                    .post<AdminApiResponse<void>>('/discordauth/logout', {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    .then(pickData);
            }
        },

        // Task management endpoints
        tasks: {
            /**
             * Retrieve all tasks with optional filters
             */
            getAll: async (token?: string) => {
                const headers = token ? { Authorization: `Bearer ${token}` } : {};                

                return agent
                    .get<Task[]>('/admin/tasks', {
                        headers
                    })
                    .then(pickData);
            },

            /**
             * Update task status (approve/reject)
             */
            updateStatus: async (updateRequest: TaskUpdateRequest) => {
                const { taskId, approval_status, discordToken } = updateRequest;

                return agent
                    .put<Task>(
                        `admin/tasks/${taskId}/status`,
                        { approval_status },
                        {
                            headers: { Authorization: `Bearer ${discordToken}` }
                        }
                    )
                    .then(pickData);
            }
        }
    };
};