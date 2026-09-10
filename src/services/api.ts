import { getSupabaseClient } from '../lib/supabase';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: any;
  };
}

class ApiService {
  private baseUrl = '/api';

  private async getAuthHeader(): Promise<Record<string, string>> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      // Check local storage for fallback/dev token
      const token = localStorage.getItem('smu_auth_token');
      return token ? { Authorization: `Bearer ${token}` } : {};
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }

    const fallbackToken = localStorage.getItem('smu_auth_token');
    return fallbackToken ? { Authorization: `Bearer ${fallbackToken}` } : {};
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const authHeaders = await this.getAuthHeader();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...((options.headers as Record<string, string>) || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || `Request failed with status ${response.status}`,
          error: data.error || { code: `HTTP_${response.status}` },
        };
      }

      return data;
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Network communication failure',
        error: { code: 'NETWORK_ERROR', details: error },
      };
    }
  }

  get<T = any>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }

  post<T = any>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  put<T = any>(endpoint: string, body?: any, headers?: Record<string, string>) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  delete<T = any>(endpoint: string, headers?: Record<string, string>) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

export const api = new ApiService();
export default api;
