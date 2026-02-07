import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  LogOut,
  Code2,
  LayoutDashboard,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useProjects, useDeleteProject } from '@/hooks/useProjects';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import type { Project } from '@/types/project';

export default function Dashboard() {
  const { data: projects, isLoading } = useProjects(true);
  const deleteProject = useDeleteProject();
  const { signOut, user } = useAuth();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProject.mutateAsync(id);
      toast.success('Projeto excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir projeto.');
    }
    setDeletingId(null);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Logout realizado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Code2 className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold">Admin</span>
        </div>

        <nav className="space-y-2">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-2 rounded-lg bg-primary/10 text-primary"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            to="/admin/projetos/novo"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Projeto
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="p-4 rounded-lg bg-muted mb-4">
            <p className="text-xs text-muted-foreground mb-1">Logado como:</p>
            <p className="text-sm font-medium truncate">{user?.email}</p>
          </div>
          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Projetos</h1>
              <p className="text-muted-foreground">
                Gerencie todos os seus projetos do portfólio
              </p>
            </div>
            <Button asChild className="gap-2">
              <Link to="/admin/projetos/novo">
                <Plus className="w-4 h-4" />
                Novo Projeto
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <FolderOpen className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total</span>
              </div>
              <p className="text-3xl font-bold">{projects?.length || 0}</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Eye className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Publicados</span>
              </div>
              <p className="text-3xl font-bold">
                {projects?.filter((p) => p.is_published).length || 0}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Destaques</span>
              </div>
              <p className="text-3xl font-bold">
                {projects?.filter((p) => p.is_featured).length || 0}
              </p>
            </div>
          </div>

          {/* Projects list */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="space-y-4">
              {projects.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={index}
                  onDelete={handleDelete}
                  isDeleting={deletingId === project.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum projeto cadastrado ainda.
              </p>
              <Button asChild>
                <Link to="/admin/projetos/novo">Criar primeiro projeto</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ProjectRow({
  project,
  index,
  onDelete,
  isDeleting,
}: {
  project: Project;
  index: number;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border"
    >
      {/* Thumbnail */}
      <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0 overflow-hidden">
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-primary/30">
            {project.title.charAt(0)}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold truncate">{project.title}</h3>
          {project.is_featured && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" />
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate mb-2">
          {project.summary}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant={project.is_published ? 'default' : 'secondary'}>
            {project.is_published ? (
              <>
                <Eye className="w-3 h-3 mr-1" />
                Publicado
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 mr-1" />
                Rascunho
              </>
            )}
          </Badge>
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button asChild variant="ghost" size="icon">
          <Link to={`/projetos/${project.slug}`} target="_blank">
            <Eye className="w-4 h-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon">
          <Link to={`/admin/projetos/${project.id}`}>
            <Edit className="w-4 h-4" />
          </Link>
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir projeto?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O projeto "{project.title}" será
                permanentemente excluído.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(project.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Excluindo...' : 'Excluir'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </motion.div>
  );
}
