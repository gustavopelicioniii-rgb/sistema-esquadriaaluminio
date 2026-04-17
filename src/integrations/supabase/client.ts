// AluFlow - Custom Supabase-compatible client using local PostgreSQL
// This replaces the cloud Supabase with our local API proxy

import type { Database } from './types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const REST_URL = `${API_BASE}/rest/v1`;
const AUTH_URL = `${API_BASE}/auth/v1`;

// Storage keys
const TOKEN_KEY = 'aluflow_token';
const USER_KEY = 'aluflow_user';

// ============================================
// Auth Helper Functions
// ============================================

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredAuth = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// ============================================
// API Fetch Helper
// ============================================

const apiFetch = async (url: string, options: RequestInit = {}) => {
  const token = getStoredToken();
  
  const headers: any = {
    'Content-Type': 'application/json',
    'apikey': token || '',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, { ...options, headers });
  
  // Handle unauthorized
  if (response.status === 401) {
    clearStoredAuth();
    window.location.reload();
  }
  
  return response;
};

// ============================================
// Supabase-compatible client
// ============================================

export const supabase = {
  // Auth
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      const response = await fetch(`${AUTH_URL}/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { data: { user: null, session: null }, error: new Error(data.error || 'Login failed') };
      }
      
      setStoredToken(data.access_token);
      setStoredUser(data.user);
      
      return {
        data: {
          user: data.user,
          session: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in,
            expires_at: Date.now() + data.expires_in * 1000,
          }
        },
        error: null
      };
    },
    
    signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
      const response = await fetch(`${AUTH_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, options }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        return { data: { user: null, session: null }, error: new Error(data.error || 'Signup failed') };
      }
      
      setStoredToken(data.token);
      
      return {
        data: {
          user: data,
          session: {
            access_token: data.token,
            refresh_token: data.token,
          }
        },
        error: null
      };
    },
    
    signOut: async () => {
      clearStoredAuth();
      return { error: null };
    },
    
    getSession: async () => {
      const token = getStoredToken();
      const user = getStoredUser();
      
      if (!token || !user) {
        return { data: { session: null, user: null }, error: null };
      }
      
      return {
        data: {
          session: { access_token: token },
          user
        },
        error: null
      };
    },
    
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      // Check on mount
      const token = getStoredToken();
      const user = getStoredUser();
      if (token && user) {
        callback('SIGNED_IN', { access_token: token });
      }
      
      // Listen for storage events (for multi-tab support)
      const handler = (e: StorageEvent) => {
        if (e.key === TOKEN_KEY) {
          if (e.newValue) {
            callback('SIGNED_IN', { access_token: e.newValue });
          } else {
            callback('SIGNED_OUT', null);
          }
        }
      };
      window.addEventListener('storage', handler);
      
      return {
        data: { subscription: { unsubscribe: () => window.removeEventListener('storage', handler) } }
      };
    },
  },
  
  // Database operations
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => execute(`${REST_URL}/${table}?${column}=eq.${value}&select=${columns}`, 'GET'),
        maybeSingle: async () => execute(`${REST_URL}/${table}?${column}=eq.${value}&select=${columns}`, 'GET'),
        then: (resolve: Function, reject: Function) => execute(`${REST_URL}/${table}?${column}=eq.${value}&select=${columns}`, 'GET').then(resolve).catch(reject),
      }),
      order: (column: string, { ascending }: { ascending: boolean }) => ({
        then: (resolve: Function, reject: Function) => 
          execute(`${REST_URL}/${table}?select=${columns}&order=${column}.${ascending ? 'asc' : 'desc'}`, 'GET').then(resolve).catch(reject),
      }),
      limit: (count: number) => ({
        then: (resolve: Function, reject: Function) => 
          execute(`${REST_URL}/${table}?select=${columns}&limit=${count}`, 'GET').then(resolve).catch(reject),
      }),
      then: (resolve: Function, reject: Function) => 
        execute(`${REST_URL}/${table}?select=${columns}`, 'GET').then(resolve).catch(reject),
    }),
    insert: (data: any) => ({
      select: () => ({
        then: (resolve: Function, reject: Function) => {
          const method = Array.isArray(data) ? 'POST' : 'POST';
          const body = Array.isArray(data) ? data : [data];
          execute(`${REST_URL}/${table}`, { method: 'POST', body }, true).then(resolve).catch(reject);
        }
      }),
      then: (resolve: Function, reject: Function) => {
        execute(`${REST_URL}/${table}`, { method: 'POST', body: data }, true).then(resolve).catch(reject);
      },
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        then: (resolve: Function, reject: Function) =>
          execute(`${REST_URL}/${table}?${column}=eq.${value}`, { method: 'PATCH', body: data }, true).then(resolve).catch(reject),
      }),
      then: (resolve: Function, reject: Function) =>
        execute(`${REST_URL}/${table}`, { method: 'PATCH', body: data }, true).then(resolve).catch(reject),
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({
        then: (resolve: Function, reject: Function) =>
          execute(`${REST_URL}/${table}?${column}=eq.${value}`, { method: 'DELETE' }, true).then(resolve).catch(reject),
      }),
    }),
  }),
  
  // RPC (stored functions)
  rpc: (fn: string, params: any = {}) => ({
    then: (resolve: Function, reject: Function) =>
      execute(`${REST_URL}/rpc/${fn}`, { method: 'POST', body: params }, true).then(resolve).catch(reject),
  }),
};

// Helper to execute requests
const execute = async (url: string, options: any = {}, isMutation = false) => {
  const token = getStoredToken();
  
  const headers: any = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['apikey'] = token;
  }
  
  const fetchOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
  };
  
  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }
  
  const response = await fetch(url, fetchOptions);
  
  // Handle errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.error || error.message || 'Request failed');
  }
  
  // Handle no content
  if (response.status === 204) {
    return isMutation ? [] : null;
  }
  
  const data = await response.json();
  
  // Return in Supabase format
  if (isMutation) {
    return { data, error: null };
  }
  
  return { data, error: null, count: Array.isArray(data) ? data.length : 1 };
};

export type SupabaseClient = typeof supabase;
