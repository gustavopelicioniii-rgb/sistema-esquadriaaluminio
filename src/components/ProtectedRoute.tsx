import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { PageLoading } from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  // BYPASSED FOR TESTING - Auth disabled
  return <>{children}</>;
  
  const { user, role, isLoading, isRoleLoading } = useAuth();

  if (isLoading || (requiredRole && isRoleLoading)) return <PageLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Acesso Negado</h2>
        <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return <>{children}</>;
}
