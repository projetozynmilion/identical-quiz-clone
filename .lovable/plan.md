## Objetivo

Tornar **tudo** que hoje está fixo no código editável diretamente pelo painel Admin do dashboard, para você não precisar mais pedir no chat. Cada seção vira CRUD com upload de vídeo/imagem, posição, ativar/desativar.

## O que já é editável hoje (mantenho)
- **Módulos** (Originais / Em alta / Mentoria Top 10) — `AdminModulesPanel`
- **Radar TikShop** — `AdminRadarPanel`

## O que vou tornar editável (novo)

### 1. Prompts (aba "Prompts")
Hoje 7 prompts fixos com vídeos `.mp4` importados via JSON.
- Nova tabela `prompts` (id, category, title, subtitle, prompt_text, video_url, position, is_active)
- Nova tabela `prompt_categories` (id, label, description, position)
- CRUD no admin: criar/editar/excluir prompt e categoria, **upload de vídeo MP4** direto (bucket `prompt-videos`), reorganizar posição.
- `PromptsTab` passa a ler do Supabase em vez de array fixo.

### 2. Bônus / Ferramentas IA (aba "Ferramentas")
Cards de bônus hoje hardcoded (GROK AÍ, etc.).
- Nova tabela `bonuses` (id, title, subtitle, description, icon, banner_url, action_type, action_payload, position, is_active)
  - `action_type`: `link` (abre URL) | `credentials` (abre modal copy/paste com login+senha embaçados) | `module` (abre módulo)
  - `action_payload` JSON: `{ url }` ou `{ email, password, warning }` ou `{ module_id }`
- CRUD admin com upload de banner e edição de credenciais (GROK fica como linha editável: email/senha/aviso).

### 3. Banner principal / Hero
Banner "Fábrica de UGC" hoje vem de asset fixo.
- Nova tabela `site_settings` (chave-valor JSON): `hero_banner_url`, `hero_title`, `hero_cta_url`, vídeos de fundo dos membros, link do FLOW iframe, link do botão de compra.
- Painel admin "Configurações gerais" com formulário simples.

### 4. Vídeos da área de membros
Vídeo `bg-members.mp4`, `CRIA.mp4` e afins (fundos animados) viram campos em `site_settings` com upload.

### 5. Categorias de prompts e ordenação
Drag handles simples (setas ↑↓) para reordenar prompts, categorias, bônus e módulos sem precisar editar `position` manualmente.

## Estrutura técnica

### Migrações SQL
- `prompts`, `prompt_categories`, `bonuses`, `site_settings` — todas com:
  - `GRANT SELECT` para `anon` + `authenticated` (conteúdo público para membros logados)
  - `GRANT ALL` para `service_role`
  - `GRANT INSERT/UPDATE/DELETE` para `authenticated` filtrado por `has_role(auth.uid(),'admin')`
  - RLS ativada com policies: leitura pra todos autenticados, escrita só admin.

### Storage
- Bucket `prompt-videos` (privado, URLs assinadas longas — mesmo padrão do `banners`).
- Bucket `bonus-banners`.
- Bucket `site-media` (vídeos de fundo, hero etc.).

### Componentes
- Refatorar painel admin em abas internas: **Módulos | Radar | Prompts | Bônus | Configurações**.
- Novo arquivo: `src/components/admin/AdminPromptsPanel.tsx`
- Novo arquivo: `src/components/admin/AdminBonusesPanel.tsx`
- Novo arquivo: `src/components/admin/AdminSettingsPanel.tsx`
- Novo arquivo: `src/components/admin/AdminTabs.tsx` (wrapper com tabs)
- `PromptsTab.tsx` reescrito para consumir `prompts` + `prompt_categories` do banco.
- Seção "Em alta" continua puxando da tabela `modules`; lógica do GROK passa a checar `action_type === 'credentials'` em `bonuses` em vez de regex no título.

### Hooks utilitários
- `useSiteSettings()` — cache leve em React Query, expõe valores chave-valor para o app inteiro.

## O que NÃO entra (deixo explícito)
- Não vou tornar editável: cores do tema, estrutura de rotas, conteúdo do FLOW iframe externo, texto institucional da landing pública (`index.tsx`) — só conteúdo da área de membros.
- Se quiser que o painel também controle landing pública, me avisa que adiciono numa segunda leva.

## Pós-implementação
Depois que aprovar, eu rodo as migrações, crio os buckets, faço o seed migrando o conteúdo fixo atual (prompts, GROK, banners) para as novas tabelas — então **nada some** da tela, só passa a ser editável por você no painel.
