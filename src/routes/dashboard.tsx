import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  DollarSign,
  FileText,
  MessageSquare,
  Phone,
  Plus,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — INFINDA" }],
  }),
  component: DashboardPage,
});

const KPIS = [
  { label: "Empresas Visitadas", value: 150, target: 150, delta: 12, icon: Building2 },
  { label: "Conversas Qualificadas", value: 60, target: 60, delta: 8, icon: MessageSquare },
  { label: "Apresentações", value: 30, target: 30, delta: 4, icon: Phone },
  { label: "Reuniões", value: 12, target: 12, delta: -2, icon: CalendarClock },
  { label: "Propostas", value: 6, target: 6, delta: 1, icon: FileText },
  { label: "Contratos Fechados", value: 5, target: 6, delta: 1, icon: CheckCircle2 },
  { label: "Receita Gerada", value: 84500, target: 100000, delta: 22, icon: DollarSign, money: true },
  { label: "Ticket Médio", value: 16900, target: 15000, delta: 5, icon: TrendingUp, money: true },
];

const FUNNEL = [
  { label: "Empresas", value: 150 },
  { label: "Conversas", value: 60 },
  { label: "Apresentações", value: 30 },
  { label: "Reuniões", value: 12 },
  { label: "Propostas", value: 6 },
  { label: "Contratos", value: 5 },
];

const REVENUE = [
  { m: "Jan", r: 32 }, { m: "Fev", r: 41 }, { m: "Mar", r: 38 }, { m: "Abr", r: 52 },
  { m: "Mai", r: 60 }, { m: "Jun", r: 68 }, { m: "Jul", r: 72 }, { m: "Ago", r: 84 },
];

const BY_SELLER = [
  { name: "Ana", contratos: 4, propostas: 7 },
  { name: "Lucas", contratos: 3, propostas: 6 },
  { name: "Pedro", contratos: 5, propostas: 8 },
  { name: "Carla", contratos: 2, propostas: 4 },
];

const SEGMENTS = [
  { name: "Alimentação", value: 32 },
  { name: "Saúde", value: 24 },
  { name: "Beleza", value: 18 },
  { name: "Varejo", value: 14 },
  { name: "Outros", value: 12 },
];

const SEG_COLORS = [
  "oklch(0.7 0.22 264)",
  "oklch(0.72 0.18 200)",
  "oklch(0.72 0.18 290)",
  "oklch(0.78 0.16 75)",
  "oklch(0.7 0.04 250)",
];

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

function KpiCard({ k }: { k: (typeof KPIS)[number] }) {
  const Icon = k.icon;
  const pct = Math.min(100, Math.round((k.value / k.target) * 100));
  const positive = k.delta >= 0;
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent">
          <Icon className="h-4 w-4 text-primary-glow" />
        </span>
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            positive ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
          }`}
        >
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(k.delta)}%
        </span>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{k.label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">
        {k.money ? brl(k.value) : k.value.toLocaleString("pt-BR")}
      </p>
      <div className="mt-3">
        <Progress value={pct} className="h-1.5" />
        <p className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
          {pct}% da meta
        </p>
      </div>
    </div>
  );
}

function FunnelChart() {
  const max = FUNNEL[0].value;
  return (
    <div className="space-y-2">
      {FUNNEL.map((s, i) => {
        const widthPct = (s.value / max) * 100;
        const conv = i === 0 ? 100 : Math.round((s.value / FUNNEL[i - 1].value) * 100);
        return (
          <div key={s.label} className="flex items-center gap-3">
            <div className="w-32 shrink-0 text-xs text-muted-foreground">{s.label}</div>
            <div className="relative h-9 flex-1 overflow-hidden rounded-md bg-accent/50">
              <div
                className="h-full rounded-md transition-all"
                style={{ width: `${widthPct}%`, background: "var(--gradient-primary)" }}
              />
              <span className="absolute inset-0 flex items-center px-3 text-xs font-semibold">
                {s.value}
              </span>
            </div>
            <div className="w-16 shrink-0 text-right text-xs text-muted-foreground">
              {conv}%
            </div>
          </div>
        );
      })}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs">
        <span className="text-muted-foreground">Conversão total</span>
        <span className="font-semibold text-success">
          {((FUNNEL[FUNNEL.length - 1].value / FUNNEL[0].value) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

const tooltipStyle = {
  background: "oklch(0.2 0.014 250)",
  border: "1px solid oklch(1 0 0 / 8%)",
  borderRadius: 8,
  fontSize: 12,
};

function DashboardPage() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  return (
    <AppShell
      title={`Olá, ${user.name.split(" ")[0]} 👋`}
      subtitle="Visão geral da sua operação comercial"
      actions={
        <Button className="btn-gradient hidden h-9 px-3 text-xs font-semibold sm:inline-flex">
          <Plus className="mr-1.5 h-4 w-4" /> Nova oportunidade
        </Button>
      }
    >
      {/* KPIs */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <KpiCard key={k.label} k={k} />
        ))}
      </section>

      {/* Goals row */}
      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {[
          { label: "Meta Diária", pct: 72, hint: "18 / 25 empresas visitadas" },
          { label: "Meta Semanal", pct: 84, hint: "126 / 150 empresas" },
          { label: "Meta Mensal", pct: 61, hint: "R$ 84,5K / R$ 138K" },
        ].map((g) => (
          <div key={g.label} className="surface-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-primary-glow" />
                <span className="text-sm font-medium">{g.label}</span>
              </div>
              <span className="text-sm font-bold">{g.pct}%</span>
            </div>
            <Progress value={g.pct} className="mt-3 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">{g.hint}</p>
          </div>
        ))}
      </section>

      {/* Funnel + Revenue */}
      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Funil Comercial</h3>
              <p className="text-xs text-muted-foreground">Da prospecção ao fechamento</p>
            </div>
            <span className="rounded-md border border-border px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              Últimos 30 dias
            </span>
          </div>
          <div className="mt-5">
            <FunnelChart />
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Receita Mensal</h3>
              <p className="text-xs text-muted-foreground">em milhares de R$</p>
            </div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.7 0.22 264)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.7 0.22 264)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="m" stroke="oklch(0.68 0.012 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.012 250)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="r" stroke="oklch(0.7 0.22 264)" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Bottom row */}
      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Performance por Vendedor</h3>
          <p className="text-xs text-muted-foreground">Contratos vs propostas no mês</p>
          <div className="mt-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BY_SELLER}>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis dataKey="name" stroke="oklch(0.68 0.012 250)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.68 0.012 250)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "oklch(1 0 0 / 4%)" }} />
                <Bar dataKey="propostas" fill="oklch(0.4 0.06 264)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="contratos" fill="oklch(0.7 0.22 264)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface-card p-5">
          <h3 className="text-sm font-semibold">Clientes por Segmento</h3>
          <p className="text-xs text-muted-foreground">Distribuição atual</p>
          <div className="mt-4 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={SEGMENTS} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {SEGMENTS.map((_, i) => (
                    <Cell key={i} fill={SEG_COLORS[i]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {SEGMENTS.map((s, i) => (
              <li key={s.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: SEG_COLORS[i] }} />
                  {s.name}
                </span>
                <span className="text-muted-foreground">{s.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </AppShell>
  );
}
