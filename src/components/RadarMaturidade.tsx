import { useMemo } from "react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { DIMENSOES, META_DIMENSAO, notaDimensao, type Respostas } from "@/lib/diagnostico";

/** Mínimo de respostas para mostrar a série dos 25% mais maduros. */
const MIN_PARA_TOPO = 4;

const COR_SALA = "var(--v4-red)";
const COR_TOPO = "#9ca3af";
const COR_META = "var(--ink)";

function formatar(valor: number) {
  return valor.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function media(valores: number[]) {
  return valores.length ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
}

interface LinhaDimensao {
  id: string;
  nome: string;
  sala: number;
  topo: number | null;
  meta: number;
  distancia: number;
}

export function RadarMaturidade({ respostas }: { respostas: Respostas[] }) {
  const total = respostas.length;
  const mostrarTopo = total >= MIN_PARA_TOPO;

  const linhas = useMemo<LinhaDimensao[]>(() => {
    // 25% mais maduros da sala, pela soma das 15 respostas.
    const ordenadas = [...respostas].sort(
      (a, b) =>
        Object.values(b).reduce((s, v) => s + v, 0) - Object.values(a).reduce((s, v) => s + v, 0),
    );
    const topo = ordenadas.slice(0, Math.max(1, Math.ceil(total * 0.25)));

    return DIMENSOES.map((dimensao) => {
      const sala = media(respostas.map((r) => notaDimensao(r, dimensao)));
      return {
        id: dimensao.id,
        nome: dimensao.nome,
        sala,
        topo: mostrarTopo ? media(topo.map((r) => notaDimensao(r, dimensao))) : null,
        meta: META_DIMENSAO,
        distancia: Math.max(0, META_DIMENSAO - sala),
      };
    });
  }, [respostas, total, mostrarTopo]);

  const maisForte = total
    ? linhas.reduce((melhor, l) => (l.sala > melhor.sala ? l : melhor), linhas[0]!)
    : null;
  const maisFraco = total
    ? linhas.reduce((pior, l) => (l.distancia > pior.distancia ? l : pior), linhas[0]!)
    : null;

  return (
    <div className="grid gap-8 2xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      <div>
        <p className="text-right text-xs text-ink-muted">Escala de 0 a 5</p>
        <div className="h-[500px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={linhas} outerRadius="78%" margin={{ top: 8, right: 80, bottom: 8, left: 80 }}>
              <PolarGrid stroke="var(--hairline)" strokeWidth={1.5} />
              <PolarAngleAxis
                dataKey="nome"
                tick={{ fill: "var(--ink)", fontSize: 15, fontWeight: 600 }}
              />
              <PolarRadiusAxis domain={[0, 5]} tickCount={6} axisLine={false} tick={false} />
              <Radar
                name={`Meta (${META_DIMENSAO})`}
                dataKey="meta"
                stroke={COR_META}
                strokeWidth={2}
                strokeDasharray="6 5"
                fill="transparent"
                dot={{ r: 4, fill: COR_META, strokeWidth: 0 }}
                isAnimationActive={false}
              />
              {mostrarTopo && (
                <Radar
                  name="25% mais maduros"
                  dataKey="topo"
                  stroke={COR_TOPO}
                  strokeWidth={2}
                  fill={COR_TOPO}
                  fillOpacity={0.18}
                  dot={{ r: 4, fill: COR_TOPO, strokeWidth: 0 }}
                />
              )}
              <Radar
                name="Média da sala"
                dataKey="sala"
                stroke={COR_SALA}
                strokeWidth={2.5}
                fill={COR_SALA}
                fillOpacity={0.28}
                dot={{ r: 5, fill: COR_SALA, stroke: "var(--card)", strokeWidth: 2 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid var(--hairline)",
                  background: "var(--card)",
                  fontSize: 13,
                  color: "var(--ink)",
                }}
                formatter={(valor: number, nome: string) => [formatar(Number(valor)), nome]}
              />
              <Legend
                iconType="square"
                wrapperStyle={{ fontSize: 14, fontWeight: 500, paddingTop: 12 }}
                formatter={(nome: string) => <span style={{ color: "var(--ink)" }}>{nome}</span>}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-4">
          <Destaque
            rotulo="Frente mais forte"
            valor={maisForte ? formatar(maisForte.sala) : "—"}
            cor="var(--flag-safe)"
            legenda={maisForte ? maisForte.nome : "Aguardando respostas"}
          />
          <Destaque
            rotulo="Maior distância da meta"
            valor={maisFraco ? `${formatar(maisFraco.distancia)} pts` : "—"}
            cor="var(--v4-red)"
            legenda={maisFraco ? maisFraco.nome : "Aguardando respostas"}
          />
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-hairline">
              <th className="micro-label pb-2 font-semibold">Frente</th>
              <th className="micro-label pb-2 text-right font-semibold">Sala</th>
              {mostrarTopo && <th className="micro-label pb-2 text-right font-semibold">Top 25%</th>}
              <th className="micro-label pb-2 text-right font-semibold">Meta</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((linha) => {
              const destaque = maisFraco?.id === linha.id;
              return (
                <tr
                  key={linha.id}
                  className="border-b border-hairline last:border-0"
                  style={destaque ? { background: "var(--v4-red-soft)" } : undefined}
                >
                  <td className="py-2.5 pl-1 text-[15px] font-semibold text-ink">{linha.nome}</td>
                  <td
                    className="py-2.5 text-right text-[15px] font-bold tabular-nums"
                    style={{ color: "var(--v4-red)" }}
                  >
                    {total ? formatar(linha.sala) : "—"}
                  </td>
                  {mostrarTopo && (
                    <td className="py-2.5 text-right text-[15px] tabular-nums text-ink-muted">
                      {linha.topo !== null ? formatar(linha.topo) : "—"}
                    </td>
                  )}
                  <td className="py-2.5 pr-1 text-right text-[15px] tabular-nums text-ink-muted">
                    {linha.meta}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div
          className="rounded-r-lg py-3 pr-4 pl-4 text-[15px] leading-snug text-ink"
          style={{ borderLeft: "3px solid var(--v4-red)", background: "var(--row-hover)" }}
        >
          <strong>A decisão vem da frente mais fraca.</strong>{" "}
          {maisForte && maisFraco ? (
            <span className="text-ink-muted">
              {maisForte.nome} puxa a sala para cima, mas {maisFraco.nome.toLowerCase()} segura o
              próximo salto.
            </span>
          ) : (
            <span className="text-ink-muted">O radar aparece assim que as respostas chegarem.</span>
          )}
        </div>
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
    <div className="rounded-xl border border-hairline bg-row-hover p-4">
      <p className="micro-label">{rotulo}</p>
      <p className="mt-1 text-4xl font-bold tabular-nums" style={{ color: cor, letterSpacing: "-0.02em" }}>
        {valor}
      </p>
      <p className="mt-1 text-sm text-ink-muted">{legenda}</p>
    </div>
  );
}
