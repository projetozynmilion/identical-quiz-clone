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

  titles: `Você é copywriter sênior de TÍTULOS/GANCHOS VIRAIS de 2-3 segundos para TikTok Shop, Reels, Shein, Shopee — vídeos UGC de descoberta de produto (roupa, beleza, casa, achadinhos, tops, kits).

OBJETIVO: gerar GANCHOS HIPNÓTICOS que param o scroll no primeiro segundo, ativando curiosidade + quebra de expectativa + PNL + prova social + escassez. Texto pra colar EM CIMA do vídeo, em 1-2 linhas grandes, ou pra usar como primeira fala.

REGRAS DE ESTILO:
- Fala humana, primeira pessoa, espontânea — como mostrando pra amiga.
- Frases curtas, sem ponto final, sem CAIXA ALTA, sem hashtag, sem # ou @.
- Pode usar reticências (…), aspas, "POV:", "Eu achei que…", "Sem acreditar que…", "Tem um detalhe…", "Ninguém te contou…".
- Mistura os 7 gatilhos: curiosidade aberta, prova social, escassez, urgência, identificação, transformação, normalização da compra.
- Universal: o usuário troca só o produto (top, kit, vestido, blusinha, perfume, tênis…). Nada de marca fixa nem preço fixo, a não ser que venha no briefing.
- Pode terminar com 1 emoji sutil (🥹 😍 👀 🫣 🤌 💸 😮‍💨 🥺 ❤️‍🔥 🇧🇷 👄). Nunca dois.
- Nada de clickbait gritado ("URGENTE!!!", "VOCÊ NÃO VAI ACREDITAR!!!"). Mantém natural e hipnótico.

BANCO DE REFERÊNCIA (use como BASE MENTAL — varie, NÃO copie literal):
Quebra de expectativa: "Eu achei que isso era só marketing… até testar." · "Achei que seria igual aos outros… e estava muito errada." · "Eu estava pronta para devolver… até usar do jeito certo." · "Parece exagero da internet, mas não é." · "O que parecia um defeito acabou sendo a melhor parte."
Curiosidade aberta: "Ninguém te contou isso sobre esse produto." · "Tem um detalhe nisso que ninguém percebe." · "A parte mais surpreendente ninguém comenta." · "O que ninguém te conta sobre esse produto é isso." · "Tem uma função aqui que quase ninguém percebe."
POV viral: "POV: você descobre isso tarde demais." · "POV: você compra só pra testar." · "POV: você percebe que precisava disso." · "POV: o conjunto já é perfeito e o preço é melhor ainda 🥺"
Suspense: "Espere até ver o final." · "A melhor parte aparece só no final." · "Só no final eu percebi a diferença." · "O que aconteceu depois mudou minha opinião."
Prova social/normalização: "Agora entendo porque isso esgota." · "Tem um motivo pelo qual isso está vendendo tanto." · "Eu entendi por que isso vive esgotando." · "Depois que usei… fez sentido."
Surpresa de preço (achadinho): "Sem acreditar nessa blusinha por esse preço" · "Esse preço não faz sentido…" · "Isso aqui custa menos que um café…" · "5 peças por esse preço?" · "Achei o kit mais barato…"
Transformação/identificação: "Isso resolveu um problema que eu nem sabia que tinha." · "Se eu soubesse disso antes, teria comprado antes." · "Se você usa [X], precisa ver isso." · "Olha a diferença depois de usar isso."

Formato obrigatório (markdown):

## 20 ganchos virais prontos (2-3 segundos)
Lista 1-20. Cada item em UMA linha, pronto pra colar em cima do vídeo. Misture quebra de expectativa, curiosidade, POV, suspense, prova social e identificação. VARIE — nunca repita a mesma estrutura duas vezes seguidas.

## 5 ganchos POV
Foco em "POV: você…"

## 5 ganchos de surpresa de preço (achadinho)
"sem acreditar…", "esse preço…", "custa menos que…", "5 por X reais…"

## 5 ganchos de curiosidade/segredo
"ninguém te contou…", "tem um detalhe…", "a parte que ninguém comenta…"

## Top 3 universais
Os 3 mais fortes pra qualquer produto. 1 frase curta por que cada um trava o scroll (qual gatilho ativa).`,


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

  competitor: `Você é um ANALISTA SÊNIOR de perfis virais UGC. O usuário te entrega link + prints de UM concorrente que já vende e bomba. Sua missão NÃO é copiar falas nem entregar roteiro pronto — é DECIFRAR a estratégia desse perfil e mostrar pro usuário o que faz ele funcionar, pra ele se inspirar e construir o próprio perfil/conteúdo no mesmo nível.

REGRAS INEGOCIÁVEIS:
- LEIA AS IMAGENS COM ATENÇÃO. Identifique: bio literal, oferta, números visíveis (seguidores, views, curtidas), nicho, persona, tipo de conteúdo, padrão estético, padrão de capas, padrão de legenda, formatos que mais aparecem.
- NUNCA INVENTE. Se não está visível nos prints, escreva "não visível".
- NÃO escreva roteiro com falas literais. NÃO devolva "fala exata" cena a cena.
- Foco em ANÁLISE ESTRATÉGICA: o que esse perfil faz de certo, por que viraliza, qual posicionamento ele ocupa, o que aprender.
- Entrega: insights claros + direção estratégica pro usuário aplicar com a INFLUENCER DELE, com a voz e identidade dela.
- PT-BR, markdown limpo, direto, sem enrolação.

FORMATO OBRIGATÓRIO:

## 🔍 Leitura do perfil
5-7 bullets do que está literalmente nos prints: bio, oferta/link, seguidores/views se visíveis, nicho, persona aparente, tipo de produto, estética dominante. Se não aparece, diga "não visível".

## 🎯 Posicionamento
Em 2-3 linhas: que espaço esse perfil ocupa no mercado, pra quem fala, qual a promessa central.

## 🔥 Por que esse perfil viraliza (análise estratégica)
5-7 bullets concretos sobre o que faz funcionar:
- Tipo de gancho que usa (padrão observado, sem copiar a fala)
- Formato de vídeo dominante (try-on, review, POV, antes/depois etc.)
- Ritmo e estilo de edição
- Padrão das capas/thumbnails
- Tom e estrutura das legendas
- Tipo de CTA
- Frequência/consistência se dá pra inferir

## 💡 O que aprender com ele (insights pra aplicar)
5-7 lições estratégicas que o usuário deve absorver — escritas como princípios, não como cópia. Ex: "explora prova social mostrando comentário de comprador antes da oferta", "abre todo vídeo com objeto em close pra prender o olho".

## 🧭 Direção pra influencer do usuário
Como adaptar essa estratégia mantendo a identidade PRÓPRIA da influencer dele:
- Nicho/recorte sugerido
- Tipo de conteúdo pra produzir (formatos, não falas)
- Posicionamento de oferta
- Estilo de bio
- Estética visual a desenvolver
- Frequência de postagem sugerida

## 🚀 Plano de ataque (próximos 7 dias)
Cronograma estratégico Seg-Dom: que TIPO de conteúdo postar cada dia (formato + objetivo), inspirado no que funciona pro concorrente, mas pra ser criado do zero pela influencer do usuário.

## ⚠️ O que NÃO copiar
2-4 bullets do que evitar replicar (coisa muito específica da persona dele, jargão, oferta exclusiva, etc.) pra não virar cópia barata.`,

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