import { authFetch } from './auth';

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

// API Client class for better error handling
export class ApiClient {
  private static instance: ApiClient;

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  // Generic request method with error handling
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await authFetch(url, options);

      // Safely parse JSON — avoid SyntaxError if backend is down and proxy returns HTML
      const contentType = response.headers.get('content-type') || '';
      let data: Record<string, unknown> = {};
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response (status ${response.status}): ${text.slice(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error((data.message as string) || `HTTP ${response.status}: ${response.statusText}`);
      }

      return {
        success: true,
        data: (data.data || data) as T,
        message: data.message as string | undefined
      };
    } catch (error) {
      console.error('API Request Error:', error);
      
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
          code: 'NETWORK_ERROR'
        }
      };
    }
  }

  // GET request
  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'GET' });
  }

  // POST request
  async post<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, { method: 'DELETE' });
  }

  // PATCH request
  async patch<T>(url: string, data?: Record<string, unknown>): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();

// Specific API methods
export const authApi = {
  login: (credentials: Record<string, string>) => apiClient.post('/api/auth/login', credentials),
  register: (userData: Record<string, string>) => apiClient.post('/api/auth/register', userData),
  forgotPasswordSendOTP: (mobile: string) => apiClient.post('/api/auth/forgot-password', { mobile }),
  forgotPasswordVerifyOTP: (mobile: string, otp: string) => apiClient.post('/api/auth/verify-otp', { mobile, otp }),
  resetPassword: (mobile: string, otp: string, password: string) => 
    apiClient.post('/api/auth/reset-password', { mobile, otp, password }),
};

export const userApi = {
  getStats: () => apiClient.get('/api/users/stats'),
  updateProfile: (data: Record<string, unknown>) => apiClient.put('/api/users/profile', data),
};

export const adminApi = {
  getDashboard: () => apiClient.get('/api/admin/dashboard'),
  getUsers: () => apiClient.get('/api/admin/users'),
  getRequests: () => apiClient.get('/api/admin/requests'),
  updateRequestStatus: (id: string, status: string) => 
    apiClient.put(`/api/admin/requests/${id}/status`, { status }),
};

export const emergencyApi = {
  triggerSOS: (location: { lat: number; lng: number }, description?: string) =>
    apiClient.post('/api/emergency/sos', { location, description }),
};

export const blogApi = {
  getAll: (params?: Record<string, unknown>) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return apiClient.get(`/api/blogs${query}`);
  },
  getOne: (id: string) => apiClient.get(`/api/blogs/${id}`),
  create: (data: Record<string, unknown>) => apiClient.post('/api/blogs', data),
  update: (id: string, data: Record<string, unknown>) => apiClient.put(`/api/blogs/${id}`, data),
  delete: (id: string) => apiClient.delete(`/api/blogs/${id}`),
};
