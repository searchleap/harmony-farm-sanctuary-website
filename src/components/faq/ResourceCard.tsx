import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Download, 
  Eye, 
  Clock, 
  Star, 
  FileText, 
  Play, 
  Image, 
  CheckSquare,
  BookOpen,
  Users,
  Calendar,
  Award,
  ExternalLink
} from 'lucide-react';
import { EducationalResource } from '../../types/faq';

interface ResourceCardProps {
  resource: EducationalResource;
  onResourceClick?: (resourceId: string) => void;
  onDownload?: (resourceId: string) => void;
  onRating?: (resourceId: string, rating: number) => void;
  variant?: 'default' | 'compact' | 'featured' | 'list';
  showPreview?: boolean;
  showRating?: boolean;
  showDownloadButton?: boolean;
  className?: string;
}

const getResourceIcon = (type: string): React.ReactNode => {
  switch (type) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-red-600" />;
    case 'video':
      return <Play className="w-5 h-5 text-blue-600" />;
    case 'article':
      return <BookOpen className="w-5 h-5 text-green-600" />;
    case 'infographic':
      return <Image className="w-5 h-5 text-purple-600" />;
    case 'quiz':
      return <CheckSquare className="w-5 h-5 text-orange-600" />;
    case 'guide':
      return <BookOpen className="w-5 h-5 text-indigo-600" />;
    case 'checklist':
      return <CheckSquare className="w-5 h-5 text-teal-600" />;
    default:
      return <FileText className="w-5 h-5 text-gray-600" />;
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800';
    case 'intermediate':
      return 'bg-yellow-100 text-yellow-800';
    case 'advanced':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
};

export const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  onResourceClick,
  onDownload,
  onRating,
  variant = 'default',
  showPreview = true,
  showRating = true,
  showDownloadButton = true,
  className = ''
}) => {
  const [currentRating, setCurrentRating] = React.useState(0);
  const [, setIsHovered] = React.useState(false);

  const handleRatingClick = (rating: number) => {
    setCurrentRating(rating);
    onRating?.(resource.id, rating);
  };

  const handleCardClick = () => {
    onResourceClick?.(resource.id);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(resource.id);
  };

  if (variant === 'compact') {
    return (
      <div 
        className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all cursor-pointer ${className}`}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex-shrink-0">
          {getResourceIcon(resource.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-medium text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                {resource.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                {resource.summary}
              </p>
            </div>
            
            {showDownloadButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadClick}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {resource.downloads}
            </span>
            <span>•</span>
            <Badge variant="default" className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
              {resource.difficulty}
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div 
        className={`flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all cursor-pointer ${className}`}
        onClick={handleCardClick}
      >
        <div className="flex-shrink-0 mt-1">
          {getResourceIcon(resource.type)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors">
                {resource.title}
              </h3>
              <p className="text-gray-600 mt-1 line-clamp-2">
                {resource.description}
              </p>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
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
                {resource.fileSize && (
                  <span>{formatFileSize(resource.fileSize)}</span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge variant="default" className={getDifficultyColor(resource.difficulty)}>
                {resource.difficulty}
              </Badge>
              
              {showRating && resource.rating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current text-yellow-500" />
                  <span className="text-sm text-gray-600">
                    {resource.rating.toFixed(1)} ({resource.ratingCount})
                  </span>
                </div>
              )}
              
              {showDownloadButton && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadClick}
                  className="mt-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card 
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer ${variant === 'featured' ? 'ring-2 ring-primary ring-opacity-20' : ''} ${className}`}
      onClick={handleCardClick}
    >
      {variant === 'featured' && (
        <div className="bg-gradient-to-r from-primary to-secondary p-1">
          <div className="bg-white rounded-sm p-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-medium text-primary">Featured Resource</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            {getResourceIcon(resource.type)}
            <div>
              <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors">
                {resource.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{resource.category.name}</p>
            </div>
          </div>
          
          {resource.featured && (
            <Badge variant="warning" className="text-xs">
              Featured
            </Badge>
          )}
        </div>

        <p className="text-gray-700 mb-4 line-clamp-3">
          {resource.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.slice(0, 3).map((tag) => (
            <Badge key={tag.id} variant="default" className="text-xs">
              {tag.name}
            </Badge>
          ))}
          {resource.tags.length > 3 && (
            <Badge variant="default" className="text-xs">
              +{resource.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Badge variant="default" className={getDifficultyColor(resource.difficulty)}>
              {resource.difficulty}
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{resource.targetAudience.join(', ')}</span>
          </div>
          
          {resource.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDuration(resource.duration)}</span>
            </div>
          )}
          
          {resource.fileSize && (
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{formatFileSize(resource.fileSize)}</span>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {resource.views.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4" />
              {resource.downloads.toLocaleString()}
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(resource.lastUpdated).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Rating */}
        {showRating && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRatingClick(star);
                    }}
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
                {resource.rating.toFixed(1)} ({resource.ratingCount} reviews)
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {showDownloadButton && (
            <Button
              variant="primary"
              onClick={handleDownloadClick}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          )}
          
          {showPreview && (
            <Button
              variant="outline"
              onClick={handleCardClick}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          )}
          
          {resource.url && (
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                window.open(resource.url, '_blank');
              }}
              className="px-3"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Special features */}
        {(resource.hasQuiz || resource.certificateAvailable) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              {resource.hasQuiz && (
                <Badge variant="info" className="text-xs">
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Quiz Available
                </Badge>
              )}
              {resource.certificateAvailable && (
                <Badge variant="success" className="text-xs">
                  <Award className="w-3 h-3 mr-1" />
                  Certificate
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};