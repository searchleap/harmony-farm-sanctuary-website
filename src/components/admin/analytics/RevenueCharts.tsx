import React, { useState } from 'react';
import { TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';

interface ChartData {
  label: string;
  value: number;
  change?: number;
  color?: string;
}

interface RevenueChartsProps {
  timeRange?: string;
}

const RevenueCharts: React.FC<RevenueChartsProps> = ({ timeRange = '6months' }) => {
  const [selectedChart, setSelectedChart] = useState<'trend' | 'sources' | 'forecast'>('trend');

  // Sample revenue trend data
  const revenueTrendData: ChartData[] = [
    { label: 'Aug 2023', value: 98450, change: 5.2 },
    { label: 'Sep 2023', value: 102340, change: 3.9 },
    { label: 'Oct 2023', value: 108920, change: 6.4 },
    { label: 'Nov 2023', value: 115670, change: 6.2 },
    { label: 'Dec 2023', value: 134590, change: 16.4 },
    { label: 'Jan 2024', value: 125670, change: -6.6 }
  ];

  // Revenue sources data
  const revenueSourcesData: ChartData[] = [
    { label: 'Individual Donations', value: 89250, color: 'bg-blue-600' },
    { label: 'Monthly Sponsorships', value: 23450, color: 'bg-green-600' },
    { label: 'Corporate Partnerships', value: 8920, color: 'bg-purple-600' },
    { label: 'Fundraising Events', value: 4050, color: 'bg-orange-600' }
  ];

  // Revenue forecast data
  const revenueForecastData: ChartData[] = [
    { label: 'Feb 2024', value: 132000, change: 5.0 },
    { label: 'Mar 2024', value: 128500, change: -2.7 },
    { label: 'Apr 2024', value: 135000, change: 5.1 },
    { label: 'May 2024', value: 142000, change: 5.2 },
    { label: 'Jun 2024', value: 148000, change: 4.2 }
  ];

  const getTotalRevenue = (data: ChartData[]) => {
    return data.reduce((sum, item) => sum + item.value, 0);
  };

  const getMaxValue = (data: ChartData[]) => {
    return Math.max(...data.map(item => item.value));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
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

  const renderTrendChart = () => {
    const maxValue = getMaxValue(revenueTrendData);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-base font-medium text-gray-900 dark:text-white">
            Revenue Trend
          </h5>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: {formatCurrency(getTotalRevenue(revenueTrendData))}
          </div>
        </div>
        
        <div className="space-y-3">
          {revenueTrendData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-16">
                  {item.label.split(' ')[0]}
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3 relative">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-3">
                <span className="text-sm font-bold text-gray-900 dark:text-white w-20 text-right">
                  {formatCurrency(item.value)}
                </span>
                {item.change && formatChange(item.change)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSourcesChart = () => {
    const totalRevenue = getTotalRevenue(revenueSourcesData);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-base font-medium text-gray-900 dark:text-white">
            Revenue Sources
          </h5>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: {formatCurrency(totalRevenue)}
          </div>
        </div>
        
        <div className="space-y-4">
          {revenueSourcesData.map((item, index) => {
            const percentage = (item.value / totalRevenue) * 100;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatCurrency(item.value)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${item.color?.replace('bg-', 'bg-')}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderForecastChart = () => {
    const maxValue = getMaxValue(revenueForecastData);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-base font-medium text-gray-900 dark:text-white">
            Revenue Forecast
          </h5>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Projected: {formatCurrency(getTotalRevenue(revenueForecastData))}
          </div>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              Forecast based on current trends and seasonal patterns
            </span>
          </div>
        </div>
        
        <div className="space-y-3">
          {revenueForecastData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-16">
                  {item.label.split(' ')[0]}
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-3 relative">
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 opacity-80" 
                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-3">
                <span className="text-sm font-bold text-gray-900 dark:text-white w-20 text-right">
                  {formatCurrency(item.value)}
                </span>
                {item.change && formatChange(item.change)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Chart Selection */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Revenue Analysis
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Financial performance visualization and forecasting
          </p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <button
            onClick={() => setSelectedChart('trend')}
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
              selectedChart === 'trend'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-1" />
            Trend
          </button>
          
          <button
            onClick={() => setSelectedChart('sources')}
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
              selectedChart === 'sources'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <PieChart className="w-4 h-4 inline mr-1" />
            Sources
          </button>
          
          <button
            onClick={() => setSelectedChart('forecast')}
            className={`px-3 py-2 text-sm rounded-md border transition-colors ${
              selectedChart === 'forecast'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-1" />
            Forecast
          </button>
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {selectedChart === 'trend' && renderTrendChart()}
        {selectedChart === 'sources' && renderSourcesChart()}
        {selectedChart === 'forecast' && renderForecastChart()}
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Monthly Average</p>
              <p className="text-2xl font-bold">
                {formatCurrency(getTotalRevenue(revenueTrendData) / revenueTrendData.length)}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Best Month</p>
              <p className="text-2xl font-bold">
                {formatCurrency(Math.max(...revenueTrendData.map(d => d.value)))}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Growth Rate</p>
              <p className="text-2xl font-bold">+6.8%</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueCharts;