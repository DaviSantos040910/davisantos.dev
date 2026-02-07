import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Palette, 
  Database, 
  Cloud, 
  Smartphone, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';

const services = [
  {
    icon: Code2,
    title: 'Desenvolvimento Web',
    description: 'Aplicações web modernas com React, Next.js, Vue e Angular.',
  },
  {
    icon: Smartphone,
    title: 'Apps Mobile',
    description: 'Aplicativos híbridos com React Native e Flutter.',
  },
  {
    icon: Database,
    title: 'Backend & APIs',
    description: 'APIs robustas com Node.js, Python, Go e bancos de dados.',
  },
  {
    icon: Cloud,
    title: 'DevOps & Cloud',
    description: 'Deploy e infraestrutura em AWS, GCP e Azure.',
  },
  {
    icon: Palette,
    title: 'UI/UX Design',
    description: 'Interfaces bonitas e experiências intuitivas.',
  },
];

const stack = {
  frontend: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Vue.js'],
  backend: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis'],
  tools: ['Docker', 'AWS', 'Git', 'Figma', 'Linux'],
};

const values = [
  'Código limpo e bem documentado',
  'Comunicação clara e frequente',
  'Entregas dentro do prazo',
  'Suporte pós-projeto',
  'Foco em resultados',
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Photo placeholder */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Code2 className="w-24 h-24 text-primary/40" />
                </div>
                <div className="absolute -bottom-4 -right-4 p-4 rounded-xl bg-card border border-border shadow-lg">
                  <p className="text-sm font-medium">+5 anos</p>
                  <p className="text-xs text-muted-foreground">de experiência</p>
                </div>
              </motion.div>

              {/* Content */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Sobre Mim
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Sou um desenvolvedor full-stack apaixonado por criar soluções 
                  digitais que resolvem problemas reais. Com mais de 5 anos de 
                  experiência, já ajudei dezenas de empresas e startups a 
                  transformar suas ideias em produtos de sucesso.
                </p>
                <p className="text-muted-foreground mb-6">
                  Meu foco é entregar código de qualidade, com performance e 
                  escalabilidade. Acredito que bons softwares são construídos 
                  com comunicação clara, processos bem definidos e atenção aos 
                  detalhes.
                </p>
                <Button asChild className="gap-2">
                  <Link to="/contato">
                    Vamos conversar
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Serviços</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ofereço soluções completas para suas necessidades digitais.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-card border border-border hover-lift"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stack Técnica</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              As principais tecnologias que utilizo no dia a dia.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {Object.entries(stack).map(([category, techs], catIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="text-sm py-2 px-4"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Como Trabalho
                </h2>
                <p className="text-muted-foreground mb-6">
                  Valorizo a transparência e a colaboração em todos os projetos.
                  Meu objetivo é não apenas entregar código, mas construir 
                  parcerias de longo prazo.
                </p>
              </div>

              <div className="space-y-4">
                {values.map((value, index) => (
                  <motion.div
                    key={value}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span>{value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center p-8 md:p-12 rounded-2xl bg-card border border-border"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Vamos trabalhar juntos?
            </h2>
            <p className="text-muted-foreground mb-8">
              Conte-me sobre seu projeto e vamos descobrir como posso ajudar.
            </p>
            <Button asChild size="lg" className="gap-2 glow">
              <Link to="/contato">
                Entrar em Contato
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
