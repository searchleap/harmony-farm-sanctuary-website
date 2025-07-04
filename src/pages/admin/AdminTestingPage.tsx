import React, { useState } from 'react';
import { AdminBreadcrumbs } from '../../components/admin/common/AdminBreadcrumbs';
import AdminTestSuite from '../../components/admin/testing/AdminTestSuite';
import ComponentTester from '../../components/admin/testing/ComponentTester';
import DataValidationTester from '../../components/admin/testing/DataValidationTester';
import PlaywrightTester from '../../components/admin/testing/PlaywrightTester';
import AdminDocumentation from '../../components/admin/testing/AdminDocumentation';
import ComponentDocGenerator from '../../components/admin/testing/ComponentDocGenerator';
import PerformanceMonitor from '../../components/admin/testing/PerformanceMonitor';

type TestingTab = 'suite' | 'components' | 'validation' | 'playwright' | 'docs' | 'component-docs' | 'performance';

interface TestingTabInfo {
  id: TestingTab;
  name: string;
  description: string;
}

const AdminTestingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TestingTab>('suite');

  const tabs: TestingTabInfo[] = [
    {
      id: 'suite',
      name: 'Test Suite',
      description: 'Comprehensive admin functionality testing'
    },
    {
      id: 'components',
      name: 'Component Tester',
      description: 'Interactive UI component testing'
    },
    {
      id: 'validation',
      name: 'Data Validation',
      description: 'Data integrity and validation testing'
    },
    {
      id: 'playwright',
      name: 'E2E Testing',
      description: 'Automated browser testing with Playwright'
    },
    {
      id: 'docs',
      name: 'Documentation',
      description: 'Admin system user guides and API docs'
    },
    {
      id: 'component-docs',
      name: 'Component Docs',
      description: 'Auto-generated component documentation'
    },
    {
      id: 'performance',
      name: 'Performance',
      description: 'Real-time performance monitoring and optimization'
    }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'suite':
        return <AdminTestSuite />;
      case 'components':
        return <ComponentTester />;
      case 'validation':
        return <DataValidationTester />;
      case 'playwright':
        return <PlaywrightTester />;
      case 'docs':
        return <AdminDocumentation />;
      case 'component-docs':
        return <ComponentDocGenerator />;
      case 'performance':
        return <PerformanceMonitor />;
      default:
        return <AdminTestSuite />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <AdminBreadcrumbs
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Testing', href: '/admin/testing' }
          ]}
        />

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <span>{tab.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {tab.description}
                    </span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {renderActiveTab()}
        </div>
      </div>
    </div>
  );
};

export default AdminTestingPage;