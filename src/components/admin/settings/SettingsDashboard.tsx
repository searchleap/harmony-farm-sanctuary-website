import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  FileText, 
  Users, 
  Plug, 
  Database,
  Save,
  RotateCcw,
  Search,
  Bell,
  Activity,
  Clock
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminBreadcrumbs } from '../common/AdminBreadcrumbs';
import GeneralSettings from './GeneralSettings';
import SecuritySettings from './SecuritySettings';
import ContentSettings from './ContentSettings';
import UserRoleManager from './UserRoleManager';
import IntegrationSettings from './IntegrationSettings';
import APIConfiguration from './APIConfiguration';

type SettingsTab = 'general' | 'security' | 'content' | 'users' | 'integrations' | 'api';

interface SettingsTabInfo {
  id: SettingsTab;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  badge?: {
    text: string;
    color: 'blue' | 'green' | 'yellow' | 'red';
  };
}

const SettingsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const tabs: SettingsTabInfo[] = [
    {
      id: 'general',
      name: 'General',
      icon: Settings,
      description: 'Site information and basic configuration'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Authentication and access control',
      badge: { text: 'Critical', color: 'red' }
    },
    {
      id: 'content',
      name: 'Content',
      icon: FileText,
      description: 'Content management and publishing settings'
    },
    {
      id: 'users',
      name: 'User Roles',
      icon: Users,
      description: 'User roles and permissions management',
      badge: { text: '5 Roles', color: 'blue' }
    },
    {
      id: 'integrations',
      name: 'Integrations',
      icon: Plug,
      description: 'Third-party services and connections',
      badge: { text: '3 Active', color: 'green' }
    },
    {
      id: 'api',
      name: 'API Config',
      icon: Database,
      description: 'API endpoints and external services'
    }
  ];

  const getBadgeStyles = (color: string) => {
    const styles = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return styles[color as keyof typeof styles];
  };

  const handleSaveAll = () => {
    console.log('Saving all settings...');
    setHasUnsavedChanges(false);
    // TODO: Implement save functionality
  };

  const handleResetAll = () => {
    console.log('Resetting all settings...');
    setHasUnsavedChanges(false);
    // TODO: Implement reset functionality
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'security':
        return <SecuritySettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'content':
        return <ContentSettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'users':
        return <UserRoleManager onChange={() => setHasUnsavedChanges(true)} />;
      case 'integrations':
        return <IntegrationSettings onChange={() => setHasUnsavedChanges(true)} />;
      case 'api':
        return <APIConfiguration onChange={() => setHasUnsavedChanges(true)} />;
      default:
        return <GeneralSettings onChange={() => setHasUnsavedChanges(true)} />;
    }
  };

  const filteredTabs = tabs.filter(tab =>
    tab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <AdminBreadcrumbs
            items={[
              { label: 'Admin', href: '/admin' },
              { label: 'Settings', href: '/admin/settings' }
            ]}
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Settings & Configuration
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your sanctuary's system settings and configuration
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {hasUnsavedChanges && (
            <AdminButton
              variant="outline"
              onClick={handleResetAll}
              icon={RotateCcw}
              className="text-gray-600"
            >
              Reset Changes
            </AdminButton>
          )}
          <AdminButton
            variant={hasUnsavedChanges ? "primary" : "outline"}
            onClick={handleSaveAll}
            icon={Save}
          >
            {hasUnsavedChanges ? 'Save Changes' : 'All Saved'}
          </AdminButton>
        </div>
      </div>

      {/* Settings Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">2 hours ago</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">API Health</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">Healthy</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Alerts</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">2</p>
            </div>
            <Bell className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Settings Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Settings Categories
            </h2>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-4" aria-label="Settings tabs">
            {filteredTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                  {tab.badge && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeStyles(tab.badge.color)}`}>
                      {tab.badge.text}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {filteredTabs.length === 0 ? (
            <div className="text-center py-8">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No settings found
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Try adjusting your search query to find what you're looking for.
              </p>
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              You have unsaved changes
            </span>
            <div className="flex gap-2">
              <AdminButton
                size="sm"
                variant="outline"
                onClick={handleResetAll}
              >
                Discard
              </AdminButton>
              <AdminButton
                size="sm"
                variant="primary"
                onClick={handleSaveAll}
              >
                Save
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDashboard;