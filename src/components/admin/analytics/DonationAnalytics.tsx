import React, { useState } from 'react';
import { DollarSign, TrendingUp, Users, CreditCard, Calendar, Target } from 'lucide-react';
import { DonationAnalytics as DonationAnalyticsType } from '../../../types/analytics';
import { donationAnalytics } from '../../../data/analyticsData';

interface DonationAnalyticsProps {
  timeRange?: string;
}

const DonationAnalytics: React.FC<DonationAnalyticsProps> = ({ timeRange = '30days' }) => {
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'donors' | 'campaigns'>('revenue');
  
  const currentData = donationAnalytics[0]; // Using first month as current data

  const donationMetrics = [
    {
      id: 'total-revenue',
      name: 'Total Revenue',
      value: currentData.totalAmount,
      change: 6.29,
      changeType: 'increase' as const,
      icon: DollarSign,
      color: 'text-green-600',
      format: 'currency'
    },
    {
      id: 'donor-count',
      name: 'Active Donors',
      value: currentData.donorCount,
      change: 4.8,
      changeType: 'increase' as const,
      icon: Users,
      color: 'text-blue-600',
      format: 'number'
    },
    {
      id: 'avg-donation',
      name: 'Average Donation',
      value: currentData.averageDonation,
      change: 2.1,
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'text-purple-600',
      format: 'currency'
    },
    {
      id: 'recurring-ratio',
      name: 'Recurring Donors',
      value: (currentData.recurringDonations / currentData.totalAmount) * 100,
      change: 8.5,
      changeType: 'increase' as const,
      icon: Calendar,
      color: 'text-orange-600',
      format: 'percentage'
    }
  ];

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'number':
      default:
        return value.toLocaleString();
    }
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    const color = change >= 0 ? 'text-green-600' : 'text-red-600';
    return (
      <span className={`text-xs font-medium ${color}`}>
        {sign}{change.toFixed(1)}%
      </span>
    );
  };

  const getDonorRetentionData = () => {
    return [
      { period: 'New Donors', count: 234, percentage: 26.2 },
      { period: '1-3 Months', count: 189, percentage: 21.2 },
      { period: '3-6 Months', count: 167, percentage: 18.7 },
      { period: '6-12 Months', count: 145, percentage: 16.3 },
      { period: '1+ Years', count: 157, percentage: 17.6 }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Donation & Financial Analytics
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Track donation trends and financial performance
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="revenue">Revenue Focus</option>
            <option value="donors">Donor Focus</option>
            <option value="campaigns">Campaign Focus</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {donationMetrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <div key={metric.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${metric.color}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                {formatChange(metric.change)}
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {metric.name}
                </h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatValue(metric.value, metric.format)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Donation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Types */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Donation Types
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Recurring Donations
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatValue(currentData.recurringDonations, 'currency')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {((currentData.recurringDonations / currentData.totalAmount) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  One-time Donations
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatValue(currentData.oneTimeDonations, 'currency')}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {((currentData.oneTimeDonations / currentData.totalAmount) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-l-full" 
                style={{ width: `${(currentData.recurringDonations / currentData.totalAmount) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Payment Methods
          </h4>
          
          <div className="space-y-4">
            {Object.entries(currentData.paymentMethods).map(([method, percentage]) => (
              <div key={method} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {method}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Active Campaigns
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentData.campaigns.map((campaign, index) => {
            const progress = (campaign.raised / campaign.goal) * 100;
            return (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white">
                    {campaign.name}
                  </h5>
                  <Target className="w-4 h-4 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Raised:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatValue(campaign.raised, 'currency')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Goal:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatValue(campaign.goal, 'currency')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Donors:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {campaign.donors}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        progress >= 100 ? 'bg-green-600' : 
                        progress >= 75 ? 'bg-blue-600' : 
                        progress >= 50 ? 'bg-yellow-600' : 'bg-red-600'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-center">
                    <span className={`text-lg font-bold ${
                      progress >= 100 ? 'text-green-600' : 
                      progress >= 75 ? 'text-blue-600' : 
                      progress >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donor Retention */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Donor Retention Analysis
        </h4>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Donor Segment
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Distribution
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {getDonorRetentionData().map((segment, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {segment.period}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {segment.count.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {segment.percentage.toFixed(1)}%
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${segment.percentage}%` }}
                        ></div>
                      </div>
                    </div>
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

export default DonationAnalytics;