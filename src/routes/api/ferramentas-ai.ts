import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { z } from "zod";

type ToolId = "names" | "titles" | "hashtags" | "competitor" | "script" | "bio" | "cta" | "ideas";

const ToolSchema = z.object({
  tool: z.enum(["names", "titles", "hashtags", "competitor", "script", "bio", "cta", "ideas"]),
  input: z.string().max(4000).optional().default(""),
  auto: z.boolean().optional().default(false),
});

const AUTO_BRIEFS: Record<ToolId, string> = {
  names: "Crie nomes para uma influencer virtual brasileira de UGC, jovem adulta, memorável, moderna, com apelo para TikTok e Instagram.",
  titles: "Crie títulos para um vídeo TikTok vendendo uma oferta digital de UGC para mulheres que querem renda extra.",
  hashtags: "Crie hashtags para um vídeo UGC brasileiro sobre ganhar dinheiro criando conteúdo e vender com TikTok.",
  competitor: "Monte uma análise modelo de concorrente do nicho UGC/infoproduto e entregue roteiro replicável de alto potencial de conversão.",
  script: "Crie roteiro UGC de 30 segundos para vender uma mentoria/curso de UGC para iniciantes.",
  bio: "Crie bios para uma influencer UGC brasileira que vende indicação, review e conteúdo para marcas.",
  cta: "Crie CTAs para uma oferta de mentoria/curso de UGC com foco em conversão imediata.",
  ideas: "Crie ideias de vídeos virais para uma influencer UGC brasileira que ensina e vende pelo TikTok.",
};

const SYSTEM_PROMPTS: Record<ToolId, string> = {
  names: `Você cria nomes de influenciadoras brasileiras virais para Instagram/TikTok.
Entregue algo objetivo, moderno e comercial — nada clássico demais como Maria Júlia/Ana Clara.
Formato obrigatório:
## 12 nomes prontos
Lista numerada com nome + sobrenome e uma justificativa curta.
## Top 3 escolhas
Explique quais têm mais potencial de perfil, lembrança e venda.`,

  titles: `Você é copywriter de títulos virais para TikTok/Reels focado em venda.
Crie títulos curtos, com gancho forte, curiosidade e intenção de compra.
Use variações como POV:, ninguém te conta, antes/depois, erro comum, teste real, prova social.
Formato obrigatório:
## 15 títulos prontos
## 5 mais agressivos para venda
## Melhor título e por quê`,

  hashtags: `Você monta hashtags brasileiras para TikTok/Instagram com foco em alcance e conversão.
Não prometa acesso a tendências em tempo real; gere combinações fortes por volume, nicho e intenção de compra.
Formato obrigatório:
## Alto volume
Linha única pronta para copiar.
## Nicho
Linha única pronta para copiar.
## Conversão
Linha única pronta para copiar.
## Mix recomendado
Linha final com 12 hashtags combinadas.`,

  competitor: `Você analisa concorrentes para criadores UGC e transforma padrões em roteiro replicável.
Se o usuário mandar link sem prints, deixe claro que a análise é baseada nas informações fornecidas.
Formato obrigatório:
## Diagnóstico do concorrente
## O que provavelmente está convertendo
## Roteiro pronto para replicar
Separar Gancho, Cena 1, Cena 2, Prova, CTA.
## 3 variações
## Checklist de gravação`,

  script: `Você é roteirista UGC para TikTok/Reels.
Crie roteiro de 15-30 segundos, direto, gravável e vendedor.
Formato obrigatório:
## Roteiro principal
Gancho 0-3s, desenvolvimento, prova/demonstração, CTA.
## Falas prontas
## Cenas/B-roll
## Legenda para postar`,

  bio: `Você cria bios de Instagram para perfis UGC que convertem visita em seguidor/lead.
Formato obrigatório:
## 8 bios prontas
Máximo 150 caracteres cada.
## Nome de exibição
5 opções.
## Destaques recomendados
## Melhor combinação`,

  cta: `Você é copywriter de conversão.
Gere CTAs curtos, fortes e naturais para vídeo, legenda e botão.
Formato obrigatório:
## CTAs para vídeo
## CTAs para legenda
## CTAs com urgência
## CTAs suaves
## Melhor CTA`,

  ideas: `Você é estrategista de conteúdo UGC para TikTok/Reels.
Gere ideias específicas, fáceis de gravar e com potencial de venda.
Formato obrigatório:
## 12 ideias de vídeo
Cada ideia com título, gancho 0-3s e execução rápida.
## Sequência de 7 dias
## Ideia com maior chance de conversão`,
};

export const Route = createFileRoute("/api/ferramentas-ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const parsed = ToolSchema.safeParse(await request.json());
          if (!parsed.success) {
            return Response.json({ error: "Dados inválidos" }, { status: 400 });
          }

          const { tool, auto } = parsed.data;
          const input = parsed.data.input.trim();
          if (!auto && input.length < 2) {
            return Response.json({ error: "Informe mais detalhes ou use Gerar automático" }, { status: 400 });
          }

          const key = process.env.LOVABLE_API_KEY;
          if (!key) {
            return Response.json({ error: "IA não configurada" }, { status: 500 });
          }

          const {
            createLovableAiGatewayProvider,
            getLovableAiGatewayResponseHeaders,
            getLovableAiGatewayRunId,
          } = await import("@/lib/ai-gateway.server");
          const gateway = createLovableAiGatewayProvider(key, getLovableAiGatewayRunId(request));
          const result = await generateText({
            model: gateway("google/gemini-3-flash-preview"),
            system: `${SYSTEM_PROMPTS[tool]}
Responda em português do Brasil, com markdown limpo, direto ao ponto e pronto para copiar.
Nunca devolva texto genérico; entregue material utilizável imediatamente.`,
            prompt: auto
              ? `${AUTO_BRIEFS[tool]}\n\nModo automático: escolha detalhes bons sozinho e entregue o resultado final.`
              : input,
          });

          return Response.json(
            { text: result.text },
            { headers: getLovableAiGatewayResponseHeaders(result.response.headers) },
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Erro ao gerar";
          const lower = message.toLowerCase();
          if (lower.includes("rate") || lower.includes("429")) {
            return Response.json({ error: "Muitas requisições. Tente novamente em instantes." }, { status: 429 });
          }
          if (lower.includes("402") || lower.includes("credit")) {
            return Response.json({ error: "Créditos de IA esgotados. Adicione créditos no workspace." }, { status: 402 });
          }
          return Response.json({ error: message.slice(0, 240) }, { status: 500 });
        }
      },
    },
  },
});