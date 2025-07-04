import React from 'react';
import { AnalyticsMetric } from '../../../types/analytics';
import { formatMetricValue, formatChangeValue, getChangeIcon, getChangeColor } from '../../../data/analyticsData';
import * as Icons from 'lucide-react';

interface MetricsWidgetProps {
  metric: AnalyticsMetric;
  variant?: 'default' | 'compact' | 'detailed';
  showTrend?: boolean;
}

const MetricsWidget: React.FC<MetricsWidgetProps> = ({ 
  metric, 
  variant = 'default',
  showTrend = true 
}) => {
  const IconComponent = Icons[metric.icon as keyof typeof Icons] as React.ComponentType<any>;
  const ChangeIconComponent = Icons[getChangeIcon(metric.changeType) as keyof typeof Icons] as React.ComponentType<any>;

  if (variant === 'compact') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${metric.color}`}>
              <IconComponent className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {formatMetricValue(metric.value, metric.format)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{metric.name}</p>
            </div>
          </div>
          {showTrend && (
            <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
              <ChangeIconComponent className="w-3 h-3" />
              <span className="text-xs font-medium">{formatChangeValue(metric.change)}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${metric.color}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{metric.name}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatMetricValue(metric.value, metric.format)}
              </p>
            </div>
          </div>
          {showTrend && (
            <div className="text-right">
              <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
                <ChangeIconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{formatChangeValue(metric.change)}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                vs previous period
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Previous:</span>
            <span className="text-gray-900 dark:text-white font-medium">
              {formatMetricValue(metric.previousValue, metric.format)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${metric.color}`}>
            <IconComponent className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric.name}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatMetricValue(metric.value, metric.format)}
            </p>
          </div>
        </div>
      </div>
      
      {showTrend && (
        <div className="mt-4 flex items-center justify-between">
          <div className={`flex items-center space-x-1 ${getChangeColor(metric.changeType)}`}>
            <ChangeIconComponent className="w-4 h-4" />
            <span className="text-sm font-medium">{formatChangeValue(metric.change)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">vs last period</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsWidget;