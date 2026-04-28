import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { supabase } from '@/integrations/supabase/client';

type User = { id: string; email?: string; nome?: string };
type Session = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
};

type AppRole = 'admin' | 'funcionario';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  isLoading: boolean;
  isRoleLoading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  isLoading: false,
  isRoleLoading: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleLoading, setIsRoleLoading] = useState(false);
  const initializedRef = useRef(false);

  const fetchRole = useCallback(async (userId: string) => {
    setIsRoleLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      if (error) {
        setRole(null);
        return;
      }
      const roles = data?.map(item => item.role) ?? [];
      setRole(roles.includes('admin') ? 'admin' : (roles[0] ?? null));
    } finally {
      setIsRoleLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const applySession = (nextSession: Session | null) => {
      if (!isMounted) return;
      setSession(nextSession);
      setUser((nextSession as unknown as { user: User | null })?.user ?? null);
      if (!(nextSession as unknown as { user: User | null })?.user) {
        setRole(null);
        setIsRoleLoading(false);
        return;
      }
      void fetchRole((nextSession as unknown as { user: User | null }).user.id);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setUser((nextSession as unknown as { user: User | null })?.user ?? null);
      if (initializedRef.current)
        void fetchRole((nextSession as unknown as { user: User | null }).user?.id ?? '');
      initializedRef.current = true;
    });

    void supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      applySession((data?.session as unknown as Session) ?? null);
      initializedRef.current = true;
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchRole]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, role, isLoading, isRoleLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
