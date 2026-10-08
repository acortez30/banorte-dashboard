import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  // Mientras valida sesión
  if (loading) {
    return <div>Cargando...</div>; // o null si quieres más limpio
  }

  // Si NO está autenticado → lo sacas
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si sí está autenticado → pasa
  return <>{children}</>;
}