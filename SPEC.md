# HookHub — Especificação Técnica

**Projeto:** HookHub — Claude Code Event Hook Dashboard
**Versão:** 0.1.0
**Data:** 2026-03-31
**Autor:** maradantaspereira-eng

---

## 1. Visão Geral

O **HookHub** é um dashboard web para visualização e monitoramento dos hooks de eventos do [Claude Code](https://github.com/anthropics/claude-code). Ele lista os hooks registrados no projeto, exibe seus metadados (evento, categoria, linguagem, status, tags) e oferece filtros de busca para facilitar a descoberta e inspeção rápida dos hooks disponíveis.

O produto é inteiramente estático no lado do cliente — nenhum servidor de API é necessário para a operação normal. Os dados são carregados a partir de um arquivo JSON em tempo de build.

---

## 2. Objetivos

| # | Objetivo |
|---|----------|
| 1 | Oferecer visibilidade centralizada de todos os hooks configurados no projeto |
| 2 | Permitir filtragem por categoria e busca por nome, evento, descrição ou tag |
| 3 | Apresentar o status (ativo / inativo) de cada hook em tempo real de leitura |
| 4 | Ser acessível conforme as diretrizes WCAG 2.1 nível AA |
| 5 | Carregar e renderizar instantaneamente em conexões de baixa latência |

---

## 3. Escopo

### 3.1 Dentro do escopo

- Página única (SPA) de listagem de hooks
- Filtro por categoria via botões de toggle
- Campo de busca textual com debounce
- Exibição de cards com metadados completos de cada hook
- Link direto para o código-fonte de cada hook no GitHub
- Indicador de contagem de hooks ativos
- Acessibilidade: navegação por teclado, suporte a leitores de tela, link "pular para o conteúdo"

### 3.2 Fora do escopo (v0.1.0)

- Autenticação ou controle de acesso
- Criação, edição ou remoção de hooks pela interface
- Execução ou acionamento de hooks via dashboard
- Backend em tempo real (WebSockets, SSE)
- Internacionalização (i18n)

---

## 4. Arquitetura

### 4.1 Stack tecnológica

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router) | ^16.2.1 |
| Linguagem | TypeScript | ^5 |
| Estilização | Tailwind CSS | ^3.3.0 |
| Ícones | lucide-react | ^0.378.0 |
| Runtime | React | ^18 |

### 4.2 Estrutura de diretórios

```
src/
├── app/
│   ├── layout.tsx          # Layout raiz (metadados, fontes, viewport)
│   └── page.tsx            # Página principal — carrega dados e monta Dashboard
├── components/
│   ├── Dashboard.tsx       # Orquestra filtros + grid de cards
│   ├── HookCard.tsx        # Card individual de um hook
│   └── HookFilter.tsx      # Campo de busca + botões de categoria
└── data/
    └── hooks_metadata.json # Fonte de dados estática dos hooks
```

### 4.3 Fluxo de dados

```
hooks_metadata.json
       │
       ▼ (importado em build-time)
   page.tsx  ──props──▶  Dashboard.tsx
                              │
                    ┌─────────┴──────────┐
                    ▼                    ▼
             HookFilter.tsx        HookCard.tsx
          (search + category)    (renderiza cada hook)
```

O `Dashboard` mantém o estado de busca e categoria, aplica o filtro via `useMemo` com debounce de 200 ms e passa o array filtrado para a lista de `HookCard`s.

---

## 5. Modelo de Dados

### 5.1 Interface `Hook`

```typescript
interface Hook {
  id: string;           // Identificador único (slug)
  name: string;         // Nome legível do hook
  event: string;        // Evento Claude Code que o aciona
                        // (PreToolUse | PostToolUse | SessionStart | Stop | Notification)
  category: string;     // Agrupamento lógico
                        // (pre-execution | post-execution | pre-commit | session | notification)
  description: string;  // Descrição funcional do hook
  author: string;       // Handle do autor no GitHub
  status: "active" | "inactive";
  language: "python" | "bash" | "typescript";
  githubUrl: string;    // URL direta para o arquivo-fonte
  tags: string[];       // Rótulos de busca livre
}
```

### 5.2 Categorias de eventos suportadas

| Evento | Descrição |
|--------|-----------|
| `PreToolUse` | Executado antes de qualquer invocação de ferramenta |
| `PostToolUse` | Executado após o retorno da ferramenta |
| `SessionStart` | Executado no início de cada sessão Claude Code |
| `Stop` | Executado ao encerrar a sessão |
| `Notification` | Executado quando Claude Code emite uma notificação |

---

## 6. Componentes

### 6.1 `Dashboard`

**Responsabilidade:** estado global de filtros, lógica de filtragem, layout de página.

| Prop | Tipo | Descrição |
|------|------|-----------|
| `hooks` | `Hook[]` | Array completo de hooks carregado da fonte de dados |

**Estado interno:**

| Estado | Tipo | Valor inicial | Descrição |
|--------|------|---------------|-----------|
| `searchInput` | `string` | `""` | Valor atual do campo de busca (atualizado a cada tecla) |
| `activeCategory` | `Category` | `"all"` | Categoria selecionada no filtro |

**Lógica de filtragem (`useMemo`):**
1. Aplica o valor debounced do `searchInput` (200 ms)
2. Filtra por categoria (curto-circuito se não bater)
3. Verifica correspondência em `name`, `event`, `description` e `tags`

### 6.2 `HookFilter`

**Responsabilidade:** capturar entrada do usuário (busca textual + seleção de categoria) e propagá-la ao `Dashboard`.

| Prop | Tipo | Descrição |
|------|------|-----------|
| `search` | `string` | Valor atual do campo de busca |
| `onSearchChange` | `(v: string) => void` | Callback de atualização da busca |
| `activeCategory` | `Category` | Categoria ativa |
| `onCategoryChange` | `(c: Category) => void` | Callback de troca de categoria |
| `totalCount` | `number` | Total de hooks antes de filtrar |
| `filteredCount` | `number` | Total de hooks após filtrar |

### 6.3 `HookCard`

**Responsabilidade:** renderizar os metadados de um único hook em formato de card.

| Prop | Tipo | Descrição |
|------|------|-----------|
| `hook` | `Hook` | Objeto completo do hook |

**Elementos visuais:**
- Barra de destaque superior colorida por status (ativa = gradiente brand/indigo, inativa = cinza)
- Badge de evento com ícone contextual (Zap, CircleDot, Play, StopCircle, Bell)
- Badge de categoria com esquema de cores por tipo
- Pill de status com animação pulse quando ativo
- Tags como lista de chips
- Badge de linguagem com cores semânticas (python = azul, bash = âmbar, typescript = violeta)
- Link "View source" apontando para o arquivo no GitHub

---

## 7. Requisitos Não-Funcionais

### 7.1 Performance

- **Debounce de busca:** 200 ms — elimina renderizações redundantes em digitação rápida
- **Memoização:** `useMemo` para a lista filtrada e para a contagem de ativos; recalcula apenas quando as dependências mudam
- **Build estático:** dados embutidos em build-time via importação JSON — zero latência de rede para os dados dos hooks
- **Objetivo de LCP:** < 1,5 s em conexão 4G lenta (página sem imagens pesadas, fonte local)
- **Bundle:** dependências mínimas (Next.js, React, Tailwind, lucide-react); sem bibliotecas de state management externas

### 7.2 Acessibilidade

Conformidade alvo: **WCAG 2.1 nível AA**

| Critério | Implementação |
|----------|---------------|
| 1.3.1 Info and Relationships | `role="list"`, `role="group"`, `<label>` explícito para input de busca |
| 2.1.1 Keyboard | Todos os controles interativos alcançáveis e operáveis via teclado |
| 2.4.1 Bypass Blocks | Link "Skip to content" como primeiro elemento focável |
| 2.4.3 Focus Order | Ordem de foco segue fluxo visual natural |
| 3.3.2 Labels or Instructions | Campo de busca com `<label>` associado via `htmlFor` |
| 4.1.2 Name, Role, Value | Botões de categoria com `aria-pressed`; status com `role="status"` e `aria-label`; contagem com `aria-live="polite"` e `aria-atomic="true"` |
| — | Elementos decorativos marcados com `aria-hidden="true"` |
| — | Links externos com `aria-label` descrevendo destino e comportamento (abre nova aba) |

### 7.3 Responsividade

O layout utiliza Tailwind CSS com breakpoints padrão:

| Breakpoint | Colunas do grid | Comportamento |
|------------|-----------------|---------------|
| `< sm` (< 640 px) | 1 coluna | Contador de ativos oculto no header |
| `sm` (≥ 640 px) | 2 colunas | Contador de ativos visível |
| `lg` (≥ 1024 px) | 3 colunas | Layout completo |

- Header sticky com `z-index` adequado para não sobrepor dropdowns/modais futuros
- Container com `max-w-6xl` e padding lateral de 24 px para evitar leitura em largura máxima
- Nenhum scroll horizontal em qualquer resolução testada

---

## 8. Fonte de Dados

O arquivo `src/data/hooks_metadata.json` é a única fonte de verdade para os dados exibidos.

**Para adicionar um novo hook:** incluir um novo objeto no array seguindo o schema da seção 5.1.
**Para desativar um hook na UI:** alterar `"status": "active"` para `"status": "inactive"`.

Não há validação em runtime do JSON — erros de schema causarão falhas de tipo em build-time (TypeScript).

---

## 9. Decisões de Design

| Decisão | Justificativa |
|---------|---------------|
| App Router (Next.js) | Alinhamento com as práticas recomendadas da versão atual do Next.js; Server Components prontos para uso futuro |
| Dados em JSON estático | Sem necessidade de API — dados mudam pouco frequentemente; reduz complexidade e elimina latência de rede |
| Tailwind CSS utilitário | Consistência visual rápida; CSS purificado em build; sem overhead de CSS-in-JS em runtime |
| Debounce de 200 ms | Imperceptível ao usuário; elimina passes de filtro excessivos em listas maiores |
| `useMemo` para filtragem | Evita recalcular o filtro a cada renderização não relacionada ao estado de busca |
| Sem biblioteca de estado | Estado local simples (`useState`) é suficiente; Redux/Zustand adicionaria complexidade desnecessária |
| lucide-react | Ícones SVG otimizados; tree-shakeable; consistente com o design system do Claude Code |

---

## 10. Executando o Projeto

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento (http://localhost:3000)
npm run dev

# Build de produção
npm run build

# Servidor de produção
npm start

# Lint
npm run lint
```

---

## 11. Extensões Futuras (Backlog)

- [ ] Paginação ou virtualização para listas com 50+ hooks
- [ ] Persistência de filtros via URL query params
- [ ] Modo escuro (dark mode)
- [ ] Exportação da lista filtrada como JSON/CSV
- [ ] Integração com API real para status dinâmico dos hooks
- [ ] Testes automatizados (Jest + React Testing Library)
- [ ] Storybook para documentação visual dos componentes
