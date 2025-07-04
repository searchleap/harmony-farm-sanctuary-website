import React, { useState } from 'react';
import { 
  Clock, 
  Download, 
  Trash2, 
  Shield,
  Search,
  Archive,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';
import { AdminStatusBadge } from '../common/AdminStatusBadge';
import { BackupFile } from '../../../types/backup';
import { 
  sampleBackupFiles, 
  formatFileSize 
} from '../../../data/backupData';

const BackupHistory: React.FC = () => {
  const [backupFiles, setBackupFiles] = useState<BackupFile[]>(sampleBackupFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'size' | 'name'>('date');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  const filteredFiles = backupFiles
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          file.filename.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || file.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'size':
          return b.size - a.size;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleFileSelect = (fileId: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedFiles(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === filteredFiles.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(filteredFiles.map(f => f.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedFiles.size} backup files? This action cannot be undone.`)) {
      setBackupFiles(prev => prev.filter(file => !selectedFiles.has(file.id)));
      setSelectedFiles(new Set());
    }
  };

  const handleVerifyFile = async (fileId: string) => {
    // Simulate verification
    setBackupFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, verified: true, verifiedAt: new Date() }
        : file
    ));
  };

  const getJobName = (jobId: string) => {
    // Return a placeholder name based on jobId (can be enhanced with actual job lookup)
    return `Backup Job ${jobId.slice(-4)}`;
  };

  const getVerificationIcon = (file: BackupFile) => {
    if (file.verified) {
      return (
        <div title="Verified">
          <CheckCircle className="h-4 w-4 text-green-500" />
        </div>
      );
    } else {
      return (
        <div title="Not verified">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
        </div>
      );
    }
  };

  const totalSize = filteredFiles.reduce((sum, file) => sum + file.size, 0);
  const verifiedCount = filteredFiles.filter(file => file.verified).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Backup History
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            View, download, and manage your backup files
          </p>
        </div>
        
        {selectedFiles.size > 0 && (
          <div className="flex gap-2">
            <AdminButton
              variant="outline"
              onClick={() => setSelectedFiles(new Set())}
            >
              Clear Selection
            </AdminButton>
            <AdminButton
              variant="danger"
              onClick={handleDeleteSelected}
              icon={Trash2}
            >
              Delete Selected ({selectedFiles.size})
            </AdminButton>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredFiles.length}</p>
            </div>
            <Archive className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatFileSize(totalSize)}</p>
            </div>
            <Download className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{verifiedCount}</p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verification Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredFiles.length > 0 ? Math.round((verifiedCount / filteredFiles.length) * 100) : 0}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search backup files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Types</option>
            <option value="full">Full Backups</option>
            <option value="content">Content Only</option>
            <option value="settings">Settings</option>
            <option value="users">User Data</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'size' | 'name')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="date">Sort by Date</option>
            <option value="size">Sort by Size</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>

      {/* Backup Files List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Backup Files ({filteredFiles.length})
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedFiles.size === filteredFiles.length && filteredFiles.length > 0}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Select All
              </label>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredFiles.map((file) => (
            <div key={file.id} className="p-6">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedFiles.has(file.id)}
                  onChange={() => handleFileSelect(file.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="text-lg font-medium text-gray-900 dark:text-white">
                          {file.name}
                        </h5>
                        {getVerificationIcon(file)}
                        <AdminStatusBadge variant="primary">{file.type}</AdminStatusBadge>
                        <AdminStatusBadge variant="success">{file.format.toUpperCase()}</AdminStatusBadge>
                        {file.encrypted && <AdminStatusBadge variant="warning">Encrypted</AdminStatusBadge>}
                        {file.compressed && <AdminStatusBadge variant="info">Compressed</AdminStatusBadge>}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Job:</span> {getJobName(file.jobId)}
                        </div>
                        <div>
                          <span className="font-medium">Size:</span> {file.sizeFormatted}
                        </div>
                        <div>
                          <span className="font-medium">Records:</span> {file.metadata.recordCount.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {file.createdAt.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Content Types:</span> {file.contentTypes.join(', ')}
                      </div>
                      
                      {file.verifiedAt && (
                        <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                          Last verified: {file.verifiedAt.toLocaleString()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!file.verified && (
                        <AdminButton
                          size="sm"
                          variant="outline"
                          onClick={() => handleVerifyFile(file.id)}
                          icon={Shield}
                        >
                          Verify
                        </AdminButton>
                      )}
                      
                      <AdminButton
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(file.downloadUrl, '_blank')}
                        icon={Download}
                      >
                        Download
                      </AdminButton>
                      
                      <AdminButton
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this backup file?')) {
                            setBackupFiles(prev => prev.filter(f => f.id !== file.id));
                          }
                        }}
                        icon={Trash2}
                      >
                        Delete
                      </AdminButton>
                    </div>
                  </div>
                  
                  {/* File Details */}
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Filename:</span>
                        <p className="font-mono text-gray-900 dark:text-white">{file.filename}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Checksum:</span>
                        <p className="font-mono text-gray-900 dark:text-white text-xs">
                          {file.checksum.substring(0, 20)}...
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Version:</span>
                        <p className="text-gray-900 dark:text-white">{file.metadata.version}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredFiles.length === 0 && (
            <div className="p-12 text-center">
              <Archive className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No backup files found
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {searchQuery || filterType !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'Backup files will appear here once created.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackupHistory;