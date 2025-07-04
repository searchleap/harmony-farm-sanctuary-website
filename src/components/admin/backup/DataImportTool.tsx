import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Eye,
  Play,
  X,
  Download
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';
import { AdminStatusBadge } from '../common/AdminStatusBadge';
import { 
  ImportJob, 
  ContentType, 
  ExportFormat, 
  ImportPreview
} from '../../../types/backup';
import { sampleImportJobs } from '../../../data/backupData';
import { 
  generateImportPreview, 
  formatFileSize,
  getStatusColor
} from '../../../utils/backupService';

const DataImportTool: React.FC = () => {
  const [importJobs, setImportJobs] = useState<ImportJob[]>(sampleImportJobs);
  const [activeImport, setActiveImport] = useState<Partial<ImportJob>>({
    name: '',
    contentType: 'animals',
    format: 'csv',
    conflictResolution: {
      strategy: 'skip',
      skipDuplicates: true,
      preserveIds: false,
      updateExisting: false
    },
    dryRun: true
  });
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportPreview | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const contentTypeOptions = [
    { value: 'animals' as ContentType, label: 'Animals', description: 'Animal profiles and stories' },
    { value: 'blog' as ContentType, label: 'Blog Posts', description: 'Articles and news posts' },
    { value: 'faq' as ContentType, label: 'FAQ Entries', description: 'Frequently asked questions' },
    { value: 'resources' as ContentType, label: 'Resources', description: 'Educational materials' },
    { value: 'users' as ContentType, label: 'Users', description: 'User accounts and profiles' },
    { value: 'volunteers' as ContentType, label: 'Volunteers', description: 'Volunteer applications' },
    { value: 'donations' as ContentType, label: 'Donations', description: 'Donation records' },
    { value: 'events' as ContentType, label: 'Events', description: 'Tours and events' }
  ];

  const formatOptions = [
    { value: 'json' as ExportFormat, label: 'JSON', accept: '.json' },
    { value: 'csv' as ExportFormat, label: 'CSV', accept: '.csv' },
    { value: 'xml' as ExportFormat, label: 'XML', accept: '.xml' },
    { value: 'sql' as ExportFormat, label: 'SQL', accept: '.sql' }
  ];

  const conflictStrategies = [
    { value: 'skip', label: 'Skip Duplicates', description: 'Skip records that already exist' },
    { value: 'overwrite', label: 'Overwrite', description: 'Replace existing records with new data' },
    { value: 'merge', label: 'Merge', description: 'Combine existing and new data' },
    { value: 'create_new', label: 'Create New', description: 'Create new records with different IDs' }
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = async (file: File) => {
    setUploadedFile(file);
    setActiveImport(prev => ({
      ...prev,
      filename: file.name,
      fileSize: file.size
    }));

    // Generate preview
    try {
      const text = await file.text();
      const preview = generateImportPreview(text, activeImport.format!, activeImport.contentType!);
      setPreviewData(preview);
      setShowPreview(true);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  const handleConflictResolutionChange = (field: string, value: any) => {
    setActiveImport(prev => ({
      ...prev,
      conflictResolution: {
        ...prev.conflictResolution!,
        [field]: value
      }
    }));
  };

  const startImport = () => {
    if (!uploadedFile || !activeImport.name) return;

    const newImport: ImportJob = {
      id: `import-${Date.now()}`,
      name: activeImport.name,
      filename: uploadedFile.name,
      format: activeImport.format!,
      contentType: activeImport.contentType!,
      fileSize: uploadedFile.size,
      progress: 0,
      status: 'pending',
      conflictResolution: activeImport.conflictResolution!,
      dryRun: activeImport.dryRun!,
      preview: previewData!,
      createdAt: new Date(),
      createdBy: 'admin'
    };

    setImportJobs(prev => [newImport, ...prev]);
    
    // Simulate import progress
    simulateImportProgress(newImport.id);
    
    // Reset form
    setActiveImport({
      name: '',
      contentType: 'animals',
      format: 'csv',
      conflictResolution: {
        strategy: 'skip',
        skipDuplicates: true,
        preserveIds: false,
        updateExisting: false
      },
      dryRun: true
    });
    setUploadedFile(null);
    setPreviewData(null);
    setShowPreview(false);
  };

  const simulateImportProgress = (importId: string) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        const preview = importJobs.find(job => job.id === importId)?.preview;
        setImportJobs(prev => prev.map(job => 
          job.id === importId 
            ? { 
                ...job, 
                progress: 100, 
                status: 'completed',
                results: {
                  recordsImported: preview?.validRecords || 0,
                  recordsSkipped: Math.floor((preview?.totalRecords || 0) * 0.1),
                  recordsUpdated: Math.floor((preview?.totalRecords || 0) * 0.3),
                  recordsCreated: preview?.validRecords || 0,
                  errors: [],
                  warnings: [],
                  duration: Math.floor(Math.random() * 60000) + 10000 // 10-70 seconds
                }
              }
            : job
        ));
      } else {
        setImportJobs(prev => prev.map(job => 
          job.id === importId 
            ? { ...job, progress: Math.floor(progress), status: 'running' }
            : job
        ));
      }
    }, 800);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'running': return <Upload className="h-5 w-5 text-blue-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const downloadTemplate = (contentType: ContentType, format: ExportFormat) => {
    // In a real implementation, this would generate and download a template file
    console.log(`Downloading ${format.toUpperCase()} template for ${contentType}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-500" />
          Data Import Tool
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Import data from CSV, JSON, or XML files with validation and conflict resolution
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Import Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Templates */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Download Templates</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Download a template file to see the expected format for your import data.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contentTypeOptions.slice(0, 4).map((type) => (
                <div key={type.value} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 dark:text-white mb-1">{type.label}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{type.description}</p>
                  <div className="flex gap-2">
                    <AdminButton
                      size="sm"
                      variant="outline"
                      onClick={() => downloadTemplate(type.value, 'csv')}
                      icon={Download}
                    >
                      CSV
                    </AdminButton>
                    <AdminButton
                      size="sm"
                      variant="outline"
                      onClick={() => downloadTemplate(type.value, 'json')}
                      icon={Download}
                    >
                      JSON
                    </AdminButton>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Upload Import File</h4>
            
            <div className="space-y-6">
              {/* Basic Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <AdminFormField
                  label="Import Name"
                  type="text"
                  value={activeImport.name || ''}
                  onChange={(value) => setActiveImport(prev => ({ ...prev, name: value }))}
                  placeholder="My Data Import"
                  required
                />
                
                <AdminFormField
                  label="Content Type"
                  type="select"
                  value={activeImport.contentType || 'animals'}
                  onChange={(value) => setActiveImport(prev => ({ ...prev, contentType: value as ContentType }))}
                  options={contentTypeOptions.map(type => ({ value: type.value, label: type.label }))}
                  required
                />
                
                <AdminFormField
                  label="File Format"
                  type="select"
                  value={activeImport.format || 'csv'}
                  onChange={(value) => setActiveImport(prev => ({ ...prev, format: value as ExportFormat }))}
                  options={formatOptions.map(fmt => ({ value: fmt.value, label: fmt.label }))}
                  required
                />
              </div>

              {/* File Drop Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragOver
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-4">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white">{uploadedFile.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatFileSize(uploadedFile.size)} • {uploadedFile.type || 'Unknown type'}
                      </p>
                    </div>
                    <AdminButton
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setUploadedFile(null);
                        setPreviewData(null);
                        setShowPreview(false);
                      }}
                      icon={X}
                    >
                      Remove
                    </AdminButton>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <button
                        type="button"
                        className="font-medium text-blue-600 hover:text-blue-500"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Click to upload
                      </button>{' '}
                      or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      CSV, JSON, XML files up to 50MB
                    </p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={formatOptions.find(f => f.value === activeImport.format)?.accept}
                onChange={handleFileInputChange}
              />

              {/* Conflict Resolution */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-4">Conflict Resolution</h5>
                
                <div className="space-y-4">
                  <AdminFormField
                    label="Conflict Strategy"
                    type="select"
                    value={activeImport.conflictResolution?.strategy || 'skip'}
                    onChange={(value) => handleConflictResolutionChange('strategy', value)}
                    options={conflictStrategies.map(strategy => ({ value: strategy.value, label: strategy.label }))}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          id="skip-duplicates"
                          type="checkbox"
                          checked={activeImport.conflictResolution?.skipDuplicates ?? true}
                          onChange={(e) => handleConflictResolutionChange('skipDuplicates', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="skip-duplicates" className="text-sm text-gray-700 dark:text-gray-300">
                          Skip duplicate records
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input
                          id="preserve-ids"
                          type="checkbox"
                          checked={activeImport.conflictResolution?.preserveIds ?? false}
                          onChange={(e) => handleConflictResolutionChange('preserveIds', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="preserve-ids" className="text-sm text-gray-700 dark:text-gray-300">
                          Preserve original IDs
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          id="update-existing"
                          type="checkbox"
                          checked={activeImport.conflictResolution?.updateExisting ?? false}
                          onChange={(e) => handleConflictResolutionChange('updateExisting', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="update-existing" className="text-sm text-gray-700 dark:text-gray-300">
                          Update existing records
                        </label>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <input
                          id="dry-run"
                          type="checkbox"
                          checked={activeImport.dryRun ?? true}
                          onChange={(e) => setActiveImport(prev => ({ ...prev, dryRun: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="dry-run" className="text-sm text-gray-700 dark:text-gray-300">
                          Dry run (preview only)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Data */}
              {previewData && (
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="font-medium text-gray-900 dark:text-white">Import Preview</h5>
                    <AdminButton
                      size="sm"
                      variant="outline"
                      onClick={() => setShowPreview(!showPreview)}
                      icon={Eye}
                    >
                      {showPreview ? 'Hide' : 'Show'} Sample Data
                    </AdminButton>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{previewData.totalRecords}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{previewData.validRecords}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Valid Records</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{previewData.invalidRecords}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Invalid Records</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{previewData.newRecords}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">New Records</p>
                    </div>
                  </div>

                  {previewData.errors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-4">
                      <h6 className="font-medium text-red-900 dark:text-red-100 mb-2">Errors Found</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {previewData.errors.slice(0, 3).map((error, index) => (
                          <li key={index} className="text-sm text-red-700 dark:text-red-300">
                            Row {error.row}: {error.message}
                          </li>
                        ))}
                        {previewData.errors.length > 3 && (
                          <li className="text-sm text-red-700 dark:text-red-300">
                            ... and {previewData.errors.length - 3} more errors
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {showPreview && previewData.sampleData.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                          <tr>
                            {Object.keys(previewData.sampleData[0]).map((key) => (
                              <th
                                key={key}
                                className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {previewData.sampleData.slice(0, 3).map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value: any, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="px-3 py-2 text-sm text-gray-900 dark:text-white"
                                >
                                  {String(value).substring(0, 50)}
                                  {String(value).length > 50 && '...'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Import Button */}
              <div className="flex justify-end">
                <AdminButton
                  variant="primary"
                  onClick={startImport}
                  disabled={!uploadedFile || !activeImport.name || !previewData}
                  icon={Play}
                >
                  {activeImport.dryRun ? 'Preview Import' : 'Start Import'}
                </AdminButton>
              </div>
            </div>
          </div>
        </div>

        {/* Import History Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-gray-900 dark:text-white">Import History</h4>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
              {importJobs.map((job) => (
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
                        {job.dryRun && (
                          <AdminBadge color="yellow" size="sm">
                            Dry Run
                          </AdminBadge>
                        )}
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
                            {job.results.recordsImported} imported
                          </p>
                          {job.results.recordsSkipped > 0 && (
                            <p className="text-yellow-600 dark:text-yellow-400">
                              {job.results.recordsSkipped} skipped
                            </p>
                          )}
                          {job.results.errors.length > 0 && (
                            <p className="text-red-600 dark:text-red-400">
                              {job.results.errors.length} errors
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

          {/* Import Guidelines */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">Import Guidelines</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• Always use the dry run option first</p>
              <p>• Download templates for correct format</p>
              <p>• Check for duplicate data before import</p>
              <p>• Maximum file size: 50MB</p>
              <p>• Backup your data before large imports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataImportTool;