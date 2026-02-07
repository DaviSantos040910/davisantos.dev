import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, FileText, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { useProject } from '@/hooks/useProjects';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, error } = useProject(slug || '');

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="h-8 w-32 bg-muted rounded animate-pulse mb-8" />
            <div className="h-12 w-3/4 bg-muted rounded animate-pulse mb-4" />
            <div className="h-6 w-1/2 bg-muted rounded animate-pulse mb-8" />
            <div className="aspect-video bg-muted rounded-xl animate-pulse mb-8" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Projeto não encontrado</h1>
            <p className="text-muted-foreground mb-8">
              O projeto que você está procurando não existe ou foi removido.
            </p>
            <Button asChild>
              <Link to="/projetos">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos projetos
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    // Direct video file
    return null;
  };

  const videoEmbedUrl = project.video_url ? getVideoEmbedUrl(project.video_url) : null;

  return (
    <Layout>
      <article className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                to="/projetos"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar aos projetos
              </Link>
            </motion.div>

            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {project.title}
              </h1>

              {/* Summary */}
              <p className="text-xl text-muted-foreground">
                {project.summary}
              </p>
            </motion.header>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {project.live_url && (
                <Button asChild className="gap-2">
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Ver projeto rodando
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button asChild variant="outline" className="gap-2">
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    Código no GitHub
                  </a>
                </Button>
              )}
              {project.case_study_url && (
                <Button asChild variant="outline" className="gap-2">
                  <a href={project.case_study_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4" />
                    Case Study
                  </a>
                </Button>
              )}
            </motion.div>

            {/* Thumbnail */}
            {project.thumbnail_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <img
                  src={project.thumbnail_url}
                  alt={project.title}
                  className="w-full rounded-xl border border-border"
                />
              </motion.div>
            )}

            {/* Video */}
            {project.video_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  Demo em Vídeo
                </h2>
                {videoEmbedUrl ? (
                  <div className="aspect-video rounded-xl overflow-hidden border border-border">
                    <iframe
                      src={videoEmbedUrl}
                      title={`${project.title} - Demo`}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <video
                    src={project.video_url}
                    controls
                    className="w-full rounded-xl border border-border"
                  >
                    Seu navegador não suporta vídeos HTML5.
                  </video>
                )}
              </motion.div>
            )}

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-12"
            >
              <MarkdownRenderer content={project.description} />
            </motion.div>

            {/* Gallery */}
            {project.gallery_urls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-semibold mb-6">Galeria</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.gallery_urls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`${project.title} - Imagem ${index + 1}`}
                      className="w-full rounded-lg border border-border hover:scale-[1.02] transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </article>
    </Layout>
  );
}
