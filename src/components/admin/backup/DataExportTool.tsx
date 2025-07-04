import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Database, 
  Calendar,
  Filter,
  Settings,
  Play,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';
import { AdminBadge } from '../common/AdminBadge';
import { 
  ExportJob, 
  ContentType, 
  ExportFormat, 
  DateRange,
  ExportFilters
} from '../../../types/backup';
import { sampleExportJobs } from '../../../data/backupData';
import { 
  validateExportJob, 
  formatFileSize, 
  formatDuration, 
  calculateProgress,
  getMimeType
} from '../../../utils/backupService';

const DataExportTool: React.FC = () => {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>(sampleExportJobs);
  const [activeForm, setActiveForm] = useState<Partial<ExportJob>>({
    name: '',
    contentTypes: [],
    format: 'json',
    includeFields: [],
    excludeFields: [],
    filters: {}
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const validation = validateExportJob(activeForm);

  const contentTypeOptions = [
    { value: 'animals' as ContentType, label: 'Animals', description: 'Animal profiles and stories', count: 247 },
    { value: 'blog' as ContentType, label: 'Blog Posts', description: 'Articles and news posts', count: 45 },
    { value: 'faq' as ContentType, label: 'FAQ Entries', description: 'Frequently asked questions', count: 67 },
    { value: 'resources' as ContentType, label: 'Resources', description: 'Educational materials', count: 23 },
    { value: 'users' as ContentType, label: 'Users', description: 'User accounts and profiles', count: 156 },
    { value: 'volunteers' as ContentType, label: 'Volunteers', description: 'Volunteer applications', count: 89 },
    { value: 'donations' as ContentType, label: 'Donations', description: 'Donation records', count: 1243 },
    { value: 'events' as ContentType, label: 'Events', description: 'Tours and events', count: 34 }
  ];

  const formatOptions = [
    { value: 'json' as ExportFormat, label: 'JSON', description: 'Complete data structure with relationships' },
    { value: 'csv' as ExportFormat, label: 'CSV', description: 'Tabular data for spreadsheet applications' },
    { value: 'xml' as ExportFormat, label: 'XML', description: 'Structured markup format' },
    { value: 'pdf' as ExportFormat, label: 'PDF', description: 'Human-readable report format' },
    { value: 'sql' as ExportFormat, label: 'SQL', description: 'Database dump for direct import' }
  ];

  const quickExportTemplates = [
    {
      name: 'Animal Report',
      contentTypes: ['animals'] as ContentType[],
      format: 'pdf' as ExportFormat,
      description: 'PDF report of all animal profiles'
    },
    {
      name: 'User Database',
      contentTypes: ['users', 'volunteers'] as ContentType[],
      format: 'csv' as ExportFormat,
      description: 'CSV export of user and volunteer data'
    },
    {
      name: 'Content Backup',
      contentTypes: ['animals', 'blog', 'faq'] as ContentType[],
      format: 'json' as ExportFormat,
      description: 'Complete content backup in JSON format'
    },
    {
      name: 'Financial Data',
      contentTypes: ['donations'] as ContentType[],
      format: 'csv' as ExportFormat,
      description: 'Donation records for accounting'
    }
  ];

  const handleContentTypeToggle = (contentType: ContentType) => {
    const currentTypes = activeForm.contentTypes || [];
    const hasType = currentTypes.includes(contentType);
    
    if (hasType) {
      setActiveForm(prev => ({
        ...prev,
        contentTypes: currentTypes.filter(type => type !== contentType)
      }));
    } else {
      setActiveForm(prev => ({
        ...prev,
        contentTypes: [...currentTypes, contentType]
      }));
    }
  };

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setActiveForm(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: new Date(value)
      } as DateRange
    }));
  };

  const handleFiltersChange = (key: string, value: any) => {
    setActiveForm(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value
      }
    }));
  };

  const startExport = () => {
    if (!validation.isValid) return;

    const newExport: ExportJob = {
      id: `export-${Date.now()}`,
      name: activeForm.name!,
      contentTypes: activeForm.contentTypes!,
      format: activeForm.format!,
      dateRange: activeForm.dateRange,
      filters: activeForm.filters!,
      includeFields: activeForm.includeFields!,
      excludeFields: activeForm.excludeFields!,
      progress: 0,
      status: 'pending',
      createdAt: new Date(),
      createdBy: 'admin'
    };

    setExportJobs(prev => [newExport, ...prev]);
    
    // Simulate export progress
    simulateExportProgress(newExport.id);
    
    // Reset form
    setActiveForm({
      name: '',
      contentTypes: [],
      format: 'json',
      includeFields: [],
      excludeFields: [],
      filters: {}
    });
  };

  const simulateExportProgress = (exportId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setExportJobs(prev => prev.map(job => 
          job.id === exportId 
            ? { 
                ...job, 
                progress: 100, 
                status: 'completed',
                actualSize: Math.floor(Math.random() * 10000000) + 1000000, // 1-10MB
                downloadUrl: `/api/exports/download/${exportId}`,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
              }
            : job
        ));
      } else {
        setExportJobs(prev => prev.map(job => 
          job.id === exportId 
            ? { ...job, progress: Math.floor(progress), status: 'running' }
            : job
        ));
      }
    }, 500);
  };

  const useTemplate = (template: typeof quickExportTemplates[0]) => {
    setActiveForm({
      name: template.name,
      contentTypes: template.contentTypes,
      format: template.format,
      includeFields: [],
      excludeFields: [],
      filters: {}
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running': return <Clock className="h-5 w-5 text-blue-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
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

  const getEstimatedRecords = () => {
    if (!activeForm.contentTypes) return 0;
    return activeForm.contentTypes.reduce((total, type) => {
      const option = contentTypeOptions.find(opt => opt.value === type);
      return total + (option?.count || 0);
    }, 0);
  };

  const getEstimatedSize = () => {
    const records = getEstimatedRecords();
    const baseSize = records * 1024; // 1KB per record base
    
    // Adjust for format
    switch (activeForm.format) {
      case 'json': return baseSize * 2;
      case 'csv': return baseSize * 0.5;
      case 'xml': return baseSize * 3;
      case 'pdf': return baseSize * 5;
      case 'sql': return baseSize * 1.5;
      default: return baseSize;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Download className="h-5 w-5 text-blue-500" />
          Data Export Tool
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Export sanctuary data in various formats for analysis, backup, or migration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Templates */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Quick Export Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickExportTemplates.map((template, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                  onClick={() => useTemplate(template)}
                >
                  <h5 className="font-medium text-gray-900 dark:text-white mb-1">{template.name}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.description}</p>
                  <div className="flex items-center gap-2">
                    <AdminBadge color="blue" size="sm">{template.format.toUpperCase()}</AdminBadge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {template.contentTypes.length} content type{template.contentTypes.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Export Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-medium text-gray-900 dark:text-white">Custom Export Configuration</h4>
              <AdminButton
                size="sm"
                variant="outline"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                icon={Settings}
              >
                {showAdvancedOptions ? 'Hide' : 'Show'} Advanced
              </AdminButton>
            </div>

            <div className="space-y-6">
              {/* Basic Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormField
                  label="Export Name"
                  type="text"
                  value={activeForm.name || ''}
                  onChange={(value) => setActiveForm(prev => ({ ...prev, name: value }))}
                  placeholder="My Data Export"
                  required
                  error={validation.errors.find(e => e.field === 'name')?.message}
                />
                
                <AdminFormField
                  label="Export Format"
                  type="select"
                  value={activeForm.format || 'json'}
                  onChange={(value) => setActiveForm(prev => ({ ...prev, format: value as ExportFormat }))}
                  options={formatOptions.map(fmt => ({ value: fmt.value, label: fmt.label }))}
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
                        activeForm.contentTypes?.includes(type.value)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => handleContentTypeToggle(type.value)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={activeForm.contentTypes?.includes(type.value) || false}
                          onChange={() => handleContentTypeToggle(type.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900 dark:text-white">{type.label}</h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{type.count}</span>
                          </div>
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

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormField
                  label="Start Date (Optional)"
                  type="date"
                  value={activeForm.dateRange?.startDate ? activeForm.dateRange.startDate.toISOString().split('T')[0] : ''}
                  onChange={(value) => handleDateRangeChange('startDate', value)}
                />
                
                <AdminFormField
                  label="End Date (Optional)"
                  type="date"
                  value={activeForm.dateRange?.endDate ? activeForm.dateRange.endDate.toISOString().split('T')[0] : ''}
                  onChange={(value) => handleDateRangeChange('endDate', value)}
                />
              </div>

              {/* Advanced Options */}
              {showAdvancedOptions && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-4">Advanced Options</h5>
                  
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Published Content Only
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            id="published-only"
                            type="checkbox"
                            checked={activeForm.filters?.published ?? false}
                            onChange={(e) => handleFiltersChange('published', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor="published-only" className="text-sm text-gray-700 dark:text-gray-300">
                            Include only published content
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Field Selection */}
                    <AdminFormField
                      label="Include Specific Fields (Optional)"
                      type="textarea"
                      value={activeForm.includeFields?.join(', ') || ''}
                      onChange={(value) => setActiveForm(prev => ({ 
                        ...prev, 
                        includeFields: value.split(',').map(f => f.trim()).filter(f => f) 
                      }))}
                      placeholder="name, email, created_at"
                      rows={2}
                      help="Comma-separated list of fields to include (leave empty for all fields)"
                    />
                    
                    <AdminFormField
                      label="Exclude Fields (Optional)"
                      type="textarea"
                      value={activeForm.excludeFields?.join(', ') || ''}
                      onChange={(value) => setActiveForm(prev => ({ 
                        ...prev, 
                        excludeFields: value.split(',').map(f => f.trim()).filter(f => f) 
                      }))}
                      placeholder="password, internal_notes, private_data"
                      rows={2}
                      help="Comma-separated list of fields to exclude"
                    />
                  </div>
                </div>
              )}

              {/* Export Summary */}
              {activeForm.contentTypes && activeForm.contentTypes.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Export Summary</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Records:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100">{getEstimatedRecords().toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Est. Size:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100">{formatFileSize(getEstimatedSize())}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Format:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100">{activeForm.format?.toUpperCase()}</p>
                    </div>
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Content Types:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100">{activeForm.contentTypes.length}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Validation Errors */}
              {validation.errors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <h5 className="font-medium text-red-900 dark:text-red-100 mb-2">Please fix the following errors:</h5>
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
                  <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Warnings:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
                        {warning.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Start Export Button */}
              <div className="flex justify-end">
                <AdminButton
                  variant="primary"
                  onClick={startExport}
                  disabled={!validation.isValid || !activeForm.contentTypes?.length}
                  icon={Play}
                >
                  Start Export
                </AdminButton>
              </div>
            </div>
          </div>
        </div>

        {/* Export History Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white">Export History</h4>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {exportJobs.map((job) => (
                <div key={job.id} className="p-4">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(job.status)}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 dark:text-white truncate">{job.name}</h5>
                      <div className="flex items-center gap-2 mt-1">
                        <AdminBadge color={getStatusColor(job.status)} size="sm">
                          {job.status}
                        </AdminBadge>
                        <AdminBadge color="blue" size="sm">
                          {job.format.toUpperCase()}
                        </AdminBadge>
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
                      
                      {job.status === 'completed' && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {job.actualSize ? formatFileSize(job.actualSize) : 'Unknown size'}
                          </p>
                          {job.downloadUrl && (
                            <AdminButton
                              size="sm"
                              variant="outline"
                              icon={Download}
                              className="mt-2"
                              onClick={() => window.open(job.downloadUrl, '_blank')}
                            >
                              Download
                            </AdminButton>
                          )}
                          {job.expiresAt && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Expires: {job.expiresAt.toLocaleDateString()}
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

          {/* Export Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Export Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Exports</span>
                <span className="font-medium text-gray-900 dark:text-white">{exportJobs.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {exportJobs.filter(j => j.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Running</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {exportJobs.filter(j => j.status === 'running').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {exportJobs.filter(j => j.createdAt.getMonth() === new Date().getMonth()).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExportTool;