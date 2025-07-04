import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Heart, 
  AlertTriangle,
  Lightbulb,
  Users,
  Clock,
  Target,
  Filter,
  Download,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { UserFeedback, FeedbackMetrics, SentimentAnalysis, FeedbackSuggestion, FeedbackTrend } from '../../../types/faq';
import { AdminButton } from '../common/AdminButton';

interface FeedbackAnalyticsProps {
  contentId?: string; // If provided, shows analytics for specific content
  contentType?: 'faq' | 'resource';
  feedback: UserFeedback[];
  metrics: FeedbackMetrics[];
  suggestions: FeedbackSuggestion[];
  onExportData?: () => void;
  onImplementSuggestion?: (suggestionId: string) => void;
}

export const FeedbackAnalytics: React.FC<FeedbackAnalyticsProps> = ({
  contentId,
  contentType,
  feedback,
  metrics,
  suggestions,
  onExportData,
  onImplementSuggestion
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [viewMode, setViewMode] = useState<'overview' | 'sentiment' | 'trends' | 'suggestions'>('overview');
  const [filterType, setFilterType] = useState<'all' | 'faq' | 'resource'>('all');

  // Filter data based on time range and content type
  const filteredData = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    let filteredFeedback = feedback.filter(f => new Date(f.created_at) >= cutoffDate);
    let filteredMetrics = metrics.filter(m => new Date(m.last_updated) >= cutoffDate);

    if (contentId) {
      filteredFeedback = filteredFeedback.filter(f => f.content_id === contentId);
      filteredMetrics = filteredMetrics.filter(m => m.content_id === contentId);
    }

    if (filterType !== 'all') {
      filteredFeedback = filteredFeedback.filter(f => f.content_type === filterType);
      filteredMetrics = filteredMetrics.filter(m => m.content_type === filterType);
    }

    return { feedback: filteredFeedback, metrics: filteredMetrics };
  }, [feedback, metrics, timeRange, contentId, filterType]);

  // Calculate analytics
  const analytics = useMemo(() => {
    const { feedback: filteredFeedback, metrics: filteredMetrics } = filteredData;
    
    // Overall metrics
    const totalFeedback = filteredFeedback.length;
    const helpfulVotes = filteredFeedback.filter(f => f.helpful === true).length;
    const notHelpfulVotes = filteredFeedback.filter(f => f.helpful === false).length;
    const averageRating = filteredFeedback
      .filter(f => f.rating)
      .reduce((sum, f, _, arr) => sum + (f.rating || 0) / arr.length, 0);
    
    // Sentiment analysis (mock data)
    const sentimentData: SentimentAnalysis = {
      score: 0.65, // Positive
      magnitude: 0.8,
      classification: 'positive',
      keywords: ['helpful', 'clear', 'informative', 'useful'],
      themes: ['content quality', 'accessibility', 'usefulness'],
      confidence: 0.85
    };

    // Trend calculations
    const trends = {
      feedback_volume: totalFeedback > 0 ? 'up' : 'stable',
      satisfaction: averageRating > 3.5 ? 'up' : averageRating < 3 ? 'down' : 'stable',
      helpfulness: helpfulVotes > notHelpfulVotes ? 'up' : 'down'
    };

    // Top performing content
    const topContent = filteredMetrics
      .sort((a, b) => b.average_rating - a.average_rating)
      .slice(0, 5);

    // Content needing attention
    const needsAttention = filteredMetrics
      .filter(m => m.improvement_priority === 'high' || m.average_rating < 3)
      .sort((a, b) => a.average_rating - b.average_rating)
      .slice(0, 5);

    return {
      totalFeedback,
      helpfulVotes,
      notHelpfulVotes,
      averageRating,
      sentimentData,
      trends,
      topContent,
      needsAttention
    };
  }, [filteredData]);

  const renderTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{analytics.totalFeedback}</div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </div>
            <div className="flex items-center space-x-1">
              {renderTrendIcon(analytics.trends.feedback_volume)}
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-gray-900">{analytics.averageRating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avg. Rating</div>
            </div>
            <div className="flex items-center space-x-1">
              {renderTrendIcon(analytics.trends.satisfaction)}
              <BarChart3 className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-700">{analytics.helpfulVotes}</div>
              <div className="text-sm text-gray-600">Helpful Votes</div>
            </div>
            <div className="flex items-center space-x-1">
              {renderTrendIcon(analytics.trends.helpfulness)}
              <Heart className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-700">
                {((analytics.helpfulVotes / (analytics.helpfulVotes + analytics.notHelpfulVotes)) * 100 || 0).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Helpfulness Rate</div>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Top Performing Content</h4>
          <div className="space-y-3">
            {analytics.topContent.map((item, index) => (
              <div key={item.content_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-700 capitalize">{item.content_type}</span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {item.average_rating.toFixed(1)} ⭐
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Needs Attention</h4>
          <div className="space-y-3">
            {analytics.needsAttention.map((item, index) => (
              <div key={item.content_id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-gray-700 capitalize">{item.content_type}</span>
                </div>
                <div className="text-sm font-medium text-red-700">
                  {item.average_rating.toFixed(1)} ⭐
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSentiment = () => (
    <div className="space-y-6">
      {/* Sentiment Overview */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Analysis</h4>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              analytics.sentimentData.classification === 'positive' ? 'text-green-600' :
              analytics.sentimentData.classification === 'negative' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {(analytics.sentimentData.score * 100).toFixed(0)}
            </div>
            <div className="text-sm text-gray-600 capitalize">
              {analytics.sentimentData.classification} Sentiment
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  analytics.sentimentData.classification === 'positive' ? 'bg-green-600' :
                  analytics.sentimentData.classification === 'negative' ? 'bg-red-600' :
                  'bg-yellow-600'
                }`}
                style={{ width: `${Math.abs(analytics.sentimentData.score) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Common Keywords</h5>
            <div className="flex flex-wrap gap-1">
              {analytics.sentimentData.keywords.map(keyword => (
                <span key={keyword} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Main Themes</h5>
            <div className="space-y-1">
              {analytics.sentimentData.themes.map(theme => (
                <div key={theme} className="text-sm text-gray-600 capitalize">{theme}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sentiment Breakdown by Content Type */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Sentiment by Content Type</h4>
        <div className="space-y-4">
          {['faq', 'resource'].map(type => {
            const typeFeedback = filteredData.feedback.filter(f => f.content_type === type && f.comment);
            const positiveCount = typeFeedback.filter(f => f.rating && f.rating >= 4).length;
            const neutralCount = typeFeedback.filter(f => f.rating && f.rating === 3).length;
            const negativeCount = typeFeedback.filter(f => f.rating && f.rating <= 2).length;
            const total = positiveCount + neutralCount + negativeCount;

            if (total === 0) return null;

            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">{type}s</span>
                  <span className="text-sm text-gray-600">{total} responses</span>
                </div>
                <div className="flex rounded-full overflow-hidden h-4">
                  {positiveCount > 0 && (
                    <div 
                      className="bg-green-500"
                      style={{ width: `${(positiveCount / total) * 100}%` }}
                      title={`${positiveCount} positive`}
                    />
                  )}
                  {neutralCount > 0 && (
                    <div 
                      className="bg-yellow-500"
                      style={{ width: `${(neutralCount / total) * 100}%` }}
                      title={`${neutralCount} neutral`}
                    />
                  )}
                  {negativeCount > 0 && (
                    <div 
                      className="bg-red-500"
                      style={{ width: `${(negativeCount / total) * 100}%` }}
                      title={`${negativeCount} negative`}
                    />
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{((positiveCount / total) * 100).toFixed(0)}% positive</span>
                  <span>{((neutralCount / total) * 100).toFixed(0)}% neutral</span>
                  <span>{((negativeCount / total) * 100).toFixed(0)}% negative</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderSuggestions = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Improvement Suggestions</h4>
        <span className="text-sm text-gray-600">{suggestions.length} suggestions</span>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No improvement suggestions at this time</p>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map(suggestion => (
            <div key={suggestion.id} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      suggestion.priority === 'high' ? 'bg-red-100 text-red-800' :
                      suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {suggestion.priority} priority
                    </span>
                    <span className="text-xs text-gray-500">{suggestion.suggestion_type}</span>
                    <span className="text-xs text-gray-500">
                      {(suggestion.confidence_score * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                  
                  <h5 className="font-medium text-gray-900 mb-1">{suggestion.title}</h5>
                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{suggestion.feedback_count} related feedback</span>
                    <span>Sentiment: {suggestion.user_sentiment.toFixed(2)}</span>
                    <span>Keywords: {suggestion.common_keywords.join(', ')}</span>
                  </div>
                </div>
                
                <div className="ml-4">
                  {suggestion.status === 'pending' && (
                    <AdminButton
                      variant="primary"
                      size="sm"
                      onClick={() => onImplementSuggestion?.(suggestion.id)}
                    >
                      Implement
                    </AdminButton>
                  )}
                  {suggestion.status === 'in_progress' && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      In Progress
                    </span>
                  )}
                  {suggestion.status === 'completed' && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Completed
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Feedback Analytics</h3>
              <p className="text-sm text-gray-600">
                {contentId ? `Analytics for specific ${contentType}` : 'Overall feedback insights'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            
            {/* Content Type Filter */}
            {!contentId && (
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="all">All Content</option>
                <option value="faq">FAQs Only</option>
                <option value="resource">Resources Only</option>
              </select>
            )}
            
            <AdminButton
              variant="outline"
              size="sm"
              onClick={onExportData}
              icon={Download}
            >
              Export
            </AdminButton>
          </div>
        </div>
        
        {/* View Mode Tabs */}
        <div className="flex space-x-1 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'sentiment', label: 'Sentiment', icon: Heart },
            { id: 'suggestions', label: 'Suggestions', icon: Lightbulb }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setViewMode(view.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                viewMode === view.id 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <view.icon className="w-4 h-4" />
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {viewMode === 'overview' && renderOverview()}
        {viewMode === 'sentiment' && renderSentiment()}
        {viewMode === 'suggestions' && renderSuggestions()}
      </div>
    </div>
  );
};