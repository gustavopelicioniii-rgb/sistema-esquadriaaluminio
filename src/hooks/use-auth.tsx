import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

// Local types instead of Supabase
type User = { id: string; email?: string; nome?: string };
type Session = { access_token: string; refresh_token?: string; expires_in?: number; expires_at?: number };

type AppRole = "admin" | "funcionario";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  isLoading: boolean;
  isRoleLoading: boolean;
  signOut: () => Promise<void>;
};

// BYPASS MODE - No auth required (set to false to enable auth)
const BYPASS_MODE = true;

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  role: null,
  isLoading: false, // Not loading in bypass mode
  isRoleLoading: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // BYPASS MODE - Return dummy values
  if (BYPASS_MODE) {
    return (
      <AuthContext.Provider value={{ 
        user: { id: 'bypass-user', email: 'bypass@test.com' } as any, 
        session: null, 
        role: 'admin' as AppRole, 
        isLoading: false, 
        isRoleLoading: false, 
        signOut: async () => {} 
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  // Original auth logic below
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
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        setRole(null);
        return;
      }

      const roles = data?.map((item) => item.role) ?? [];
      setRole(roles.includes("admin") ? "admin" : roles[0] ?? null);
    } finally {
      setIsRoleLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const applySession = (nextSession: Session | null) => {
      if (!isMounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!nextSession?.user) {
        setRole(null);
        setIsRoleLoading(false);
        return;
      }

      void fetchRole(nextSession.user.id);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (!initializedRef.current) return;

      if (!nextSession?.user) {
        setRole(null);
        setIsRoleLoading(false);
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        if (!isMounted) return;
        void fetchRole(nextSession.user.id);
      }, 0);
    });

    supabase.auth.getSession()
      .then(({ data: { session: initialSession } }) => {
        applySession(initialSession);
      })
      .catch(() => {
        if (!isMounted) return;

        setSession(null);
        setUser(null);
        setRole(null);
        setIsRoleLoading(false);
      })
      .finally(() => {
        if (!isMounted) return;

        initializedRef.current = true;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchRole]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole(null);
    setIsRoleLoading(false);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, isLoading, isRoleLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
