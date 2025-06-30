import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Star, 
  TrendingUp,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { FAQ } from '../../types/faq';

interface RelatedFAQsProps {
  currentFaqId: string;
  relatedFaqs: FAQ[];
  onFaqClick: (faqId: string) => void;
  variant?: 'default' | 'compact' | 'sidebar' | 'inline';
  maxItems?: number;
  showSuggestionReason?: boolean;
  className?: string;
}

interface SuggestionReason {
  type: 'category' | 'tags' | 'difficulty' | 'popularity' | 'recent';
  label: string;
  icon: React.ReactNode;
  color: string;
}

const getSuggestionReason = (currentFaq: FAQ, relatedFaq: FAQ): SuggestionReason => {
  // Check if same category
  if (currentFaq.category === relatedFaq.category) {
    return {
      type: 'category',
      label: `Same category: ${relatedFaq.category}`,
      icon: <BookOpen className="w-3 h-3" />,
      color: 'bg-blue-100 text-blue-700'
    };
  }

  // Check if shared tags
  const sharedTags = currentFaq.tags.filter(tag => relatedFaq.tags.includes(tag));
  if (sharedTags.length > 0) {
    return {
      type: 'tags',
      label: `Related topic: ${sharedTags[0]}`,
      icon: <ArrowRight className="w-3 h-3" />,
      color: 'bg-green-100 text-green-700'
    };
  }

  // Check if popular
  if (relatedFaq.views > 1000) {
    return {
      type: 'popularity',
      label: 'Popular FAQ',
      icon: <TrendingUp className="w-3 h-3" />,
      color: 'bg-purple-100 text-purple-700'
    };
  }

  // Check if recently updated
  const daysSinceUpdate = Math.floor(
    (new Date().getTime() - new Date(relatedFaq.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceUpdate <= 7) {
    return {
      type: 'recent',
      label: 'Recently updated',
      icon: <Clock className="w-3 h-3" />,
      color: 'bg-orange-100 text-orange-700'
    };
  }

  // Default
  return {
    type: 'difficulty',
    label: `${relatedFaq.difficulty} level`,
    icon: <Star className="w-3 h-3" />,
    color: 'bg-gray-100 text-gray-700'
  };
};

const formatViews = (views: number): string => {
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}k views`;
  }
  return `${views} views`;
};

export const RelatedFAQs: React.FC<RelatedFAQsProps> = ({
  currentFaqId,
  relatedFaqs,
  onFaqClick,
  variant = 'default',
  maxItems = 5,
  showSuggestionReason = true,
  className = ''
}) => {
  const currentFaq = relatedFaqs.find(faq => faq.id === currentFaqId);
  const filteredFaqs = relatedFaqs
    .filter(faq => faq.id !== currentFaqId)
    .slice(0, maxItems);

  if (filteredFaqs.length === 0) {
    return null;
  }

  if (variant === 'inline') {
    return (
      <div className={`border-t pt-6 ${className}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Related Questions
        </h3>
        <div className="space-y-3">
          {filteredFaqs.map((faq) => (
            <Button
              key={faq.id}
              variant="ghost"
              onClick={() => onFaqClick(faq.id)}
              className="w-full justify-between text-left p-3 h-auto hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-900">{faq.question}</p>
                <p className="text-sm text-gray-600 mt-1">{formatViews(faq.views)}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        <h4 className="font-medium text-gray-900 text-sm">You might also be interested in:</h4>
        {filteredFaqs.slice(0, 3).map((faq) => (
          <Button
            key={faq.id}
            variant="ghost"
            size="sm"
            onClick={() => onFaqClick(faq.id)}
            className="text-left text-xs text-gray-600 hover:text-primary p-1 h-auto font-normal"
          >
            {faq.question}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <Card className={`p-6 ${variant === 'sidebar' ? 'sticky top-4' : ''} ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Related FAQs</h3>
      </div>

      <div className="space-y-4">
        {filteredFaqs.map((faq) => {
          const suggestionReason = currentFaq ? getSuggestionReason(currentFaq, faq) : null;
          
          return (
            <div
              key={faq.id}
              className="group cursor-pointer border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all duration-200"
              onClick={() => onFaqClick(faq.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {faq.question}
                  </h4>
                  
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="default" className="text-xs">
                      {faq.category.name}
                    </Badge>
                    <span>•</span>
                    <span>{formatViews(faq.views)}</span>
                    {faq.helpful > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                          {faq.helpful}
                        </span>
                      </>
                    )}
                  </div>

                  {showSuggestionReason && suggestionReason && (
                    <div className="mt-2">
                      <Badge
                        variant="default"
                        className={`text-xs ${suggestionReason.color}`}
                      >
                        {suggestionReason.icon}
                        <span className="ml-1">{suggestionReason.label}</span>
                      </Badge>
                    </div>
                  )}

                  {faq.priority > 5 && (
                    <div className="mt-2">
                      <Badge variant="warning" className="text-xs">
                        Important
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex items-center text-gray-400 group-hover:text-primary transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>

              {variant === 'default' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {faq.answer.substring(0, 120)}...
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {relatedFaqs.length > maxItems && (
        <div className="mt-4 pt-4 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              // This would typically navigate to a full FAQ page with filters
              console.log('Show all related FAQs');
            }}
          >
            View All Related FAQs
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {variant === 'default' && (
        <div className="mt-6 pt-4 border-t bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <p className="text-sm text-gray-600 text-center">
            Can't find what you're looking for?{' '}
            <Button variant="ghost" className="text-sm p-0 h-auto font-medium">
              Contact our support team
            </Button>
          </p>
        </div>
      )}
    </Card>
  );
};