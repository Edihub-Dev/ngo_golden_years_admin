import { useRouter } from 'next/navigation';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const safeAtob = (value: string) => {
  if (typeof atob === 'function') return atob(value);
  return Buffer.from(value, 'base64').toString('binary');
};

interface TokenPayload {
  exp?: number;
  [key: string]: unknown;
}

interface User {
  _id: string;
  mobile: string;
  name?: string;
  email?: string;
  age?: number;
  role?: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export class AuthManager {
  private static instance: AuthManager;
  private router: ReturnType<typeof useRouter> | null = null;

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  setRouter(router: ReturnType<typeof useRouter>) {
    this.router = router;
  }

  // Secure token storage with validation
  setToken(token: string): boolean {
    try {
      if (!isBrowser()) return false;
      if (!this.isValidToken(token)) {
        throw new Error('Invalid token format');
      }
      
      // Store token with expiration check
      const tokenData = this.parseToken(token);
      if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
        throw new Error('Token expired');
      }

      window.localStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.error('Failed to set token:', error);
      this.clearAuth();
      return false;
    }
  }

  getToken(): string | null {
    try {
      if (!isBrowser()) return null;

      const token = window.localStorage.getItem('token');
      if (!token) return null;

      // Validate token format and expiration
      if (!this.isValidToken(token)) {
        this.clearAuth();
        return null;
      }

      const tokenData = this.parseToken(token);
      if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
        this.clearAuth();
        return null;
      }

      return token;
    } catch (error) {
      console.error('Failed to get token:', error);
      this.clearAuth();
      return null;
    }
  }

  setUser(user: User): void {
    try {
      if (!isBrowser()) return;
      // Validate user data
      if (!user || !user.mobile || !user._id) {
        throw new Error('Invalid user data');
      }
      window.localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to set user:', error);
    }
  }

  getUser(): User | null {
    try {
      if (!isBrowser()) return null;

      const userData = window.localStorage.getItem('user');
      if (!userData) return null;

      const user = JSON.parse(userData);
      if (!user || !user.mobile || !user._id) {
        this.clearAuth();
        return null;
      }
      return user;
    } catch (error) {
      console.error('Failed to get user:', error);
      this.clearAuth();
      return null;
    }
  }

  getAuthState(): AuthState {
    const token = this.getToken();
    const user = this.getUser();
    
    return {
      user,
      token,
      isAuthenticated: !!(token && user),
      isLoading: false
    };
  }

  // Secure logout
  logout(): void {
    this.clearAuth();
    if (this.router) {
      this.router.push('/login');
    } else {
      if (isBrowser()) {
        window.location.href = '/login';
      }
    }
  }

  private clearAuth(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user');
  }

  private isValidToken(token: string): boolean {
    try {
      const parts = token.split('.');
      return parts.length === 3;
    } catch {
      return false;
    }
  }

  private parseToken(token: string): TokenPayload {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(safeAtob(payload)) as TokenPayload;
    } catch {
      return {};
    }
  }

  // Route protection utility
  requireAuth(): AuthState {
    const authState = this.getAuthState();
    
    if (!authState.isAuthenticated) {
      if (this.router) {
        this.router.push('/login');
      } else {
        if (isBrowser()) {
          window.location.href = '/login';
        }
      }
    }
    
    return authState;
  }

  // Admin route protection
  requireAdmin(): AuthState {
    const authState = this.requireAuth();
    
    if (authState.user?.role !== 'admin') {
      if (this.router) {
        this.router.push('/dashboard');
      } else {
        if (isBrowser()) {
          window.location.href = '/dashboard';
        }
      }
    }
    
    return authState;
  }

  // Check if user is fully registered
  isUserRegistered(): boolean {
    const user = this.getUser();
    return !!(user && user.name);
  }
}

// Hook for using auth in components
export function useAuth() {
  const authManager = AuthManager.getInstance();
  return authManager.getAuthState();
}

// API headers utility
export function getAuthHeaders(): Record<string, string> {
  const authManager = AuthManager.getInstance();
  const token = authManager.getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// Safe fetch wrapper with auth
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const authManager = AuthManager.getInstance();
  const token = authManager.getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Directly point to the backend URL if using environment variables to avoid Next.js proxy 503 errors on Vercel
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const fetchUrl = url.startsWith('/api') && baseUrl ? `${baseUrl}${url}` : url;
  
  console.log(`[API DEBUG] Requesting: ${fetchUrl} (BaseURL: ${baseUrl || 'not set'})`);
  
  const response = await fetch(fetchUrl, {
    ...options,
    headers,
  });
  
  // Handle token expiration
  if (response.status === 401) {
    authManager.logout();
  }
  
  return response;
}
