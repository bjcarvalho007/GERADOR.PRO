export interface Category {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  gradient: string;
  bgLight: string;
  borderClass: string;
  modelLabel: string;
  powerLabel: string;
  models: string[];
  powers: string[];
  quickServices: { label: string; name: string; price: number }[];
}

export const CATEGORIES: Category[] = [
  {
    id: "climatizacao",
    title: "Climatização",
    subtitle: "Ar-condicionado & Refrigeração",
    iconName: "Snowflake",
    gradient: "from-sky-500 to-blue-600",
    bgLight: "bg-sky-50",
    borderClass: "border-sky-100",
    modelLabel: "Aparelho / Modelo",
    powerLabel: "Capacidade / BTUs",
    models: [
      "Split Hi-Wall",
      "Split Inverter",
      "Multi Split",
      "Piso Teto",
      "Cassete",
      "ACJ (Janela)",
      "Duto",
      "Portátil"
    ],
    powers: [
      "9.000 BTU",
      "12.000 BTU",
      "18.000 BTU",
      "22.000 BTU",
      "24.000 BTU",
      "30.000 BTU",
      "36.000 BTU",
      "60.000 BTU"
    ],
    quickServices: [
      { label: "LIMPEZA", name: "Limpeza e Higienização", price: 180 },
      { label: "INSTALAÇÃO", name: "Instalação Completa", price: 450 },
      { label: "CARGA DE GÁS", name: "Carga de Gás (R410/R22)", price: 250 },
      { label: "CAPACITOR", name: "Troca de Capacitor", price: 150 },
      { label: "PLACA", name: "Conserto de Placa Eletrônica", price: 350 },
      { label: "REMOÇÃO", name: "Remoção de Aparelho", price: 120 },
      { label: "COMPRESSOR", name: "Troca de Compressor", price: 850 },
      { label: "VISITA", name: "Visita Técnica / Avaliação", price: 50 }
    ]
  },
  {
    id: "eletrica",
    title: "Elétrica",
    subtitle: "Instalações & Manutenção Elétrica",
    iconName: "Zap",
    gradient: "from-amber-500 to-yellow-600",
    bgLight: "bg-amber-50",
    borderClass: "border-amber-100",
    modelLabel: "Tipo de Instalação / Item",
    powerLabel: "Especificação / Tensão",
    models: [
      "Fiação / Circuito",
      "Quadro de Distribuição",
      "Tomada / Interruptor",
      "Chuveiro Elétrico",
      "Luminária / Refletor",
      "Disjuntor / DR",
      "Ventilador de Teto",
      "Sistema de Automação"
    ],
    powers: [
      "110V (Monofásico)",
      "220V (Bifásico)",
      "380V (Trifásico)",
      "Padrão de Entrada",
      "Sob Medida",
      "Geral / Preventiva"
    ],
    quickServices: [
      { label: "INSTALAÇÃO", name: "Instalação Elétrica Geral", price: 300 },
      { label: "FIAÇÃO", name: "Troca de Fiação por Circuito", price: 600 },
      { label: "QUADRO", name: "Montagem de Quadro Elétrico", price: 450 },
      { label: "ILUMINAÇÃO", name: "Instalação de Pontos de Luz", price: 150 },
      { label: "DISJUNTOR", name: "Troca de Disjuntor / DR", price: 120 },
      { label: "TOMADAS", name: "Troca de Tomadas ou Interruptores", price: 80 },
      { label: "VENTILADOR", name: "Instalação de Ventilador de Teto", price: 150 },
      { label: "CHUVEIRO", name: "Troca / Instalação de Chuveiro", price: 100 }
    ]
  },
  {
    id: "hidraulica",
    title: "Hidráulica",
    subtitle: "Encanamento, Vazamentos & Bombas",
    iconName: "Droplet",
    gradient: "from-blue-500 to-indigo-600",
    bgLight: "bg-blue-50",
    borderClass: "border-blue-100",
    modelLabel: "Tipo de Serviço / Reparo",
    powerLabel: "Medida / Material",
    models: [
      "Tubulação de Água Fria",
      "Tubulação de Água Quente",
      "Esgoto / Caixa de Gordura",
      "Bomba d'Água / Pressurizador",
      "Torneira / Registro / Válvula",
      "Vaso Sanitário / Caixa Acoplada",
      "Caixa d'Água",
      "Detecção de Vazamento"
    ],
    powers: [
      "1/2\" (Meia polegada)",
      "3/4\" (Três quartos)",
      "1\" (Uma polegada)",
      "40mm / 50mm",
      "100mm (Esgoto)",
      "PVC / Cobre / PPR"
    ],
    quickServices: [
      { label: "VAZAMENTO", name: "Localização e Conserto de Vazamento", price: 200 },
      { label: "CAIXA D'ÁGUA", name: "Limpeza / Instalação de Caixa d'Água", price: 350 },
      { label: "TORNEIRA", name: "Troca de Torneira ou Reparo", price: 80 },
      { label: "CHUVEIRO", name: "Troca de Chuveiro / Encanamento", price: 120 },
      { label: "ESGOTO", name: "Desentupimento de Tubulação de Esgoto", price: 400 },
      { label: "BOMBA", name: "Manutenção de Bomba d'Água", price: 300 },
      { label: "REGISTRO", name: "Substituição de Registro Geral", price: 150 },
      { label: "TUBULAÇÃO", name: "Nova Tubulação por Metro", price: 500 }
    ]
  },
  {
    id: "jardinagem",
    title: "Jardinagem",
    subtitle: "Manutenção de Jardins & Paisagismo",
    iconName: "Sprout",
    gradient: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50",
    borderClass: "border-emerald-100",
    modelLabel: "Tipo de Manutenção / Espécie",
    powerLabel: "Área / Especificação",
    models: [
      "Corte / Aparo de Grama",
      "Poda de Árvores / Arbustos",
      "Plantio de Grama / Mudas",
      "Adubação / Tratamento de Solo",
      "Sistema de Irrigação",
      "Paisagismo Residencial",
      "Limpeza de Terreno",
      "Controle de Pragas de Jardim"
    ],
    powers: [
      "Área Pequena (até 50m²)",
      "Área Média (50 a 200m²)",
      "Área Grande (acima de 200m²)",
      "Por Unidade",
      "Por Metro Linear",
      "Adubo Orgânico / Químico"
    ],
    quickServices: [
      { label: "CORTE GRAMA", name: "Corte e Aparo de Gramado", price: 150 },
      { label: "PAISAGISMO", name: "Projeto e Execução de Paisagismo", price: 1000 },
      { label: "PLANTIO", name: "Plantio de Novas Mudas/Grama", price: 250 },
      { label: "ADUBAÇÃO", name: "Adubação e Preparo de Solo", price: 120 },
      { label: "PODA", name: "Poda de Árvores ou Cerca Viva", price: 180 },
      { label: "IRRIGAÇÃO", name: "Instalação de Sistema de Irrigação", price: 600 },
      { label: "LIMPEZA", name: "Limpeza Completa de Terreno", price: 450 }
    ]
  },
  {
    id: "pintura",
    title: "Pintura",
    subtitle: "Pintura Residencial & Comercial",
    iconName: "Paintbrush",
    gradient: "from-violet-500 to-fuchsia-600",
    bgLight: "bg-violet-50",
    borderClass: "border-violet-100",
    modelLabel: "Área de Pintura",
    powerLabel: "Acabamento / Tinta",
    models: [
      "Paredes Internas",
      "Paredes Externas / Fachada",
      "Teto / Forro",
      "Portas / Janelas (Madeira/Metal)",
      "Portão de Ferro / Grade",
      "Aplicação de Textura / Grafiato",
      "Aplicação de Massa Corrida"
    ],
    powers: [
      "Tinta Látex / Acrílica Fosca",
      "Tinta Acrílica Semibrilho/Acetinada",
      "Massa Corrida / Lixamento",
      "Textura / Grafiato Rústico",
      "Verniz / Seladora",
      "Esmalte Sintético"
    ],
    quickServices: [
      { label: "PINTURA INT", name: "Pintura de Paredes Internas", price: 800 },
      { label: "PINTURA EXT", name: "Pintura Externa / Fachada", price: 1500 },
      { label: "TEXTURA", name: "Aplicação de Textura ou Grafiato", price: 450 },
      { label: "MASSA CORRIDA", name: "Aplicação de Massa Corrida", price: 400 },
      { label: "LIXAMENTO", name: "Lixamento e Preparação de Paredes", price: 250 },
      { label: "VERNIZ", name: "Aplicação de Verniz em Madeiras", price: 300 }
    ]
  },
  {
    id: "construcao",
    title: "Construção",
    subtitle: "Reformas, Alvenaria & Acabamento",
    iconName: "Hammer",
    gradient: "from-orange-500 to-amber-700",
    bgLight: "bg-orange-50",
    borderClass: "border-orange-100",
    modelLabel: "Etapa / Estrutura",
    powerLabel: "Material / Dimensões",
    models: [
      "Alvenaria / Paredes",
      "Reboco / Emboço",
      "Piso / Contra-piso",
      "Porcelanato / Cerâmica",
      "Fundação / Sapata / Viga",
      "Muros / Cercados",
      "Demolição / Remoção",
      "Reforma Geral"
    ],
    powers: [
      "Por Metro Quadrado (m²)",
      "Por Metro Linear",
      "Diária de Pedreiro",
      "Estrutura Armada",
      "Argamassa AC-I / AC-III",
      "Alvenaria de Bloco / Tijolo"
    ],
    quickServices: [
      { label: "PEDREIRO", name: "Serviço de Pedreiro por Diária", price: 250 },
      { label: "REFORMAS", name: "Pequenas Reformas Gerais", price: 1500 },
      { label: "PISOS", name: "Instalação de Piso Cerâmico", price: 800 },
      { label: "PORCELANATO", name: "Colocação de Porcelanato Nobre", price: 1200 },
      { label: "MUROS", name: "Construção de Muro de Divisa", price: 2000 },
      { label: "REBOCO", name: "Aplicação de Reboco de Parede", price: 500 },
      { label: "FUNDAÇÃO", name: "Execução de Sapata e Fundação", price: 3000 }
    ]
  },
  {
    id: "limpeza",
    title: "Limpeza",
    subtitle: "Pós-obra, Residencial & Estofados",
    iconName: "Sparkles",
    gradient: "from-teal-500 to-cyan-600",
    bgLight: "bg-teal-50",
    borderClass: "border-teal-100",
    modelLabel: "Tipo de Limpeza",
    powerLabel: "Tamanho / Categoria",
    models: [
      "Limpeza Residencial Diária",
      "Limpeza Comercial / Escritório",
      "Limpeza Pós-Obra Fina",
      "Higienização de Sofá / Poltrona",
      "Higienização de Colchão",
      "Lavagem de Tapetes / Carpetes",
      "Limpeza de Vidros / Fachadas"
    ],
    powers: [
      "Imóvel até 70m²",
      "Imóvel de 70 a 150m²",
      "Imóvel acima de 150m²",
      "Sofá de 2 / 3 Lugares",
      "Colchão Solteiro / Casal / King",
      "Por m² de Vidro"
    ],
    quickServices: [
      { label: "RESIDENCIAL", name: "Faxina Residencial Completa", price: 200 },
      { label: "COMERCIAL", name: "Limpeza de Escritório Comercial", price: 450 },
      { label: "POS-OBRA", name: "Limpeza Profissional Pós-Obra", price: 800 },
      { label: "SOFAS", name: "Higienização Completa de Sofá", price: 180 },
      { label: "COLCHOES", name: "Lavagem a Seco de Colchão Casal", price: 150 },
      { label: "TAPETES", name: "Lavagem de Tapete por Metro", price: 100 },
      { label: "FACHADAS", name: "Limpeza de Fachada de Vidro", price: 1200 }
    ]
  },
  {
    id: "piscinas",
    title: "Piscinas",
    subtitle: "Manutenção, Tratamento & Filtros",
    iconName: "Waves",
    gradient: "from-cyan-500 to-blue-600",
    bgLight: "bg-cyan-50",
    borderClass: "border-cyan-100",
    modelLabel: "Tipo de Intervenção",
    powerLabel: "Volume / Tipo Piscina",
    models: [
      "Limpeza & Aspiração Física",
      "Tratamento Químico Integrado",
      "Manutenção de Motobomba",
      "Troca de Areia do Filtro",
      "Troca de Dispositivos / Leds",
      "Conserto de Vazamento Piscina"
    ],
    powers: [
      "Piscina até 20.000 Litros",
      "Piscina de 20k a 50k Litros",
      "Piscina acima de 50.000 Litros",
      "Alvenaria / Vinil / Fibra",
      "Filtro Portátil / Fixo"
    ],
    quickServices: [
      { label: "LIMPEZA", name: "Limpeza e Aspiração de Rotina", price: 150 },
      { label: "ASPIRAÇÃO", name: "Aspiração e Escovação de Paredes", price: 100 },
      { label: "TRATAMENTO", name: "Tratamento Químico de Choque", price: 120 },
      { label: "BOMBAS", name: "Reparo ou Troca de Selo de Bomba", price: 250 },
      { label: "FILTROS", name: "Substituição de Carga de Areia do Filtro", price: 300 }
    ]
  },
  {
    id: "solar",
    title: "Energia Solar",
    subtitle: "Instalação & Manutenção Fotovoltaica",
    iconName: "Sun",
    gradient: "from-yellow-500 to-orange-600",
    bgLight: "bg-yellow-50",
    borderClass: "border-yellow-100",
    modelLabel: "Componente / Módulo",
    powerLabel: "Capacidade / Geração",
    models: [
      "Módulos Fotovoltaicos (Painéis)",
      "Inversor / Microinversor",
      "Estrutura de Fixação / Telhado",
      "String Box / Proteção",
      "Limpeza de Placas Solares",
      "Projeto de Engenharia / Homologação"
    ],
    powers: [
      "Sistema de 3 kWp (Residencial)",
      "Sistema de 5 kWp (Médio)",
      "Sistema de 10 kWp (Comercial)",
      "Inversor Monofásico / Trifásico",
      "Estrutura Fibrocimento / Cerâmico"
    ],
    quickServices: [
      { label: "INSTALAÇÃO", name: "Instalação Completa de Sistema Solar", price: 5000 },
      { label: "LIMPEZA", name: "Limpeza Química de Painéis Solares", price: 350 },
      { label: "MANUTENÇÃO", name: "Revisão e Reaperto de Stringbox", price: 600 },
      { label: "AMPLIAÇÃO", name: "Ampliação de Geração (Novas Placas)", price: 2500 },
      { label: "PROJETOS", name: "Projeto e Entrada na Concessionária", price: 1800 }
    ]
  },
  {
    id: "seguranca",
    title: "Segurança Eletrônica",
    subtitle: "Câmeras, Alarmes & Cercas",
    iconName: "Shield",
    gradient: "from-rose-600 to-red-700",
    bgLight: "bg-rose-50",
    borderClass: "border-rose-100",
    modelLabel: "Equipamento / Sistema",
    powerLabel: "Tecnologia / Pontos",
    models: [
      "Câmeras de Segurança (CFTV)",
      "Central de Alarme Sem Fio / Com Fio",
      "Cerca Elétrica / Concertina",
      "Interfone / Vídeo Porteiro",
      "Fechadura Digital / Eletroímã",
      "Controle de Acesso Biométrico / TAG"
    ],
    powers: [
      "Resolução Full HD / 4K",
      "Sistema de 4 Câmeras",
      "Sistema de 8 Câmeras",
      "Cerca até 20 metros lineares",
      "TAG / Wi-Fi / Aplicativo"
    ],
    quickServices: [
      { label: "CÂMERAS", name: "Instalação e Configuração de CFTV (por Câmera)", price: 450 },
      { label: "ALARMES", name: "Instalação de Central de Alarme", price: 600 },
      { label: "INTERFONES", name: "Instalação / Reparo de Interfone", price: 350 },
      { label: "CERCAS", name: "Instalação de Cerca Elétrica (metro)", price: 500 },
      { label: "ACESSO", name: "Instalação de Fechadura Digital Inteligente", price: 800 }
    ]
  },
  {
    id: "automotivo",
    title: "Automotivo",
    subtitle: "Oficinas Mecânicas & Estética",
    iconName: "Car",
    gradient: "from-slate-600 to-slate-800",
    bgLight: "bg-slate-100",
    borderClass: "border-slate-200",
    modelLabel: "Componente / Serviço",
    powerLabel: "Veículo / Categoria",
    models: [
      "Revisão Mecânica Preventiva",
      "Sistema de Suspensão / Amortecedores",
      "Sistema de Freios (Pastilhas/Discos)",
      "Troca de Óleo & Filtros",
      "Parte Elétrica Automotiva",
      "Polimento Técnico de Pintura",
      "Higienização Interna Completa"
    ],
    powers: [
      "Carro de Passeio Popular",
      "SUV / Sedã Médio",
      "Caminhonete / Diesel",
      "Moto até 300cc",
      "Moto Alta Cilindrada"
    ],
    quickServices: [
      { label: "MECÂNICA", name: "Mão de Obra Mecânica Geral", price: 250 },
      { label: "REVISÃO", name: "Revisão Completa de Itens de Segurança", price: 400 },
      { label: "SUSPENSÃO", name: "Substituição de Kit Amortecedores", price: 600 },
      { label: "FREIOS", name: "Troca de Pastilhas de Freio Dianteiro", price: 300 },
      { label: "OLEO", name: "Troca de Óleo Motor + Filtros Inclusos", price: 150 },
      { label: "ELETRICA", name: "Diagnóstico e Reparo Elétrico", price: 350 },
      { label: "POLIMENTO", name: "Polimento de Faróis e Brilho Técnico", price: 250 },
      { label: "HIGIENIZAÇÃO", name: "Lavagem Detalhada e Higienização de Bancos", price: 180 }
    ]
  },
  {
    id: "informatica",
    title: "Informática",
    subtitle: "Suporte, Computadores & Redes",
    iconName: "Laptop",
    gradient: "from-blue-600 to-sky-700",
    bgLight: "bg-blue-50",
    borderClass: "border-blue-100",
    modelLabel: "Dispositivo / Infra",
    powerLabel: "Especificação / Sistema",
    models: [
      "Computador de Mesa (Desktop)",
      "Notebook / Macbook",
      "Roteador / Repetidor Wi-Fi",
      "Cabeamento de Rede Estruturado",
      "Servidor / Backup de Dados",
      "Impressora Multifuncional"
    ],
    powers: [
      "Windows 10 / 11",
      "macOS Catalina / Sonoma",
      "Rede Wi-Fi 2.4Ghz / 5Ghz",
      "SSD / RAM Upgrade",
      "Suporte Remoto / Presencial"
    ],
    quickServices: [
      { label: "COMPUTADORES", name: "Manutenção de Computador de Mesa", price: 150 },
      { label: "NOTEBOOKS", name: "Conserto de Notebook / Limpeza Física", price: 200 },
      { label: "IMPRESSORAS", name: "Configuração e Limpeza de Impressora", price: 120 },
      { label: "REDES", name: "Instalação de Rede de Dados / Roteadores", price: 250 },
      { label: "WI-FI", name: "Otimização de Sinal Wi-Fi Residencial", price: 150 },
      { label: "BACKUP", name: "Criação de Backup e Nuvem de Segurança", price: 100 },
      { label: "FORMATAÇÃO", name: "Formatação Completa com Instalação de OS", price: 100 }
    ]
  },
  {
    id: "marcenaria",
    title: "Marcenaria",
    subtitle: "Móveis Planejados & Reformas",
    iconName: "Wrench",
    gradient: "from-yellow-700 to-amber-900",
    bgLight: "bg-amber-50",
    borderClass: "border-amber-200",
    modelLabel: "Móvel / Peça",
    powerLabel: "Material / Acabamento",
    models: [
      "Armário de Cozinha Planejado",
      "Guarda-Roupa Sob Medida",
      "Painel de TV / Home Theater",
      "Bancada de Escritório",
      "Reparo de Portas / Gavetas",
      "Substituição de Dobradiças / Corrediças"
    ],
    powers: [
      "MDF Amadeirado",
      "MDF Branco TX",
      "Madeira Maciça",
      "Ferragens com Amortecedor",
      "Puxadores Perfil Alumínio"
    ],
    quickServices: [
      { label: "ARMÁRIOS", name: "Instalação de Armário Suspenso", price: 1800 },
      { label: "MÓVEIS", name: "Fabricação de Móvel Planejado m²", price: 4500 },
      { label: "PAINÉIS", name: "Montagem de Painel de TV MDF", price: 1200 },
      { label: "BANCADAS", name: "Instalação de Bancada Suspensa", price: 800 },
      { label: "REPAROS", name: "Regulagem de Portas e Gavetas", price: 180 }
    ]
  },
  {
    id: "serralheria",
    title: "Serralheria",
    subtitle: "Portões, Grades & Coberturas",
    iconName: "Hammer",
    gradient: "from-zinc-600 to-zinc-800",
    bgLight: "bg-zinc-100",
    borderClass: "border-zinc-200",
    modelLabel: "Estrutura Metálica",
    powerLabel: "Material / Bitola",
    models: [
      "Portão Basculante / Deslizante",
      "Grade de Proteção para Janelas",
      "Corrimão / Guarda-Corpo Metálico",
      "Cobertura de Policarbonato",
      "Estrutura Metálica de Telhado",
      "Soldagem e Reparos Gerais"
    ],
    powers: [
      "Aço Carbono (Ferro)",
      "Alumínio Branco / Bronze",
      "Aço Inoxidável Polido",
      "Policarbonato Alveolar",
      "Chapa Galvanizada"
    ],
    quickServices: [
      { label: "PORTÕES", name: "Fabricação de Portão Sob Medida", price: 1200 },
      { label: "GRADES", name: "Instalação de Grades de Proteção", price: 600 },
      { label: "CORRIMÃOS", name: "Instalação de Corrimão de Alumínio", price: 450 },
      { label: "COBERTURAS", name: "Instalação de Cobertura Policarbonato", price: 1800 },
      { label: "ESTRUTURAS", name: "Montagem de Galpão / Estrutura Metálica", price: 2500 }
    ]
  },
  {
    id: "vidraçaria",
    title: "Vidraçaria",
    subtitle: "Vidros Temperados, Boxes & Espelhos",
    iconName: "Maximize",
    gradient: "from-sky-400 to-cyan-500",
    bgLight: "bg-sky-50",
    borderClass: "border-sky-100",
    modelLabel: "Item de Vidro",
    powerLabel: "Espessura / Cor",
    models: [
      "Box para Banheiro",
      "Espelho Lapidado / Bisotado",
      "Porta de Vidro de Correr",
      "Janela Blindex de Quatro Folhas",
      "Guarda-Corpo de Vidro",
      "Prateleira de Vidro Comum"
    ],
    powers: [
      "Vidro Temperado 8mm",
      "Vidro Temperado 10mm",
      "Vidro Comum 4mm",
      "Incolor / Fumê / Verde",
      "Acabamento Alumínio Preto / Fosco"
    ],
    quickServices: [
      { label: "BOX", name: "Instalação de Box para Banheiro", price: 600 },
      { label: "ESPELHOS", name: "Instalação de Espelho Grande Lapidado", price: 350 },
      { label: "PORTAS", name: "Instalação de Porta Blindex de Correr", price: 1200 },
      { label: "JANELAS", name: "Instalação de Janela Blindex 2 Folhas", price: 800 },
      { label: "GUARDA-CORPO", name: "Instalação de Guarda-Corpo de Vidro m²", price: 1500 }
    ]
  },
  {
    id: "dedetização",
    title: "Dedetização",
    subtitle: "Controle de Pragas & Insetos",
    iconName: "Bug",
    gradient: "from-emerald-600 to-green-700",
    bgLight: "bg-emerald-50",
    borderClass: "border-emerald-100",
    modelLabel: "Tipo de Praga",
    powerLabel: "Tipo de Aplicação",
    models: [
      "Controle de Baratas / Formigas",
      "Controle de Cupins (Descupinização)",
      "Controle de Roedores (Desratização)",
      "Mosquitos da Dengue (Termonebulização)",
      "Sanitização de Ambientes contra Vírus"
    ],
    powers: [
      "Gel / Pulverização Líquida",
      "Barreira Química / Injeção",
      "Iscagem Monitorada",
      "Atomização / Fumaça",
      "Área Residencial até 100m²",
      "Área Comercial de Grande Porte"
    ],
    quickServices: [
      { label: "BARATAS", name: "Dedetização de Baratas e Formigas", price: 180 },
      { label: "CUPINS", name: "Tratamento Contra Cupins de Solo", price: 350 },
      { label: "FORMIGAS", name: "Dedetização de Formigas em Cozinha", price: 150 },
      { label: "MOSQUITOS", name: "Fumacê de Quintal / Controle de Mosquitos", price: 200 },
      { label: "ROEDORES", name: "Desratização por Iscagem Ativa", price: 220 }
    ]
  },
  {
    id: "mudancas",
    title: "Mudanças",
    subtitle: "Mudanças, Carretos & Embalagens",
    iconName: "Truck",
    gradient: "from-amber-600 to-orange-700",
    bgLight: "bg-amber-50",
    borderClass: "border-amber-100",
    modelLabel: "Categoria de Transporte",
    powerLabel: "Veículo / Equipe",
    models: [
      "Mudança Residencial Completa",
      "Frete / Carreto Rápido (Poucos itens)",
      "Mudança Comercial / Escritório",
      "Embalagem Completa (Caixas/Plástico Bolha)",
      "Içamento de Móveis pesados"
    ],
    powers: [
      "Caminhão Baú Grande (Toco)",
      "Caminhão Baú Pequeno (3/4)",
      "Utilitário HR / Fiorino",
      "Motorista + 2 Ajudantes",
      "Apenas Motorista (Sem ajudante)"
    ],
    quickServices: [
      { label: "MUDANÇAS", name: "Mudança Residencial Completa de Grande Porte", price: 1200 },
      { label: "CARRETOS", name: "Carreto Rápido Intermunicipal", price: 350 },
      { label: "FRETES", name: "Frete de Itens Individuais (Sofá/Geladeira)", price: 250 },
      { label: "TRANSPORTE", name: "Transporte Comercial de Equipamentos", price: 600 },
      { label: "EMBALAGEM", name: "Serviço de Embalagem e Proteção", price: 300 }
    ]
  },
  {
    id: "eventos",
    title: "Eventos",
    subtitle: "Buffet, Som, DJ & Decoração",
    iconName: "Calendar",
    gradient: "from-fuchsia-500 to-pink-600",
    bgLight: "bg-fuchsia-50",
    borderClass: "border-fuchsia-100",
    modelLabel: "Atração / Estrutura",
    powerLabel: "Duração / Convidados",
    models: [
      "Serviço de Buffet / Garçons",
      "Apresentação de DJ + Iluminação",
      "Estrutura de Som / Pista de Dança",
      "Decoração Temática / Flores",
      "Fotografia e Cobertura Digital",
      "Gravação de Vídeo / Clipes"
    ],
    powers: [
      "Festa até 50 Convidados",
      "Festa de 50 a 150 Convidados",
      "Festa acima de 150 Convidados",
      "Duração de 4 Horas",
      "Duração de 6 Horas",
      "Pacote Completo (Fotos + Vídeos)"
    ],
    quickServices: [
      { label: "BUFFET", name: "Coquetel e Comida por Convidado", price: 2500 },
      { label: "DJ", name: "DJ com Pista Completa e Moving Head", price: 800 },
      { label: "DECORAÇÃO", name: "Decoração de Mesa Principal de Evento", price: 1500 },
      { label: "SOM", name: "Sonorização de Ambiente para Palestra/Festa", price: 600 },
      { label: "FOTOGRAFIA", name: "Cobertura Fotográfica Digital", price: 1200 },
      { label: "FILMAGEM", name: "Filmagem de Evento em Alta Resolução", price: 1500 }
    ]
  }
];
