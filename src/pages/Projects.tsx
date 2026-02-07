import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { ProjectCard } from '@/components/ProjectCard';
import { useProjects } from '@/hooks/useProjects';

export default function Projects() {
  const { data: projects, isLoading } = useProjects();

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meus Projetos
            </h1>
            <p className="text-lg text-muted-foreground">
              Uma seleção dos trabalhos que desenvolvi, desde aplicações web até 
              sistemas completos. Cada projeto representa um desafio único resolvido 
              com as melhores tecnologias.
            </p>
          </motion.div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-video rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-muted-foreground text-lg">
                Nenhum projeto publicado ainda.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
