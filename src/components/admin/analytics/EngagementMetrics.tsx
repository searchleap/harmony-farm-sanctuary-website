import React, { useState } from 'react';
import { Users, MousePointer, ThumbsUp, MessageCircle, Share2, Download, ArrowUp, ArrowDown } from 'lucide-react';

interface EngagementMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: string;
  color: string;
  description: string;
}

interface UserBehaviorData {
  event: string;
  count: number;
  percentage: number;
  avgDuration?: number;
  conversionRate?: number;
}

const EngagementMetrics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | '90days'>('30days');

  const engagementMetrics: EngagementMetric[] = [
    {
      id: 'page-views',
      name: 'Page Views',
      value: 45230,
      previousValue: 42180,
      change: 7.23,
      changeType: 'increase',
      icon: 'Eye',
      color: 'text-blue-600',
      description: 'Total pages viewed by visitors'
    },
    {
      id: 'unique-visitors',
      name: 'Unique Visitors',
      value: 8420,
      previousValue: 7890,
      change: 6.72,
      changeType: 'increase',
      icon: 'Users',
      color: 'text-green-600',
      description: 'Unique individuals visiting the site'
    },
    {
      id: 'session-duration',
      name: 'Avg. Session Duration',
      value: 342,
      previousValue: 318,
      change: 7.55,
      changeType: 'increase',
      icon: 'Clock',
      color: 'text-purple-600',
      description: 'Average time spent per session (seconds)'
    },
    {
      id: 'bounce-rate',
      name: 'Bounce Rate',
      value: 23.4,
      previousValue: 28.1,
      change: -16.73,
      changeType: 'increase',
      icon: 'TrendingDown',
      color: 'text-green-600',
      description: 'Percentage of single-page sessions'
    },
    {
      id: 'form-submissions',
      name: 'Form Submissions',
      value: 1240,
      previousValue: 1120,
      change: 10.71,
      changeType: 'increase',
      icon: 'FileText',
      color: 'text-orange-600',
      description: 'Contact forms and applications submitted'
    },
    {
      id: 'newsletter-signups',
      name: 'Newsletter Signups',
      value: 890,
      previousValue: 820,
      change: 8.54,
      changeType: 'increase',
      icon: 'Mail',
      color: 'text-indigo-600',
      description: 'New newsletter subscribers'
    }
  ];

  const userBehaviorData: UserBehaviorData[] = [
    {
      event: 'Homepage Visit',
      count: 12450,
      percentage: 27.5,
      avgDuration: 145,
      conversionRate: 12.3
    },
    {
      event: 'Animal Profile View',
      count: 8920,
      percentage: 19.7,
      avgDuration: 245,
      conversionRate: 8.7
    },
    {
      event: 'Blog Post Read',
      count: 6780,
      percentage: 15.0,
      avgDuration: 320,
      conversionRate: 15.2
    },
    {
      event: 'Donation Page Visit',
      count: 3240,
      percentage: 7.2,
      avgDuration: 180,
      conversionRate: 22.4
    },
    {
      event: 'Volunteer Application',
      count: 1890,
      percentage: 4.2,
      avgDuration: 420,
      conversionRate: 67.8
    },
    {
      event: 'Contact Form View',
      count: 2340,
      percentage: 5.2,
      avgDuration: 160,
      conversionRate: 34.5
    },
    {
      event: 'FAQ Search',
      count: 4560,
      percentage: 10.1,
      avgDuration: 90,
      conversionRate: 45.2
    },
    {
      event: 'Resource Download',
      count: 1240,
      percentage: 2.7,
      avgDuration: 60,
      conversionRate: 78.9
    }
  ];

  const socialEngagement = {
    shares: {
      facebook: 1420,
      twitter: 890,
      instagram: 2340,
      linkedin: 560
    },
    interactions: {
      likes: 5670,
      comments: 890,
      follows: 1240
    }
  };

  const formatValue = (value: number, metric: EngagementMetric) => {
    if (metric.id === 'session-duration') {
      const minutes = Math.floor(value / 60);
      const seconds = value % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    if (metric.id === 'bounce-rate') {
      return `${value}%`;
    }
    return value.toLocaleString();
  };

  const formatChange = (change: number, isImprovement: boolean) => {
    const sign = change >= 0 ? '+' : '';
    const color = isImprovement 
      ? (change >= 0 ? 'text-green-600' : 'text-red-600')
      : (change >= 0 ? 'text-red-600' : 'text-green-600');
    
    return (
      <span className={`flex items-center ${color}`}>
        {change >= 0 ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
        {sign}{change.toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            User Engagement Metrics
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Track user interactions and behavior patterns
          </p>
        </div>
        
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as any)}
          className="mt-4 lg:mt-0 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      {/* Engagement Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {engagementMetrics.map((metric) => (
          <div key={metric.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${metric.color}`}>
                {metric.icon === 'Eye' && <MousePointer className="w-5 h-5" />}
                {metric.icon === 'Users' && <Users className="w-5 h-5" />}
                {metric.icon === 'Clock' && <Users className="w-5 h-5" />}
                {metric.icon === 'TrendingDown' && <ArrowDown className="w-5 h-5" />}
                {metric.icon === 'FileText' && <Download className="w-5 h-5" />}
                {metric.icon === 'Mail' && <Share2 className="w-5 h-5" />}
              </div>
              {formatChange(metric.change, metric.id === 'bounce-rate' ? metric.change < 0 : metric.change > 0)}
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {metric.name}
              </h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatValue(metric.value, metric)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {metric.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* User Behavior Flow */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          User Behavior Analysis
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  % of Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Avg. Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Conversion Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {userBehaviorData.map((behavior, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {behavior.event}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {behavior.count.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${behavior.percentage}%` }}
                        ></div>
                      </div>
                      {behavior.percentage}%
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {behavior.avgDuration ? `${Math.floor(behavior.avgDuration / 60)}:${(behavior.avgDuration % 60).toString().padStart(2, '0')}` : '-'}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`font-medium ${
                      (behavior.conversionRate || 0) > 50 ? 'text-green-600' : 
                      (behavior.conversionRate || 0) > 25 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {behavior.conversionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Social Media Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Social Shares
          </h4>
          <div className="space-y-4">
            {Object.entries(socialEngagement.shares).map(([platform, count]) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {platform.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {platform}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Social Interactions
          </h4>
          <div className="space-y-4">
            {Object.entries(socialEngagement.interactions).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {type === 'likes' && <ThumbsUp className="w-4 h-4 text-blue-600" />}
                    {type === 'comments' && <MessageCircle className="w-4 h-4 text-green-600" />}
                    {type === 'follows' && <Users className="w-4 h-4 text-purple-600" />}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {type}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementMetrics;