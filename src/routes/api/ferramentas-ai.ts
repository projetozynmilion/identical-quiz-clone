import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

type ToolId = "names" | "titles" | "hashtags" | "competitor" | "script" | "bio" | "cta" | "ideas";

const GITHUB_MODELS = [
  // Microsoft Phi-4
  "microsoft/Phi-4-reasoning",
  "microsoft/Phi-4-multimodal-instruct",
  "microsoft/Phi-4-mini-reasoning",
  "microsoft/Phi-4-mini-instruct",
  "microsoft/Phi-4",
  // OpenAI GPT-5
  "openai/gpt-5",
  "openai/gpt-5-mini",
  "openai/gpt-5-nano",
  "openai/gpt-5-chat",
  // OpenAI GPT-4.1 / 4o
  "openai/gpt-4.1",
  "openai/gpt-4.1-mini",
  "openai/gpt-4.1-nano",
  "openai/gpt-4o",
  "openai/gpt-4o-mini",
  // OpenAI reasoning
  "openai/o4-mini",
  "openai/o3",
  "openai/o3-mini",
  "openai/o1",
  "openai/o1-mini",
  "openai/o1-preview",
  // Meta Llama
  "meta/Meta-Llama-3.1-8B-Instruct",
  "meta/Meta-Llama-3.1-405B-Instruct",
  "meta/Llama-3.3-70B-Instruct",
  "meta/Llama-3.2-90B-Vision-Instruct",
  "meta/Llama-3.2-11B-Vision-Instruct",
  "meta/Llama-4-Scout-17B-16E-Instruct",
  "meta/Llama-4-Maverick-17B-128E-Instruct-FP8",
  // Cohere
  "cohere/cohere-command-a",
  // Mistral
  "mistral-ai/mistral-small-2503",
  "mistral-ai/codestral-2501",
  "mistral-ai/mistral-medium-2505",
  "mistral-ai/ministral-3b",
  // DeepSeek
  "deepseek/DeepSeek-V3-0324",
  "deepseek/DeepSeek-R1-0528",
  "deepseek/DeepSeek-R1",
] as const;

const FALLBACK_CHAIN = [
  "openai/gpt-4.1-mini",
  "openai/gpt-4o-mini",
  "microsoft/Phi-4",
  "meta/Llama-3.3-70B-Instruct",
];

const ToolSchema = z.object({
  tool: z.enum(["names", "titles", "hashtags", "competitor", "script", "bio", "cta", "ideas"]),
  input: z.string().max(4000).optional().default(""),
  auto: z.boolean().optional().default(false),
  provider: z.enum(["lovable", "github"]).optional().default("lovable"),
  model: z.string().max(120).optional(),
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

          const { tool, auto, provider } = parsed.data;
          const input = parsed.data.input.trim();
          if (!auto && input.length < 2) {
            return Response.json({ error: "Informe mais detalhes ou use Gerar automático" }, { status: 400 });
          }

          const systemPrompt = `${SYSTEM_PROMPTS[tool]}
Responda em português do Brasil, com markdown limpo, direto ao ponto e pronto para copiar.
Nunca devolva texto genérico; entregue material utilizável imediatamente.`;
          const userPrompt = auto
            ? `${AUTO_BRIEFS[tool]}\n\nModo automático: escolha detalhes bons sozinho e entregue o resultado final.`
            : input;

          if (provider === "github") {
            const ghKey = process.env.GITHUB_MODELS_TOKEN;
            if (!ghKey) {
              return Response.json({ error: "GitHub Models não configurado" }, { status: 500 });
            }
            const requested = parsed.data.model && GITHUB_MODELS.includes(parsed.data.model as typeof GITHUB_MODELS[number])
              ? parsed.data.model
              : "microsoft/Phi-4-reasoning";
            const ghRes = await fetch("https://models.github.ai/inference/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ghKey}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                model: requested,
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: userPrompt },
                ],
                temperature: 0.9,
              }),
            });
            if (!ghRes.ok) {
              const body = await ghRes.text();
              if (ghRes.status === 429) {
                return Response.json({ error: "GitHub Models: limite atingido. Tente novamente em instantes." }, { status: 429 });
              }
              if (ghRes.status === 401 || ghRes.status === 403) {
                return Response.json({ error: "Token do GitHub Models inválido ou sem acesso." }, { status: 401 });
              }
              return Response.json({ error: `GitHub Models: ${body.slice(0, 200)}` }, { status: ghRes.status });
            }
            const data = await ghRes.json();
            const text = data?.choices?.[0]?.message?.content ?? "";
            return Response.json({ text, provider: "github", model: requested });
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
          const { generateText } = await import("ai");
          const gateway = createLovableAiGatewayProvider(key, getLovableAiGatewayRunId(request));
          const result = await generateText({
            model: gateway("google/gemini-3-flash-preview"),
            system: systemPrompt,
            prompt: userPrompt,
          });

          return Response.json(
            { text: result.text, provider: "lovable", model: "google/gemini-3-flash-preview" },
            { headers: getLovableAiGatewayResponseHeaders(result.response.headers) },
          );

        } catch (err) {
          const message = err instanceof Error ? err.message : "Erro ao gerar";
          const lower = message.toLowerCase();
          if (lower.includes("rate") || lower.includes("429")) {
            return Response.json({ error: "Muitas requisições. Tente novamente em instantes." }, { status: 429 });
          }
          if (lower.includes("402") || lower.includes("credit") || lower.includes("payment required")) {
            return Response.json({ error: "Créditos de IA esgotados. Adicione créditos no workspace." }, { status: 402 });
          }
          return Response.json({ error: message.slice(0, 240) }, { status: 500 });
        }
      },
    },
  },
});