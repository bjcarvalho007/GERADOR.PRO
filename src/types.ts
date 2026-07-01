export interface QuoteItem {
  id: string;
  desc: string;
  model: string;
  power: string;
  price: number;
}

export interface Quote {
  id: number;
  cliente: string;
  telefone: string;
  contatoAlt?: string;
  clientDoc?: string;
  clientAddress?: string;
  data: string;
  items: QuoteItem[];
  total: string;
  category?: string;
  status?: "aprovado" | "pendente" | "cancelado";
  warranty?: string;
}

export interface ProfessionalInfo {
  name: string;
  phone: string;
  cnpj: string;
}

export const AC_MODELS = [
  "Split Hi-Wall",
  "Split Inverter",
  "Multi Split",
  "Piso Teto",
  "Cassete",
  "ACJ",
  "Duto",
  "Portátil"
];

export const AC_POWERS = [
  "9.000 MBTU",
  "12.000 MBTU",
  "18.000 MBTU",
  "22.000 MBTU",
  "24.000 MBTU",
  "30.000 MBTU",
  "36.000 MBTU",
  "60.000 MBTU"
];

export const QUICK_SERVICES = [
  { label: "LIMPEZA", name: "Limpeza e Higienização", price: 180 },
  { label: "INSTALAÇÃO", name: "Instalação Completa", price: 450 },
  { label: "CARGA DE GÁS", name: "Carga de Gás (R410/R22)", price: 250 },
  { label: "CAPACITOR", name: "Troca de Capacitor", price: 150 },
  { label: "PLACA", name: "Conserto de Placa Eletrônica", price: 350 },
  { label: "REMOÇÃO", name: "Remoção de Aparelho", price: 120 },
  { label: "COMPRESSOR", name: "Troca de Compressor", price: 850 },
  { label: "VISITA", name: "Visita Técnica / Avaliação", price: 50 }
];
