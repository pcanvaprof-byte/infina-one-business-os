export type PipelineStage =
  | "lead"
  | "contato"
  | "qualificado"
  | "apresentacao"
  | "reuniao"
  | "proposta"
  | "negociacao"
  | "fechado"
  | "perdido";

export interface Deal {
  id: string;
  company: string;
  segment: string;
  contact: string;
  city: string;
  value: number;
  stage: PipelineStage;
  owner: string;
  whatsapp?: string;
  updatedAt: string;
}

export const STAGES: { id: PipelineStage; label: string; tone: string }[] = [
  { id: "lead", label: "Lead", tone: "oklch(0.7 0.04 250)" },
  { id: "contato", label: "Contato Feito", tone: "oklch(0.72 0.12 220)" },
  { id: "qualificado", label: "Qualificado", tone: "oklch(0.72 0.14 200)" },
  { id: "apresentacao", label: "Apresentação", tone: "oklch(0.7 0.18 264)" },
  { id: "reuniao", label: "Reunião", tone: "oklch(0.72 0.18 290)" },
  { id: "proposta", label: "Proposta", tone: "oklch(0.78 0.16 75)" },
  { id: "negociacao", label: "Negociação", tone: "oklch(0.72 0.18 35)" },
  { id: "fechado", label: "Fechado", tone: "oklch(0.7 0.17 158)" },
  { id: "perdido", label: "Perdido", tone: "oklch(0.62 0.15 25)" },
];

export const INITIAL_DEALS: Deal[] = [
  { id: "d1", company: "Padaria Pão Quente", segment: "Alimentação", contact: "Marcos Silva", city: "São Paulo - SP", value: 4500, stage: "lead", owner: "Ana", updatedAt: "há 2h" },
  { id: "d2", company: "Studio Bella Hair", segment: "Beleza", contact: "Júlia Mendes", city: "Campinas - SP", value: 2800, stage: "lead", owner: "Lucas", updatedAt: "há 4h" },
  { id: "d3", company: "Auto Center Turbo", segment: "Automotivo", contact: "Rafael Costa", city: "Curitiba - PR", value: 7200, stage: "contato", owner: "Ana", updatedAt: "hoje" },
  { id: "d4", company: "Clínica Vitalis", segment: "Saúde", contact: "Dra. Carla", city: "BH - MG", value: 12500, stage: "qualificado", owner: "Pedro", updatedAt: "ontem" },
  { id: "d5", company: "Pizzaria Forno&Cia", segment: "Alimentação", contact: "Bruno Alves", city: "Santos - SP", value: 3900, stage: "qualificado", owner: "Lucas", updatedAt: "ontem" },
  { id: "d6", company: "Escola Aprender+", segment: "Educação", contact: "Renata Lima", city: "Rio - RJ", value: 9800, stage: "apresentacao", owner: "Ana", updatedAt: "há 3d" },
  { id: "d7", company: "Imobiliária Prime", segment: "Imobiliária", contact: "Eduardo Reis", city: "Brasília - DF", value: 15400, stage: "reuniao", owner: "Pedro", updatedAt: "hoje" },
  { id: "d8", company: "Fitness Pro Academia", segment: "Fitness", contact: "Tiago Souza", city: "Porto Alegre - RS", value: 6600, stage: "proposta", owner: "Lucas", updatedAt: "há 1d" },
  { id: "d9", company: "Pet Shop Amigo Fiel", segment: "Pet", contact: "Camila Rocha", city: "São Paulo - SP", value: 5200, stage: "negociacao", owner: "Ana", updatedAt: "hoje" },
  { id: "d10", company: "Ótica Visão Clara", segment: "Saúde", contact: "Fernando Dias", city: "Recife - PE", value: 8100, stage: "fechado", owner: "Pedro", updatedAt: "há 2d" },
  { id: "d11", company: "Restaurante Sabor Caseiro", segment: "Alimentação", contact: "Patrícia Nunes", city: "Salvador - BA", value: 4700, stage: "fechado", owner: "Lucas", updatedAt: "semana passada" },
  { id: "d12", company: "Moda & Estilo Boutique", segment: "Varejo", contact: "Mariana Pires", city: "Goiânia - GO", value: 3300, stage: "perdido", owner: "Ana", updatedAt: "há 1 sem" },
];
