# DevPortfolio - Portfólio para Programador Freelancer

Um portfólio moderno e fácil de editar para programadores freelancers, com painel administrativo completo.

## 🚀 Funcionalidades

### Páginas Públicas
- **Home**: Headline, bio, CTA e projetos em destaque
- **Projetos**: Lista de projetos com cards interativos
- **Projeto (detalhe)**: Descrição em Markdown, galeria, vídeo embed, links
- **Sobre**: Experiência, serviços, stack, valores
- **Contato**: Formulário de contato + links sociais
- **SEO**: Metatags, Open Graph, sitemap

### Painel Admin (`/admin`)
- Login com e-mail/senha
- CRUD completo de projetos
- Upload de imagens (thumbnail + galeria)
- Preview de Markdown antes de publicar
- Controle de publicação e destaque

## 📋 Como Usar

### 1. Cadastrar Admin

1. Acesse a aba **Cloud** no painel do Lovable
2. Vá para **Authentication** > **Users**
3. Clique em **Add User**
4. Preencha e-mail e senha
5. Acesse `/admin/login` e faça login

### 2. Adicionar/Editar Projetos

1. Acesse `/admin` após fazer login
2. Clique em **Novo Projeto**
3. Preencha os campos:
   - **Título**: Nome do projeto
   - **Slug**: URL amigável (ex: `meu-projeto`)
   - **Resumo**: Descrição curta para os cards
   - **Descrição**: Conteúdo em Markdown
   - **Tags**: Tecnologias utilizadas
   - **Imagens**: Thumbnail e galeria
   - **Links**: Demo, GitHub, vídeo, case study
4. Ative **Publicar** para tornar visível
5. Ative **Destaque** para aparecer na home

### 3. Personalizar Textos

Os textos da Home, Sobre e Contato podem ser editados diretamente nos arquivos:

- `src/pages/Home.tsx` - Headline, bio, features
- `src/pages/About.tsx` - Experiência, serviços, stack, valores
- `src/pages/Contact.tsx` - Informações de contato
- `src/components/layout/Footer.tsx` - Links do rodapé

### 4. Personalizar Design

- `src/index.css` - Cores, gradientes, sombras
- `tailwind.config.ts` - Tokens do Tailwind

## 🛠️ Stack Técnica

- **Frontend**: React + TypeScript + Vite
- **Estilos**: TailwindCSS + shadcn/ui
- **Animações**: Framer Motion
- **Backend**: Lovable Cloud
- **Banco de Dados**: PostgreSQL
- **Storage**: Cloud Storage
- **Auth**: Cloud Auth

## 📦 Estrutura de Pastas

```
src/
├── components/
│   ├── layout/         # Header, Footer, Layout
│   ├── ui/             # Componentes shadcn
│   ├── ProjectCard.tsx
│   ├── MarkdownRenderer.tsx
│   ├── ThemeToggle.tsx
│   └── ProtectedRoute.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useProjects.ts
├── pages/
│   ├── admin/          # Dashboard, Login, Form
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── ProjectDetail.tsx
│   ├── About.tsx
│   └── Contact.tsx
├── types/
│   └── project.ts
└── integrations/
    └── supabase/
```

## 🚀 Deploy

O projeto pode ser publicado diretamente pelo Lovable:

1. Clique no botão **Publish** no canto superior direito
2. O site será publicado em um subdomínio `.lovable.app`
3. Para domínio personalizado, configure nas opções de deploy

## 📝 Licença

MIT - Use livremente para seu portfólio pessoal.