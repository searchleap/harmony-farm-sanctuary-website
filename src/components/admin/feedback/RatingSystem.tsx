import React, { useState, useMemo } from 'react';
import { 
  Star, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Users, 
  Clock, 
  Award,
  Target,
  Filter,
  RefreshCw
} from 'lucide-react';
import { FeedbackMetrics, UserFeedback, FeedbackCategory } from '../../../types/faq';
import { AdminButton } from '../common/AdminButton';

interface RatingSystemProps {
  contentId: string;
  contentType: 'faq' | 'resource';
  metrics: FeedbackMetrics;
  feedback: UserFeedback[];
  onRatingSubmit?: (rating: number, categories?: FeedbackCategory[]) => void;
  onMetricsRefresh?: () => void;
  showDetailedBreakdown?: boolean;
  allowInteraction?: boolean;
}

export const RatingSystem: React.FC<RatingSystemProps> = ({
  contentId,
  contentType,
  metrics,
  feedback,
  onRatingSubmit,
  onMetricsRefresh,
  showDetailedBreakdown = true,
  allowInteraction = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<FeedbackCategory[]>([]);
  const [viewMode, setViewMode] = useState<'overview' | 'distribution' | 'trends'>('overview');
  const [timeFilter, setTimeFilter] = useState<'all' | '7d' | '30d' | '90d'>('30d');

  // Calculate rating trends
  const ratingTrends = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeFilter) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      default:
        cutoffDate.setFullYear(2000); // All time
    }

    const filteredFeedback = feedback.filter(f => 
      f.rating && new Date(f.created_at) >= cutoffDate
    );

    const avgRating = filteredFeedback.length > 0 
      ? filteredFeedback.reduce((sum, f) => sum + (f.rating || 0), 0) / filteredFeedback.length
      : 0;

    return {
      current: avgRating,
      count: filteredFeedback.length,
      trend: avgRating > metrics.average_rating ? 'up' : avgRating < metrics.average_rating ? 'down' : 'stable'
    };
  }, [feedback, metrics.average_rating, timeFilter]);

  const handleRatingClick = (rating: number) => {
    if (!allowInteraction) return;
    
    setSelectedRating(rating);
    if (onRatingSubmit) {
      onRatingSubmit(rating, selectedCategories.length > 0 ? selectedCategories : undefined);
    }
  };

  const handleCategoryRating = (categoryName: string, rating: number) => {
    setSelectedCategories(prev => [
      ...prev.filter(c => c.name !== categoryName),
      { name: categoryName, rating }
    ]);
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive: boolean = false) => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4', 
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => {
          const filled = star <= rating;
          const hovering = interactive && star <= hoverRating;
          
          return (
            <button
              key={star}
              className={`${sizeClasses[size]} transition-colors ${
                interactive 
                  ? 'cursor-pointer hover:scale-110' 
                  : 'cursor-default'
              } ${
                filled || hovering 
                  ? 'text-yellow-400' 
                  : 'text-gray-300'
              }`}
              onClick={() => interactive && handleRatingClick(star)}
              onMouseEnter={() => interactive && setHoverRating(star)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              disabled={!interactive}
            >
              <Star className="fill-current" />
            </button>
          );
        })}
      </div>
    );
  };

  const renderRatingDistribution = () => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-900">Rating Distribution</h4>
      {[5, 4, 3, 2, 1].map(rating => {
        const count = metrics.rating_distribution[rating] || 0;
        const percentage = metrics.rating_count > 0 ? (count / metrics.rating_count) * 100 : 0;
        
        return (
          <div key={rating} className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 w-12">
              <span className="text-sm text-gray-600">{rating}</span>
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
            </div>
            
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            
            <div className="text-right w-16">
              <span className="text-sm text-gray-600">{count}</span>
              <span className="text-xs text-gray-400 ml-1">({percentage.toFixed(0)}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderCategoryRatings = () => {
    if (Object.keys(metrics.category_ratings).length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900">Category Ratings</h4>
        {Object.entries(metrics.category_ratings).map(([category, data]) => (
          <div key={category} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700 capitalize">{category}</span>
                <span className="text-sm font-medium text-gray-900">
                  {data.average.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {renderStars(data.average, 'sm')}
                <span className="text-xs text-gray-500">({data.count} ratings)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Main Rating Display */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <span className="text-3xl font-bold text-gray-900">
            {metrics.average_rating.toFixed(1)}
          </span>
          <div className="flex flex-col">
            {renderStars(metrics.average_rating, 'lg')}
            <span className="text-sm text-gray-600 mt-1">
              {metrics.rating_count} ratings
            </span>
          </div>
        </div>
        
        {/* Trend Indicator */}
        <div className="flex items-center justify-center space-x-2 mt-2">
          {ratingTrends.trend === 'up' && (
            <>
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">Trending up</span>
            </>
          )}
          {ratingTrends.trend === 'down' && (
            <>
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">Trending down</span>
            </>
          )}
          {ratingTrends.trend === 'stable' && (
            <span className="text-sm text-gray-600">Stable ratings</span>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-700">
            {metrics.helpfulness_ratio.toFixed(0)}%
          </div>
          <div className="text-xs text-green-600">Helpful</div>
        </div>
        
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-700">
            {metrics.total_feedback_count}
          </div>
          <div className="text-xs text-blue-600">Total Feedback</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-700">
            {metrics.quality_score || 0}
          </div>
          <div className="text-xs text-purple-600">Quality Score</div>
        </div>
      </div>

      {/* Interactive Rating (if allowed) */}
      {allowInteraction && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Rate this {contentType}</h4>
          <div className="flex items-center justify-center space-x-2">
            {renderStars(selectedRating || hoverRating, 'lg', true)}
          </div>
          {selectedRating > 0 && (
            <div className="mt-3 text-center">
              <span className="text-sm text-gray-600">
                You rated this {selectedRating} star{selectedRating !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rating System</h3>
              <p className="text-sm text-gray-600">
                {contentType === 'faq' ? 'FAQ' : 'Resource'} performance metrics
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Time Filter */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-3 py-1 text-xs ${
                  viewMode === 'overview' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode('distribution')}
                className={`px-3 py-1 text-xs ${
                  viewMode === 'distribution' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Distribution
              </button>
            </div>
            
            <AdminButton
              variant="outline"
              size="sm"
              onClick={onMetricsRefresh}
              icon={RefreshCw}
            >
              Refresh
            </AdminButton>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {viewMode === 'overview' && renderOverview()}
        
        {viewMode === 'distribution' && (
          <div className="space-y-6">
            {renderRatingDistribution()}
            {showDetailedBreakdown && renderCategoryRatings()}
          </div>
        )}
      </div>

      {/* Quality Indicators */}
      {metrics.improvement_priority && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-2">
            <Target className={`w-4 h-4 ${
              metrics.improvement_priority === 'high' ? 'text-red-600' :
              metrics.improvement_priority === 'medium' ? 'text-yellow-600' :
              'text-green-600'
            }`} />
            <span className="text-sm text-gray-700">
              Improvement Priority: 
              <span className={`ml-1 font-medium ${
                metrics.improvement_priority === 'high' ? 'text-red-700' :
                metrics.improvement_priority === 'medium' ? 'text-yellow-700' :
                'text-green-700'
              }`}>
                {metrics.improvement_priority}
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};