import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  X, 
  Download, 
  Share2, 
  Bookmark, 
  Clock, 
  Eye, 
  Star, 
  FileText, 
  Play, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Users,
  Calendar
} from 'lucide-react';
import { EducationalResource } from '../../types/faq';

interface ResourcePreviewProps {
  resource: EducationalResource;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (resourceId: string) => void;
  onBookmark?: (resourceId: string) => void;
  onShare?: (resourceId: string) => void;
  onRating?: (resourceId: string, rating: number) => void;
  variant?: 'modal' | 'sidebar' | 'inline';
  className?: string;
}

export const ResourcePreview: React.FC<ResourcePreviewProps> = ({
  resource,
  isOpen,
  onClose,
  onDownload,
  onBookmark,
  onShare,
  onRating,
  variant = 'modal',
  className = ''
}) => {
  const [currentPage] = React.useState(1);
  const [zoomLevel, setZoomLevel] = React.useState(100);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [currentRating, setCurrentRating] = React.useState(0);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const handleRatingClick = (rating: number) => {
    setCurrentRating(rating);
    onRating?.(resource.id, rating);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.(resource.id);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  if (!isOpen) return null;

  const renderPreviewContent = () => {
    switch (resource.type) {
      case 'pdf':
        return (
          <div className="bg-gray-100 rounded-lg p-6 text-center min-h-96 flex items-center justify-center">
            <div>
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">PDF Preview</h3>
              <p className="text-gray-600 mb-4">
                {resource.pageCount ? `${resource.pageCount} pages` : 'Multi-page document'}
                {resource.fileSize && ` • ${formatFileSize(resource.fileSize)}`}
              </p>
              
              {/* PDF Controls */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <Button variant="outline" size="sm" disabled={currentPage <= 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 px-3">
                  Page {currentPage} of {resource.pageCount || 1}
                </span>
                <Button variant="outline" size="sm" disabled={currentPage >= (resource.pageCount || 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 25))}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 px-2">{zoomLevel}%</span>
                <Button variant="ghost" size="sm" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'video':
        return (
          <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-white mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Video Preview</h3>
              <p className="text-gray-300 mb-4">
                {resource.duration && formatDuration(resource.duration)}
                {resource.fileSize && ` • ${formatFileSize(resource.fileSize)}`}
              </p>
              <Button variant="primary">
                <Play className="w-4 h-4 mr-2" />
                Play Video
              </Button>
            </div>
          </div>
        );
        
      case 'article':
        return (
          <div className="prose max-w-none">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Article Preview</h3>
              <div className="text-gray-700 space-y-4">
                <p>{resource.description}</p>
                <p className="text-gray-600 italic">
                  This is a preview of the article. The full content would be displayed here 
                  with proper formatting, images, and interactive elements.
                </p>
                <div className="bg-gray-50 p-4 rounded border-l-4 border-primary">
                  <p className="font-medium text-primary mb-2">Key Learning Points:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Understanding animal behavior and intelligence</li>
                    <li>Proper care techniques and best practices</li>
                    <li>Creating enriching environments</li>
                    <li>Building positive human-animal relationships</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="bg-gray-100 rounded-lg p-6 text-center min-h-64 flex items-center justify-center">
            <div>
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Preview not available for this resource type</p>
            </div>
          </div>
        );
    }
  };

  if (variant === 'inline') {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{resource.title}</h2>
            <p className="text-gray-600 mt-1">{resource.category.name}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {renderPreviewContent()}
      </Card>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${className}`}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Resource Preview</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-1">{resource.title}</h3>
              <p className="text-sm text-gray-600">{resource.summary}</p>
            </div>
            
            {renderPreviewContent()}
          </div>
        </div>
      </div>
    );
  }

  // Modal variant (default)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{resource.title}</h2>
              <p className="text-gray-600 mb-3">{resource.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Badge variant="default" className="text-xs">
                  {resource.category.name}
                </Badge>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {resource.views.toLocaleString()} views
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  {resource.downloads.toLocaleString()} downloads
                </div>
                {resource.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(resource.duration)}
                  </div>
                )}
              </div>
            </div>
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {renderPreviewContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Rate this resource:</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRatingClick(star)}
                    className="p-0 h-auto"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= (currentRating || resource.rating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </Button>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({resource.ratingCount} reviews)
              </span>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{resource.targetAudience.join(', ')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Updated {new Date(resource.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={() => onDownload?.(resource.id)}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resource
            </Button>
            
            <Button
              variant={isBookmarked ? 'secondary' : 'outline'}
              onClick={handleBookmark}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onShare?.(resource.id)}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            
            {resource.url && (
              <Button
                variant="ghost"
                onClick={() => window.open(resource.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-4">
            {resource.tags.map((tag) => (
              <Badge key={tag.id} variant="default" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};