import { createFileRoute } from "@tanstack/react-router";

type ToolId =
  | "names"
  | "titles"
  | "hashtags"
  | "competitor"
  | "script"
  | "bio"
  | "cta"
  | "ideas";

const SYSTEM_PROMPTS: Record<ToolId, string> = {
  names: `Você é um especialista em criar nomes de influenciadoras brasileiras virais para o nicho UGC e Instagram/TikTok.
Gere 10 sugestões de nomes (nome + sobrenome) brasileiros, modernos, atrativos e que combinem com o nicho descrito pelo usuário.
Evite nomes batidos demais (ex: Maria Júlia, Ana Clara, João Pedro). Prefira combinações modernas, fofas, sensuais ou marcantes conforme o nicho.
Para cada nome, em uma linha curta, justifique por que ele funciona.
Formato em markdown, lista numerada.`,

  titles: `Você é um copywriter especialista em títulos virais para TikTok, Reels e Shorts, focado em vendas e conversão.
Gere 10 títulos curtos (máximo 80 caracteres) para o vídeo/produto descrito.
Use ganchos comprovados: "POV:", "Ninguém te conta que...", "Eu não acreditei até...", "Faz isso AGORA antes...", "Por que ninguém comprou...", curiosidade, urgência, prova social.
Misture estilos. Inclua emojis quando fizer sentido.
Formato markdown, lista numerada.`,

  hashtags: `Você é especialista em viralização no TikTok e Instagram. Gere conjuntos de hashtags em alta para o nicho/vídeo descrito.
Retorne 3 blocos:
1. **Hashtags virais (alto volume)** — 10 hashtags grandes e atuais
2. **Hashtags de nicho (médio volume)** — 10 hashtags específicas do nicho
3. **Hashtags de cauda longa (conversão)** — 10 hashtags específicas que convertem
Cada bloco em uma única linha pronta para copiar (com #).
Formato markdown.`,

  competitor: `Você é um analista de concorrência para criadores de conteúdo UGC e influencers virtuais.
O usuário vai te enviar: link do perfil do concorrente, descrição de prints, vídeos e estilo do concorrente.
Sua tarefa:
1. Analisar o padrão de conteúdo (gancho, estrutura, CTA, edição, estética).
2. Identificar o que está funcionando (porque viralizou / converte).
3. Criar um ROTEIRO PRONTO PARA REPLICAR (com gancho, desenvolvimento e CTA) que o usuário possa gravar imediatamente, adaptado para a influencer dele.
4. Dar 3 variações do mesmo roteiro.
Formato em markdown bem estruturado com títulos e bullets.`,

  script: `Você é roteirista de UGC viral para TikTok/Reels. Gere um roteiro de 15-30 segundos para o produto/tema descrito.
Estrutura obrigatória:
- **Gancho (0-3s):** frase de impacto
- **Desenvolvimento (3-20s):** demonstração/storytelling
- **CTA (20-30s):** chamada para ação clara
Inclua também: sugestão de cenário, expressão facial, b-roll e legenda do vídeo.
Formato markdown.`,

  bio: `Você é especialista em bios de Instagram que convertem para influencers UGC.
Gere 5 opções de bio (máx 150 caracteres cada) para o perfil descrito.
Cada bio deve ter: posicionamento + benefício + chamada/CTA + emojis estratégicos.
Inclua também sugestão de "nome de exibição" e um destaque para o link.
Formato markdown numerado.`,

  cta: `Você é copywriter de conversão. Gere 10 CTAs (chamadas para ação) curtas e poderosas para o produto/oferta descrita.
Misture estilos: urgência, escassez, curiosidade, prova social, garantia.
Cada CTA com no máximo 12 palavras.
Formato markdown numerado.`,

  ideas: `Você é estrategista de conteúdo para influencers UGC. Gere 10 ideias de vídeos virais para o nicho descrito.
Cada ideia deve ter:
- **Título do vídeo**
- **Gancho inicial (0-3s)**
- **Por que vai viralizar**
Formato markdown numerado.`,
};

export const Route = createFileRoute("/api/ferramentas-ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { tool, input } = (await request.json()) as {
            tool: ToolId;
            input: string;
          };

          if (!tool || !SYSTEM_PROMPTS[tool]) {
            return new Response(JSON.stringify({ error: "Ferramenta inválida" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          if (!input || input.trim().length < 2) {
            return new Response(JSON.stringify({ error: "Informe mais detalhes" }), {
              status: 400,
              headers: { "content-type": "application/json" },
            });
          }

          const key = process.env.LOVABLE_API_KEY;
          if (!key) {
            return new Response(JSON.stringify({ error: "AI não configurada" }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }

          const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": key,
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              messages: [
                { role: "system", content: SYSTEM_PROMPTS[tool] },
                { role: "user", content: input.trim().slice(0, 4000) },
              ],
            }),
          });

          if (res.status === 429) {
            return new Response(
              JSON.stringify({ error: "Muitas requisições. Tente novamente em instantes." }),
              { status: 429, headers: { "content-type": "application/json" } },
            );
          }
          if (res.status === 402) {
            return new Response(
              JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos no workspace." }),
              { status: 402, headers: { "content-type": "application/json" } },
            );
          }
          if (!res.ok) {
            const errText = await res.text();
            return new Response(JSON.stringify({ error: `Erro IA: ${errText.slice(0, 200)}` }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }

          const data = (await res.json()) as {
            choices?: { message?: { content?: string } }[];
          };
          const text = data.choices?.[0]?.message?.content ?? "";

          return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err instanceof Error ? err.message : "Erro" }),
            { status: 500, headers: { "content-type": "application/json" } },
          );
        }
      },
    },
  },
});
