import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { DashboardUser } from "@/types/dashboard";
import { MOCK_USERS } from "@/data/mockData";

interface AuthContextValue {
  user: DashboardUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: true; user: DashboardUser } | { ok: false; error: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const SESSION_KEY = "banorte_mock_session";
const USERS_KEY = "banorte_mock_users";

function readUsers(): DashboardUser[] {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    return stored ? JSON.parse(stored) : MOCK_USERS;
  } catch {
    return MOCK_USERS;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const sessionUser = JSON.parse(stored) as DashboardUser;
        const current = readUsers().find((candidate) => candidate.id === sessionUser.id);
        if (current?.active) setUser(current);
        else localStorage.removeItem(SESSION_KEY);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    async signIn(email, password) {
      const candidate = readUsers().find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
      if (!candidate) return { ok: false, error: "Correo o contraseña incorrectos." };
      if (!candidate.active) return { ok: false, error: "Este usuario está desactivado." };
      if (candidate.password !== password) return { ok: false, error: "Correo o contraseña incorrectos." };
      localStorage.setItem(SESSION_KEY, JSON.stringify(candidate));
      setUser(candidate);
      return { ok: true, user: candidate };
    },
    logout() {
      localStorage.removeItem(SESSION_KEY);
      setUser(null);
    },
  }), [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
