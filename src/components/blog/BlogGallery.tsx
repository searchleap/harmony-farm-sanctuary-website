// BlogGallery Component for Harmony Farm Sanctuary
// Rich media gallery for blog posts with lightbox functionality

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Download, Maximize2 } from 'lucide-react';
import { BlogMedia } from '../../types/blog';

interface BlogGalleryProps {
  media: BlogMedia[];
  showCaptions?: boolean;
  showCredits?: boolean;
  layout?: 'grid' | 'carousel' | 'masonry';
  className?: string;
}

export const BlogGallery: React.FC<BlogGalleryProps> = ({
  media,
  showCaptions = true,
  showCredits = true,
  layout = 'grid',
  className = ''
}) => {
  console.log('BlogGallery rendering:', { mediaCount: media.length, layout, showCaptions });

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    setSelectedIndex(null);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < media.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const renderMediaItem = (item: BlogMedia, index: number) => {
    const baseClasses = "relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100";

    switch (item.type) {
      case 'image':
        return (
          <div
            key={index}
            className={baseClasses}
            onClick={() => openLightbox(index)}
          >
            <img
              src={item.url}
              alt={item.alt || `Gallery image ${index + 1}`}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-5 h-5 text-white" />
              </div>
            </div>
            {showCaptions && item.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm">{item.caption}</p>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div
            key={index}
            className={baseClasses}
            onClick={() => openLightbox(index)}
          >
            <div className="relative">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.alt || `Video thumbnail ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
              {item.duration && (
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {formatDuration(item.duration)}
                </div>
              )}
            </div>
            {showCaptions && item.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="text-white text-sm">{item.caption}</p>
              </div>
            )}
          </div>
        );

      case 'document':
        return (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-sanctuary-primary/10 rounded-lg flex items-center justify-center">
                <Download className="w-6 h-6 text-sanctuary-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{item.caption || 'Document'}</h4>
                {item.size && (
                  <p className="text-sm text-gray-600">{formatFileSize(item.size)}</p>
                )}
              </div>
              <a
                href={item.url}
                download
                className="bg-sanctuary-primary text-white px-3 py-2 rounded-lg hover:bg-sanctuary-primary/90 transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const layoutClasses = {
    grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
    carousel: 'flex gap-4 overflow-x-auto pb-4',
    masonry: 'columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4'
  };

  return (
    <>
      <div className={`${className}`}>
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900">Gallery</h3>
          <p className="text-gray-600">{media.length} {media.length === 1 ? 'item' : 'items'}</p>
        </div>

        <div className={layoutClasses[layout]}>
          {media.map((item, index) => renderMediaItem(item, index))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-6xl max-h-full p-4" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {selectedIndex > 0 && (
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {selectedIndex < media.length - 1 && (
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Media Content */}
            <div className="bg-white rounded-lg overflow-hidden">
              {media[selectedIndex].type === 'image' && (
                <img
                  src={media[selectedIndex].url}
                  alt={media[selectedIndex].alt}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              )}

              {media[selectedIndex].type === 'video' && (
                <video
                  src={media[selectedIndex].url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh]"
                />
              )}

              {/* Media Info */}
              {(showCaptions || showCredits) && (
                <div className="p-4 bg-white">
                  {showCaptions && media[selectedIndex].caption && (
                    <p className="text-gray-800 mb-2">{media[selectedIndex].caption}</p>
                  )}
                  {showCredits && media[selectedIndex].credits && (
                    <p className="text-sm text-gray-600">Credit: {media[selectedIndex].credits}</p>
                  )}
                </div>
              )}
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} of {media.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};