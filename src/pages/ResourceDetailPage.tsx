import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { ResourcePreview } from '../components/faq/ResourcePreview';
import { ResourceDownload } from '../components/faq/ResourceDownload';
import { ResourceRating } from '../components/faq/ResourceRating';
import { RelatedFAQs } from '../components/faq/RelatedFAQs';
import { ResourceCard } from '../components/faq/ResourceCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  ArrowLeft,
  Calendar,
  Users,
  Download,
  Eye,
  Star,
  Clock,
  FileText,
  Play,
  BookOpen,
  Image,
  CheckSquare,
  Award,
  Share2,
  Bookmark,
  ExternalLink
} from 'lucide-react';
import { educationalResources } from '../data/educationalResources';
import { faqs } from '../data/faqs';
// import type { ResourceRatingSubmission } from '../components/faq/ResourceRating';

export const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  // const [showDownload, setShowDownload] = React.useState(false);

  const resource = educationalResources.find(r => r.id === id);
  
  if (!resource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Resource Not Found</h1>
          <p className="text-gray-600 mb-6">The resource you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/resources')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resources
          </Button>
        </div>
      </div>
    );
  }

  // Find related resources
  const relatedResources = educationalResources
    .filter(r => 
      r.id !== resource.id && 
      (r.category.id === resource.category.id || 
       r.tags.some(tag => resource.tags.some(resTag => resTag.id === tag.id)))
    )
    .slice(0, 3);

  // Find related FAQs
  const relatedFAQs = faqs
    .filter(faq => 
      faq.tags.some(tag => resource.tags.some(resTag => resTag.name === tag.name)) ||
      resource.relatedFAQs?.includes(faq.id)
    )
    .slice(0, 5);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-600" />;
      case 'video':
        return <Play className="w-6 h-6 text-blue-600" />;
      case 'article':
        return <BookOpen className="w-6 h-6 text-green-600" />;
      case 'infographic':
        return <Image className="w-6 h-6 text-purple-600" />;
      case 'quiz':
        return <CheckSquare className="w-6 h-6 text-orange-600" />;
      case 'guide':
        return <BookOpen className="w-6 h-6 text-indigo-600" />;
      case 'checklist':
        return <CheckSquare className="w-6 h-6 text-teal-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const handleDownload = (resourceId: string) => {
    console.log('Downloading resource:', resourceId);
    // Track download
    // setShowDownload(true);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    console.log('Bookmark toggled:', !isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: resource.title,
        text: resource.summary,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleRatingSubmit = (submission: any) => {
    console.log('Rating submitted:', submission);
  };

  const handleHelpfulVote = (ratingId: string, helpful: boolean) => {
    console.log('Helpful vote:', ratingId, helpful);
  };

  return (
    <>
      <SEOHead 
        title={`${resource.title} | Educational Resources | Harmony Farm Sanctuary`}
        description={resource.summary}
        keywords={resource.keywords.join(', ')}
        canonical={`https://harmonyfarm.org/resources/${resource.id}`}
      />

      <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/resources')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Resources
            </Button>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Resource Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    {getResourceIcon(resource.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="text-sm">
                        {resource.category.name}
                      </Badge>
                      <Badge variant="default" className={`text-sm ${getDifficultyColor(resource.difficulty)}`}>
                        {resource.difficulty}
                      </Badge>
                      {resource.featured && (
                        <Badge variant="warning" className="text-sm">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      {resource.title}
                    </h1>
                    
                    <p className="text-lg text-gray-700 mb-4">
                      {resource.description}
                    </p>
                    
                    {/* Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
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
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Updated {new Date(resource.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {resource.tags.map((tag) => (
                    <Badge key={tag.id} variant="default" className="text-xs">
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                {/* Target Audience */}
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    For: {resource.targetAudience.join(', ')}
                  </span>
                </div>
              </div>

              {/* Actions Sidebar */}
              <div className="lg:w-80">
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  {/* Rating */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= resource.rating
                              ? 'text-yellow-500 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {resource.rating.toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-600">
                      ({resource.ratingCount} reviews)
                    </p>
                  </div>

                  {/* Download Button */}
                  <Button
                    variant="primary"
                    onClick={() => handleDownload(resource.id)}
                    className="w-full"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download {resource.type.toUpperCase()}
                    {resource.fileSize && (
                      <span className="ml-2 text-sm opacity-80">
                        ({formatFileSize(resource.fileSize)})
                      </span>
                    )}
                  </Button>

                  {/* Secondary Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant={isBookmarked ? 'secondary' : 'outline'}
                      onClick={handleBookmark}
                      className="flex-1"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex-1"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    {resource.url && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(resource.url, '_blank')}
                        className="flex-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Special Features */}
                  {(resource.hasQuiz || resource.certificateAvailable) && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="font-medium text-gray-900 mb-2">Special Features</h4>
                      <div className="space-y-2">
                        {resource.hasQuiz && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                            Interactive quiz included
                          </div>
                        )}
                        {resource.certificateAvailable && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Award className="w-4 h-4 text-green-600" />
                            Certificate of completion available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Preview and Description */}
            <div className="lg:col-span-2 space-y-8">
              {/* Resource Preview */}
              <ResourcePreview
                resource={resource}
                isOpen={true}
                onClose={() => {}}
                onDownload={handleDownload}
                onBookmark={handleBookmark}
                onShare={handleShare}
                variant="inline"
              />

              {/* Detailed Description */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About This Resource</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="text-lg mb-4">{resource.summary}</p>
                  <p>{resource.description}</p>
                  
                  {/* Additional content would go here */}
                  <div className="mt-6 p-4 bg-sanctuary-50 rounded-lg">
                    <h3 className="font-medium text-sanctuary-800 mb-2">What You'll Learn:</h3>
                    <ul className="list-disc list-inside text-sanctuary-700 space-y-1">
                      <li>Understanding animal behavior and needs</li>
                      <li>Best practices for animal care and welfare</li>
                      <li>Creating enriching environments</li>
                      <li>Building positive human-animal relationships</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Ratings and Reviews */}
              <ResourceRating
                resourceId={resource.id}
                resourceTitle={resource.title}
                currentRating={resource.rating}
                totalRatings={resource.ratingCount}
                onRatingSubmit={handleRatingSubmit}
                onHelpfulVote={handleHelpfulVote}
                variant="detailed"
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Download Component */}
              <ResourceDownload
                resourceId={resource.id}
                title={resource.title}
                fileSize={resource.fileSize}
                downloadUrl={resource.url}
                onDownload={handleDownload}
                variant="default"
              />

              {/* Related Resources */}
              {relatedResources.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Resources</h3>
                  <div className="space-y-4">
                    {relatedResources.map((relatedResource) => (
                      <ResourceCard
                        key={relatedResource.id}
                        resource={relatedResource}
                        onResourceClick={(id) => navigate(`/resources/${id}`)}
                        onDownload={handleDownload}
                        variant="compact"
                        showDownloadButton={false}
                      />
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View More Resources
                  </Button>
                </div>
              )}

              {/* Related FAQs */}
              {relatedFAQs.length > 0 && (
                <RelatedFAQs
                  currentFaqId=""
                  relatedFaqs={relatedFAQs}
                  onFaqClick={(faqId) => navigate(`/faq#${faqId}`)}
                  variant="sidebar"
                  maxItems={3}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};