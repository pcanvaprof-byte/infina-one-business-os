import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth, type Role, ROLE_LABEL } from "@/lib/auth-context";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Sparkles, ShieldCheck, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — INFINDA" },
      { name: "description", content: "Acesse a plataforma INFINDA — CRM + IA + Automação Comercial." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("consultor");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "demo@infinda.com", "Demo User", role);
    toast.success("Bem-vindo de volta!");
    navigate({ to: "/dashboard" });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "demo@infinda.com", name || "Demo User", role);
    toast.success("Conta criada com sucesso!");
    navigate({ to: "/dashboard" });
  };

  const handleDemo = () => {
    login("demo@infinda.com", "Demo User", role);
    toast.success("Entrando como demo…");
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden border-r border-border lg:flex lg:flex-col lg:justify-between lg:p-10"
        style={{ background: "var(--gradient-surface)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "var(--gradient-glow)" }}
        />
        <div className="relative">
          <Logo size={40} />
        </div>
        <div className="relative space-y-6">
          <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
            O sistema operacional <span className="text-gradient">comercial</span> da sua empresa.
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            CRM, prospecção, metas, propostas e IA em uma única plataforma. Construído para
            equipes que vendem todo dia.
          </p>
          <ul className="grid gap-3 text-sm">
            {[
              { icon: BarChart3, text: "Dashboard executivo em tempo real" },
              { icon: Sparkles, text: "IA que qualifica leads e cria tarefas" },
              { icon: ShieldCheck, text: "Multi-tenant seguro e escalável" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-accent">
                  <Icon className="h-4 w-4 text-primary-glow" />
                </span>
                <span className="text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-muted-foreground">
          © {new Date().getFullYear()} Infinda Mídias Digitais. Todos os direitos reservados.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Logo size={36} />
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar conta</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <h1 className="text-2xl font-bold">Acesse sua conta</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Entre para continuar gerenciando suas vendas.
              </p>
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="voce@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link to="/login" className="text-xs text-muted-foreground hover:text-foreground">
                      Esqueci minha senha
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Perfil de acesso</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                        <SelectItem key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="btn-gradient h-11 w-full text-sm font-semibold">
                  Entrar na plataforma
                </Button>
                <Button type="button" variant="outline" onClick={handleDemo} className="h-11 w-full text-sm font-semibold">
                  Entrar como demo (sem senha)
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Versão demo · email e senha são opcionais
                </p>

              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <h1 className="text-2xl font-bold">Crie sua conta</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Comece a usar o INFINDA em segundos.
              </p>
              <form onSubmit={handleSignup} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email-s">Email</Label>
                  <Input id="email-s" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@empresa.com" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password-s">Senha</Label>
                  <Input id="password-s" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <Label>Perfil de acesso</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
                        <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="btn-gradient h-11 w-full text-sm font-semibold">
                  Criar conta
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
