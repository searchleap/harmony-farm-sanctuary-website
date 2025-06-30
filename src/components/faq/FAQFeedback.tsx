import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageCircle, 
  Star, 
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export interface FeedbackData {
  faqId: string;
  helpful: boolean | null;
  rating: number | null;
  comment: string;
  category: 'helpful' | 'unclear' | 'outdated' | 'suggestion' | 'other';
  timestamp: Date;
}

interface FAQFeedbackProps {
  faqId: string;
  onFeedbackSubmit: (feedback: FeedbackData) => void;
  variant?: 'default' | 'compact' | 'inline';
  initialFeedback?: Partial<FeedbackData>;
  className?: string;
}

const feedbackCategories = [
  { id: 'helpful', label: 'Very Helpful', description: 'This answered my question completely' },
  { id: 'unclear', label: 'Unclear', description: 'The answer was confusing or hard to understand' },
  { id: 'outdated', label: 'Outdated', description: 'This information seems out of date' },
  { id: 'suggestion', label: 'Suggestion', description: 'I have a suggestion for improvement' },
  { id: 'other', label: 'Other', description: 'Something else I want to share' }
];

export const FAQFeedback: React.FC<FAQFeedbackProps> = ({
  faqId,
  onFeedbackSubmit,
  variant = 'default',
  initialFeedback,
  className = ''
}) => {
  const [helpful, setHelpful] = React.useState<boolean | null>(initialFeedback?.helpful || null);
  const [rating, setRating] = React.useState<number | null>(initialFeedback?.rating || null);
  const [comment, setComment] = React.useState(initialFeedback?.comment || '');
  const [category, setCategory] = React.useState<string>(initialFeedback?.category || '');
  const [showDetailedFeedback, setShowDetailedFeedback] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleHelpfulClick = (isHelpful: boolean) => {
    setHelpful(isHelpful);
    
    if (isHelpful) {
      // If helpful, submit immediately with minimal feedback
      handleQuickSubmit(isHelpful);
    } else {
      // If not helpful, show detailed feedback form
      setShowDetailedFeedback(true);
    }
  };

  const handleQuickSubmit = async (isHelpful: boolean) => {
    setIsSubmitting(true);
    
    const feedback: FeedbackData = {
      faqId,
      helpful: isHelpful,
      rating: isHelpful ? 5 : null,
      comment: '',
      category: isHelpful ? 'helpful' : 'other',
      timestamp: new Date()
    };

    try {
      await onFeedbackSubmit(feedback);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDetailedSubmit = async () => {
    if (!category) return;

    setIsSubmitting(true);
    
    const feedback: FeedbackData = {
      faqId,
      helpful,
      rating,
      comment: comment.trim(),
      category: category as any,
      timestamp: new Date()
    };

    try {
      await onFeedbackSubmit(feedback);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Card className={`p-4 bg-green-50 border-green-200 ${className}`}>
        <div className="flex items-center gap-3 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-medium">Thank you for your feedback!</p>
            <p className="text-sm text-green-600">
              Your input helps us improve our FAQ section for everyone.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-gray-600">Was this helpful?</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleHelpfulClick(true)}
          disabled={isSubmitting}
          className={`text-gray-500 hover:text-green-600 ${helpful === true ? 'text-green-600 bg-green-50' : ''}`}
        >
          <ThumbsUp className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleHelpfulClick(false)}
          disabled={isSubmitting}
          className={`text-gray-500 hover:text-red-600 ${helpful === false ? 'text-red-600 bg-red-50' : ''}`}
        >
          <ThumbsDown className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-primary" />
        Feedback on this FAQ
      </h3>

      {!showDetailedFeedback ? (
        <div className="space-y-4">
          <div>
            <p className="text-gray-700 mb-3">Was this FAQ helpful?</p>
            <div className="flex gap-3">
              <Button
                variant={helpful === true ? 'primary' : 'outline'}
                onClick={() => handleHelpfulClick(true)}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                Yes, very helpful
              </Button>
              <Button
                variant={helpful === false ? 'primary' : 'outline'}
                onClick={() => handleHelpfulClick(false)}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <ThumbsDown className="w-4 h-4" />
                Not quite
              </Button>
            </div>
          </div>

          <div className="pt-3 border-t">
            <Button
              variant="ghost"
              onClick={() => setShowDetailedFeedback(true)}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Provide detailed feedback →
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Overall Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  variant="ghost"
                  size="sm"
                  onClick={() => setRating(star)}
                  className="p-1"
                >
                  <Star
                    className={`w-5 h-5 ${
                      rating && star <= rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </Button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What type of feedback is this?
            </label>
            <div className="space-y-2">
              {feedbackCategories.map((cat) => (
                <label key={cat.id} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={category === cat.id}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{cat.label}</div>
                    <div className="text-sm text-gray-600">{cat.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Comments (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share any specific suggestions or details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t">
            <Button
              onClick={handleDetailedSubmit}
              disabled={!category || isSubmitting}
              className="flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowDetailedFeedback(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {variant === 'default' && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Your privacy matters</p>
              <p>
                Your feedback is anonymous and helps us improve our content. 
                We don't store personal information with your responses.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};