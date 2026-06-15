export type ProspectStatus =
  | "nao_contatado"
  | "primeiro_contato"
  | "em_negociacao"
  | "qualificado"
  | "agendado"
  | "perdido";

export type ProspectPotential = "alto" | "medio" | "baixo";

export interface Prospect {
  id: string;
  company: string;
  segment: string;
  owner: string;
  whatsapp: string;
  phone: string;
  email: string;
  instagram: string;
  city: string;
  state: string;
  source: string;
  potential: ProspectPotential;
  status: ProspectStatus;
  createdAt: string;
  interactions?: Interaction[];
}

export type InteractionKind =
  | "whatsapp"
  | "ligacao"
  | "email"
  | "reuniao"
  | "nota"
  | "status";

export interface Interaction {
  id: string;
  kind: InteractionKind;
  text: string;
  by: string;
  at: string;
}

export const STATUS_LABEL: Record<ProspectStatus, string> = {
  nao_contatado: "Não contatado",
  primeiro_contato: "Primeiro contato",
  em_negociacao: "Em negociação",
  qualificado: "Qualificado",
  agendado: "Agendado",
  perdido: "Perdido",
};

export const STATUS_TONE: Record<ProspectStatus, string> = {
  nao_contatado: "bg-muted text-muted-foreground border-border",
  primeiro_contato: "bg-sky-500/10 text-sky-300 border-sky-500/20",
  em_negociacao: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  qualificado: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  agendado: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  perdido: "bg-rose-500/10 text-rose-300 border-rose-500/20",
};

export const POTENTIAL_LABEL: Record<ProspectPotential, string> = {
  alto: "Alto",
  medio: "Médio",
  baixo: "Baixo",
};

export const POTENTIAL_TONE: Record<ProspectPotential, string> = {
  alto: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  medio: "bg-amber-500/10 text-amber-300 border-amber-500/20",
  baixo: "bg-muted text-muted-foreground border-border",
};

export const SEGMENTS = [
  "Alimentação",
  "Beleza",
  "Saúde",
  "Educação",
  "Varejo",
  "Automotivo",
  "Fitness",
  "Pet",
  "Imobiliária",
  "Serviços",
  "Tecnologia",
  "Outros",
];

export const SOURCES = [
  "Indicação",
  "Instagram",
  "Google",
  "Prospecção ativa",
  "Evento",
  "Site",
  "WhatsApp",
  "Importação",
];

export const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export const INITIAL_PROSPECTS: Prospect[] = [
  {
    id: "p1",
    company: "Padaria Pão Quente",
    segment: "Alimentação",
    owner: "Valdinei",
    whatsapp: "(11) 98765-4321",
    phone: "(11) 3456-7890",
    email: "contato@paoquente.com.br",
    instagram: "@paoquentesp",
    city: "São Paulo",
    state: "SP",
    source: "Prospecção ativa",
    potential: "alto",
    status: "nao_contatado",
    createdAt: "há 2h",
  },
  {
    id: "p2",
    company: "Studio Bella Hair",
    segment: "Beleza",
    owner: "Valdinei",
    whatsapp: "(19) 99988-7766",
    phone: "(19) 3322-1100",
    email: "agenda@bellahair.com.br",
    instagram: "@bellahairstudio",
    city: "Campinas",
    state: "SP",
    source: "Instagram",
    potential: "medio",
    status: "primeiro_contato",
    createdAt: "ontem",
  },
  {
    id: "p3",
    company: "Auto Center Turbo",
    segment: "Automotivo",
    owner: "Valdinei",
    whatsapp: "(41) 98123-4567",
    phone: "(41) 3088-9090",
    email: "comercial@autoturbo.com.br",
    instagram: "@autoturbocwb",
    city: "Curitiba",
    state: "PR",
    source: "Indicação",
    potential: "alto",
    status: "em_negociacao",
    createdAt: "há 3d",
  },
  {
    id: "p4",
    company: "Clínica Vitalis",
    segment: "Saúde",
    owner: "Valdinei",
    whatsapp: "(31) 99777-8899",
    phone: "(31) 3211-4455",
    email: "contato@clinicavitalis.com.br",
    instagram: "@clinicavitalis",
    city: "Belo Horizonte",
    state: "MG",
    source: "Google",
    potential: "alto",
    status: "qualificado",
    createdAt: "há 5d",
  },
  {
    id: "p5",
    company: "Pizzaria Forno & Cia",
    segment: "Alimentação",
    owner: "Valdinei",
    whatsapp: "(13) 99654-3210",
    phone: "(13) 3344-5566",
    email: "atendimento@fornoecia.com.br",
    instagram: "@fornoeciapizza",
    city: "Santos",
    state: "SP",
    source: "Prospecção ativa",
    potential: "medio",
    status: "agendado",
    createdAt: "hoje",
  },
  {
    id: "p6",
    company: "Pet Shop Amigo Fiel",
    segment: "Pet",
    owner: "Valdinei",
    whatsapp: "(11) 98123-7654",
    phone: "",
    email: "amigofiel@petshop.com.br",
    instagram: "@petshopamigofiel",
    city: "São Paulo",
    state: "SP",
    source: "Instagram",
    potential: "medio",
    status: "nao_contatado",
    createdAt: "há 1h",
  },
];
