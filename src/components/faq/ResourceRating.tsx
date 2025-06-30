import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Send, 
  CheckCircle,
  User
} from 'lucide-react';

export interface ResourceRating {
  id: string;
  resourceId: string;
  userId?: string;
  userName?: string;
  rating: number; // 1-5
  review?: string;
  helpful: number; // Number of helpful votes
  notHelpful: number; // Number of not helpful votes
  timestamp: Date;
  verified: boolean; // Whether the user actually downloaded the resource
  tags?: string[]; // What aspects they're rating
}

interface ResourceRatingProps {
  resourceId: string;
  resourceTitle: string;
  currentRating?: number;
  totalRatings?: number;
  ratings?: ResourceRating[];
  userRating?: ResourceRating;
  onRatingSubmit?: (rating: ResourceRatingSubmission) => void;
  onHelpfulVote?: (ratingId: string, helpful: boolean) => void;
  variant?: 'default' | 'compact' | 'summary' | 'detailed';
  showReviews?: boolean;
  showRatingForm?: boolean;
  maxReviews?: number;
  className?: string;
}

interface ResourceRatingSubmission {
  resourceId: string;
  rating: number;
  review?: string;
  tags?: string[];
}

const ratingLabels = {
  1: 'Poor',
  2: 'Fair', 
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent'
};

const ratingAspects = [
  { id: 'accuracy', label: 'Accuracy', description: 'Information is correct and up-to-date' },
  { id: 'clarity', label: 'Clarity', description: 'Easy to understand and well-organized' },
  { id: 'usefulness', label: 'Usefulness', description: 'Practical and applicable information' },
  { id: 'completeness', label: 'Completeness', description: 'Covers the topic thoroughly' },
  { id: 'quality', label: 'Quality', description: 'Well-designed and professional' }
];

const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return date.toLocaleDateString();
};

export const ResourceRating: React.FC<ResourceRatingProps> = ({
  resourceId,

  currentRating = 0,
  totalRatings = 0,
  ratings = [],
  userRating,
  onRatingSubmit,
  onHelpfulVote,
  variant = 'default',
  showReviews = true,
  showRatingForm = true,
  maxReviews = 5,
  className = ''
}) => {
  const [selectedRating, setSelectedRating] = React.useState(userRating?.rating || 0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [reviewText, setReviewText] = React.useState(userRating?.review || '');
  const [selectedAspects, setSelectedAspects] = React.useState<string[]>(userRating?.tags || []);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);

  const handleRatingClick = (rating: number) => {
    setSelectedRating(rating);
    if (!showRatingForm) {
      // If not showing form, submit immediately
      handleSubmit(rating);
    }
  };

  const handleAspectToggle = (aspectId: string) => {
    setSelectedAspects(prev =>
      prev.includes(aspectId)
        ? prev.filter(id => id !== aspectId)
        : [...prev, aspectId]
    );
  };

  const handleSubmit = async (quickRating?: number) => {
    if (!selectedRating && !quickRating) return;
    
    setIsSubmitting(true);
    
    const submission: ResourceRatingSubmission = {
      resourceId,
      rating: quickRating || selectedRating,
      review: reviewText.trim() || undefined,
      tags: selectedAspects.length > 0 ? selectedAspects : undefined
    };

    try {
      await onRatingSubmit?.(submission);
      if (!quickRating) {
        setShowForm(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach(rating => {
      distribution[rating.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= currentRating
                  ? 'text-yellow-500 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {currentRating.toFixed(1)} ({totalRatings} reviews)
        </span>
      </div>
    );
  }

  if (variant === 'summary') {
    const distribution = getRatingDistribution();
    
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center mb-6">
          <div className="text-4xl font-bold text-gray-900 mb-2">
            {currentRating.toFixed(1)}
          </div>
          <div className="flex items-center justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= currentRating
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600">
            Based on {totalRatings} review{totalRatings !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-8">{rating}</span>
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: totalRatings > 0 ? `${(distribution[rating as keyof typeof distribution] / totalRatings) * 100}%` : '0%'
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">
                {distribution[rating as keyof typeof distribution]}
              </span>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Ratings & Reviews
        </h3>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= currentRating
                    ? 'text-yellow-500 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {currentRating.toFixed(1)} ({totalRatings})
          </span>
        </div>
      </div>

      {/* Rating Form */}
      {showRatingForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          {!showForm ? (
            <div className="text-center">
              <p className="text-gray-700 mb-3">Rate this resource:</p>
              <div className="flex items-center justify-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Button
                    key={star}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRatingClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1"
                    disabled={isSubmitting}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || selectedRating)
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </Button>
                ))}
              </div>
              
              {(hoverRating || selectedRating) > 0 && (
                <p className="text-sm text-gray-600 mb-3">
                  {ratingLabels[(hoverRating || selectedRating) as keyof typeof ratingLabels]}
                </p>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowForm(true)}
                className="text-primary hover:text-primary-dark"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Write a review
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-gray-700 mb-2">Your rating:</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= selectedRating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review (Optional)
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this resource..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  rows={3}
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  What aspects are you rating? (Optional)
                </p>
                <div className="flex flex-wrap gap-2">
                  {ratingAspects.map((aspect) => (
                    <Button
                      key={aspect.id}
                      variant={selectedAspects.includes(aspect.id) ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleAspectToggle(aspect.id)}
                      className="text-xs"
                    >
                      {aspect.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => handleSubmit()}
                  disabled={!selectedRating || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Review
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews List */}
      {showReviews && ratings.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">
            Recent Reviews ({ratings.length})
          </h4>
          
          {ratings.slice(0, maxReviews).map((rating) => (
            <div key={rating.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">
                        {rating.userName || 'Anonymous'}
                      </span>
                      {rating.verified && (
                        <Badge variant="success" className="text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= rating.rating
                                ? 'text-yellow-500 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDate(rating.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {rating.review && (
                <p className="text-gray-700 mb-3">{rating.review}</p>
              )}

              {rating.tags && rating.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {rating.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="text-xs">
                      {ratingAspects.find(a => a.id === tag)?.label || tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onHelpfulVote?.(rating.id, true)}
                  className="flex items-center gap-1 text-xs"
                >
                  <ThumbsUp className="w-3 h-3" />
                  Helpful ({rating.helpful})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onHelpfulVote?.(rating.id, false)}
                  className="flex items-center gap-1 text-xs"
                >
                  <ThumbsDown className="w-3 h-3" />
                  Not helpful ({rating.notHelpful})
                </Button>
              </div>
            </div>
          ))}

          {ratings.length > maxReviews && (
            <Button variant="outline" className="w-full">
              View All {ratings.length} Reviews
            </Button>
          )}
        </div>
      )}

      {showReviews && ratings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No reviews yet. Be the first to review this resource!</p>
        </div>
      )}
    </Card>
  );
};