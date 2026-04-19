// AluFlow - Custom Supabase-compatible client using local PostgreSQL

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const REST_URL = `${API_BASE}/rest/v1`;
const AUTH_URL = `${API_BASE}/auth/v1`;

const TOKEN_KEY = 'aluflow_token';
const USER_KEY = 'aluflow_user';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user: any) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const getHeaders = () => {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    'apikey': token || '',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

const execute = async (url: string, options: RequestInit = {}) => {
  const headers = getHeaders();
  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.error || error.message || 'Request failed');
  }
  
  if (response.status === 204) return { data: [], error: null };
  
  const data = await response.json();
  return { data, error: null, count: Array.isArray(data) ? data.length : 1 };
};

// Simple query executor
const query = (table: string) => {
  let url = `${REST_URL}/${table}`;
  let method = 'GET';
  let body = null;
  let hasData = false;
  
  const api = {
    // Select
    select: (columns = '*') => {
      url += `?select=${columns}`;
      return api;
    },
    
    // Filters
    eq: (column: string, value: any) => {
      const op = encodeURIComponent(value);
      url += url.includes('?') ? `&${column}=eq.${op}` : `?${column}=eq.${op}`;
      return api;
    },
    neq: (column: string, value: any) => {
      url += url.includes('?') ? `&${column}=neq.${value}` : `?${column}=neq.${value}`;
      return api;
    },
    gt: (column: string, value: any) => {
      url += url.includes('?') ? `&${column}=gt.${value}` : `?${column}=gt.${value}`;
      return api;
    },
    lt: (column: string, value: any) => {
      url += url.includes('?') ? `&${column}=lt.${value}` : `?${column}=lt.${value}`;
      return api;
    },
    gte: (column: string, value: any) => {
      url += url.includes('?') ? `&${column}=gte.${value}` : `?${column}=gte.${value}`;
      return api;
    },
    lte: (column: string, value: any) => {
      url += url.includes('?') ? `&${column}=lte.${value}` : `?${column}=lte.${value}`;
      return api;
    },
    
    // Ordering
    order: (column: string, { ascending = true } = {}) => {
      url += `&order=${column}.${ascending ? 'asc' : 'desc'}`;
      return api;
    },
    
    // Limit
    limit: (count: number) => {
      url += `&limit=${count}`;
      return api;
    },
    
    // Range
    range: (from: number, to: number) => {
      url += `&offset=${from}&limit=${to - from + 1}`;
      return api;
    },
    
    // Insert
    insert: (data: any) => {
      method = 'POST';
      body = data;
      hasData = true;
      return api;
    },
    
    // Update
    update: (data: any) => {
      method = 'PATCH';
      body = data;
      hasData = true;
      return api;
    },
    
    // Delete
    delete: () => {
      method = 'DELETE';
      return api;
    },
    
    // Promise then
    then: (resolve: Function, reject: Function) => {
      const opts: RequestInit = { method };
      if (body) opts.body = JSON.stringify(body);
      execute(url, opts).then(resolve).catch(reject);
    },
    
    // Async get
    get: async () => {
      return execute(url, { method });
    },
    
    // Single result
    single: async () => {
      const result = await execute(url, { method });
      if (result.data && result.data.length > 0) {
        result.data = result.data[0];
      } else if (result.data && result.data.length === 0) {
        result.data = null;
      }
      return result;
    },
    
    // Maybe single
    maybeSingle: async () => {
      const result = await execute(url, { method });
      if (result.data && result.data.length > 0) {
        result.data = result.data[0];
      }
      return result;
    },
  };
  
  return api;
};

export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      try {
        const response = await fetch(`${AUTH_URL}/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          return { data: { user: null, session: null }, error: new Error(data.error || 'Login failed') };
        }
        
        setStoredToken(data.token);
        setStoredUser(data.user);
        
        return {
          data: {
            user: data.user,
            session: { access_token: data.token }
          },
          error: null
        };
      } catch (err) {
        return { data: { user: null, session: null }, error: err instanceof Error ? err : new Error('Login failed') };
      }
    },
    
    signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
      try {
        const response = await fetch(`${AUTH_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, nome: options?.nome || email.split('@')[0] }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          return { data: { user: null, session: null }, error: new Error(data.error || 'Signup failed') };
        }
        
        setStoredToken(data.token);
        setStoredUser(data.user);
        
        return {
          data: { user: data.user, session: { access_token: data.token } },
          error: null
        };
      } catch (err) {
        return { data: { user: null, session: null }, error: err instanceof Error ? err : new Error('Signup failed') };
      }
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
      
      return { data: { session: { access_token: token }, user }, error: null };
    },
    
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      const token = getStoredToken();
      const user = getStoredUser();
      if (token && user) callback('SIGNED_IN', { access_token: token });
      
      const handler = (e: StorageEvent) => {
        if (e.key === TOKEN_KEY) {
          if (e.newValue) callback('SIGNED_IN', { access_token: e.newValue });
          else callback('SIGNED_OUT', null);
        }
      };
      window.addEventListener('storage', handler);
      
      return { data: { subscription: { unsubscribe: () => window.removeEventListener('storage', handler) } } };
    },
  },
  
  from: (table: string) => query(table),
  
  rpc: (fn: string, params: any = {}) => ({
    then: (resolve: Function, reject: Function) => {
      execute(`${REST_URL}/rpc/${fn}`, { method: 'POST', body: params }, true).then(resolve).catch(reject);
    },
  }),
  
  // Realtime stubs (not supported in local API)
  channel: (name: string) => ({
    on: () => ({ on: () => ({ subscribe: () => ({ data: { subscription: {} } }) }) }),
    subscribe: () => ({ data: { subscription: {} } }),
    unsubscribe: () => {},
  }),
  removeChannel: () => Promise.resolve(),
};

export type SupabaseClient = typeof supabase;
