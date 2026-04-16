import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

type AppRole = "admin" | "funcionario";

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
  isLoading: true,
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
        .from("user_roles")
        .select("role")
        .eq("user_id", userId);

      if (error) {
        // Error loading permissions treated gracefully
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
