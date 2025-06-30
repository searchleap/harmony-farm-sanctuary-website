import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  TrendingUp, 
  Star, 
  Eye, 
  ThumbsUp, 
  Clock,
  ArrowRight,
  Crown,
  Flame,
  Award
} from 'lucide-react';
import { FAQ } from '../../types/faq';

interface PopularFAQsProps {
  faqs: FAQ[];
  onFaqClick: (faqId: string) => void;
  variant?: 'default' | 'compact' | 'trending' | 'dashboard';
  timeframe?: 'day' | 'week' | 'month' | 'all';
  maxItems?: number;
  showRanking?: boolean;
  showMetrics?: boolean;
  className?: string;
}



const getPopularityScore = (faq: FAQ): number => {
  // Weighted score based on various factors
  const viewWeight = 0.4;
  const helpfulWeight = 0.3;
  const recentWeight = 0.2;
  const recencyWeight = 0.1;

  const daysSinceUpdate = Math.floor(
    (new Date().getTime() - new Date(faq.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const recencyScore = Math.max(0, 30 - daysSinceUpdate) / 30; // Higher for recent updates
  const recentViewsScore = Math.min(faq.views * 0.3, 100); // Simulate recent views
  
  return (
    (faq.views * viewWeight) +
    (faq.helpful * helpfulWeight * 10) +
    (recentViewsScore * recentWeight) +
    (recencyScore * recencyWeight * 100)
  );
};

const getRankingIcon = (rank: number): React.ReactNode => {
  switch (rank) {
    case 1:
      return <Crown className="w-4 h-4 text-yellow-500" />;
    case 2:
      return <Award className="w-4 h-4 text-gray-400" />;
    case 3:
      return <Award className="w-4 h-4 text-orange-500" />;
    default:
      return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
  }
};

const getTrendingIndicator = (faq: FAQ): React.ReactNode => {
  const score = getPopularityScore(faq);
  
  if (score > 200) {
    return (
      <div className="flex items-center gap-1 text-red-600">
        <Flame className="w-3 h-3" />
        <span className="text-xs font-medium">Hot</span>
      </div>
    );
  } else if (score > 100) {
    return (
      <div className="flex items-center gap-1 text-orange-600">
        <TrendingUp className="w-3 h-3" />
        <span className="text-xs font-medium">Trending</span>
      </div>
    );
  }
  return null;
};

const formatTimeframe = (timeframe: string): string => {
  switch (timeframe) {
    case 'day': return 'today';
    case 'week': return 'this week';
    case 'month': return 'this month';
    default: return 'all time';
  }
};

export const PopularFAQs: React.FC<PopularFAQsProps> = ({
  faqs,
  onFaqClick,
  variant = 'default',
  timeframe = 'week',
  maxItems = 5,
  showRanking = true,
  showMetrics = true,
  className = ''
}) => {
  const sortedFaqs = React.useMemo(() => {
    return [...faqs]
      .sort((a, b) => getPopularityScore(b) - getPopularityScore(a))
      .slice(0, maxItems);
  }, [faqs, maxItems]);

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        <h4 className="font-medium text-gray-900 text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Popular Questions
        </h4>
        {sortedFaqs.slice(0, 3).map((faq, index) => (
          <Button
            key={faq.id}
            variant="ghost"
            size="sm"
            onClick={() => onFaqClick(faq.id)}
            className="w-full justify-between text-left p-2 h-auto hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              {showRanking && (
                <span className="text-xs font-bold text-gray-500 w-4">
                  #{index + 1}
                </span>
              )}
              <span className="text-sm text-gray-700 line-clamp-1">{faq.question}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="w-3 h-3" />
              {faq.views}
            </div>
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'trending') {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold">Trending FAQs</h3>
          <Badge variant="info" className="text-xs">
            {formatTimeframe(timeframe)}
          </Badge>
        </div>

        <div className="space-y-3">
          {sortedFaqs.map((faq, index) => {
            const trending = getTrendingIndicator(faq);
            
            return (
              <div
                key={faq.id}
                className="group cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                onClick={() => onFaqClick(faq.id)}
              >
                <div className="flex items-start gap-3">
                  {showRanking && (
                    <div className="flex-shrink-0 mt-1">
                      {getRankingIcon(index + 1)}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {faq.question}
                      </h4>
                      {trending}
                    </div>
                    
                    {showMetrics && (
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {faq.views.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {faq.helpful}
                        </div>
                        <Badge variant="default" className="text-xs">
                          {faq.category.name}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  }

  if (variant === 'dashboard') {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Popular FAQs</h3>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 capitalize">{formatTimeframe(timeframe)}</span>
          </div>
        </div>

        <div className="grid gap-4">
          {sortedFaqs.map((faq, index) => (
            <div
              key={faq.id}
              className="group cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => onFaqClick(faq.id)}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {faq.question}
                  </h4>
                  <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                    <span>{faq.views.toLocaleString()} views</span>
                    <span>{faq.helpful} helpful votes</span>
                    <Badge variant="default" className="text-xs">
                      {faq.category.name}
                    </Badge>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {getTrendingIndicator(faq) || (
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <Button variant="outline" className="w-full">
            View All Popular FAQs
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <Star className="w-5 h-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Most Popular FAQs</h3>
        <Badge variant="info" className="text-xs ml-auto">
          {formatTimeframe(timeframe)}
        </Badge>
      </div>

      <div className="space-y-4">
        {sortedFaqs.map((faq, index) => (
          <div
            key={faq.id}
            className="group cursor-pointer border border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all duration-200"
            onClick={() => onFaqClick(faq.id)}
          >
            <div className="flex items-start gap-4">
              {showRanking && (
                <div className="flex-shrink-0 mt-1">
                  {getRankingIcon(index + 1)}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {faq.question}
                  </h4>
                  {getTrendingIndicator(faq)}
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {faq.answer.substring(0, 150)}...
                </p>
                
                {showMetrics && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {faq.views.toLocaleString()} views
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {faq.helpful} helpful
                    </div>
                    <Badge variant="default" className="text-xs">
                      {faq.category.name}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t text-center">
        <p className="text-sm text-gray-600 mb-3">
          These are the questions our community finds most helpful
        </p>
        <Button variant="outline">
          Browse All FAQs
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};