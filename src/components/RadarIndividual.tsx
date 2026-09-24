import { useMemo } from "react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import { DIMENSOES, META_DIMENSAO, notaDimensao, type Respostas } from "@/lib/diagnostico";

/**
 * Versão individual do radar do painel: mesmas 6 frentes e mesma meta,
 * mas com a nota do próprio participante no lugar da média da sala.
 */

const COR_VOCE = "var(--v4-red)";
const COR_META = "var(--ink)";

function formatar(valor: number) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/** Quebra o nome da frente em até 2 linhas equilibradas, para caber no celular. */
function quebrarRotulo(texto: string): string[] {
  const palavras = texto.split(" ");
  if (palavras.length < 3) return [texto];
  const meio = Math.ceil(palavras.length / 2);
  return [palavras.slice(0, meio).join(" "), palavras.slice(meio).join(" ")];
}

interface PropsRotulo {
  x?: number;
  y?: number;
  cy?: number;
  textAnchor?: "start" | "middle" | "end";
  payload?: { value: string };
}

function RotuloFrente({ x = 0, y = 0, cy = 0, textAnchor = "middle", payload }: PropsRotulo) {
  const linhas = quebrarRotulo(payload?.value ?? "");
  const alturaLinha = 13;
  // Rótulos acima do centro crescem para cima; abaixo, para baixo.
  const acima = y < cy - 4;
  const abaixo = y > cy + 4;
  const inicio = acima
    ? -(linhas.length - 1) * alturaLinha - 4
    : abaixo
      ? 10
      : -((linhas.length - 1) * alturaLinha) / 2 + 4;

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fill="var(--ink)"
      fontSize={11}
      fontWeight={600}
    >
      {linhas.map((linha, i) => (
        <tspan key={linha} x={x} dy={i === 0 ? inicio : alturaLinha}>
          {linha}
        </tspan>
      ))}
    </text>
  );
}

interface LinhaDimensao {
  id: string;
  nome: string;
  voce: number;
  meta: number;
  distancia: number;
}

export function RadarIndividual({ respostas }: { respostas: Respostas }) {
  const linhas = useMemo<LinhaDimensao[]>(
    () =>
      DIMENSOES.map((dimensao) => {
        const voce = notaDimensao(respostas, dimensao);
        return {
          id: dimensao.id,
          nome: dimensao.nome,
          voce,
          meta: META_DIMENSAO,
          distancia: Math.max(0, META_DIMENSAO - voce),
        };
      }),
    [respostas],
  );

  const maisForte = linhas.reduce((melhor, l) => (l.voce > melhor.voce ? l : melhor), linhas[0]!);
  const maisFraco = linhas.reduce(
    (pior, l) => (l.distancia > pior.distancia ? l : pior),
    linhas[0]!,
  );
  const tudoNaMeta = maisFraco.distancia === 0;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-right text-[11px] text-ink-muted">Escala de 0 a 5</p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart
              data={linhas}
              outerRadius="68%"
              margin={{ top: 16, right: 44, bottom: 8, left: 44 }}
            >
              <PolarGrid stroke="var(--hairline)" strokeWidth={1.5} />
              <PolarAngleAxis dataKey="nome" tick={<RotuloFrente />} />
              <PolarRadiusAxis domain={[0, 5]} tickCount={6} axisLine={false} tick={false} />
              <Radar
                name={`Meta (${META_DIMENSAO})`}
                dataKey="meta"
                stroke={COR_META}
                strokeWidth={1.5}
                strokeDasharray="5 4"
                fill="transparent"
                dot={{ r: 3, fill: COR_META, strokeWidth: 0 }}
                isAnimationActive={false}
              />
              <Radar
                name="Você"
                dataKey="voce"
                stroke={COR_VOCE}
                strokeWidth={2.5}
                fill={COR_VOCE}
                fillOpacity={0.28}
                dot={{ r: 4, fill: COR_VOCE, stroke: "var(--card)", strokeWidth: 2 }}
              />
              <Legend
                iconType="square"
                wrapperStyle={{ fontSize: 12, fontWeight: 500, paddingTop: 4 }}
                formatter={(nome: string) => <span style={{ color: "var(--ink)" }}>{nome}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Destaque
          rotulo="Frente mais forte"
          valor={formatar(maisForte.voce)}
          cor="var(--flag-safe)"
          legenda={maisForte.nome}
        />
        <Destaque
          rotulo="Maior distância da meta"
          valor={tudoNaMeta ? "0" : `${formatar(maisFraco.distancia)} pts`}
          cor="var(--v4-red)"
          legenda={tudoNaMeta ? "Todas na meta" : maisFraco.nome}
        />
      </div>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-hairline">
            <th className="micro-label pb-2 font-semibold">Frente</th>
            <th className="micro-label pb-2 text-right font-semibold">Você</th>
            <th className="micro-label pb-2 text-right font-semibold">Meta</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => {
            const destaque = !tudoNaMeta && maisFraco.id === linha.id;
            return (
              <tr
                key={linha.id}
                className="border-b border-hairline last:border-0"
                style={destaque ? { background: "var(--v4-red-soft)" } : undefined}
              >
                <td className="py-2 pl-1 text-[13px] font-semibold text-ink">{linha.nome}</td>
                <td
                  className="py-2 text-right text-[13px] font-bold tabular-nums"
                  style={{ color: "var(--v4-red)" }}
                >
                  {formatar(linha.voce)}
                </td>
                <td className="py-2 pr-1 text-right text-[13px] tabular-nums text-ink-muted">
                  {linha.meta}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div
        className="rounded-r-lg py-3 pr-3 pl-3 text-[13px] leading-snug text-ink"
        style={{ borderLeft: "3px solid var(--v4-red)", background: "var(--row-hover)" }}
      >
        {tudoNaMeta ? (
          <>
            <strong>Todas as frentes estão na meta.</strong>{" "}
            <span className="text-ink-muted">
              O desafio agora é manter a consistência e subir a régua.
            </span>
          </>
        ) : (
          <>
            <strong>O próximo salto vem da frente mais fraca.</strong>{" "}
            <span className="text-ink-muted">
              {maisForte.id === maisFraco.id
                ? `${maisFraco.nome} é a frente que mais segura o seu crescimento.`
                : `${maisForte.nome} puxa você para cima, mas ${maisFraco.nome.toLowerCase()} segura o próximo salto.`}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

function Destaque({
  rotulo,
  valor,
  cor,
  legenda,
}: {
  rotulo: string;
  valor: string;
  cor: string;
  legenda: string;
}) {
  return (
    <div className="rounded-xl border border-hairline bg-row-hover p-3">
      <p className="micro-label">{rotulo}</p>
      <p
        className="mt-1 text-2xl font-bold tabular-nums"
        style={{ color: cor, letterSpacing: "-0.02em" }}
      >
        {valor}
      </p>
      <p className="mt-0.5 text-xs leading-snug text-ink-muted">{legenda}</p>
    </div>
  );
}
