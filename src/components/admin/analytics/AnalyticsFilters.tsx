import React, { useState } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { AnalyticsFilter, AnalyticsTimeRange } from '../../../types/analytics';
import { AdminButton } from '../common/AdminButton';

interface AnalyticsFiltersProps {
  filters: AnalyticsFilter;
  onFiltersChange: (filters: AnalyticsFilter) => void;
  availableMetrics: string[];
  availableCategories: string[];
}

const AnalyticsFilters: React.FC<AnalyticsFiltersProps> = ({
  filters,
  onFiltersChange,
  availableMetrics,
  availableCategories
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const timeRangePresets = [
    { value: 'today', label: 'Today' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: '1year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleTimeRangeChange = (preset: string) => {
    const now = new Date();
    let start = new Date();
    
    switch (preset) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '7days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90days':
        start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        return;
    }

    const newTimeRange: AnalyticsTimeRange = {
      start,
      end: now,
      preset: preset as any
    };

    onFiltersChange({
      ...filters,
      dateRange: newTimeRange
    });
  };

  const handleMetricToggle = (metric: string) => {
    const newMetrics = filters.metrics.includes(metric)
      ? filters.metrics.filter(m => m !== metric)
      : [...filters.metrics, metric];
    
    onFiltersChange({
      ...filters,
      metrics: newMetrics
    });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category];
    
    onFiltersChange({
      ...filters,
      category: newCategories
    });
  };

  const resetFilters = () => {
    const defaultFilters: AnalyticsFilter = {
      category: [],
      dateRange: {
        start: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
        end: new Date(),
        preset: '30days'
      },
      metrics: [],
      groupBy: 'day'
    };
    onFiltersChange(defaultFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Analytics Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          <AdminButton
            variant="outline"
            size="sm"
            onClick={resetFilters}
            icon={RotateCcw}
          >
            Reset
          </AdminButton>
          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Less Filters' : 'More Filters'}
          </AdminButton>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Time Range
        </label>
        <div className="flex flex-wrap gap-2">
          {timeRangePresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handleTimeRangeChange(preset.value)}
              className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                filters.dateRange.preset === preset.value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Group By Selector */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Group By
        </label>
        <select
          value={filters.groupBy}
          onChange={(e) => onFiltersChange({ ...filters, groupBy: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
          <option value="quarter">Quarterly</option>
        </select>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Metrics Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Metrics
            </label>
            <div className="flex flex-wrap gap-2">
              {availableMetrics.map((metric) => (
                <button
                  key={metric}
                  onClick={() => handleMetricToggle(metric)}
                  className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                    filters.metrics.includes(metric)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-1 text-sm rounded-md border transition-colors ${
                    filters.category.includes(category)
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Date Range */}
      {filters.dateRange.preset === 'custom' && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => {
                const newStart = new Date(e.target.value);
                onFiltersChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, start: newStart }
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => {
                const newEnd = new Date(e.target.value);
                onFiltersChange({
                  ...filters,
                  dateRange: { ...filters.dateRange, end: newEnd }
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsFilters;