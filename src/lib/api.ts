/**
 * Enhanced API Client for Production (Admin)
 * Centralizes all network interactions with standardized error handling and type-safety.
 */
import { authFetch } from './auth';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

class ApiClient {
  private static instance: ApiClient;

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Universal fetch wrapper with automatic auth and error normalization
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await authFetch(endpoint, options);
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        return {
          success: false,
          error: {
            message: data?.message || `HTTP Error ${response.status}: ${response.statusText}`,
            status: response.status,
            code: data?.error?.code
          }
        };
      }

      return {
        success: true,
        data: (data?.data || data) as T,
        message: data?.message
      };
    } catch (error: any) {
      console.error(`[API FAIL] ${endpoint}:`, error.message);
      return {
        success: false,
        error: {
          message: 'Unable to connect to the server. Please check your internet connection.',
          code: 'NETWORK_DISCONNECTED'
        }
      };
    }
  }

  // HTTP Methods
  public async get<T>(url: string) {
    return this.request<T>(url, { method: 'GET' });
  }

  public async post<T>(url: string, body?: any) {
    return this.request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  public async put<T>(url: string, body?: any) {
    return this.request<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  public async patch<T>(url: string, body?: any) {
    return this.request<T>(url, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  public async delete<T>(url: string) {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

export const apiClient = ApiClient.getInstance();

/**
 * Service Layer (Production Registry)
 */
export const AuthService = {
  login: (creds: any) => apiClient.post('/api/auth/login', creds),
  register: (data: any) => apiClient.post('/api/auth/register', data),
  getProfile: () => apiClient.get('/api/auth/profile'),
  updateProfile: (data: any) => apiClient.put('/api/auth/profile', data),
  forgotPasswordSendOTP: (mobile: string) => apiClient.post('/api/auth/forgot-password', { mobile }),
  forgotPasswordVerifyOTP: (mobile: string, otp: string) => apiClient.post('/api/auth/verify-otp', { mobile, otp }),
  resetPassword: (mobile: string, otp: string, password: string) => 
    apiClient.post('/api/auth/reset-password', { mobile, otp, password }),
};

export const AdminService = {
  getAnalytics: () => apiClient.get<any>('/api/admin/dashboard'),
  getUsers: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient.get<any>(`/api/admin/users${query}`);
  },
  getInquiries: () => apiClient.get<any>('/api/admin/inquiries'),
  updateInquiry: (id: string, status: string) => apiClient.patch<any>(`/api/admin/inquiries/${id}/status`, { status }),
  getStaff: () => apiClient.get<any>('/api/admin/staff'),
  addStaff: (data: any) => apiClient.post<any>('/api/admin/staff', data),
  getRequests: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient.get<any>(`/api/admin/requests${query}`);
  },
  updateRequestStatus: (id: string, status: string, note?: string) => 
    apiClient.patch<any>(`/api/admin/requests/${id}/status`, { status, note }),
  assignStaffToRequest: (id: string, staffId: string) =>
    apiClient.post<any>(`/api/admin/requests/${id}/assign`, { staffId }),
  deleteRequest: (id: string) => apiClient.delete<any>(`/api/admin/requests/${id}`),
  getDashboard: () => apiClient.get<any>('/api/admin/dashboard'),
  getSettings: () => apiClient.get<any>('/api/admin/settings'),
  updateSettings: (data: any) => apiClient.put<any>('/api/admin/settings', data),
  
  // User Management
  updateUser: (id: string, data: any) => apiClient.put<any>(`/api/admin/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete<any>(`/api/admin/users/${id}`),
  getMembers: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient.get<any>(`/api/admin/users/members${query}`);
  },

  // Staff Management
  updateStaff: (id: string, data: any) => apiClient.put<any>(`/api/admin/staff/${id}`, data),
  deleteStaff: (id: string) => apiClient.delete<any>(`/api/admin/staff/${id}`),

  // Inquiry Management
  deleteInquiry: (id: string) => apiClient.delete<any>(`/api/admin/inquiries/${id}`),
};

export const adminApi = AdminService;

export const blogApi = {
  getAll: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient.get(`/api/blogs${query}`);
  },
  getById: (id: string) => apiClient.get(`/api/blogs/${id}`),
  create: (data: any) => apiClient.post('/api/blogs', data),
  update: (id: string, data: any) => apiClient.put(`/api/blogs/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/blogs/${id}`),
};

export const BlogService = {
  getAll: (params?: any) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient.get(`/api/blogs${query}`);
  },
  getById: (id: string) => apiClient.get(`/api/blogs/${id}`),
  create: (data: any) => apiClient.post('/api/blogs', data),
  update: (id: string, data: any) => apiClient.put(`/api/blogs/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/blogs/${id}`),
};
