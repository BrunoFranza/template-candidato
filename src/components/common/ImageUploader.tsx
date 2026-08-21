import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check, Loader2, Link2 } from 'lucide-react';
import { uploadCampaignImage, StorageFolder } from '../../services/storage-service';
import { useTenant } from '../../context/TenantContext';

interface ImageUploaderProps {
  currentImageUrl?: string;
  folder?: StorageFolder;
  onImageUploaded: (url: string, storagePath?: string) => void;
  label?: string;
  description?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  folder = 'news',
  onImageUploaded,
  label = 'Imagem',
  description = 'Formatos suportados: JPG, PNG, WebP (máx. 5MB)',
  aspectRatio = 'auto',
}) => {
  const { currentSite } = useTenant();
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Por favor selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('O arquivo excede o limite máximo recomendado de 5MB.');
      return;
    }

    setError(null);
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const siteId = currentSite?.id || 'default-site';
      setUploadProgress(50);
      const result = await uploadCampaignImage(siteId, folder, file);
      setUploadProgress(100);
      setPreviewUrl(result.url);
      onImageUploaded(result.url, result.path);
    } catch (err: any) {
      setError(err?.message || 'Erro ao processar upload da imagem.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      setPreviewUrl(manualUrl.trim());
      onImageUploaded(manualUrl.trim());
      setShowUrlInput(false);
      setManualUrl('');
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'square': return 'aspect-square max-w-[240px]';
      case 'video': return 'aspect-video max-w-[420px]';
      case 'portrait': return 'aspect-[3/4] max-w-[240px]';
      default: return 'max-h-60';
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-700">{label}</label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-xs text-sky-600 hover:text-sky-700 flex items-center gap-1 font-medium"
          >
            <Link2 className="w-3.5 h-3.5" />
            {showUrlInput ? 'Ocultar URL' : 'Inserir URL direta'}
          </button>
        </div>
      )}

      {showUrlInput && (
        <form onSubmit={handleManualUrlSubmit} className="flex gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
          <input
            type="url"
            placeholder="https://exemplo.com/imagem.jpg"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            className="flex-1 text-xs px-3 py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-xs bg-slate-800 text-white rounded font-medium hover:bg-slate-900"
          >
            Aplicar
          </button>
        </form>
      )}

      {previewUrl ? (
        <div className="relative group inline-block rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
          <img
            src={previewUrl}
            alt="Preview"
            className={`w-full object-cover rounded-xl ${getAspectClass()}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white/90 text-slate-800 rounded-full hover:bg-white transition-colors"
              title="Trocar imagem"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-rose-600/90 text-white rounded-full hover:bg-rose-700 transition-colors"
              title="Remover imagem"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragOver ? 'border-sky-500 bg-sky-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
              <p className="text-sm font-medium text-slate-700">Enviando para o Supabase Storage...</p>
              <div className="w-48 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-sky-600 h-1.5 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-2 space-y-2">
              <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700">
                  <span className="text-sky-600 hover:underline">Clique para fazer upload</span> ou arraste a imagem aqui
                </p>
                <p className="text-xs text-slate-500 mt-1">{description}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};
