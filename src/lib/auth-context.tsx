import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "admin" | "gestor" | "sdr" | "consultor";

export interface MockUser {
  name: string;
  email: string;
  role: Role;
}

interface AuthCtx {
  user: MockUser | null;
  login: (email: string, name?: string, role?: Role) => void;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "infinda.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* noop */
    }
  }, []);

  const login: AuthCtx["login"] = (email, name, role) => {
    const u: MockUser = {
      email,
      name: name || email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()),
      role: role || "consultor",
    };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrador",
  gestor: "Gestor",
  sdr: "SDR",
  consultor: "Consultor Comercial",
};
