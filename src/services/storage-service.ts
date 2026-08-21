import { supabase, isSupabaseConfigured } from '../lib/supabase';

export type StorageFolder = 'hero' | 'about' | 'logos' | 'news' | 'proposals' | 'gallery' | string;

export interface UploadResult {
  url: string;
  path: string;
}

export async function uploadCampaignImage(
  siteId: string,
  folder: StorageFolder,
  file: File
): Promise<UploadResult> {
  const cleanSiteId = siteId || 'default-site';
  const fileExt = file.name.split('.').pop() || 'jpg';
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `${cleanSiteId}/${folder}/${fileName}`;

  // If Supabase Storage is configured, upload to bucket 'campaign-assets'
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.storage
        .from('campaign-assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('campaign-assets')
          .getPublicUrl(filePath);

        return {
          url: publicUrlData.publicUrl,
          path: filePath,
        };
      }
    } catch (e) {
      console.warn('Supabase storage upload failed, falling back to local data URL:', e);
    }
  }

  // Fallback: convert file to local data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        path: filePath,
      });
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
}
