import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Play, 
  Pause, 
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';
import { AdminModal } from '../common/AdminModal';
import { AdminStatusBadge } from '../common/AdminStatusBadge';
import { BackupJob, BackupType, ContentType, ScheduleFrequency } from '../../../types/backup';
import { 
  sampleBackupJobs, 
  sampleBackupTemplates,
  getActiveBackupJobs,
  getFailedBackupJobs
} from '../../../data/backupData';
import { 
  validateBackupJob, 
  getNextBackupTime, 
  getScheduleDescription,
  estimateBackupSize,
  formatFileSize
} from '../../../utils/backupService';

interface BackupJobModalProps {
  job: BackupJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: BackupJob) => void;
}

const BackupJobModal: React.FC<BackupJobModalProps> = ({ job, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<BackupJob>>({
    name: '',
    description: '',
    type: 'full',
    contentTypes: [],
    schedule: {
      frequency: 'daily',
      time: '02:00',
      timezone: 'America/Los_Angeles',
      enabled: true
    },
    retentionDays: 30,
    maxBackups: 30,
    compressionEnabled: true,
    encryptionEnabled: true
  });

  React.useEffect(() => {
    if (job) {
      setFormData(job);
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'full',
        contentTypes: [],
        schedule: {
          frequency: 'daily',
          time: '02:00',
          timezone: 'America/Los_Angeles',
          enabled: true
        },
        retentionDays: 30,
        maxBackups: 30,
        compressionEnabled: true,
        encryptionEnabled: true
      });
    }
  }, [job]);

  const validation = validateBackupJob(formData);
  const estimatedSize = formData.contentTypes && formData.type 
    ? estimateBackupSize(formData.contentTypes, formData.type) 
    : 0;

  const handleSubmit = () => {
    if (!validation.isValid) return;

    const nextRun = formData.schedule ? getNextBackupTime(formData.schedule) : undefined;

    const jobData: BackupJob = {
      id: job?.id || `backup-job-${Date.now()}`,
      name: formData.name!,
      description: formData.description!,
      type: formData.type!,
      contentTypes: formData.contentTypes!,
      schedule: formData.schedule!,
      status: job?.status || 'active',
      retentionDays: formData.retentionDays!,
      maxBackups: formData.maxBackups!,
      compressionEnabled: formData.compressionEnabled!,
      encryptionEnabled: formData.encryptionEnabled!,
      nextRun,
      lastRun: job?.lastRun,
      lastError: job?.lastError,
      createdAt: job?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: job?.createdBy || 'admin'
    };

    onSave(jobData);
    onClose();
  };

  const handleScheduleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule!,
        [field]: value
      }
    }));
  };

  const handleContentTypeToggle = (contentType: ContentType) => {
    const currentTypes = formData.contentTypes || [];
    const hasType = currentTypes.includes(contentType);
    
    if (hasType) {
      setFormData(prev => ({
        ...prev,
        contentTypes: currentTypes.filter(type => type !== contentType)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        contentTypes: [...currentTypes, contentType]
      }));
    }
  };

  const backupTypes: { value: BackupType; label: string; description: string }[] = [
    { value: 'full', label: 'Full Backup', description: 'Complete backup of all selected data' },
    { value: 'incremental', label: 'Incremental', description: 'Only changes since last backup' },
    { value: 'content', label: 'Content Only', description: 'Animals, blog posts, and resources' },
    { value: 'settings', label: 'Settings Only', description: 'System configuration and settings' },
    { value: 'users', label: 'User Data', description: 'Users, volunteers, and donations' }
  ];

  const frequencies: { value: ScheduleFrequency; label: string }[] = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom (Cron)' }
  ];

  const contentTypes: { value: ContentType; label: string; description: string }[] = [
    { value: 'animals', label: 'Animals', description: 'Animal profiles and stories' },
    { value: 'blog', label: 'Blog Posts', description: 'Blog articles and news' },
    { value: 'faq', label: 'FAQ', description: 'Frequently asked questions' },
    { value: 'resources', label: 'Resources', description: 'Educational resources' },
    { value: 'users', label: 'Users', description: 'User accounts and profiles' },
    { value: 'volunteers', label: 'Volunteers', description: 'Volunteer applications' },
    { value: 'donations', label: 'Donations', description: 'Donation records' },
    { value: 'events', label: 'Events', description: 'Tours and events' },
    { value: 'settings', label: 'Settings', description: 'System configuration' }
  ];

  const timezones = [
    'America/Los_Angeles',
    'America/Denver',
    'America/Chicago',
    'America/New_York',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo'
  ];

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={job ? 'Edit Backup Job' : 'Create Backup Job'}
      size="xl"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormField
            label="Job Name"
            type="text"
            value={formData.name || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            placeholder="Daily Full Backup"
            required
            error={validation.errors.find(e => e.field === 'name')?.message}
          />
          
          <AdminFormField
            label="Backup Type"
            type="select"
            value={formData.type || 'full'}
            onChange={(value) => setFormData(prev => ({ ...prev, type: value as BackupType }))}
            options={backupTypes.map(type => ({ value: type.value, label: type.label }))}
            required
          />
        </div>
        
        <AdminFormField
          label="Description"
          type="textarea"
          value={formData.description || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          placeholder="Describe the purpose of this backup job..."
          rows={3}
          required
        />

        {/* Content Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Content Types
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {contentTypes.map((type) => (
              <div
                key={type.value}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.contentTypes?.includes(type.value)
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleContentTypeToggle(type.value)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.contentTypes?.includes(type.value) || false}
                    onChange={() => handleContentTypeToggle(type.value)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{type.label}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {validation.errors.find(e => e.field === 'contentTypes') && (
            <p className="mt-2 text-sm text-red-600">{validation.errors.find(e => e.field === 'contentTypes')?.message}</p>
          )}
        </div>

        {/* Schedule Configuration */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4">Schedule Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <AdminFormField
              label="Frequency"
              type="select"
              value={formData.schedule?.frequency || 'daily'}
              onChange={(value) => handleScheduleChange('frequency', value)}
              options={frequencies}
              required
            />
            
            <AdminFormField
              label="Time"
              type="time"
              value={formData.schedule?.time || '02:00'}
              onChange={(value) => handleScheduleChange('time', value)}
              required
            />
          </div>

          {formData.schedule?.frequency === 'weekly' && (
            <AdminFormField
              label="Day of Week"
              type="select"
              value={String(formData.schedule?.dayOfWeek || 0)}
              onChange={(value) => handleScheduleChange('dayOfWeek', parseInt(value))}
              options={[
                { value: 0, label: 'Sunday' },
                { value: 1, label: 'Monday' },
                { value: 2, label: 'Tuesday' },
                { value: 3, label: 'Wednesday' },
                { value: 4, label: 'Thursday' },
                { value: 5, label: 'Friday' },
                { value: 6, label: 'Saturday' }
              ]}
            />
          )}

          {formData.schedule?.frequency === 'monthly' && (
            <AdminFormField
              label="Day of Month"
              type="number"
              value={String(formData.schedule?.dayOfMonth || 1)}
              onChange={(value) => handleScheduleChange('dayOfMonth', parseInt(value))}
              min={1}
              max={31}
            />
          )}

          {formData.schedule?.frequency === 'custom' && (
            <AdminFormField
              label="Cron Expression"
              type="text"
              value={formData.schedule?.customCron || ''}
              onChange={(value) => handleScheduleChange('customCron', value)}
              placeholder="0 2 * * *"
              help="Use standard cron syntax (minute hour day month dayofweek)"
            />
          )}

          <AdminFormField
            label="Timezone"
            type="select"
            value={formData.schedule?.timezone || 'America/Los_Angeles'}
            onChange={(value) => handleScheduleChange('timezone', value)}
            options={timezones.map(tz => ({ value: tz, label: tz }))}
          />

          <div className="flex items-center gap-3 mt-4">
            <input
              id="schedule-enabled"
              type="checkbox"
              checked={formData.schedule?.enabled ?? true}
              onChange={(e) => handleScheduleChange('enabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="schedule-enabled" className="text-sm text-gray-700 dark:text-gray-300">
              Enable automatic scheduling
            </label>
          </div>
        </div>

        {/* Storage & Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Retention Policy</h3>
            <div className="space-y-4">
              <AdminFormField
                label="Retention Days"
                type="number"
                value={String(formData.retentionDays || 30)}
                onChange={(value) => setFormData(prev => ({ ...prev, retentionDays: parseInt(value) }))}
                min={1}
                max={3650}
                help="How long to keep backup files"
              />
              
              <AdminFormField
                label="Max Backup Count"
                type="number"
                value={String(formData.maxBackups || 30)}
                onChange={(value) => setFormData(prev => ({ ...prev, maxBackups: parseInt(value) }))}
                min={1}
                max={100}
                help="Maximum number of backup files to keep"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 dark:text-white mb-4">Backup Options</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  id="compression"
                  type="checkbox"
                  checked={formData.compressionEnabled ?? true}
                  onChange={(e) => setFormData(prev => ({ ...prev, compressionEnabled: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="compression" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable compression
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  id="encryption"
                  type="checkbox"
                  checked={formData.encryptionEnabled ?? true}
                  onChange={(e) => setFormData(prev => ({ ...prev, encryptionEnabled: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="encryption" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable encryption
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Size */}
        {estimatedSize > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Estimated Backup Size</h4>
            <p className="text-blue-700 dark:text-blue-300">
              Approximately {formatFileSize(estimatedSize)} per backup
            </p>
          </div>
        )}

        {/* Validation Errors */}
        {validation.errors.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">Please fix the following errors:</h4>
            <ul className="list-disc list-inside space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700 dark:text-red-300">
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Validation Warnings */}
        {validation.warnings.length > 0 && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Warnings:</h4>
            <ul className="list-disc list-inside space-y-1">
              {validation.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                  {warning.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <AdminButton variant="outline" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!validation.isValid}
          >
            {job ? 'Update Job' : 'Create Job'}
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
};

const BackupScheduler: React.FC = () => {
  const [jobs, setJobs] = useState<BackupJob[]>(sampleBackupJobs);
  const [selectedJob, setSelectedJob] = useState<BackupJob | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeJobs = getActiveBackupJobs();
  const failedJobs = getFailedBackupJobs();

  const handleCreateJob = () => {
    setSelectedJob(null);
    setIsModalOpen(true);
  };

  const handleEditJob = (job: BackupJob) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleDeleteJob = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this backup job? This action cannot be undone.')) {
      setJobs(prev => prev.filter(job => job.id !== jobId));
    }
  };

  const handleToggleJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: job.status === 'active' ? 'paused' : 'active' } 
        : job
    ));
  };

  const handleSaveJob = (job: BackupJob) => {
    if (selectedJob) {
      setJobs(prev => prev.map(j => j.id === job.id ? job : j));
    } else {
      setJobs(prev => [...prev, job]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'paused': return <Pause className="h-5 w-5 text-yellow-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'paused': return 'yellow';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Backup Scheduler
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage automated backup jobs for your sanctuary data
          </p>
        </div>
        <AdminButton
          variant="primary"
          onClick={handleCreateJob}
          icon={Plus}
        >
          New Backup Job
        </AdminButton>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Jobs</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{activeJobs.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed Jobs</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{failedJobs.length}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Backup Jobs
          </h4>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {jobs.map((job) => (
            <div key={job.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(job.status)}
                    <h5 className="text-lg font-medium text-gray-900 dark:text-white">
                      {job.name}
                    </h5>
                    <AdminStatusBadge color={getStatusColor(job.status)}>
                      {job.status}
                    </AdminStatusBadge>
                    <AdminStatusBadge color="blue">{job.type}</AdminStatusBadge>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {job.description}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Schedule:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {getScheduleDescription(job.schedule)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Content Types:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {job.contentTypes.length} selected
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Retention:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {job.retentionDays} days
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Next Run:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {job.nextRun?.toLocaleString() || 'Not scheduled'}
                      </p>
                    </div>
                  </div>

                  {job.lastError && (
                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        <strong>Last Error:</strong> {job.lastError}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <AdminButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleJob(job.id)}
                    icon={job.status === 'active' ? Pause : Play}
                  >
                    {job.status === 'active' ? 'Pause' : 'Resume'}
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditJob(job)}
                    icon={Edit}
                  >
                    Edit
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteJob(job.id)}
                    icon={Trash2}
                  >
                    Delete
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
          
          {jobs.length === 0 && (
            <div className="p-12 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No backup jobs configured
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Get started by creating your first automated backup job.
              </p>
              <AdminButton
                variant="primary"
                onClick={handleCreateJob}
                icon={Plus}
                className="mt-4"
              >
                Create Your First Backup Job
              </AdminButton>
            </div>
          )}
        </div>
      </div>

      {/* Templates Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Backup Templates
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Quick start templates for common backup scenarios
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleBackupTemplates.map((template) => (
              <div key={template.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">{template.name}</h5>
                    {template.isDefault && (
                      <AdminStatusBadge color="blue" size="sm">Default</AdminStatusBadge>
                    )}
                  </div>
                  <AdminButton
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      // Pre-fill form with template data
                      setSelectedJob({
                        ...template,
                        id: `backup-job-${Date.now()}`,
                        status: 'active',
                        lastRun: undefined,
                        nextRun: undefined,
                        lastError: undefined,
                        maxBackups: 30,
                        compressionEnabled: true,
                        encryptionEnabled: false,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        createdBy: 'admin'
                      } as BackupJob);
                      setIsModalOpen(true);
                    }}
                  >
                    Use Template
                  </AdminButton>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {template.description}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <span>Type: {template.type}</span> • 
                  <span> Content: {template.contentTypes.join(', ')}</span> • 
                  <span> Used {template.usageCount} times</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Job Modal */}
      <BackupJobModal
        job={selectedJob}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
      />
    </div>
  );
};

export default BackupScheduler;