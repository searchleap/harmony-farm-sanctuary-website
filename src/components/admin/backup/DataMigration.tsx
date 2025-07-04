import React, { useState } from 'react';
import { 
  RotateCcw, 
  ArrowRight, 
  Database, 
  Play,
  Pause,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';
import { AdminStatusBadge } from '../common/AdminStatusBadge';
import { MigrationJob, ContentType } from '../../../types/backup';
import { sampleMigrationJobs } from '../../../data/backupData';
import { formatDuration } from '../../../utils/backupService';

const DataMigration: React.FC = () => {
  const [migrationJobs, setMigrationJobs] = useState<MigrationJob[]>(sampleMigrationJobs);
  const [newMigration, setNewMigration] = useState<Partial<MigrationJob>>({
    name: '',
    description: '',
    sourceEnvironment: 'staging',
    targetEnvironment: 'production',
    contentTypes: [],
    dryRun: true,
    preserveIds: false,
    migrationStrategy: {
      handleConflicts: 'skip',
      preserveRelationships: true,
      validateData: true,
      createBackup: true
    }
  });

  const environments = [
    { value: 'staging', label: 'Staging', description: 'Development and testing environment' },
    { value: 'production', label: 'Production', description: 'Live public website' },
    { value: 'backup', label: 'Backup Server', description: 'Dedicated backup environment' },
    { value: 'local', label: 'Local Development', description: 'Local development environment' }
  ];

  const contentTypeOptions = [
    { value: 'animals' as ContentType, label: 'Animals', count: 247 },
    { value: 'blog' as ContentType, label: 'Blog Posts', count: 45 },
    { value: 'faq' as ContentType, label: 'FAQ Entries', count: 67 },
    { value: 'resources' as ContentType, label: 'Resources', count: 23 },
    { value: 'users' as ContentType, label: 'Users', count: 156 },
    { value: 'volunteers' as ContentType, label: 'Volunteers', count: 89 },
    { value: 'donations' as ContentType, label: 'Donations', count: 1243 },
    { value: 'events' as ContentType, label: 'Events', count: 34 }
  ];

  const conflictStrategies = [
    { value: 'skip', label: 'Skip Conflicts', description: 'Skip records that already exist' },
    { value: 'overwrite', label: 'Overwrite', description: 'Replace existing records' },
    { value: 'merge', label: 'Merge Data', description: 'Combine existing and new data' }
  ];

  const handleContentTypeToggle = (contentType: ContentType) => {
    const currentTypes = newMigration.contentTypes || [];
    const hasType = currentTypes.includes(contentType);
    
    if (hasType) {
      setNewMigration(prev => ({
        ...prev,
        contentTypes: currentTypes.filter(type => type !== contentType)
      }));
    } else {
      setNewMigration(prev => ({
        ...prev,
        contentTypes: [...currentTypes, contentType]
      }));
    }
  };

  const handleStrategyChange = (field: string, value: any) => {
    setNewMigration(prev => ({
      ...prev,
      migrationStrategy: {
        ...prev.migrationStrategy!,
        [field]: value
      }
    }));
  };

  const startMigration = () => {
    if (!newMigration.name || !newMigration.contentTypes?.length) return;

    const migration: MigrationJob = {
      id: `migration-${Date.now()}`,
      name: newMigration.name,
      description: newMigration.description || '',
      sourceEnvironment: newMigration.sourceEnvironment!,
      targetEnvironment: newMigration.targetEnvironment!,
      contentTypes: newMigration.contentTypes,
      migrationStrategy: newMigration.migrationStrategy!,
      status: 'pending',
      progress: 0,
      dryRun: newMigration.dryRun!,
      preserveIds: newMigration.preserveIds!,
      createdAt: new Date(),
      createdBy: 'admin'
    };

    setMigrationJobs(prev => [migration, ...prev]);
    
    // Simulate migration progress
    simulateMigrationProgress(migration.id);
    
    // Reset form
    setNewMigration({
      name: '',
      description: '',
      sourceEnvironment: 'staging',
      targetEnvironment: 'production',
      contentTypes: [],
      dryRun: true,
      preserveIds: false,
      migrationStrategy: {
        handleConflicts: 'skip',
        preserveRelationships: true,
        validateData: true,
        createBackup: true
      }
    });
  };

  const simulateMigrationProgress = (migrationId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setMigrationJobs(prev => prev.map(job => 
          job.id === migrationId 
            ? { 
                ...job, 
                progress: 100, 
                status: 'completed',
                startTime: new Date(Date.now() - 300000), // 5 minutes ago
                endTime: new Date(),
                results: {
                  recordsMigrated: Math.floor(Math.random() * 100) + 50,
                  recordsSkipped: Math.floor(Math.random() * 10),
                  recordsUpdated: Math.floor(Math.random() * 30),
                  errors: [],
                  warnings: [],
                  duration: 300000 // 5 minutes
                }
              }
            : job
        ));
      } else {
        setMigrationJobs(prev => prev.map(job => 
          job.id === migrationId 
            ? { 
                ...job, 
                progress: Math.floor(progress), 
                status: 'running',
                startTime: job.startTime || new Date()
              }
            : job
        ));
      }
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running': return <RotateCcw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Pause className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'running': return 'blue';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getEnvironmentIcon = (env: string) => {
    return <Database className="h-4 w-4" />;
  };

  const getEstimatedRecords = () => {
    if (!newMigration.contentTypes) return 0;
    return newMigration.contentTypes.reduce((total, type) => {
      const option = contentTypeOptions.find(opt => opt.value === type);
      return total + (option?.count || 0);
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-blue-500" />
          Data Migration
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Migrate data between environments with validation and conflict resolution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Migration Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Migration Templates */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Quick Migration Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Staging to Production',
                  description: 'Deploy tested content to live site',
                  source: 'staging',
                  target: 'production',
                  types: ['animals', 'blog']
                },
                {
                  name: 'Production Backup',
                  description: 'Create backup of production data',
                  source: 'production',
                  target: 'backup',
                  types: ['animals', 'blog', 'users', 'donations']
                },
                {
                  name: 'Content Sync',
                  description: 'Sync content between environments',
                  source: 'production',
                  target: 'staging',
                  types: ['animals', 'blog', 'faq', 'resources']
                },
                {
                  name: 'User Data Migration',
                  description: 'Migrate user and volunteer data',
                  source: 'backup',
                  target: 'production',
                  types: ['users', 'volunteers']
                }
              ].map((template, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                  onClick={() => {
                    setNewMigration({
                      ...newMigration,
                      name: template.name,
                      description: template.description,
                      sourceEnvironment: template.source,
                      targetEnvironment: template.target,
                      contentTypes: template.types as ContentType[]
                    });
                  }}
                >
                  <h5 className="font-medium text-gray-900 dark:text-white mb-1">{template.name}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      {getEnvironmentIcon(template.source)}
                      <span className="text-gray-700 dark:text-gray-300">{template.source}</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                    <div className="flex items-center gap-1">
                      {getEnvironmentIcon(template.target)}
                      <span className="text-gray-700 dark:text-gray-300">{template.target}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Migration Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-6">Custom Migration</h4>

            <div className="space-y-6">
              {/* Basic Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormField
                  label="Migration Name"
                  type="text"
                  value={newMigration.name || ''}
                  onChange={(value) => setNewMigration(prev => ({ ...prev, name: value }))}
                  placeholder="Content Migration"
                  required
                />
                
                <AdminFormField
                  label="Description"
                  type="text"
                  value={newMigration.description || ''}
                  onChange={(value) => setNewMigration(prev => ({ ...prev, description: value }))}
                  placeholder="Describe the migration purpose"
                />
              </div>

              {/* Environment Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormField
                  label="Source Environment"
                  type="select"
                  value={newMigration.sourceEnvironment || 'staging'}
                  onChange={(value) => setNewMigration(prev => ({ ...prev, sourceEnvironment: value }))}
                  options={environments.map(env => ({ value: env.value, label: env.label }))}
                  required
                />
                
                <AdminFormField
                  label="Target Environment"
                  type="select"
                  value={newMigration.targetEnvironment || 'production'}
                  onChange={(value) => setNewMigration(prev => ({ ...prev, targetEnvironment: value }))}
                  options={environments.map(env => ({ value: env.value, label: env.label }))}
                  required
                />
              </div>

              {/* Content Types */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Content Types
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {contentTypeOptions.map((type) => (
                    <div
                      key={type.value}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        newMigration.contentTypes?.includes(type.value)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handleContentTypeToggle(type.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={newMigration.contentTypes?.includes(type.value) || false}
                            onChange={() => handleContentTypeToggle(type.value)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="font-medium text-gray-900 dark:text-white">{type.label}</span>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{type.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Migration Strategy */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-4">Migration Strategy</h5>
                
                <div className="space-y-4">
                  <AdminFormField
                    label="Conflict Handling"
                    type="select"
                    value={newMigration.migrationStrategy?.handleConflicts || 'skip'}
                    onChange={(value) => handleStrategyChange('handleConflicts', value)}
                    options={conflictStrategies.map(strategy => ({ value: strategy.value, label: strategy.label }))}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          id="preserve-relationships"
                          type="checkbox"
                          checked={newMigration.migrationStrategy?.preserveRelationships ?? true}
                          onChange={(e) => handleStrategyChange('preserveRelationships', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="preserve-relationships" className="text-sm text-gray-700 dark:text-gray-300">
                          Preserve relationships
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input
                          id="validate-data"
                          type="checkbox"
                          checked={newMigration.migrationStrategy?.validateData ?? true}
                          onChange={(e) => handleStrategyChange('validateData', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="validate-data" className="text-sm text-gray-700 dark:text-gray-300">
                          Validate data before migration
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          id="create-backup"
                          type="checkbox"
                          checked={newMigration.migrationStrategy?.createBackup ?? true}
                          onChange={(e) => handleStrategyChange('createBackup', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="create-backup" className="text-sm text-gray-700 dark:text-gray-300">
                          Create backup before migration
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input
                          id="preserve-ids"
                          type="checkbox"
                          checked={newMigration.preserveIds ?? false}
                          onChange={(e) => setNewMigration(prev => ({ ...prev, preserveIds: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="preserve-ids" className="text-sm text-gray-700 dark:text-gray-300">
                          Preserve original IDs
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      id="dry-run"
                      type="checkbox"
                      checked={newMigration.dryRun ?? true}
                      onChange={(e) => setNewMigration(prev => ({ ...prev, dryRun: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="dry-run" className="text-sm text-gray-700 dark:text-gray-300">
                      Dry run (preview changes without applying)
                    </label>
                  </div>
                </div>
              </div>

              {/* Migration Summary */}
              {newMigration.contentTypes && newMigration.contentTypes.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Migration Summary</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Records:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100">{getEstimatedRecords().toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Content Types:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100">{newMigration.contentTypes.length}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Source:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100">{newMigration.sourceEnvironment}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Target:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100">{newMigration.targetEnvironment}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Start Migration Button */}
              <div className="flex justify-end">
                <AdminButton
                  variant="primary"
                  onClick={startMigration}
                  disabled={!newMigration.name || !newMigration.contentTypes?.length}
                  icon={Play}
                >
                  {newMigration.dryRun ? 'Preview Migration' : 'Start Migration'}
                </AdminButton>
              </div>
            </div>
          </div>
        </div>

        {/* Migration History Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white">Migration History</h4>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {migrationJobs.map((job) => (
                <div key={job.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(job.status)}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 dark:text-white truncate">{job.name}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <AdminBadge color={getStatusColor(job.status)} size="sm">
                          {job.status}
                        </AdminBadge>
                        {job.dryRun && (
                          <AdminBadge color="yellow" size="sm">
                            Dry Run
                          </AdminBadge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          {getEnvironmentIcon(job.sourceEnvironment)}
                          <span>{job.sourceEnvironment}</span>
                        </div>
                        <ArrowRight className="h-3 w-3" />
                        <div className="flex items-center gap-1">
                          {getEnvironmentIcon(job.targetEnvironment)}
                          <span>{job.targetEnvironment}</span>
                        </div>
                      </div>
                      
                      {job.status === 'running' && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${job.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {job.progress}% complete
                          </p>
                        </div>
                      )}
                      
                      {job.status === 'completed' && job.results && (
                        <div className="mt-2 text-sm">
                          <p className="text-green-600 dark:text-green-400">
                            {job.results.recordsMigrated} migrated
                          </p>
                          {job.results.recordsSkipped > 0 && (
                            <p className="text-yellow-600 dark:text-yellow-400">
                              {job.results.recordsSkipped} skipped
                            </p>
                          )}
                          {job.endTime && job.startTime && (
                            <p className="text-gray-500 dark:text-gray-400">
                              Duration: {formatDuration(job.endTime.getTime() - job.startTime.getTime())}
                            </p>
                          )}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {job.createdAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Migration Guidelines */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Migration Guidelines</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• Always run dry run first</p>
              <p>• Create backups before migration</p>
              <p>• Test in staging environment</p>
              <p>• Validate data relationships</p>
              <p>• Monitor during migration</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMigration;