export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  thumbnail_url: string | null;
  gallery_urls: string[];
  video_url: string | null;
  live_url: string | null;
  github_url: string | null;
  case_study_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type ProjectUpdate = Partial<ProjectInsert>;
