import React, { useState } from 'react';
import { FileText, Eye, Clock, Share2, TrendingUp, ExternalLink } from 'lucide-react';
import { ContentAnalytics as ContentAnalyticsType } from '../../../types/analytics';
import { topContent } from '../../../data/analyticsData';
import { AdminButton } from '../common/AdminButton';

interface ContentAnalyticsProps {
  timeRange?: string;
  category?: string[];
}

const ContentAnalytics: React.FC<ContentAnalyticsProps> = ({ 
  timeRange = '30days', 
  category = [] 
}) => {
  const [sortBy, setSortBy] = useState<'views' | 'engagement' | 'recent'>('views');
  const [filterType, setFilterType] = useState<'all' | 'blog' | 'faq' | 'resource' | 'page'>('all');

  // Filter and sort content based on current settings
  const filteredContent = topContent
    .filter(content => filterType === 'all' || content.type === filterType)
    .sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.views - a.views;
        case 'engagement':
          return (b.shares + (b.rating || 0) * 100) - (a.shares + (a.rating || 0) * 100);
        case 'recent':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'blog': return '📝';
      case 'faq': return '❓';
      case 'resource': return '📚';
      case 'page': return '📄';
      default: return '📄';
    }
  };

  const getEngagementScore = (content: ContentAnalyticsType) => {
    const baseScore = content.views * 0.1;
    const shareScore = content.shares * 5;
    const ratingScore = (content.rating || 0) * 20;
    const timeScore = Math.max(0, (content.timeOnPage - 60) * 0.1);
    const bounceScore = Math.max(0, (50 - content.bounceRate) * 2);
    
    return Math.round(baseScore + shareScore + ratingScore + timeScore + bounceScore);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Content Performance
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze content engagement and user behavior
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-0">
          {/* Content Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Content</option>
            <option value="blog">Blog Posts</option>
            <option value="faq">FAQ Entries</option>
            <option value="resource">Resources</option>
            <option value="page">Pages</option>
          </select>

          {/* Sort Options */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="views">Most Viewed</option>
            <option value="engagement">Highest Engagement</option>
            <option value="recent">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Content Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {topContent.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
              </p>
            </div>
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Time on Page</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(topContent.reduce((sum, item) => sum + item.timeOnPage, 0) / topContent.length)}s
              </p>
            </div>
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Shares</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {topContent.reduce((sum, item) => sum + item.shares, 0).toLocaleString()}
              </p>
            </div>
            <Share2 className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg. Bounce Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(topContent.reduce((sum, item) => sum + item.bounceRate, 0) / topContent.length).toFixed(1)}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            Content Performance Details
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContent.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-lg flex-shrink-0">
                        {getContentTypeIcon(content.type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {content.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {content.type}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {content.views.toLocaleString()}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {content.uniqueViews.toLocaleString()} unique
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 dark:text-gray-400">Time:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {content.timeOnPage}s
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 dark:text-gray-400">Shares:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {content.shares}
                        </span>
                      </div>
                      {content.rating && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 dark:text-gray-400">Rating:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            ⭐ {content.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Score:</span>
                        <span className="font-bold text-blue-600">
                          {getEngagementScore(content)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Bounce:</span>
                        <span className={`font-medium ${
                          content.bounceRate > 40 ? 'text-red-600' : 
                          content.bounceRate > 25 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {content.bounceRate}%
                        </span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(content.lastUpdated)}
                  </td>
                  
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <AdminButton
                      variant="outline"
                      size="sm"
                      icon={ExternalLink}
                    >
                      View
                    </AdminButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentAnalytics;