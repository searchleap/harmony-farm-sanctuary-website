import { useState, useRef } from 'react';
import { Upload, Search, Filter, Grid, List, Image, Video, FileText, Download, Trash2, Eye, Tag, Calendar, User } from 'lucide-react';
import type { BlogMedia } from '../../../types/blog';

interface MediaLibraryProps {
  media: BlogMedia[];
  onMediaSelect?: (media: BlogMedia) => void;
  onMediaUpload?: (files: FileList) => Promise<BlogMedia[]>;
  onMediaDelete?: (media: BlogMedia) => Promise<void>;
  onMediaUpdate?: (media: BlogMedia) => Promise<void>;
  selectionMode?: boolean;
  selectedMedia?: BlogMedia[];
  onSelectionChange?: (media: BlogMedia[]) => void;
  className?: string;
}

interface MediaFilter {
  type: 'all' | 'image' | 'video' | 'audio' | 'document';
  searchTerm: string;
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  sortBy: 'name' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
}

export function MediaLibrary({
  media,
  onMediaSelect,
  onMediaUpload,
  onMediaDelete,
  onMediaUpdate,
  selectionMode = false,
  selectedMedia = [],
  onSelectionChange,
  className = ''
}: MediaLibraryProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<MediaFilter>({
    type: 'all',
    searchTerm: '',
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });
  const [selectedItem, setSelectedItem] = useState<BlogMedia | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('[MediaLibrary] Rendering with media:', media.length);

  const filteredMedia = media.filter(item => {
    // Type filter
    if (filter.type !== 'all' && item.type !== filter.type) return false;
    
    // Search filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      const searchableText = `${item.url} ${item.alt || ''} ${item.caption || ''}`.toLowerCase();
      if (!searchableText.includes(searchLower)) return false;
    }
    
    return true;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (filter.sortBy) {
      case 'name':
        comparison = (a.url || '').localeCompare(b.url || '');
        break;
      case 'size':
        comparison = (a.size || 0) - (b.size || 0);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'date':
      default:
        // For demo, we'll use url as proxy for date (in real app, would have uploadedAt field)
        comparison = (a.url || '').localeCompare(b.url || '');
        break;
    }
    
    return filter.sortOrder === 'desc' ? -comparison : comparison;
  });

  const handleFileSelect = async (files: FileList) => {
    if (!onMediaUpload) return;
    
    setUploading(true);
    try {
      await onMediaUpload(files);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleMediaClick = (mediaItem: BlogMedia) => {
    if (selectionMode) {
      const isSelected = selectedMedia.some(m => m.url === mediaItem.url);
      const newSelection = isSelected
        ? selectedMedia.filter(m => m.url !== mediaItem.url)
        : [...selectedMedia, mediaItem];
      onSelectionChange?.(newSelection);
    } else {
      onMediaSelect?.(mediaItem);
    }
  };

  const getFileTypeIcon = (type: BlogMedia['type']) => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'audio': return FileText;
      case 'document': return FileText;
      default: return FileText;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Media Library</h3>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Uploading...' : 'Upload Media'}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search media..."
                value={filter.searchTerm}
                onChange={(e) => setFilter(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          <select
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as MediaFilter['type'] }))}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
          </select>
          
          <select
            value={`${filter.sortBy}-${filter.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilter(prev => ({ 
                ...prev, 
                sortBy: sortBy as MediaFilter['sortBy'], 
                sortOrder: sortOrder as MediaFilter['sortOrder'] 
              }));
            }}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="size-desc">Largest First</option>
            <option value="size-asc">Smallest First</option>
          </select>
        </div>

        {filteredMedia.length > 0 && (
          <p className="text-sm text-gray-500 mt-2">
            Showing {filteredMedia.length} of {media.length} files
            {selectionMode && selectedMedia.length > 0 && (
              <span className="ml-2 font-medium">• {selectedMedia.length} selected</span>
            )}
          </p>
        )}
      </div>

      {/* Media Grid/List */}
      <div className="p-4">
        {filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              {filter.searchTerm || filter.type !== 'all' ? 'No media found matching your filters' : 'No media uploaded yet'}
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-sm text-emerald-600 hover:text-emerald-500 font-medium"
            >
              Upload your first file
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid view
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((mediaItem, index) => {
              const Icon = getFileTypeIcon(mediaItem.type);
              const isSelected = selectedMedia.some(m => m.url === mediaItem.url);
              
              return (
                <div
                  key={index}
                  onClick={() => handleMediaClick(mediaItem)}
                  className={`
                    relative group cursor-pointer rounded-lg border-2 transition-all
                    ${isSelected 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  {/* Media preview */}
                  <div className="aspect-square p-2">
                    {mediaItem.type === 'image' ? (
                      <img
                        src={mediaItem.thumbnail || mediaItem.url}
                        alt={mediaItem.alt || 'Media item'}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                        <Icon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Duration overlay for videos */}
                    {mediaItem.type === 'video' && mediaItem.duration && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                        {formatDuration(mediaItem.duration)}
                      </div>
                    )}
                  </div>
                  
                  {/* Filename */}
                  <div className="p-2 border-t border-gray-200">
                    <p className="text-xs text-gray-600 truncate" title={mediaItem.url}>
                      {mediaItem.url.split('/').pop()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(mediaItem.size)}
                    </p>
                  </div>
                  
                  {/* Selection indicator */}
                  {selectionMode && isSelected && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                  
                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(mediaItem);
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      {onMediaDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMediaDelete(mediaItem);
                          }}
                          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // List view
          <div className="space-y-2">
            {filteredMedia.map((mediaItem, index) => {
              const Icon = getFileTypeIcon(mediaItem.type);
              const isSelected = selectedMedia.some(m => m.url === mediaItem.url);
              
              return (
                <div
                  key={index}
                  onClick={() => handleMediaClick(mediaItem)}
                  className={`
                    flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all
                    ${isSelected 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-12 h-12">
                    {mediaItem.type === 'image' ? (
                      <img
                        src={mediaItem.thumbnail || mediaItem.url}
                        alt={mediaItem.alt || 'Media item'}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                        <Icon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {mediaItem.url.split('/').pop()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {mediaItem.type.charAt(0).toUpperCase() + mediaItem.type.slice(1)} • {formatFileSize(mediaItem.size)}
                      {mediaItem.duration && ` • ${formatDuration(mediaItem.duration)}`}
                    </p>
                    {mediaItem.caption && (
                      <p className="text-xs text-gray-400 truncate">{mediaItem.caption}</p>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(mediaItem);
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                      title="View details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {onMediaDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMediaDelete(mediaItem);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        multiple
        onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Media detail modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Media Details</h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {/* Media preview */}
              <div className="mb-4">
                {selectedItem.type === 'image' ? (
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.alt || 'Media preview'}
                    className="max-w-full h-auto rounded-lg"
                  />
                ) : selectedItem.type === 'video' ? (
                  <video
                    src={selectedItem.url}
                    controls
                    className="max-w-full h-auto rounded-lg"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="text-center">
                      <Icon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">{selectedItem.type.toUpperCase()} file</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Details */}
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Filename:</span>
                  <span className="ml-2 text-gray-600">{selectedItem.url.split('/').pop()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Type:</span>
                  <span className="ml-2 text-gray-600">{selectedItem.type}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Size:</span>
                  <span className="ml-2 text-gray-600">{formatFileSize(selectedItem.size)}</span>
                </div>
                {selectedItem.duration && (
                  <div>
                    <span className="font-medium text-gray-700">Duration:</span>
                    <span className="ml-2 text-gray-600">{formatDuration(selectedItem.duration)}</span>
                  </div>
                )}
                {selectedItem.alt && (
                  <div>
                    <span className="font-medium text-gray-700">Alt Text:</span>
                    <span className="ml-2 text-gray-600">{selectedItem.alt}</span>
                  </div>
                )}
                {selectedItem.caption && (
                  <div>
                    <span className="font-medium text-gray-700">Caption:</span>
                    <span className="ml-2 text-gray-600">{selectedItem.caption}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">URL:</span>
                  <span className="ml-2 text-gray-600 break-all">{selectedItem.url}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={() => navigator.clipboard.writeText(selectedItem.url)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Copy URL
                </button>
                
                {onMediaSelect && (
                  <button
                    onClick={() => {
                      onMediaSelect(selectedItem);
                      setSelectedItem(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700"
                  >
                    Use This Media
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}