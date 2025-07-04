import React, { useState } from 'react';
import { 
  TrendingUp, 
  ThumbsUp, 
  ThumbsDown, 
  Eye, 
  Search,
  Users,
  Target,
  BarChart3,
  Download
} from 'lucide-react';
import { FAQ, FAQCategory, FAQHelpfulness } from '../../../types/faq';
import { AdminButton } from '../common';

interface FAQAnalyticsProps {
  faqs: FAQ[];
  categories: FAQCategory[];
  helpfulness: FAQHelpfulness[];
}

interface AnalyticsData {
  totalViews: number;
  totalHelpful: number;
  totalNotHelpful: number;
  averageHelpfulness: number;
  topPerforming: FAQ[];
  needsImprovement: FAQ[];
  categoryPerformance: { category: FAQCategory; score: number; views: number }[];
  searchQueries: { query: string; count: number; results: number }[];
  userEngagement: {
    dailyViews: { date: string; views: number }[];
    helpfulnessRate: number;
    improvementSuggestions: string[];
  };
}

export const FAQAnalytics: React.FC<FAQAnalyticsProps> = ({
  faqs,
  categories,
  helpfulness: _helpfulness
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedCategory] = useState('all');
  const [activeView, setActiveView] = useState('overview');

  // Calculate analytics data
  const analytics: AnalyticsData = React.useMemo(() => {
    const totalViews = faqs.reduce((sum, faq) => sum + faq.views, 0);
    const totalHelpful = faqs.reduce((sum, faq) => sum + faq.helpful, 0);
    const totalNotHelpful = faqs.reduce((sum, faq) => sum + faq.notHelpful, 0);
    const averageHelpfulness = totalHelpful + totalNotHelpful > 0 
      ? (totalHelpful / (totalHelpful + totalNotHelpful)) * 100 
      : 0;

    // Top performing FAQs (high helpfulness ratio and views)
    const topPerforming = faqs
      .filter(faq => faq.helpful + faq.notHelpful >= 10) // Minimum votes for significance
      .sort((a, b) => (b.helpfulnessRatio * b.views) - (a.helpfulnessRatio * a.views))
      .slice(0, 5);

    // FAQs needing improvement (low helpfulness or many unhelpful votes)
    const needsImprovement = faqs
      .filter(faq => faq.helpful + faq.notHelpful >= 5)
      .sort((a, b) => a.helpfulnessRatio - b.helpfulnessRatio)
      .slice(0, 5);

    // Category performance
    const categoryPerformance = categories.map(category => {
      const categoryFAQs = faqs.filter(faq => faq.category.id === category.id);
      const totalViews = categoryFAQs.reduce((sum, faq) => sum + faq.views, 0);
      const totalVotes = categoryFAQs.reduce((sum, faq) => sum + faq.helpful + faq.notHelpful, 0);
      const helpfulVotes = categoryFAQs.reduce((sum, faq) => sum + faq.helpful, 0);
      const score = totalVotes > 0 ? (helpfulVotes / totalVotes) * 100 : 0;
      
      return {
        category,
        score,
        views: totalViews
      };
    }).sort((a, b) => b.score - a.score);

    // Mock search queries data
    const searchQueries = [
      { query: 'animal care', count: 245, results: 12 },
      { query: 'visiting hours', count: 189, results: 8 },
      { query: 'volunteering', count: 156, results: 15 },
      { query: 'donations', count: 134, results: 6 },
      { query: 'adoption process', count: 98, results: 9 },
      { query: 'feeding schedule', count: 87, results: 5 },
      { query: 'tours', count: 76, results: 4 },
      { query: 'educational programs', count: 65, results: 7 }
    ];

    // Mock daily views data
    const dailyViews = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      views: Math.floor(Math.random() * 100) + 50
    }));

    const improvementSuggestions = [
      'Add more visual content to low-performing FAQs',
      'Break down complex answers into numbered steps',
      'Include related links in answers with poor helpfulness',
      'Review and update outdated information',
      'Add video explanations for frequently misunderstood topics'
    ];

    return {
      totalViews,
      totalHelpful,
      totalNotHelpful,
      averageHelpfulness,
      topPerforming,
      needsImprovement,
      categoryPerformance,
      searchQueries,
      userEngagement: {
        dailyViews,
        helpfulnessRate: averageHelpfulness,
        improvementSuggestions
      }
    };
  }, [faqs, categories, selectedPeriod, selectedCategory]);

  const views = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'search', label: 'Search Analytics', icon: Search },
    { id: 'improvement', label: 'Improvement', icon: Target }
  ];

  const periodOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">FAQ Analytics</h3>
          <p className="text-sm text-gray-600">
            Monitor FAQ performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {periodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <AdminButton variant="outline" icon={Download}>
            Export Report
          </AdminButton>
        </div>
      </div>

      {/* View Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {views.map(view => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeView === view.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {view.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-800">Total Views</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {analytics.totalViews.toLocaleString()}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-xs text-blue-700 mt-1">+12% from last period</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Helpful Votes</p>
                  <p className="text-2xl font-bold text-green-900">
                    {analytics.totalHelpful.toLocaleString()}
                  </p>
                </div>
                <ThumbsUp className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-xs text-green-700 mt-1">
                {analytics.averageHelpfulness.toFixed(1)}% helpfulness rate
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-800">Needs Help</p>
                  <p className="text-2xl font-bold text-red-900">
                    {analytics.totalNotHelpful.toLocaleString()}
                  </p>
                </div>
                <ThumbsDown className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-xs text-red-700 mt-1">
                {analytics.needsImprovement.length} FAQs need attention
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-800">Engagement</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {((analytics.totalHelpful + analytics.totalNotHelpful) / analytics.totalViews * 100).toFixed(1)}%
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-xs text-purple-700 mt-1">User interaction rate</p>
            </div>
          </div>

          {/* Category Performance Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Category Performance
            </h4>
            <div className="space-y-3">
              {analytics.categoryPerformance.slice(0, 8).map((item, index) => (
                <div key={item.category.id} className="flex items-center gap-4">
                  <div className="w-8 text-sm text-gray-500 text-center">
                    #{index + 1}
                  </div>
                  <div 
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ backgroundColor: item.category.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 truncate">
                        {item.category.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.views.toLocaleString()} views
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {item.score.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'performance' && (
        <div className="space-y-6">
          {/* Top Performing FAQs */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Top Performing FAQs
            </h4>
            <div className="space-y-3">
              {analytics.topPerforming.map((faq, index) => (
                <div key={faq.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-2">
                      {faq.question}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {faq.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {(faq.helpfulnessRatio * 100).toFixed(1)}% helpful
                      </span>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {faq.category.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs Needing Improvement */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              FAQs Needing Improvement
            </h4>
            <div className="space-y-3">
              {analytics.needsImprovement.map(faq => (
                <div key={faq.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-2">
                      {faq.question}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {faq.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1 text-red-600">
                        <ThumbsDown className="w-4 h-4" />
                        {(faq.helpfulnessRatio * 100).toFixed(1)}% helpful
                      </span>
                      <span className="text-red-600">
                        {faq.notHelpful} unhelpful votes
                      </span>
                    </div>
                    <div className="mt-2">
                      <AdminButton variant="outline" size="sm">
                        Review & Improve
                      </AdminButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === 'search' && (
        <div className="space-y-6">
          {/* Search Queries */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Popular Search Queries
            </h4>
            <div className="space-y-3">
              {analytics.searchQueries.map((query, index) => (
                <div key={query.query} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-sm text-gray-500 text-center">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{query.query}</p>
                      <p className="text-sm text-gray-600">
                        {query.results} results found
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{query.count}</p>
                    <p className="text-sm text-gray-600">searches</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Performance Insights */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">
              Search Insights
            </h4>
            <div className="space-y-3 text-blue-800">
              <p>• Most searches are related to basic information and getting started</p>
              <p>• "Animal care" is the most popular topic - consider expanding this category</p>
              <p>• Several searches return few results - opportunity to create new content</p>
              <p>• Users often search for specific processes - consider step-by-step guides</p>
            </div>
          </div>
        </div>
      )}

      {activeView === 'improvement' && (
        <div className="space-y-6">
          {/* Improvement Suggestions */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              AI-Powered Improvement Suggestions
            </h4>
            <div className="space-y-4">
              {analytics.userEngagement.improvementSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-orange-800 text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-orange-800">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Quality Overview */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Content Quality Metrics
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Average SEO Score</span>
                  <span className="font-bold text-green-600">82%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Average Readability</span>
                  <span className="font-bold text-blue-600">Good</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">FAQs with Low Scores</span>
                  <span className="font-bold text-red-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Outdated Content</span>
                  <span className="font-bold text-yellow-600">12</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                User Feedback Summary
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Positive Feedback</span>
                  <span className="font-bold text-green-600">89%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Requests for More Detail</span>
                  <span className="font-bold text-blue-600">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Requests for Videos</span>
                  <span className="font-bold text-purple-600">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Outdated Information</span>
                  <span className="font-bold text-red-600">7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};