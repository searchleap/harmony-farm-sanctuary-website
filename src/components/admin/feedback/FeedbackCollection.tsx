import React, { useState, useEffect } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  MessageSquare, 
  Send, 
  Heart,
  TrendingUp,
  CheckCircle,
  X,
  Mail,
  User,
  Clock
} from 'lucide-react';
import { UserFeedback, FeedbackWidget, FeedbackCategory } from '../../../types/faq';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';

interface FeedbackCollectionProps {
  contentId: string;
  contentType: 'faq' | 'resource';
  widget: FeedbackWidget;
  existingFeedback?: UserFeedback[];
  onFeedbackSubmit?: (feedback: Omit<UserFeedback, 'id' | 'created_at'>) => void;
  onWidgetUpdate?: (widget: Partial<FeedbackWidget>) => void;
  currentUser?: {
    id?: string;
    email?: string;
    name?: string;
  };
}

export const FeedbackCollection: React.FC<FeedbackCollectionProps> = ({
  contentId,
  contentType,
  widget,
  existingFeedback = [],
  onFeedbackSubmit,
  onWidgetUpdate,
  currentUser
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'helpfulness' | 'rating' | 'comment'>('helpfulness');
  const [formData, setFormData] = useState({
    helpful: undefined as boolean | undefined,
    rating: 0,
    comment: '',
    email: currentUser?.email || '',
    categories: [] as FeedbackCategory[],
    anonymous: !currentUser
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Track time spent on content
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Show widget based on trigger settings
  useEffect(() => {
    if (!widget.enabled) return;

    switch (widget.trigger) {
      case 'immediate':
        setIsVisible(true);
        break;
      case 'timed':
        setTimeout(() => setIsVisible(true), (widget.trigger_delay || 5) * 1000);
        break;
      case 'on_scroll':
        const handleScroll = () => {
          const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
          if (scrolled > 70) {
            setIsVisible(true);
          }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      case 'on_exit':
        const handleMouseLeave = (e: MouseEvent) => {
          if (e.clientY <= 0) {
            setIsVisible(true);
          }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }
  }, [widget]);

  // Check if user has already provided feedback
  const userHasFeedback = existingFeedback.some(f => 
    f.user_id === currentUser?.id || 
    (!f.user_id && !currentUser) // Anonymous feedback
  );

  const handleHelpfulnessVote = (helpful: boolean) => {
    setFormData(prev => ({ ...prev, helpful }));
    submitFeedback('helpfulness', { helpful });
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleCategoryRating = (category: string, rating: number) => {
    setFormData(prev => ({
      ...prev,
      categories: [
        ...prev.categories.filter(c => c.name !== category),
        { name: category, rating }
      ]
    }));
  };

  const submitFeedback = async (type: 'helpfulness' | 'rating' | 'comment', data?: Partial<typeof formData>) => {
    setIsSubmitting(true);
    
    const feedbackData = { ...formData, ...data };
    
    const feedback: Omit<UserFeedback, 'id' | 'created_at'> = {
      content_id: contentId,
      content_type: contentType,
      user_id: feedbackData.anonymous ? undefined : currentUser?.id,
      feedback_type: type,
      helpful: feedbackData.helpful,
      rating: feedbackData.rating || undefined,
      comment: feedbackData.comment || undefined,
      categories: feedbackData.categories.length > 0 ? feedbackData.categories : undefined,
      user_agent: navigator.userAgent,
      time_spent: timeSpent,
      status: 'pending',
      updated_at: new Date().toISOString()
    };

    try {
      await onFeedbackSubmit?.(feedback);
      setSubmitted(true);
      
      if (widget.auto_hide_after_feedback) {
        setTimeout(() => setIsVisible(false), 3000);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetailedSubmit = () => {
    if (formData.rating > 0 || formData.comment.trim()) {
      submitFeedback(formData.rating > 0 ? 'rating' : 'comment');
    }
  };

  if (!isVisible || userHasFeedback) return null;

  const renderSimpleThumbsWidget = () => (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-600">Was this helpful?</span>
      <div className="flex space-x-2">
        <button
          onClick={() => handleHelpfulnessVote(true)}
          className="flex items-center space-x-1 px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>Yes</span>
        </button>
        <button
          onClick={() => handleHelpfulnessVote(false)}
          className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          disabled={isSubmitting}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>No</span>
        </button>
      </div>
    </div>
  );

  const renderStarRating = () => (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Rate this {contentType}</p>
        <div className="flex justify-center space-x-1">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => handleRatingChange(star)}
              className={`p-1 transition-colors ${
                star <= formData.rating 
                  ? 'text-yellow-400' 
                  : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              <Star className="w-6 h-6 fill-current" />
            </button>
          ))}
        </div>
      </div>
      
      {widget.categories && widget.categories.length > 0 && formData.rating > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Rate specific aspects:</p>
          {widget.categories.map(category => (
            <div key={category} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{category}</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map(star => {
                  const categoryRating = formData.categories.find(c => c.name === category)?.rating || 0;
                  return (
                    <button
                      key={star}
                      onClick={() => handleCategoryRating(category, star)}
                      className={`transition-colors ${
                        star <= categoryRating 
                          ? 'text-yellow-400' 
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDetailedForm = () => (
    <div className="space-y-4">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setFeedbackType('helpfulness')}
          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
            feedbackType === 'helpfulness' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ThumbsUp className="w-4 h-4 inline mr-1" />
          Helpful?
        </button>
        <button
          onClick={() => setFeedbackType('rating')}
          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
            feedbackType === 'rating' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Star className="w-4 h-4 inline mr-1" />
          Rate
        </button>
        <button
          onClick={() => setFeedbackType('comment')}
          className={`px-3 py-2 text-sm rounded-lg transition-colors ${
            feedbackType === 'comment' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-1" />
          Comment
        </button>
      </div>

      {feedbackType === 'helpfulness' && renderSimpleThumbsWidget()}
      {feedbackType === 'rating' && renderStarRating()}
      
      {feedbackType === 'comment' && (
        <AdminFormField
          label="Your feedback"
          type="textarea"
          value={formData.comment}
          onChange={(value) => setFormData(prev => ({ ...prev, comment: value }))}
          placeholder="Share your thoughts or suggestions..."
          rows={3}
        />
      )}

      {(feedbackType === 'comment' || (feedbackType === 'rating' && formData.rating > 0)) && (
        <div className="space-y-3">
          {widget.require_email && (
            <AdminFormField
              label="Email (optional)"
              type="email"
              value={formData.email}
              onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
              placeholder="your@email.com"
            />
          )}
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.anonymous}
              onChange={(e) => setFormData(prev => ({ ...prev, anonymous: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-600">Submit anonymously</span>
          </label>
        </div>
      )}
    </div>
  );

  const renderWidget = () => {
    if (submitted) {
      return (
        <div className="text-center py-4">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm text-green-700 font-medium">Thank you for your feedback!</p>
          <p className="text-xs text-gray-500 mt-1">We appreciate your input and will use it to improve our content.</p>
        </div>
      );
    }

    switch (widget.widget_type) {
      case 'simple_thumbs':
        return renderSimpleThumbsWidget();
      case 'star_rating':
        return (
          <div className="space-y-3">
            {renderStarRating()}
            {formData.rating > 0 && (
              <div className="text-center">
                <AdminButton
                  variant="primary"
                  size="sm"
                  onClick={handleDetailedSubmit}
                  disabled={isSubmitting}
                  icon={Send}
                >
                  Submit Rating
                </AdminButton>
              </div>
            )}
          </div>
        );
      case 'detailed_form':
        return (
          <div className="space-y-4">
            {renderDetailedForm()}
            <div className="flex justify-end space-x-2">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setIsVisible(false)}
              >
                Skip
              </AdminButton>
              <AdminButton
                variant="primary"
                size="sm"
                onClick={handleDetailedSubmit}
                disabled={isSubmitting || (!formData.rating && !formData.comment.trim() && !formData.helpful)}
                icon={Send}
              >
                Submit Feedback
              </AdminButton>
            </div>
          </div>
        );
      case 'quick_survey':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 text-center">Quick feedback:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleHelpfulnessVote(true)}
                className="flex items-center justify-center space-x-1 p-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              >
                <Heart className="w-4 h-4" />
                <span>Helpful</span>
              </button>
              <button
                onClick={() => setFeedbackType('comment')}
                className="flex items-center justify-center space-x-1 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Suggest</span>
              </button>
            </div>
            {feedbackType === 'comment' && (
              <div className="mt-3">
                <AdminFormField
                  label="Comments"
                  type="textarea"
                  value={formData.comment}
                  onChange={(value) => setFormData(prev => ({ ...prev, comment: value }))}
                  placeholder="How can we improve this?"
                  rows={2}
                />
                <div className="mt-2 text-right">
                  <AdminButton
                    variant="primary"
                    size="sm"
                    onClick={handleDetailedSubmit}
                    disabled={!formData.comment.trim()}
                    icon={Send}
                  >
                    Send
                  </AdminButton>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return renderSimpleThumbsWidget();
    }
  };

  const getWidgetPositionClasses = () => {
    switch (widget.position) {
      case 'top':
        return 'mb-4';
      case 'bottom':
        return 'mt-4';
      case 'sidebar':
        return 'fixed right-4 top-1/2 transform -translate-y-1/2 z-50 max-w-xs';
      case 'inline':
      default:
        return 'my-4';
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${getWidgetPositionClasses()}`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-medium text-gray-900">
            {widget.title || 'Your Feedback'}
          </h4>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Widget Description */}
      {widget.description && (
        <p className="text-xs text-gray-600 mb-3">{widget.description}</p>
      )}

      {/* Widget Content */}
      {renderWidget()}

      {/* Widget Footer */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Time on page: {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
          </div>
          {!formData.anonymous && currentUser && (
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{currentUser.name || currentUser.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};