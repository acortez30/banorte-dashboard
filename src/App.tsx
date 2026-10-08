import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Lockers from "@/pages/Lockers";
import Employees from "@/pages/Employees";
import AdminLockers from "@/pages/AdminLockers";
import Accesses from "@/pages/Accesses";
import Users from "@/pages/Users";
import NotFound from "@/pages/NotFound";
import type { UserRole } from "@/types/dashboard";
import EmployeeDetail from "./pages/EmployeeDetail";

function HomeRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "SUPER_ADMIN" ? "/lockers" : "/employees"} replace />;
}

function Protected({ children, roles }: { children: ReactNode; roles?: UserRole[] }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Cargando…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={user.role === "SUPER_ADMIN" ? "/lockers" : "/employees"} replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/lockers" element={<Protected roles={["SUPER_ADMIN"]}><Lockers /></Protected>} />
            <Route path="/employees" element={<Protected roles={["ADMIN"]}><Employees /></Protected>} />
            <Route path="/employees/:employeeId" element={<Protected roles={["ADMIN"]}><EmployeeDetail /></Protected>} />
            <Route path="/locker-view" element={<Protected roles={["ADMIN"]}><AdminLockers /></Protected>} />
            <Route path="/accesses" element={<Protected roles={["ADMIN"]}><Accesses /></Protected>} />
            <Route path="/users" element={<Protected roles={["SUPER_ADMIN", "ADMIN"]}><Users /></Protected>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </DataProvider>
    </BrowserRouter>
  );
}
