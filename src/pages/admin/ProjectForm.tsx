import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Loader2,
  Code2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import {
  useProjectById,
  useCreateProject,
  useUpdateProject,
} from '@/hooks/useProjects';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const projectSchema = z.object({
  slug: z.string().min(3, 'Slug deve ter pelo menos 3 caracteres').regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens'),
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  summary: z.string().min(10, 'Resumo deve ter pelo menos 10 caracteres'),
  description: z.string().min(50, 'Descrição deve ter pelo menos 50 caracteres'),
  live_url: z.string().url().optional().or(z.literal('')),
  github_url: z.string().url().optional().or(z.literal('')),
  video_url: z.string().url().optional().or(z.literal('')),
  case_study_url: z.string().url().optional().or(z.literal('')),
  is_featured: z.boolean(),
  is_published: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: project, isLoading: isLoadingProject } = useProjectById(id || '');
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      slug: '',
      title: '',
      summary: '',
      description: '',
      live_url: '',
      github_url: '',
      video_url: '',
      case_study_url: '',
      is_featured: false,
      is_published: false,
    },
  });

  const description = watch('description');

  // Load project data when editing
  useEffect(() => {
    if (project) {
      reset({
        slug: project.slug,
        title: project.title,
        summary: project.summary,
        description: project.description,
        live_url: project.live_url || '',
        github_url: project.github_url || '',
        video_url: project.video_url || '',
        case_study_url: project.case_study_url || '',
        is_featured: project.is_featured,
        is_published: project.is_published,
      });
      setTags(project.tags);
      setThumbnailUrl(project.thumbnail_url);
      setGalleryUrls(project.gallery_urls);
    }
  }, [project, reset]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'thumbnail' | 'gallery'
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${type}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('project-images')
          .getPublicUrl(filePath);

        if (type === 'thumbnail') {
          setThumbnailUrl(urlData.publicUrl);
        } else {
          setGalleryUrls((prev) => [...prev, urlData.publicUrl]);
        }
      }

      toast.success('Imagem(ns) enviada(s) com sucesso!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erro ao enviar imagem.');
    }

    setIsUploading(false);
  };

  const handleRemoveGalleryImage = (urlToRemove: string) => {
    setGalleryUrls(galleryUrls.filter((url) => url !== urlToRemove));
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
const projectData = {
        slug: data.slug,
        title: data.title,
        summary: data.summary,
        description: data.description,
        is_featured: data.is_featured,
        is_published: data.is_published,
        tags,
        thumbnail_url: thumbnailUrl,
        gallery_urls: galleryUrls,
        live_url: data.live_url || null,
        github_url: data.github_url || null,
        video_url: data.video_url || null,
        case_study_url: data.case_study_url || null,
      };

      if (isEditing) {
        await updateProject.mutateAsync({ id, ...projectData });
        toast.success('Projeto atualizado com sucesso!');
      } else {
        await createProject.mutateAsync(projectData);
        toast.success('Projeto criado com sucesso!');
      }

      navigate('/admin');
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Este slug já está em uso. Escolha outro.');
      } else {
        toast.error('Erro ao salvar projeto.');
      }
    }
  };

  if (isEditing && isLoadingProject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link to="/admin">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveTab(activeTab === 'edit' ? 'preview' : 'edit')}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              {activeTab === 'edit' ? 'Preview' : 'Editar'}
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="edit">Editar</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Info */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <h2 className="text-lg font-semibold mb-6">Informações Básicas</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título *</Label>
                      <Input
                        id="title"
                        placeholder="Nome do projeto"
                        {...register('title')}
                        className={errors.title ? 'border-destructive' : ''}
                      />
                      {errors.title && (
                        <p className="text-xs text-destructive">{errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug (URL) *</Label>
                      <Input
                        id="slug"
                        placeholder="nome-do-projeto"
                        {...register('slug')}
                        className={errors.slug ? 'border-destructive' : ''}
                      />
                      {errors.slug && (
                        <p className="text-xs text-destructive">{errors.slug.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <Label htmlFor="summary">Resumo *</Label>
                    <Textarea
                      id="summary"
                      placeholder="Uma breve descrição do projeto..."
                      rows={2}
                      {...register('summary')}
                      className={errors.summary ? 'border-destructive' : ''}
                    />
                    {errors.summary && (
                      <p className="text-xs text-destructive">{errors.summary.message}</p>
                    )}
                  </div>

                  <div className="mt-6 space-y-2">
                    <Label htmlFor="description">Descrição (Markdown) *</Label>
                    <Textarea
                      id="description"
                      placeholder="Descrição completa do projeto em Markdown..."
                      rows={12}
                      {...register('description')}
                      className={`font-mono text-sm ${errors.description ? 'border-destructive' : ''}`}
                    />
                    {errors.description && (
                      <p className="text-xs text-destructive">{errors.description.message}</p>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="mt-6 space-y-2">
                    <Label>Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      placeholder="Digite uma tag e pressione Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                  </div>
                </motion.section>

                {/* Images */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <h2 className="text-lg font-semibold mb-6">Imagens</h2>

                  {/* Thumbnail */}
                  <div className="mb-6">
                    <Label className="mb-2 block">Thumbnail</Label>
                    {thumbnailUrl ? (
                      <div className="relative w-full max-w-md">
                        <img
                          src={thumbnailUrl}
                          alt="Thumbnail"
                          className="w-full rounded-lg border border-border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2"
                          onClick={() => setThumbnailUrl(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">
                          Clique para enviar
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'thumbnail')}
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>

                  {/* Gallery */}
                  <div>
                    <Label className="mb-2 block">Galeria</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {galleryUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Galeria ${index + 1}`}
                            className="w-full aspect-video object-cover rounded-lg border border-border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6"
                            onClick={() => handleRemoveGalleryImage(url)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                      <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <Plus className="w-6 h-6 text-muted-foreground" />
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'gallery')}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando imagem...
                    </div>
                  )}
                </motion.section>

                {/* Links */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <h2 className="text-lg font-semibold mb-6">Links</h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="live_url">Link do Projeto (Live)</Label>
                      <Input
                        id="live_url"
                        type="url"
                        placeholder="https://..."
                        {...register('live_url')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="github_url">GitHub</Label>
                      <Input
                        id="github_url"
                        type="url"
                        placeholder="https://github.com/..."
                        {...register('github_url')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="video_url">Vídeo (YouTube/Vimeo/MP4)</Label>
                      <Input
                        id="video_url"
                        type="url"
                        placeholder="https://..."
                        {...register('video_url')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="case_study_url">Case Study</Label>
                      <Input
                        id="case_study_url"
                        type="url"
                        placeholder="https://..."
                        {...register('case_study_url')}
                      />
                    </div>
                  </div>
                </motion.section>

                {/* Settings */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 rounded-xl bg-card border border-border"
                >
                  <h2 className="text-lg font-semibold mb-6">Configurações</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Publicar</Label>
                        <p className="text-sm text-muted-foreground">
                          Torna o projeto visível publicamente
                        </p>
                      </div>
                      <Switch {...register('is_published')} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Destaque na Home</Label>
                        <p className="text-sm text-muted-foreground">
                          Exibe o projeto na seção de destaques
                        </p>
                      </div>
                      <Switch {...register('is_featured')} />
                    </div>
                  </div>
                </motion.section>
              </form>
            </TabsContent>

            <TabsContent value="preview">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 rounded-xl bg-card border border-border"
              >
                <h1 className="text-3xl font-bold mb-4">Preview da Descrição</h1>
                <MarkdownRenderer content={description || '*Nenhum conteúdo ainda...*'} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
