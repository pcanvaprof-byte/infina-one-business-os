import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  CalendarPlus,
  CheckCircle2,
  Download,
  Filter,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Sparkles,
  Target,
  Upload,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  INITIAL_PROSPECTS,
  POTENTIAL_LABEL,
  POTENTIAL_TONE,
  SEGMENTS,
  SOURCES,
  STATUS_LABEL,
  STATUS_TONE,
  UFS,
  type Prospect,
  type ProspectPotential,
  type ProspectStatus,
} from "@/lib/mock-prospects";

export const Route = createFileRoute("/prospeccao")({
  head: () => ({
    meta: [{ title: "Prospecção — INFINDA" }],
  }),
  component: ProspeccaoPage,
});

const STATUSES: ProspectStatus[] = [
  "nao_contatado",
  "primeiro_contato",
  "em_negociacao",
  "qualificado",
  "agendado",
  "perdido",
];
const POTENTIALS: ProspectPotential[] = ["alto", "medio", "baixo"];

const onlyDigits = (s: string) => s.replace(/\D/g, "");

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent">
          <Icon className="h-4 w-4 text-primary-glow" />
        </span>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">
        {value.toLocaleString("pt-BR")}
      </p>
      <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: ProspectStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${STATUS_TONE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function PotentialBadge({ p }: { p: ProspectPotential }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium ${POTENTIAL_TONE[p]}`}
    >
      {POTENTIAL_LABEL[p]}
    </span>
  );
}

const EMPTY_FORM: Omit<Prospect, "id" | "createdAt"> = {
  company: "",
  segment: SEGMENTS[0],
  owner: "",
  whatsapp: "",
  phone: "",
  email: "",
  instagram: "",
  city: "",
  state: "SP",
  source: SOURCES[0],
  potential: "medio",
  status: "nao_contatado",
};

function ProspeccaoPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [prospects, setProspects] = useState<Prospect[]>(INITIAL_PROSPECTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProspectStatus | "all">("all");
  const [segmentFilter, setSegmentFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [potentialFilter, setPotentialFilter] = useState<ProspectPotential | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM, owner: user?.name ?? "" });

  if (!user) return <Navigate to="/login" replace />;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return prospects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (segmentFilter !== "all" && p.segment !== segmentFilter) return false;
      if (stateFilter !== "all" && p.state !== stateFilter) return false;
      if (potentialFilter !== "all" && p.potential !== potentialFilter) return false;
      if (!q) return true;
      return [
        p.company,
        p.segment,
        p.owner,
        p.email,
        p.whatsapp,
        p.phone,
        p.instagram,
        p.city,
        p.state,
        p.source,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [prospects, search, statusFilter, segmentFilter, stateFilter, potentialFilter]);

  const stats = useMemo(() => {
    const t = prospects.length;
    const contatadas = prospects.filter((p) => p.status !== "nao_contatado").length;
    const qualificadas = prospects.filter((p) => p.status === "qualificado").length;
    const agendadas = prospects.filter((p) => p.status === "agendado").length;
    return { t, contatadas, qualificadas, agendadas };
  }, [prospects]);

  const updateStatus = (id: string, status: ProspectStatus) => {
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    toast.success(`Status atualizado: ${STATUS_LABEL[status]}`);
  };

  const removeProspect = (id: string) => {
    setProspects((prev) => prev.filter((p) => p.id !== id));
    toast.success("Empresa removida da prospecção");
  };

  const openWhats = (n: string) => {
    const d = onlyDigits(n);
    if (!d) return toast.error("WhatsApp não cadastrado");
    window.open(`https://wa.me/55${d}`, "_blank");
  };
  const callPhone = (n: string) => {
    const d = onlyDigits(n);
    if (!d) return toast.error("Telefone não cadastrado");
    window.open(`tel:+55${d}`);
  };

  const convertToLead = (p: Prospect) => {
    toast.success(`${p.company} convertida em lead no CRM`);
    setProspects((prev) =>
      prev.map((x) => (x.id === p.id ? { ...x, status: "qualificado" } : x)),
    );
    setTimeout(() => navigate({ to: "/crm" }), 600);
  };

  const handleCreate = () => {
    if (!form.company.trim()) return toast.error("Informe o nome da empresa");
    const novo: Prospect = {
      ...form,
      id: `p_${Date.now()}`,
      owner: form.owner || user.name,
      createdAt: "agora",
    };
    setProspects((prev) => [novo, ...prev]);
    toast.success("Empresa cadastrada com sucesso");
    setForm({ ...EMPTY_FORM, owner: user.name });
    setDialogOpen(false);
  };

  const exportCsv = () => {
    const headers = [
      "Empresa","Segmento","Responsavel","WhatsApp","Telefone","Email",
      "Instagram","Cidade","Estado","Origem","Potencial","Status",
    ];
    const rows = prospects.map((p) => [
      p.company, p.segment, p.owner, p.whatsapp, p.phone, p.email,
      p.instagram, p.city, p.state, p.source, p.potential, STATUS_LABEL[p.status],
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prospeccao-infinda-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado");
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) return toast.error("CSV vazio");
    const parseLine = (l: string): string[] => {
      const out: string[] = [];
      let cur = "", inQ = false;
      for (let i = 0; i < l.length; i++) {
        const c = l[i];
        if (c === '"') {
          if (inQ && l[i + 1] === '"') { cur += '"'; i++; }
          else inQ = !inQ;
        } else if (c === "," && !inQ) { out.push(cur); cur = ""; }
        else cur += c;
      }
      out.push(cur);
      return out.map((s) => s.trim());
    };
    const headers = parseLine(lines[0]).map((h) => h.toLowerCase());
    const idx = (n: string) => headers.findIndex((h) => h.includes(n));
    const iEmpresa = idx("empresa");
    if (iEmpresa < 0) return toast.error("Cabeçalho 'Empresa' não encontrado");
    const fields = {
      segmento: idx("segmento"),
      responsavel: idx("respons"),
      whatsapp: idx("whats"),
      telefone: idx("telefone"),
      email: idx("email"),
      instagram: idx("instagram"),
      cidade: idx("cidade"),
      estado: idx("estado"),
      origem: idx("origem"),
      potencial: idx("potencial"),
    };
    const novos: Prospect[] = [];
    for (let i = 1; i < lines.length; i++) {
      const c = parseLine(lines[i]);
      const company = c[iEmpresa];
      if (!company) continue;
      const pot = (c[fields.potencial] || "medio").toLowerCase() as ProspectPotential;
      novos.push({
        id: `p_${Date.now()}_${i}`,
        company,
        segment: c[fields.segmento] || "Outros",
        owner: c[fields.responsavel] || user.name,
        whatsapp: c[fields.whatsapp] || "",
        phone: c[fields.telefone] || "",
        email: c[fields.email] || "",
        instagram: c[fields.instagram] || "",
        city: c[fields.cidade] || "",
        state: (c[fields.estado] || "SP").toUpperCase().slice(0, 2),
        source: c[fields.origem] || "Importação",
        potential: POTENTIALS.includes(pot) ? pot : "medio",
        status: "nao_contatado",
        createdAt: "importado",
      });
    }
    if (!novos.length) return toast.error("Nenhuma linha válida no CSV");
    setProspects((prev) => [...novos, ...prev]);
    toast.success(`${novos.length} empresa(s) importada(s)`);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setSegmentFilter("all");
    setStateFilter("all");
    setPotentialFilter("all");
    setSearch("");
  };

  return (
    <AppShell
      title="Prospecção"
      subtitle="Sua máquina de geração de oportunidades comerciais"
      actions={
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="outline" className="h-9 text-xs" onClick={exportCsv}>
            <Download className="mr-1.5 h-4 w-4" /> Exportar
          </Button>
          <Button
            variant="outline"
            className="h-9 text-xs"
            onClick={() => fileRef.current?.click()}
          >
            <Upload className="mr-1.5 h-4 w-4" /> Importar CSV
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = "";
            }}
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="btn-gradient h-9 text-xs font-semibold">
                <Plus className="mr-1.5 h-4 w-4" /> Nova empresa
              </Button>
            </DialogTrigger>
            <NewProspectDialog form={form} setForm={setForm} onCreate={handleCreate} />
          </Dialog>
        </div>
      }
    >
      {/* Stats */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Building2} label="Empresas cadastradas" value={stats.t} hint="Base total" />
        <StatCard icon={MessageSquare} label="Contatadas" value={stats.contatadas} hint="Pelo menos 1 contato" />
        <StatCard icon={Target} label="Qualificadas" value={stats.qualificadas} hint="Prontas para proposta" />
        <StatCard icon={CalendarPlus} label="Agendadas" value={stats.agendadas} hint="Com reunião marcada" />
      </section>

      {/* Toolbar */}
      <section className="mt-6 surface-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Busca inteligente: empresa, contato, cidade, segmento…"
              className="h-10 pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-10 text-xs"
              onClick={() => setShowFilters((s) => !s)}
            >
              <Filter className="mr-1.5 h-4 w-4" />
              Filtros
              {(statusFilter !== "all" ||
                segmentFilter !== "all" ||
                stateFilter !== "all" ||
                potentialFilter !== "all") && (
                <span className="ml-2 rounded-full bg-primary/20 px-1.5 text-[10px] text-primary-glow">
                  ativos
                </span>
              )}
            </Button>
            <Button variant="ghost" className="h-10 text-xs sm:hidden" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" /> Nova
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-5">
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ProspectStatus | "all")}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_LABEL[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={segmentFilter} onValueChange={setSegmentFilter}>
              <SelectTrigger><SelectValue placeholder="Segmento" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos segmentos</SelectItem>
                {SEGMENTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos estados</SelectItem>
                {UFS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select
              value={potentialFilter}
              onValueChange={(v) => setPotentialFilter(v as ProspectPotential | "all")}
            >
              <SelectTrigger><SelectValue placeholder="Potencial" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos potenciais</SelectItem>
                {POTENTIALS.map((p) => (
                  <SelectItem key={p} value={p}>{POTENTIAL_LABEL[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={clearFilters} className="h-10 text-xs">
              <X className="mr-1.5 h-4 w-4" /> Limpar filtros
            </Button>
          </div>
        )}
      </section>

      {/* Tabela */}
      <section className="mt-4 surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-accent/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Contato</th>
                <th className="px-4 py-3">Localização</th>
                <th className="px-4 py-3">Origem</th>
                <th className="px-4 py-3">Potencial</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-sm text-muted-foreground">
                    Nenhuma empresa encontrada. Ajuste os filtros ou cadastre uma nova.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-border/60 hover:bg-accent/30">
                  <td className="px-4 py-3 align-top">
                    <div className="font-semibold">{p.company}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {p.segment} · resp. {p.owner}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-xs">{p.whatsapp || p.phone || "—"}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {p.email || p.instagram || "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-xs">
                    {p.city ? `${p.city} - ${p.state}` : p.state || "—"}
                  </td>
                  <td className="px-4 py-3 align-top text-xs">{p.source}</td>
                  <td className="px-4 py-3 align-top"><PotentialBadge p={p.potential} /></td>
                  <td className="px-4 py-3 align-top"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-emerald-400 hover:text-emerald-300"
                        title="WhatsApp"
                        onClick={() => openWhats(p.whatsapp)}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title="Ligar"
                        onClick={() => callPhone(p.phone || p.whatsapp)}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        title="Agendar"
                        onClick={() => updateStatus(p.id, "agendado")}
                      >
                        <CalendarPlus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-primary-glow"
                        title="Converter para Lead"
                        onClick={() => convertToLead(p)}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel className="text-[11px]">Alterar status</DropdownMenuLabel>
                          {STATUSES.map((s) => (
                            <DropdownMenuItem
                              key={s}
                              onClick={() => updateStatus(p.id, s)}
                              className="text-xs"
                            >
                              <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                              {STATUS_LABEL[s]}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-xs text-destructive"
                            onClick={() => removeProspect(p.id)}
                          >
                            <X className="mr-2 h-3.5 w-3.5" /> Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-[11px] text-muted-foreground">
          <span>Mostrando {filtered.length} de {prospects.length} empresas</span>
          <span className="hidden sm:inline">INFINDA digital — Prospecção</span>
        </div>
      </section>
    </AppShell>
  );
}

function NewProspectDialog({
  form,
  setForm,
  onCreate,
}: {
  form: Omit<Prospect, "id" | "createdAt">;
  setForm: (f: Omit<Prospect, "id" | "createdAt">) => void;
  onCreate: () => void;
}) {
  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm({ ...form, [k]: v });

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Nova empresa na prospecção</DialogTitle>
        <DialogDescription>
          Cadastre uma oportunidade. Você pode evoluir o status conforme a abordagem.
        </DialogDescription>
      </DialogHeader>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Nome da empresa *</Label>
          <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Ex: Padaria Pão Quente" />
        </div>
        <div className="space-y-1.5">
          <Label>Segmento</Label>
          <Select value={form.segment} onValueChange={(v) => set("segment", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SEGMENTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Responsável</Label>
          <Input value={form.owner} onChange={(e) => set("owner", e.target.value)} placeholder="Nome do consultor" />
        </div>
        <div className="space-y-1.5">
          <Label>WhatsApp</Label>
          <Input value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="(11) 99999-0000" />
        </div>
        <div className="space-y-1.5">
          <Label>Telefone</Label>
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(11) 3333-0000" />
        </div>
        <div className="space-y-1.5">
          <Label>Email</Label>
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="contato@empresa.com" />
        </div>
        <div className="space-y-1.5">
          <Label>Instagram</Label>
          <Input value={form.instagram} onChange={(e) => set("instagram", e.target.value)} placeholder="@empresa" />
        </div>
        <div className="space-y-1.5">
          <Label>Cidade</Label>
          <Input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="São Paulo" />
        </div>
        <div className="space-y-1.5">
          <Label>Estado</Label>
          <Select value={form.state} onValueChange={(v) => set("state", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {UFS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Origem</Label>
          <Select value={form.source} onValueChange={(v) => set("source", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Potencial</Label>
          <Select value={form.potential} onValueChange={(v) => set("potential", v as ProspectPotential)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {POTENTIALS.map((p) => (
                <SelectItem key={p} value={p}>{POTENTIAL_LABEL[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onCreate} className="btn-gradient">
          <Plus className="mr-1.5 h-4 w-4" /> Cadastrar empresa
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
