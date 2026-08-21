import React, { useState } from 'react';
import { ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../../types';
import { Modal } from '../common/Modal';

interface GalleryGridProps {
  items: GalleryItem[];
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ items }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
        <p className="text-sm text-slate-500 font-medium">Nenhuma foto adicionada à galeria no momento.</p>
      </div>
    );
  }

  const selectedItem = selectedIdx !== null ? items[selectedIdx] : null;

  const handleNext = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % items.length);
    }
  };

  const handlePrev = () => {
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + items.length) % items.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => setSelectedIdx(idx)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 cursor-pointer shadow-xs hover:shadow-md transition-all border border-slate-100"
          >
            <img
              src={item.image_url}
              alt={item.caption || 'Foto da campanha'}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
              <div className="self-end p-2 bg-white/20 backdrop-blur-xs rounded-full">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
              {item.caption && (
                <p className="text-xs font-semibold line-clamp-2 leading-snug">
                  {item.caption}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <Modal
          isOpen={selectedIdx !== null}
          onClose={() => setSelectedIdx(null)}
          title={selectedItem.caption || 'Visualização da Foto'}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="relative aspect-auto max-h-[60vh] flex items-center justify-center bg-black/90 rounded-xl overflow-hidden">
              <img
                src={selectedItem.image_url}
                alt={selectedItem.caption}
                className="max-h-[60vh] w-auto object-contain"
                referrerPolicy="no-referrer"
              />

              {/* Navigation Arrows */}
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {selectedItem.caption && (
              <p className="text-sm font-medium text-slate-700 text-center">
                {selectedItem.caption}
              </p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};
