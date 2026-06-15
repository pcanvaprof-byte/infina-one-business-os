import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "admin" | "consultor";

export interface MockUser {
  name: string;
  email: string;
  role: Role;
}

export interface AccountSeed extends MockUser {
  password: string;
}

// MVP: contas pré-cadastradas diretamente na ferramenta
export const SEED_ACCOUNTS: AccountSeed[] = [
  {
    name: "Danielly",
    email: "danielly@infinda.com",
    password: "danielly123",
    role: "admin",
  },
  {
    name: "Valdinei",
    email: "valdinei@infinda.com",
    password: "valdinei123",
    role: "consultor",
  },
];

interface AuthCtx {
  user: MockUser | null;
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  loginAs: (user: MockUser) => void;
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

  const login: AuthCtx["login"] = (email, password) => {
    const e = email.trim().toLowerCase();
    const found = SEED_ACCOUNTS.find(
      (a) => a.email.toLowerCase() === e && a.password === password,
    );
    if (!found) return { ok: false, error: "Email ou senha inválidos." };
    const u: MockUser = { name: found.name, email: found.email, role: found.role };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return { ok: true };
  };

  const loginAs: AuthCtx["loginAs"] = (u) => {
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, login, loginAs, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Administrador",
  consultor: "Consultor Comercial",
};
