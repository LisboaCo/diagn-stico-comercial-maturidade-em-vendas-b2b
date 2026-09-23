import { createServerFn } from "@tanstack/react-start";

import type { NivelCodigo, Respostas } from "./diagnostico";

export interface RespostaRegistro {
  id: string;
  criado_em: string;
  respostas: Respostas;
  pontos_fundacao: number;
  pontos_gestao: number;
  pontos_escala: number;
  nivel: NivelCodigo;
  nome: string;
  whatsapp: string;
  email: string;
  segmento: string;
  faixa_faturamento: string;
  consentimento: boolean;
}

interface PayloadSalvar {
  respostas: Respostas;
  pontos_fundacao: number;
  pontos_gestao: number;
  pontos_escala: number;
  nivel: NivelCodigo;
  nome: string;
  whatsapp: string;
  email: string;
  segmento: string;
  faixa_faturamento: string;
  consentimento: boolean;
}

function getBaseUrl() {
  const url = process.env["POSTGREST_DASHBOARD_TVSIM"];
  if (!url) throw new Error("POSTGREST_DASHBOARD_TVSIM não configurado");
  const clean = url.replace(/\/$/, "");
  return clean.startsWith("http://") || clean.startsWith("https://") ? clean : `https://${clean}`;
}

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export const salvarResposta = createServerFn({ method: "POST" })
  .inputValidator((data: PayloadSalvar) => data)
  .handler(async ({ data }) => {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/rpc/salvar_resposta_comercial`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        p_respostas: data.respostas,
        p_pontos_fundacao: data.pontos_fundacao,
        p_pontos_gestao: data.pontos_gestao,
        p_pontos_escala: data.pontos_escala,
        p_nivel: data.nivel,
        p_nome: data.nome,
        p_whatsapp: data.whatsapp,
        p_email: data.email,
        p_segmento: data.segmento,
        p_faixa_faturamento: data.faixa_faturamento,
        p_consentimento: data.consentimento,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      throw new Error(`Falha ao salvar resposta: ${response.status} ${text}`);
    }

    return (await response.json()) as { id: string };
  });

export const listarRespostas = createServerFn({ method: "GET" }).handler(async () => {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/respostas_comercial?select=*&order=criado_em.desc`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Falha ao listar respostas: ${response.status} ${text}`);
  }

  return (await response.json()) as RespostaRegistro[];
});
