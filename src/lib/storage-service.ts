import { supabase, isSupabaseConfigured } from './supabase';

export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
  type: string;
}

export async function uploadCampaignImage(
  siteId: string,
  folder: 'hero' | 'logos' | 'news' | 'proposals' | 'gallery' | 'about',
  file: File
): Promise<UploadResult> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const storagePath = `sites/${siteId}/${folder}/${cleanFileName}`;

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.storage
      .from('campaign-assets')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw new Error(`Erro ao enviar arquivo para o Supabase Storage: ${error.message}`);
    }

    const { data: publicUrlData } = supabase.storage
      .from('campaign-assets')
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
      name: file.name,
      size: file.size,
      type: file.type,
    };
  }

  // Fallback: Local Client-Side Object URL / Base64 Data URL with localStorage tracking
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      // In local mode, save to localStorage or return as Data URI
      resolve({
        url: dataUrl,
        path: storagePath,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo localmente'));
    reader.readAsDataURL(file);
  });
}

export async function deleteCampaignImage(storagePath: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.storage
      .from('campaign-assets')
      .remove([storagePath]);

    if (error) {
      console.warn('Erro ao deletar imagem do Supabase Storage:', error);
      return false;
    }
  }
  return true;
}

export function parseYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export function getYouTubeEmbedUrl(url: string): string {
  const id = parseYouTubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
}

export function getYouTubeThumbnail(url: string): string {
  const id = parseYouTubeVideoId(url);
  return id 
    ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80';
}
