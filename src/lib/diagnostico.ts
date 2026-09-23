export type PilarId = "fundacao" | "gestao" | "escala";

export interface Pergunta {
  id: string;
  pilar: PilarId;
  texto: string;
  opcoes: [string, string, string];
  acao: string;
}

export const PILARES: { id: PilarId; numero: number; nome: string; legenda: string }[] = [
  {
    id: "fundacao",
    numero: 1,
    nome: "Fundação",
    legenda: "Pessoas, perfil de cliente e processo. Sem isso, venda é improviso.",
  },
  {
    id: "gestao",
    numero: 2,
    nome: "Gestão",
    legenda: "Metas, CRM e números que mostram onde o funil trava.",
  },
  {
    id: "escala",
    numero: 3,
    nome: "Escala",
    legenda: "Previsibilidade, geração de demanda e máquina rodando.",
  },
];

export const PERGUNTAS: Pergunta[] = [
  // FUNDAÇÃO
  {
    id: "p1",
    pilar: "fundacao",
    texto: "Quem vende na sua empresa hoje?",
    opcoes: [
      "Time comercial dedicado (2 ou mais pessoas)",
      "1 vendedor, ou o dono com apoio",
      "Só o dono ou sócio vende",
    ],
    acao: "Tirar a venda das costas do dono e montar um time comercial dedicado",
  },
  {
    id: "p2",
    pilar: "fundacao",
    texto:
      "As funções do comercial estão separadas (quem prospecta, quem qualifica, quem fecha, quem cuida do pós-venda)?",
    opcoes: ["Sim, cada etapa tem dono", "Em parte, alguns acumulam funções", "Todo mundo faz tudo"],
    acao: "Separar papéis no comercial: prospecção, qualificação, fechamento e pós-venda",
  },
  {
    id: "p3",
    pilar: "fundacao",
    texto: "O perfil de cliente ideal (segmento, porte, quem decide a compra) está definido?",
    opcoes: ["Sim, escrito e usado para qualificar", "Temos uma ideia, mas não está escrito", "Vendemos para quem aparecer"],
    acao: "Definir o perfil de cliente ideal (ICP) e usá-lo para qualificar oportunidades",
  },
  {
    id: "p4",
    pilar: "fundacao",
    texto: "As etapas do seu funil de vendas, do primeiro contato ao fechamento, estão desenhadas?",
    opcoes: ["Sim, com critério claro de passagem entre etapas", "Existe na prática, mas não está escrito", "Cada vendedor vende do seu jeito"],
    acao: "Desenhar o processo de vendas com etapas e critérios de avanço",
  },
  {
    id: "p5",
    pilar: "fundacao",
    texto: "Se o seu melhor vendedor sair amanhã, as vendas continuam?",
    opcoes: ["Sim, processo e carteira estão registrados", "Continuam, mas caem bastante", "Param, tudo depende dele"],
    acao: "Registrar carteira e processo para as vendas não dependerem de uma pessoa",
  },
  // GESTÃO
  {
    id: "p6",
    pilar: "gestao",
    texto: "Onde vocês registram as oportunidades de venda?",
    opcoes: ["CRM usado por todo o time, todo dia", "CRM mal alimentado ou planilha", "WhatsApp, caderno ou na cabeça"],
    acao: "Implantar um CRM e criar a disciplina de registrar toda oportunidade",
  },
  {
    id: "p7",
    pilar: "gestao",
    texto: "Existe meta de vendas definida por mês e por vendedor?",
    opcoes: ["Sim, mensal e individual", "Só uma meta geral da empresa", "Não temos meta definida"],
    acao: "Definir meta mensal por vendedor, desdobrada da meta da empresa",
  },
  {
    id: "p8",
    pilar: "gestao",
    texto: "Você sabe a taxa de conversão de cada etapa do funil (contato → reunião → proposta → fechamento)?",
    opcoes: ["Sei, por etapa e por vendedor", "Só a conversão geral", "Não sei"],
    acao: "Medir a conversão de cada etapa do funil para achar o gargalo",
  },
  {
    id: "p9",
    pilar: "gestao",
    texto: "Você conhece o ticket médio e o tempo médio para fechar uma venda?",
    opcoes: ["Sei os dois e acompanho", "Tenho noção de um deles", "Não sei"],
    acao: "Acompanhar ticket médio e ciclo de vendas todo mês",
  },
  {
    id: "p10",
    pilar: "gestao",
    texto: "Existe rotina de gestão comercial (reunião semanal de pipeline, conversas individuais com vendedores)?",
    opcoes: ["Sim, com cadência fixa", "Acontece de vez em quando", "Não existe"],
    acao: "Instituir rituais de gestão: reunião semanal de pipeline e 1:1 com o time",
  },
  // ESCALA
  {
    id: "p11",
    pilar: "escala",
    texto: "Você consegue prever quanto vai vender no próximo mês?",
    opcoes: ["Sim, pelo pipeline, com pouca margem de erro", "Tenho uma estimativa, mas erra bastante", "Não, cada mês é uma surpresa"],
    acao: "Construir um forecast de vendas a partir do pipeline",
  },
  {
    id: "p12",
    pilar: "escala",
    texto: "De onde vêm as suas oportunidades de venda?",
    opcoes: ["Canais ativos e previsíveis (marketing e prospecção)", "Mais indicação, com alguma ação ativa", "Só indicação e demanda espontânea"],
    acao: "Criar canais ativos de geração de demanda além da indicação",
  },
  {
    id: "p13",
    pilar: "escala",
    texto: "Marketing e vendas têm acordo sobre o que é um lead qualificado e em quanto tempo ele é atendido?",
    opcoes: ["Sim, formalizado e medido", "Combinado informal", "Não há alinhamento"],
    acao: "Formalizar o acordo entre marketing e vendas (lead qualificado e tempo de resposta)",
  },
  {
    id: "p14",
    pilar: "escala",
    texto: "Um vendedor novo tem playbook e treinamento para começar a vender?",
    opcoes: ["Sim, playbook e integração com prazo definido", "Aprende acompanhando os outros", "Aprende na raça"],
    acao: "Escrever o playbook de vendas e um roteiro de integração de vendedores",
  },
  {
    id: "p15",
    pilar: "escala",
    texto: "Existe processo de follow-up, pós-venda e recompra rodando?",
    opcoes: ["Sim, automatizado e com responsável", "Manual, quando dá tempo", "Não existe"],
    acao: "Estruturar follow-up e pós-venda com automação para gerar recompra",
  },
];

export const NIVEIS = {
  V0: {
    codigo: "V0",
    nome: "Improviso",
    frase: "Sua empresa ainda vende no improviso: antes de escalar, é preciso construir a fundação comercial.",
  },
  V1: {
    codigo: "V1",
    nome: "Fundação",
    frase: "Você tem a base do comercial, mas ainda gerencia no escuro: o próximo passo é dominar metas e números.",
  },
  V2: {
    codigo: "V2",
    nome: "Gestão",
    frase: "Time estruturado e números na mão: sua empresa está pronta para ganhar previsibilidade e escala.",
  },
  V3: {
    codigo: "V3",
    nome: "Máquina de Vendas",
    frase: "Sua empresa está entre as poucas com uma máquina de vendas previsível e escalável.",
  },
} as const;

export type NivelCodigo = keyof typeof NIVEIS;

export const FAIXAS_FATURAMENTO = [
  "Até R$ 50 mil",
  "R$ 50 a 200 mil",
  "R$ 200 mil a 1 milhão",
  "Acima de R$ 1 milhão",
] as const;

export type Respostas = Record<string, number>;

export function pontuacaoPilar(respostas: Respostas, pilar: PilarId): number {
  return PERGUNTAS.filter((p) => p.pilar === pilar).reduce(
    (soma, p) => soma + (respostas[p.id] ?? 0),
    0,
  );
}

export function calcularNivel(fundacao: number, gestao: number, escala: number): NivelCodigo {
  if (fundacao < 6) return "V0";
  if (gestao < 6) return "V1";
  if (escala < 6) return "V2";
  return "V3";
}

export function proximosPassos(respostas: Respostas): string[] {
  return [...PERGUNTAS]
    .map((p, indice) => ({ p, indice, valor: respostas[p.id] ?? 0 }))
    .sort((a, b) => a.valor - b.valor || a.indice - b.indice)
    .slice(0, 3)
    .map((item) => item.p.acao);
}

/**
 * Dimensões do radar do painel. Reagrupam as 15 perguntas em 6 frentes
 * comerciais, na escala de 0 a 5 (média das respostas da dimensão).
 */
export interface Dimensao {
  id: string;
  nome: string;
  perguntas: string[];
}

export const DIMENSOES: Dimensao[] = [
  { id: "demanda", nome: "Geração de demanda", perguntas: ["p12", "p13"] },
  { id: "processo", nome: "Processo e playbook", perguntas: ["p3", "p4", "p14"] },
  { id: "pessoas", nome: "Pessoas e papéis", perguntas: ["p1", "p2", "p5"] },
  { id: "gestao", nome: "Gestão e rituais", perguntas: ["p7", "p10", "p11"] },
  { id: "dados", nome: "Dados e CRM", perguntas: ["p6", "p8", "p9"] },
  { id: "posvenda", nome: "Pós-venda e retenção", perguntas: ["p15"] },
];

/** Meta de referência de cada dimensão (escala 0 a 5). */
export const META_DIMENSAO = 4;

/** Nota de 0 a 5 de uma dimensão para um conjunto de respostas (0/1/2 por pergunta). */
export function notaDimensao(respostas: Respostas, dimensao: Dimensao): number {
  const soma = dimensao.perguntas.reduce((total, id) => total + (respostas[id] ?? 0), 0);
  return (soma / (dimensao.perguntas.length * 2)) * 5;
}
