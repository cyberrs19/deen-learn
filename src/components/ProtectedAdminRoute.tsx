import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute = ({ children }: ProtectedAdminRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      if (authLoading) return;

      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error || !data) {
        navigate("/", { replace: true });
        return;
      }

      setIsAdmin(true);
      setChecking(false);
    };

    checkAdmin();
  }, [user, authLoading, navigate]);

  if (authLoading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-sm text-muted-foreground">যাচাই করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return <>{children}</>;
};

export default ProtectedAdminRoute;
