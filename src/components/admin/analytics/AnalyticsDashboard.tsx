import React, { useState } from 'react';
import { BarChart3, Calendar, RefreshCw } from 'lucide-react';
import { AnalyticsFilter } from '../../../types/analytics';
import { dashboardData, kpiMetrics } from '../../../data/analyticsData';
import MetricsWidget from './MetricsWidget';
import AnalyticsFilters from './AnalyticsFilters';
import DataExportTool from './DataExportTool';
import { AdminButton } from '../common/AdminButton';

const AnalyticsDashboard: React.FC = () => {
  const [filters, setFilters] = useState<AnalyticsFilter>({
    category: [],
    dateRange: {
      start: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      end: new Date(),
      preset: '30days'
    },
    metrics: [],
    groupBy: 'day'
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const availableMetrics = ['animals', 'donations', 'volunteers', 'content', 'engagement'];
  const availableCategories = ['Sanctuary Operations', 'Financial', 'Community', 'Content'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive insights into sanctuary operations and performance
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-1" />
            Last updated: {dashboardData.lastUpdated.toLocaleDateString()}
          </div>
          <AdminButton
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            loading={isRefreshing}
            icon={RefreshCw}
          >
            Refresh
          </AdminButton>
          <DataExportTool
            data={[dashboardData.sanctuary]}
            filters={filters}
            filename="sanctuary-analytics"
            title="Export Analytics Data"
          />
        </div>
      </div>

      {/* Filters */}
      <AnalyticsFilters
        filters={filters}
        onFiltersChange={setFilters}
        availableMetrics={availableMetrics}
        availableCategories={availableCategories}
      />

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiMetrics.map((metric) => (
          <MetricsWidget key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sanctuary Operations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sanctuary Operations
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Animals</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {dashboardData.sanctuary.animals.total}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">New Rescues (Month)</span>
              <span className="text-lg font-semibold text-green-600">
                +{dashboardData.sanctuary.animals.newRescues}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Animals in Medical Care</span>
              <span className="text-lg font-semibold text-orange-600">
                {dashboardData.sanctuary.animals.medical}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Successful Adoptions</span>
              <span className="text-lg font-semibold text-blue-600">
                {dashboardData.sanctuary.animals.adoptions}
              </span>
            </div>
          </div>
        </div>

        {/* Community Engagement */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Community Engagement
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Volunteers</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {dashboardData.sanctuary.volunteers.active}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Monthly Volunteer Hours</span>
              <span className="text-lg font-semibold text-purple-600">
                {dashboardData.sanctuary.volunteers.hours.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Newsletter Subscribers</span>
              <span className="text-lg font-semibold text-indigo-600">
                {dashboardData.sanctuary.engagement.newsletter.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Event Attendance</span>
              <span className="text-lg font-semibold text-teal-600">
                {dashboardData.sanctuary.engagement.eventAttendance}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Species Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Animal Population by Species
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(dashboardData.sanctuary.animals.species).map(([species, count]) => (
            <div key={species} className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{count}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{species}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Performance Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="text-green-800 dark:text-green-300 text-sm font-medium">
              Donation Growth
            </div>
            <div className="text-2xl font-bold text-green-900 dark:text-green-200 mt-1">
              +6.29%
            </div>
            <div className="text-green-700 dark:text-green-400 text-sm">
              vs previous month
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="text-blue-800 dark:text-blue-300 text-sm font-medium">
              Volunteer Retention
            </div>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-1">
              87.3%
            </div>
            <div className="text-blue-700 dark:text-blue-400 text-sm">
              retention rate
            </div>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="text-purple-800 dark:text-purple-300 text-sm font-medium">
              Website Traffic
            </div>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-200 mt-1">
              +7.23%
            </div>
            <div className="text-purple-700 dark:text-purple-400 text-sm">
              unique visitors
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;