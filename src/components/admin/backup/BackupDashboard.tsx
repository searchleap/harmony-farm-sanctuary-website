import React, { useState } from 'react';
import { 
  Database, 
  Clock, 
  HardDrive, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Play,
  Calendar,
  Download,
  FileText,
  Settings,
  RotateCcw,
  TrendingUp,
  Activity
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminBreadcrumbs } from '../common/AdminBreadcrumbs';
import { AdminStatusBadge } from '../common/AdminStatusBadge';
import BackupScheduler from './BackupScheduler';
import DataExportTool from './DataExportTool';
import DataImportTool from './DataImportTool';
import BackupHistory from './BackupHistory';
import BackupVerification from './BackupVerification';
import DataMigration from './DataMigration';
import { 
  sampleBackupStats, 
  sampleBackupHealthCheck, 
  getRecentBackupFiles,
  getActiveBackupJobs
} from '../../../data/backupData';
import { formatDuration } from '../../../utils/backupService';

type BackupTab = 'overview' | 'scheduler' | 'export' | 'import' | 'history' | 'verification' | 'migration';

interface BackupTabInfo {
  id: BackupTab;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  badge?: {
    text: string;
    color: 'blue' | 'green' | 'yellow' | 'red';
  };
}

const BackupDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BackupTab>('overview');
  const [runningBackup, setRunningBackup] = useState<string | null>(null);

  const stats = sampleBackupStats;
  const healthCheck = sampleBackupHealthCheck;
  const recentBackups = getRecentBackupFiles(5);
  const activeJobs = getActiveBackupJobs();

  const tabs: BackupTabInfo[] = [
    {
      id: 'overview',
      name: 'Overview',
      icon: Database,
      description: 'Backup system status and quick actions'
    },
    {
      id: 'scheduler',
      name: 'Scheduler',
      icon: Calendar,
      description: 'Automated backup scheduling',
      badge: { text: `${activeJobs.length} Active`, color: 'green' }
    },
    {
      id: 'export',
      name: 'Export',
      icon: Download,
      description: 'Data export tools and templates'
    },
    {
      id: 'import',
      name: 'Import',
      icon: FileText,
      description: 'Data import and validation tools'
    },
    {
      id: 'history',
      name: 'History',
      icon: Clock,
      description: 'Backup history and file management',
      badge: { text: `${stats.totalBackups}`, color: 'blue' }
    },
    {
      id: 'verification',
      name: 'Verification',
      icon: Shield,
      description: 'Backup integrity and verification'
    },
    {
      id: 'migration',
      name: 'Migration',
      icon: RotateCcw,
      description: 'Data migration between environments'
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

  const runManualBackup = async (jobId: string) => {
    setRunningBackup(jobId);
    // Simulate backup execution
    await new Promise(resolve => setTimeout(resolve, 3000));
    setRunningBackup(null);
    // TODO: Implement actual backup execution
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600 dark:text-green-400';
      case 'warning': return 'text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* System Health Status */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-3 w-3 rounded-full ${healthCheck.overallHealth === 'healthy' ? 'bg-green-500' : healthCheck.overallHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Backup System Health
              </h3>
              <p className={`font-medium ${getHealthColor(healthCheck.overallHealth)}`}>
                {healthCheck.overallHealth.charAt(0).toUpperCase() + healthCheck.overallHealth.slice(1)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Last Check</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {healthCheck.timestamp.toLocaleString()}
            </p>
          </div>
        </div>
        
        {healthCheck.issues.length > 0 && (
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Issues & Recommendations</h4>
            <div className="space-y-2">
              {healthCheck.issues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{issue.message}</p>
                    {issue.resolution && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{issue.resolution}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Backups</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBackups}</p>
            </div>
            <Database className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {stats.successfulBackups} successful, {stats.failedBackups} failed
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSizeFormatted}</p>
            </div>
            <HardDrive className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.storageUsagePercent}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {stats.storageUsagePercent}% of allocated storage
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((stats.successfulBackups / stats.totalBackups) * 100)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Last 30 days average
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatDuration(stats.averageBackupTime)}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Per backup execution
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeJobs.slice(0, 3).map((job) => (
              <div key={job.id} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">{job.name}</h4>
                  <AdminStatusBadge variant={job.status === 'active' ? 'success' : job.status === 'error' ? 'error' : 'warning'}>
                    {job.status}
                  </AdminStatusBadge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {job.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Next: {job.nextRun?.toLocaleString() || 'Not scheduled'}
                  </span>
                  <AdminButton
                    size="sm"
                    variant="outline"
                    onClick={() => runManualBackup(job.id)}
                    loading={runningBackup === job.id}
                    icon={Play}
                  >
                    Run Now
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Backup Files */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Backups</h3>
            <AdminButton
              size="sm"
              variant="outline"
              onClick={() => setActiveTab('history')}
            >
              View All
            </AdminButton>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentBackups.map((backup) => (
            <div key={backup.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {backup.verified ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{backup.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {backup.sizeFormatted} • {backup.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AdminStatusBadge variant="success">{backup.format.toUpperCase()}</AdminStatusBadge>
                <AdminButton
                  size="sm"
                  variant="outline"
                  icon={Download}
                >
                  Download
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Scheduled Backup */}
      {healthCheck.nextScheduledBackup && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-blue-500" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                Next Scheduled Backup
              </h4>
              <p className="text-blue-700 dark:text-blue-300">
                {healthCheck.nextScheduledBackup.toLocaleString()} ({Math.round((healthCheck.nextScheduledBackup.getTime() - Date.now()) / (1000 * 60 * 60))} hours from now)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'scheduler':
        return <BackupScheduler />;
      case 'export':
        return <DataExportTool />;
      case 'import':
        return <DataImportTool />;
      case 'history':
        return <BackupHistory />;
      case 'verification':
        return <BackupVerification />;
      case 'migration':
        return <DataMigration />;
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <AdminBreadcrumbs
            items={[
              { label: 'Admin', href: '/admin' },
              { label: 'Backup & Export', href: '/admin/backup' }
            ]}
          />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Backup & Export Functions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage backups, exports, and data migration for your sanctuary
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <AdminButton
            variant="outline"
            onClick={() => setActiveTab('export')}
            icon={Download}
          >
            Quick Export
          </AdminButton>
          <AdminButton
            variant="primary"
            onClick={() => setActiveTab('scheduler')}
            icon={Settings}
          >
            Manage Backups
          </AdminButton>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Backup tabs">
            {tabs.map((tab) => {
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
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default BackupDashboard;