import React from 'react';
import AnalyticsDashboard from '../../components/admin/analytics/AnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <AnalyticsDashboard />
      </div>
    </div>
  );
};

export default AnalyticsPage;