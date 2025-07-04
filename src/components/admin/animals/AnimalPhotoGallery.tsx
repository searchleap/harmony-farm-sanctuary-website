import React, { useState, useRef } from 'react';
import { Upload, X, Star, Edit3, Eye, AlertCircle } from 'lucide-react';
import type { AnimalPhoto } from '../../../types/admin';

interface AnimalPhotoGalleryProps {
  photos: AnimalPhoto[];
  onPhotosChange: (photos: AnimalPhoto[]) => void;
  readOnly?: boolean;
  maxPhotos?: number;
  className?: string;
}

export function AnimalPhotoGallery({ 
  photos, 
  onPhotosChange, 
  readOnly = false, 
  maxPhotos = 20,
  className = '' 
}: AnimalPhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<AnimalPhoto | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<AnimalPhoto | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('[AnimalPhotoGallery] Rendering with photos:', photos.length);

  const handleFileSelect = async (files: FileList) => {
    if (readOnly || files.length === 0) return;
    
    setUploading(true);
    try {
      const newPhotos: AnimalPhoto[] = [];
      
      for (let i = 0; i < files.length && photos.length + newPhotos.length < maxPhotos; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          console.warn('Non-image file skipped:', file.name);
          continue;
        }
        
        // Create object URL for preview (in real app, would upload to server)
        const url = URL.createObjectURL(file);
        
        // Get image dimensions
        const dimensions = await getImageDimensions(file);
        
        const newPhoto: AnimalPhoto = {
          id: `photo_${Date.now()}_${i}`,
          url,
          thumbnailUrl: url, // In real app, would generate thumbnail
          caption: '',
          isPrimary: photos.length === 0 && newPhotos.length === 0, // First photo is primary
          uploadedBy: 'current_user', // Would get from auth context
          uploadedAt: new Date(),
          altText: `Animal photo ${photos.length + newPhotos.length + 1}`,
          tags: [],
          metadata: {
            filename: file.name,
            size: file.size,
            dimensions,
            format: file.type
          }
        };
        
        newPhotos.push(newPhoto);
      }
      
      onPhotosChange([...photos, ...newPhotos]);
    } catch (error) {
      console.error('Error uploading photos:', error);
    } finally {
      setUploading(false);
    }
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDeletePhoto = (photoId: string) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    
    // If deleted photo was primary, make first remaining photo primary
    if (updatedPhotos.length > 0 && !updatedPhotos.some(p => p.isPrimary)) {
      updatedPhotos[0].isPrimary = true;
    }
    
    onPhotosChange(updatedPhotos);
  };

  const handleSetPrimary = (photoId: string) => {
    const updatedPhotos = photos.map(photo => ({
      ...photo,
      isPrimary: photo.id === photoId
    }));
    onPhotosChange(updatedPhotos);
  };

  const handleUpdateCaption = (photoId: string, caption: string) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, caption } : photo
    );
    onPhotosChange(updatedPhotos);
    setEditingPhoto(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const primaryPhoto = photos.find(p => p.isPrimary);
  const otherPhotos = photos.filter(p => !p.isPrimary);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Photo Gallery</h3>
          <p className="text-sm text-gray-500">
            {photos.length} of {maxPhotos} photos • Primary photo will appear on animal profile
          </p>
        </div>
        
        {!readOnly && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || photos.length >= maxPhotos}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Add Photos'}
          </button>
        )}
      </div>

      {/* Upload area */}
      {!readOnly && photos.length < maxPhotos && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop photos here, or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-emerald-600 hover:text-emerald-500 font-medium"
            >
              browse
            </button>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, GIF up to 10MB each
          </p>
        </div>
      )}

      {/* Primary photo section */}
      {primaryPhoto && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            Primary Photo
          </h4>
          
          <div className="relative group">
            <img
              src={primaryPhoto.url}
              alt={primaryPhoto.altText}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            {/* Overlay controls */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <button
                  onClick={() => setSelectedPhoto(primaryPhoto)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  title="View full size"
                >
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
                
                {!readOnly && (
                  <>
                    <button
                      onClick={() => setEditingPhoto(primaryPhoto)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                      title="Edit caption"
                    >
                      <Edit3 className="w-4 h-4 text-gray-600" />
                    </button>
                    
                    <button
                      onClick={() => handleDeletePhoto(primaryPhoto.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                      title="Delete photo"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Caption */}
            {primaryPhoto.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-3 rounded-b-lg">
                <p className="text-sm">{primaryPhoto.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Other photos grid */}
      {otherPhotos.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">
            Other Photos ({otherPhotos.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {otherPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.altText}
                  className="w-full h-32 object-cover rounded-lg"
                />
                
                {/* Overlay controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                    <button
                      onClick={() => setSelectedPhoto(photo)}
                      className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
                      title="View full size"
                    >
                      <Eye className="w-3 h-3 text-gray-600" />
                    </button>
                    
                    {!readOnly && (
                      <>
                        <button
                          onClick={() => handleSetPrimary(photo.id)}
                          className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
                          title="Set as primary"
                        >
                          <Star className="w-3 h-3 text-gray-600" />
                        </button>
                        
                        <button
                          onClick={() => setEditingPhoto(photo)}
                          className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
                          title="Edit caption"
                        >
                          <Edit3 className="w-3 h-3 text-gray-600" />
                        </button>
                        
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
                          title="Delete photo"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Caption */}
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                    <p className="text-xs truncate">{photo.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No photos state */}
      {photos.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No photos uploaded yet</p>
          {!readOnly && (
            <p className="text-xs text-gray-500">Add photos to showcase this animal</p>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Full size photo modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.altText}
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            
            {selectedPhoto.caption && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
                <p>{selectedPhoto.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit caption modal */}
      {editingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Photo Caption</h3>
            
            <div className="mb-4">
              <img
                src={editingPhoto.thumbnailUrl}
                alt={editingPhoto.altText}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <textarea
                defaultValue={editingPhoto.caption}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Add a caption for this photo..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleUpdateCaption(editingPhoto.id, e.currentTarget.value);
                  }
                }}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingPhoto(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  const textarea = e.currentTarget.parentElement?.parentElement?.querySelector('textarea') as HTMLTextAreaElement;
                  if (textarea) {
                    handleUpdateCaption(editingPhoto.id, textarea.value);
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700"
              >
                Save Caption
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}