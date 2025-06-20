# 🏆 Feed de Reconhecimentos - Applause

Uma plataforma moderna de reconhecimentos entre participantes da equipe, desenvolvida com Next.js e Tailwind CSS.

## ✨ Funcionalidades

### 📱 Feed de Reconhecimentos
- **Visualização de posts**: Cards elegantes com informações completas dos reconhecimentos
- **Scroll infinito**: Carregamento automático de 5 posts por vez
- **Filtros avançados**: Busca por nome (autor/destinatário) e tipo de reconhecimento
- **Responsividade**: Layout adaptável para desktop, tablet e mobile

### ✏️ Formulário de Reconhecimento
- **Seleção de participante**: Autocomplete com busca e paginação (20 por vez)
- **Chip interativo**: Exibição visual do participante selecionado
- **4 tipos de reconhecimento**:
  - 🙏 Obrigado!
  - 🙌 Bom trabalho!
  - 😍 Impressionante!
  - ✨ Extraordinário!
- **Editor de mensagem**: Textarea com contador de caracteres (máx. 500)
- **Hashtags automáticas**: Detecção e preview de hashtags
- **Upload de imagem**: Suporte a PNG, JPG, GIF, WebP (máx. 5MB)

### 🔍 Busca e Filtros
- **Busca em tempo real**: Por nome do autor ou destinatário
- **Filtros por tipo**: Botões interativos para cada tipo de reconhecimento
- **Contadores dinâmicos**: Exibição do número de posts filtrados
- **Limpeza rápida**: Botão para resetar todos os filtros

## 🛠 Tecnologias Utilizadas

- **Next.js 15**: Framework React com otimizações de performance
- **TypeScript**: Tipagem estática para maior segurança
- **Tailwind CSS 4**: Estilização moderna e responsiva
- **Context API**: Gerenciamento de estado global
- **React Hooks**: useState, useCallback, useMemo, useRef
- **Next/Image**: Otimização automática de imagens

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <seu-repositorio>
cd applause-teste

# Instale as dependências
npm install

# Execute em modo de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Comandos Disponíveis
```bash
npm run dev      # Executar em desenvolvimento
npm run build    # Construir para produção
npm run start    # Executar versão de produção
npm run lint     # Verificar código com ESLint
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── globals.css        # Estilos globais e Tailwind
│   ├── layout.tsx         # Layout principal
│   └── page.tsx          # Página inicial
├── components/            # Componentes React
│   ├── ui/               # Componentes base reutilizáveis
│   │   ├── Avatar.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Textarea.tsx
│   ├── Feed.tsx          # Feed de reconhecimentos
│   ├── PostCard.tsx      # Card individual de post
│   ├── SearchAndFilters.tsx # Busca e filtros
│   ├── RecognitionForm.tsx  # Formulário de reconhecimento
│   ├── ParticipantSelector.tsx # Seletor de participantes
│   └── MobileLayout.tsx  # Layout responsivo mobile
├── contexts/              # Context API
│   └── AppContext.tsx    # Estado global da aplicação
├── types/                # Definições TypeScript
│   └── index.ts
├── constants/            # Constantes da aplicação
│   └── index.ts
└── utils/                # Funções utilitárias
    └── index.ts
```

## 🎨 Design System

### Cores Principais
- **Azul**: `blue-600` - Cor primária dos botões e links
- **Cinza**: `gray-50` até `gray-900` - Textos e backgrounds
- **Branco**: `white` - Backgrounds dos cards

### Componentes Base
- **Avatar**: 3 tamanhos (sm, md, lg) com otimização de imagem
- **Button**: 4 variantes (primary, secondary, outline, ghost)
- **Input/Textarea**: Estados de erro, ícones e validação
- **Cards**: Bordas arredondadas, sombras suaves

## 📊 Dados Mock

O projeto utiliza dois arquivos JSON para simular dados:

- **`participants-mock.json`**: 20 participantes com ID, nome e avatar
- **`posts-mock.json`**: 20 reconhecimentos com todas as informações necessárias

## ⚡ Otimizações de Performance

### React
- **React.memo**: Componentes memoizados para evitar re-renderizações
- **useCallback**: Funções memoizadas para callbacks estáveis
- **useMemo**: Cálculos complexos memoizados
- **useRef**: Referências DOM otimizadas

### Next.js
- **next/image**: Otimização automática de imagens
- **Dynamic imports**: Carregamento sob demanda de componentes
- **App Router**: Roteamento otimizado

### Tailwind CSS
- **JIT**: Compilação just-in-time
- **Tree-shaking**: Remoção de CSS não utilizado
- **PostCSS**: Otimizações automáticas

## 📱 Responsividade

### Breakpoints
- **Mobile**: < 1024px (layout em tabs)
- **Desktop**: ≥ 1024px (layout em colunas)

### Layout Mobile
- **Navegação por tabs**: Feed / Elogiar
- **Formulário adaptado**: Campos empilhados
- **Cards otimizados**: Espaçamento reduzido

## 🔄 Fluxo de Estado

### Context API
```typescript
// Estado global
interface AppState {
  posts: Post[]              // Todos os posts
  participants: Participant[] // Lista de participantes
  filter: Filter            // Filtros ativos
  displayedPosts: Post[]    // Posts exibidos (paginados)
  currentPage: number       // Página atual
  hasMorePosts: boolean     // Se há mais posts para carregar
}

// Ações disponíveis
- setFilter()     // Atualizar filtros
- loadMorePosts() // Carregar mais posts
- addNewPost()    // Adicionar novo reconhecimento
- resetPosts()    // Resetar paginação
```

## 🧪 Recursos Extras Implementados

### ✅ Concluído
- **Hashtags**: Detecção automática e preview
- **Responsividade**: Layout adaptável mobile/desktop
- **Animações**: Transições suaves entre estados
- **Validação**: Formulário com validação em tempo real
- **Upload de imagem**: Simulado com preview
- **Scroll infinito**: Com intersection observer
- **Performance**: Otimizações React e Next.js

### 🔮 Possíveis Melhorias Futuras
- **Testes unitários**: Jest + React Testing Library
- **Storybook**: Documentação de componentes
- **PWA**: Progressive Web App
- **Dark mode**: Tema escuro
- **Internacionalização**: i18n
- **Backend real**: API REST ou GraphQL

## 📝 Licença

Este projeto foi desenvolvido como teste técnico e demonstração de habilidades em React/Next.js.

---

**Desenvolvido com ❤️ usando Next.js + Tailwind CSS**
