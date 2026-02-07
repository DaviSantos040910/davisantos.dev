-- Create projects table for portfolio
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  thumbnail_url TEXT,
  gallery_urls TEXT[] DEFAULT '{}',
  video_url TEXT,
  live_url TEXT,
  github_url TEXT,
  case_study_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Public can read published projects
CREATE POLICY "Anyone can view published projects" 
ON public.projects 
FOR SELECT 
USING (is_published = true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can manage all projects" 
ON public.projects 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create storage bucket for project images
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);

-- Storage policies for project images
CREATE POLICY "Anyone can view project images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated users can upload project images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update project images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete project images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert 3 example projects
INSERT INTO public.projects (slug, title, summary, description, tags, thumbnail_url, is_featured, is_published, live_url, github_url) VALUES
(
  'ecommerce-dashboard',
  'Dashboard E-commerce',
  'Painel administrativo completo para gestão de loja virtual com métricas em tempo real e gestão de produtos.',
  '## Visão Geral

Este projeto é um dashboard administrativo completo para e-commerce, desenvolvido com foco em performance e experiência do usuário.

## Funcionalidades Principais

- **Métricas em Tempo Real**: Vendas, visitantes, conversões
- **Gestão de Produtos**: CRUD completo com upload de imagens
- **Gestão de Pedidos**: Acompanhamento de status e histórico
- **Relatórios**: Exportação para PDF e Excel

## Tecnologias Utilizadas

O projeto foi construído utilizando as melhores práticas de desenvolvimento moderno:

```typescript
const stack = {
  frontend: ["React", "TypeScript", "TailwindCSS"],
  backend: ["Node.js", "PostgreSQL", "Redis"],
  infra: ["Docker", "AWS", "CI/CD"]
};
```

## Resultados

- 40% de aumento na eficiência operacional
- Redução de 60% no tempo de processamento de pedidos
- Interface responsiva funcionando em todos os dispositivos',
  ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
  NULL,
  true,
  true,
  'https://example.com/dashboard',
  'https://github.com/example/dashboard'
),
(
  'app-fitness-tracker',
  'FitTrack - App de Fitness',
  'Aplicativo mobile-first para acompanhamento de treinos, dieta e evolução física com gamificação.',
  '## Sobre o Projeto

FitTrack é um aplicativo completo para acompanhamento de fitness, desenvolvido com React Native para máxima performance em iOS e Android.

## Funcionalidades

- **Treinos Personalizados**: Criação e acompanhamento de rotinas
- **Controle Nutricional**: Registro de refeições com cálculo de macros
- **Gamificação**: Sistema de conquistas e desafios
- **Comunidade**: Ranking e interação com outros usuários

## Arquitetura

```
├── Mobile App (React Native)
├── API REST (Express + TypeScript)
├── Database (MongoDB)
└── Push Notifications (Firebase)
```

## Impacto

- +10.000 downloads nos primeiros 3 meses
- Nota 4.8 nas lojas de aplicativos
- 85% de retenção de usuários ativos',
  ARRAY['React Native', 'TypeScript', 'MongoDB', 'Firebase', 'Express'],
  NULL,
  true,
  true,
  'https://example.com/fittrack',
  'https://github.com/example/fittrack'
),
(
  'sistema-agendamento',
  'AgendaFácil - Sistema de Agendamentos',
  'Plataforma SaaS para agendamento online com integração de pagamentos e notificações automáticas.',
  '## Descrição

Sistema completo de agendamento online desenvolvido como SaaS, permitindo que empresas gerenciem seus horários e clientes de forma eficiente.

## Módulos

### Para Empresas
- Configuração de serviços e horários
- Gestão de colaboradores
- Dashboard de métricas
- Integração com Google Calendar

### Para Clientes
- Agendamento em poucos cliques
- Histórico de atendimentos
- Avaliações e feedback
- Pagamento online integrado

## Stack Técnica

- **Frontend**: Next.js + TypeScript
- **Backend**: NestJS + Prisma
- **Database**: PostgreSQL
- **Pagamentos**: Stripe
- **Infra**: Vercel + Railway

## Métricas de Sucesso

| Métrica | Resultado |
|---------|-----------|
| Empresas ativas | 150+ |
| Agendamentos/mês | 5.000+ |
| NPS | 72 |
| Uptime | 99.9% |',
  ARRAY['Next.js', 'NestJS', 'PostgreSQL', 'Stripe', 'TypeScript', 'Prisma'],
  NULL,
  false,
  true,
  'https://example.com/agendafacil',
  'https://github.com/example/agendafacil'
);