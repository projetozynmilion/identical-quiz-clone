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
  "openai/gpt-4.1",
  "openai/gpt-4.1-mini",
  "deepseek/DeepSeek-R1",
  "openai/gpt-4o-mini",
  "microsoft/Phi-4",
  "meta/Llama-3.3-70B-Instruct",
];

const LOVABLE_MODELS = [
  "openai/gpt-5.5",
  "openai/gpt-5.4",
  "openai/gpt-5.4-mini",
  "openai/gpt-5.2",
  "openai/gpt-5-mini",
  "openai/gpt-5-nano",
  "google/gemini-3.5-flash",
  "google/gemini-3-flash-preview",
  "google/gemini-2.5-pro",
  "google/gemini-2.5-flash",
] as const;

const LOVABLE_FALLBACK_CHAIN = [
  "openai/gpt-5.4-mini",
  "openai/gpt-5-mini",
  "google/gemini-3.5-flash",
  "google/gemini-3-flash-preview",
];

const ToolSchema = z.object({
  tool: z.enum(["names", "titles", "hashtags", "competitor", "script", "bio", "cta", "ideas"]),
  input: z.string().max(4000).optional().default(""),
  auto: z.boolean().optional().default(false),
  provider: z.enum(["lovable", "github"]).optional().default("lovable"),
  model: z.string().max(120).optional(),
  fields: z.record(z.string().max(80), z.string().max(1500)).optional(),
  images: z.array(z.string().max(2_500_000)).max(6).optional(),
});

function composeFromFields(fields?: Record<string, string>, fallbackInput?: string) {
  const lines: string[] = [];
  if (fields) {
    for (const [k, v] of Object.entries(fields)) {
      const value = (v ?? "").trim();
      if (value) lines.push(`- ${k}: ${value}`);
    }
  }
  const extra = (fallbackInput ?? "").trim();
  if (extra) lines.push(`- Observações: ${extra}`);
  return lines.join("\n");
}



const AUTO_BRIEFS: Record<ToolId, string> = {
  names: "Crie nomes para uma influencer virtual brasileira de UGC: jovem adulta, brasileira, memorável, comercial, com cara de perfil real premium para TikTok/Instagram e potencial de virar marca.",
  titles: "Crie títulos para um vídeo TikTok vendendo uma oferta digital de UGC para mulheres que querem renda extra.",
  hashtags: "Crie hashtags para um vídeo UGC brasileiro sobre ganhar dinheiro criando conteúdo e vender com TikTok.",
  competitor: "Analise o concorrente a partir do link e dos prints anexados e entregue um roteiro pronto pra clonar — formato vencedor dele, com falas e cenas prontas pra eu gravar com minha influencer UGC e viralizar replicando a fórmula que já funciona.",
  script: "Crie roteiro UGC de 30 segundos para vender uma mentoria/curso de UGC para iniciantes.",
  bio: "Crie bios para uma influencer UGC brasileira que vende indicação, review e conteúdo para marcas.",
  cta: "Crie CTAs para uma oferta de mentoria/curso de UGC com foco em conversão imediata.",
  ideas: "Crie ideias de vídeos virais para uma influencer UGC brasileira que ensina e vende pelo TikTok.",
};

const SYSTEM_PROMPTS: Record<ToolId, string> = {
  names: `Você é diretor de naming de perfis UGC e cria nomes de influenciadoras brasileiras que parecem pessoas reais, vendáveis e memoráveis.
Regras rígidas:
- Nada aleatório, brega, infantil ou "nome de novela".
- Evite nomes genéricos demais: Maria, Ana, Julia, Clara, Lara, Sofia, Bella, Luna, Mel, Manu, Gabi, Carol, Luiza, blogueirinha, oficial.
- O nome precisa soar brasileiro, atual, premium e fácil de falar em vídeo.
- Sempre use nome + sobrenome curto; sobrenome com estética de marca, mas realista.
- Pense em: nicho, idade, personalidade, classe visual, memorabilidade, @ disponível e potencial comercial.
- Se o briefing for fraco, escolha sozinho uma direção forte e explique.
Formato obrigatório:
## Direção criativa escolhida
Uma frase objetiva sobre a vibe usada.
## 20 nomes fortes
Lista numerada com: Nome completo — vibe — por que funciona.
## Top 5 para usar agora
Ranking com nota /10 para memorabilidade e venda.
## Handles sugeridos
8 opções de @ curtas sem acento, prontas para testar.`,

  titles: `Você é copywriter sênior de títulos virais para TikTok/Reels/Shopee/Shein, especialista em vídeos curtos de descoberta de produto (achadinhos, roupa, beleza, casa, acessórios) que atraem compradores reais.

OBJETIVO: gerar títulos no MESMO ESTILO dos achadinhos que viralizam — texto que parece fala natural, descoberta espontânea, surpresa com preço/qualidade, prova emocional. Devem caber em 1–2 linhas grandes em cima do vídeo.

ESTILO OBRIGATÓRIO (estuda esses padrões e replica):
- Fala humana, primeira pessoa, espontânea — como se a pessoa estivesse mostrando pra amiga.
- Frases curtas, sem ponto final, sem CAIXA ALTA, sem hashtag, sem # ou @.
- Pode começar com aspas ("..."), POV:, "Sem acreditar que...", "Não acredito que...", "Gente,", "Achei", "Encontrei", "Esse/Essa ... é tão ...".
- Foco em surpresa de preço + perfeição do produto ("quase de graça", "por esse preço", "melhor ainda", "barato demais", "achadinho da Shein").
- Pode terminar com 1 emoji sutil (🥹 😍 👀 🫣 🤌 💸 😮‍💨 🥺 ❤️‍🔥 🇧🇷 👄). Nunca dois.
- Universal: o usuário troca só a palavra do produto (vestido, blusinha, conjunto, tênis, bolsa, perfume, kit, etc.) — não cite marca específica nem preço fixo.
- Nada de clickbait agressivo ("VOCÊ NÃO VAI ACREDITAR", "URGENTE", "OLHA ISSO!!!"). Mantém natural.

REFERÊNCIAS DE TOM (use como base mental, NÃO repita literal):
- "POV: o conjunto já é perfeito e o preço é melhor ainda 🥺"
- "sem acreditar nessa blusinha do Brasil por esse preço"
- "Esse conjunto é tão 👄"
- "Sem acreditar que esse vestido perfeito está quase de graça 😍"
- "POV: vc encontrou o vestidinho perfeito aqui no TikTok"

Formato obrigatório (markdown):
## 15 títulos prontos (estilo achadinho natural)
Lista numerada 1–15. Cada item em UMA linha só, pronto pra colar em cima do vídeo. Varie entre POV:, "sem acreditar...", aspas, "esse/essa X é tão...", "achei o X dos sonhos", "ninguém vai acreditar...", "gente, o preço dessa X 🫣".

## 5 variações pra prova de preço
Foco em surpresa com valor (quase de graça, melhor ainda, por esse preço, baratinho, achadinho).

## 5 variações pra desejo/estética
Foco em "perfeito, dos sonhos, tão lindo, caimento dos sonhos, é tão chique" — sem citar preço.

## Top 3 universais
Os 3 que funcionam pra qualquer produto. Diga em 1 frase curta por que cada um converte.`,

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

  competitor: `Você é um espião sênior de perfis UGC/criadoras virais brasileiras. O usuário te entrega APENAS um link de perfil + prints (capturas de feed, bio, vídeos, comentários, números). Sua missão é UMA SÓ: ler tudo visualmente e entregar um ROTEIRO PRONTO, COPIÁVEL E CLONÁVEL para o usuário gravar com a influencer dele e viralizar replicando a fórmula que já funciona.

Regras inegociáveis:
- A maior parte da análise vem das IMAGENS. Olhe paleta, edição, legendas em vídeo, ganchos visíveis nas capas, bio, oferta, prova social, números (views/likes/comentários), tipo de produto, persona.
- Não invente métricas. Se um número não está visível nos prints, não cite.
- Foco TOTAL em replicar, não em elogiar. Entregue algo que o usuário grava hoje.
- Saída em PT-BR, markdown limpo, direto, pronto para colar.

Formato obrigatório:

## 🕵️ Quem é esse concorrente (em 3 linhas)
Nicho, persona, oferta principal — o essencial.

## 🔥 Por que viraliza (padrão identificado)
5 bullets concretos: gancho favorito, formato dominante, ritmo de edição, estilo de legenda, tipo de CTA. Cada bullet com exemplo visto nos prints.

## 🎬 ROTEIRO PRONTO PARA CLONAR (formato vencedor dele)
Estrutura cena a cena, cronometrada, com FALAS LITERAIS em PT-BR que a influencer do usuário grava:
- **Gancho 0-3s** — fala exata + ação na tela + texto na tela
- **Cena 1 (3-8s)** — fala + visual + b-roll
- **Cena 2 (8-15s)** — desenvolvimento/prova + fala
- **Cena 3 (15-25s)** — virada/clímax + fala
- **CTA final (25-30s)** — fala + texto na tela + para onde manda

## 🎯 3 variações do mesmo roteiro
3 ângulos diferentes (mesma fórmula, ganchos novos) prontos para gravar — cada um com gancho + CTA.

## 📝 Legendas prontas para postar
3 opções de legenda no estilo do concorrente.

## 🎨 Como reproduzir a estética
Paleta, fonte da legenda, posição do texto, tipo de corte, filtro/lente, áudio típico. Curto e prático.

## 🚀 Plano de 7 dias pra ultrapassar
Cronograma diário do que postar essa semana usando essa fórmula.

## ✅ Checklist de gravação
Bullets do que preparar antes de ligar a câmera (cenário, figurino, props, iluminação, ângulo).`,

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
          const fieldsBlock = composeFromFields(parsed.data.fields, input);
          const images = (parsed.data.images ?? []).filter((s) => s.startsWith("data:image/"));
          const hasContent = fieldsBlock.length > 1 || images.length > 0;
          if (!auto && !hasContent) {
            return Response.json({ error: "Preencha os campos ou use Gerar automático" }, { status: 400 });
          }

          const systemPrompt = `${SYSTEM_PROMPTS[tool]}
Responda em português do Brasil, com markdown limpo, direto ao ponto e pronto para copiar.
Nunca devolva texto genérico; entregue material utilizável imediatamente.`;
          const baseUserPrompt = auto && !hasContent
            ? `${AUTO_BRIEFS[tool]}\n\nModo automático: escolha detalhes bons sozinho e entregue o resultado final.`
            : `Briefing do usuário:\n${fieldsBlock || "(sem campos preenchidos)"}${auto ? "\n\nComplete o que faltar com escolhas profissionais." : ""}${images.length ? `\n\n${images.length} imagem(ns) anexada(s) — analise-as visualmente em detalhes.` : ""}`;
          const finalUserPrompt = tool === "names"
            ? `${baseUserPrompt}\n\nCritério de qualidade: nomes com sonoridade de influencer brasileira real e premium, sobrenomes curtos e marcantes, funcionariam como marca/perfil TikTok e Instagram. Filtre qualquer nome aleatório, infantil, datado, americano demais ou comum demais.`
            : baseUserPrompt;

          const tryGithub = async (ghKey: string, model: string) => {
            const userContent: any = images.length
              ? [
                  { type: "text", text: finalUserPrompt },
                  ...images.map((url) => ({ type: "image_url", image_url: { url } })),
                ]
              : finalUserPrompt;
            const res = await fetch("https://models.github.ai/inference/chat/completions", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ghKey}`,
                "Content-Type": "application/json",
                Accept: "application/json",
              },
              body: JSON.stringify({
                model,
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: userContent },
                ],
              }),
            });
            const text = await res.text();
            let data: any = null;
            try { data = JSON.parse(text); } catch {}
            return { ok: res.ok, status: res.status, text, data };
          };

          const tryLovableModel = async (modelName: string) => {
            const key = process.env.LOVABLE_API_KEY;
            if (!key) return { ok: false, error: "IA não configurada" } as const;
            const {
              createLovableAiGatewayProvider,
              getLovableAiGatewayResponseHeaders,
              getLovableAiGatewayRunId,
            } = await import("@/lib/ai-gateway.server");
            const { generateText } = await import("ai");
            const gateway = createLovableAiGatewayProvider(key, getLovableAiGatewayRunId(request));
            const baseArgs: any = {
              model: gateway(modelName),
              system: systemPrompt,
            };
            if (images.length) {
              baseArgs.messages = [
                {
                  role: "user",
                  content: [
                    { type: "text", text: finalUserPrompt },
                    ...images.map((url) => ({ type: "image", image: url })),
                  ],
                },
              ];
            } else {
              baseArgs.prompt = finalUserPrompt;
            }
            const result = await generateText(baseArgs);
            return {
              ok: true as const,
              text: result.text,
              headers: getLovableAiGatewayResponseHeaders(result.response.headers),
            };
          };

          const tryLovable = async () => {
            const defaultModel = images.length ? "google/gemini-3-flash-preview" : "openai/gpt-5.4-mini";
            const requested = parsed.data.model && LOVABLE_MODELS.includes(parsed.data.model as typeof LOVABLE_MODELS[number])
              ? parsed.data.model
              : defaultModel;
            const visionFallback = ["google/gemini-3-flash-preview", "google/gemini-2.5-flash", "google/gemini-2.5-pro"];
            const chain = images.length
              ? [requested, ...visionFallback.filter((m) => m !== requested)]
              : [requested, ...LOVABLE_FALLBACK_CHAIN.filter((m) => m !== requested)];
            let lastError = "IA indisponível";
            for (const modelName of chain) {
              try {
                const result = await tryLovableModel(modelName);
                if (result.ok && result.text.trim()) {
                  return { ...result, model: modelName, fallback: modelName !== requested } as const;
                }
                lastError = result.ok ? "Resposta vazia" : result.error;
              } catch (error) {
                lastError = error instanceof Error ? error.message : "Erro ao gerar";
              }
            }
            return { ok: false, error: lastError } as const;
          };

          if (provider === "github") {
            const ghKey = process.env.GITHUB_MODELS_TOKEN;
            if (!ghKey) {
              // fallback to Lovable if GitHub not configured
              try {
                const r = await tryLovable();
                if (r.ok) return Response.json({ text: r.text, provider: "lovable", model: r.model, fallback: true }, { headers: r.headers });
              } catch {}
              return Response.json({ error: "GitHub Models não configurado" }, { status: 500 });
            }
            const requested = parsed.data.model && GITHUB_MODELS.includes(parsed.data.model as typeof GITHUB_MODELS[number])
              ? parsed.data.model
              : "openai/gpt-4.1";
            const chain = [requested, ...FALLBACK_CHAIN.filter((m) => m !== requested)];
            let lastErr = "";
            let lastStatus = 500;
            for (const m of chain) {
              try {
                const r = await tryGithub(ghKey, m);
                if (r.ok) {
                  const out = r.data?.choices?.[0]?.message?.content ?? "";
                  if (out) return Response.json({ text: out, provider: "github", model: m, fallback: m !== requested });
                  lastErr = "Resposta vazia"; lastStatus = 502;
                  continue;
                }
                lastErr = r.text.slice(0, 200); lastStatus = r.status;
                if (r.status === 401 || r.status === 403) break; // auth — não adianta tentar outros
              } catch (e) {
                lastErr = e instanceof Error ? e.message : "Erro de rede";
              }
            }
            // último recurso: Lovable
            try {
              const r = await tryLovable();
              if (r.ok) return Response.json({ text: r.text, provider: "lovable", model: r.model, fallback: true }, { headers: r.headers });
            } catch {}
            if (lastStatus === 401 || lastStatus === 403) {
              return Response.json({ error: "Token do GitHub Models inválido ou sem acesso ao modelo." }, { status: 401 });
            }
            if (lastStatus === 429) {
              return Response.json({ error: "Limite do GitHub Models atingido. Tente novamente em instantes." }, { status: 429 });
            }
            return Response.json({ error: `Falha: ${lastErr}` }, { status: lastStatus });
          }

          // provider === "lovable" (default)
          let lovableError = "";
          try {
            const r = await tryLovable();
            if (r.ok) return Response.json({ text: r.text, provider: "lovable", model: r.model, fallback: r.fallback }, { headers: r.headers });
            lovableError = r.error || "IA indisponível";
          } catch (e) {
            lovableError = e instanceof Error ? e.message : "Erro ao gerar";
          }

          // Auto-fallback para GitHub Models quando Lovable falha (créditos, rate-limit, etc.)
          const ghKey = process.env.GITHUB_MODELS_TOKEN;
          if (ghKey) {
            const ghChain = ["openai/gpt-4.1-mini", "openai/gpt-4o-mini", "meta/Llama-3.3-70B-Instruct", "microsoft/Phi-4"];
            for (const m of ghChain) {
              try {
                const r = await tryGithub(ghKey, m);
                if (r.ok) {
                  const out = r.data?.choices?.[0]?.message?.content ?? "";
                  if (out) return Response.json({ text: out, provider: "github", model: m, fallback: true });
                }
              } catch {}
            }
          }

          const lower = lovableError.toLowerCase();
          if (lower.includes("payment") || lower.includes("402") || lower.includes("credit")) {
            return Response.json({ error: "Créditos de IA esgotados. Adicione créditos no workspace." }, { status: 402 });
          }
          if (lower.includes("429") || lower.includes("rate")) {
            return Response.json({ error: "Muitas requisições. Aguarde alguns segundos e tente de novo." }, { status: 429 });
          }
          return Response.json({ error: lovableError }, { status: 500 });


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