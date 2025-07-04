import React, { useState } from 'react';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Play,
  Eye,
  FileText
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminBadge } from '../common/AdminBadge';
import { BackupVerification as BackupVerificationType, BackupFile } from '../../../types/backup';
import { 
  sampleBackupVerifications, 
  sampleBackupFiles 
} from '../../../data/backupData';

const BackupVerification: React.FC = () => {
  const [verifications, setVerifications] = useState<BackupVerificationType[]>(sampleBackupVerifications);
  const [runningVerification, setRunningVerification] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const backupFiles = sampleBackupFiles;

  const runVerification = async (fileId: string) => {
    setRunningVerification(prev => new Set(prev).add(fileId));
    
    // Simulate verification process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newVerification: BackupVerificationType = {
      id: `verification-${Date.now()}`,
      backupFileId: fileId,
      verifiedAt: new Date(),
      verifiedBy: 'admin',
      status: Math.random() > 0.8 ? 'warning' : 'passed',
      checksumValid: true,
      sizeValid: true,
      contentValid: Math.random() > 0.2,
      restorable: Math.random() > 0.1,
      issues: Math.random() > 0.7 ? [
        {
          severity: 'warning',
          message: 'Some metadata inconsistencies found',
          details: 'Minor timestamp differences in content records'
        }
      ] : [],
      score: Math.floor(Math.random() * 20) + 80 // 80-100
    };

    setVerifications(prev => [newVerification, ...prev.filter(v => v.backupFileId !== fileId)]);
    setRunningVerification(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'green';
      case 'warning': return 'yellow';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600 dark:text-green-400';
    if (score >= 85) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getFileById = (fileId: string) => {
    return backupFiles.find(f => f.id === fileId);
  };

  const getVerificationForFile = (fileId: string) => {
    return verifications.find(v => v.backupFileId === fileId);
  };

  const unverifiedFiles = backupFiles.filter(file => !getVerificationForFile(file.id));
  const verifiedFiles = backupFiles.filter(file => getVerificationForFile(file.id));
  const passedCount = verifications.filter(v => v.status === 'passed').length;
  const averageScore = verifications.length > 0 
    ? verifications.reduce((sum, v) => sum + v.score, 0) / verifications.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          Backup Verification
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Verify backup integrity and ensure files can be restored successfully
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified Files</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{verifiedFiles.length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {unverifiedFiles.length} pending verification
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pass Rate</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {verifications.length > 0 ? Math.round((passedCount / verifications.length) * 100) : 0}%
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Score</p>
              <p className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                {averageScore.toFixed(0)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Issues Found</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {verifications.reduce((sum, v) => sum + v.issues.length, 0)}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Unverified Files */}
      {unverifiedFiles.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Pending Verification ({unverifiedFiles.length})
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              These backup files have not been verified yet
            </p>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {unverifiedFiles.map((file) => (
              <div key={file.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900 dark:text-white">{file.name}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <AdminBadge color="blue">{file.type}</AdminBadge>
                      <AdminBadge color="green">{file.format.toUpperCase()}</AdminBadge>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {file.sizeFormatted} • {file.createdAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <AdminButton
                    variant="primary"
                    size="sm"
                    onClick={() => runVerification(file.id)}
                    loading={runningVerification.has(file.id)}
                    icon={Play}
                  >
                    Verify Now
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Verification Results */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            Verification Results
          </h4>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {verifications.map((verification) => {
            const file = getFileById(verification.backupFileId);
            if (!file) return null;

            return (
              <div key={verification.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(verification.status)}
                      <h5 className="font-medium text-gray-900 dark:text-white">{file.name}</h5>
                      <AdminBadge color={getStatusColor(verification.status)}>
                        {verification.status}
                      </AdminBadge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Score:</span>
                        <span className={`font-bold ${getScoreColor(verification.score)}`}>
                          {verification.score}/100
                        </span>
                      </div>
                    </div>
                    
                    {/* Verification Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        {verification.checksumValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">Checksum</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {verification.sizeValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">File Size</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {verification.contentValid ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">Content</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {verification.restorable ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">Restorable</span>
                      </div>
                    </div>
                    
                    {/* Issues */}
                    {verification.issues.length > 0 && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 mb-3">
                        <h6 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                          Issues Found ({verification.issues.length})
                        </h6>
                        <div className="space-y-2">
                          {verification.issues.map((issue, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                              <div>
                                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                  {issue.message}
                                </p>
                                {issue.details && (
                                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                    {issue.details}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Verified by {verification.verifiedBy} on {verification.verifiedAt.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <AdminButton
                      size="sm"
                      variant="outline"
                      onClick={() => runVerification(verification.backupFileId)}
                      loading={runningVerification.has(verification.backupFileId)}
                      icon={RefreshCw}
                    >
                      Re-verify
                    </AdminButton>
                    
                    <AdminButton
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedFile(selectedFile === file.id ? null : file.id)}
                      icon={Eye}
                    >
                      Details
                    </AdminButton>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {selectedFile === file.id && (
                  <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h6 className="font-medium text-gray-900 dark:text-white mb-3">Backup File Details</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Filename:</span>
                        <p className="font-mono text-gray-900 dark:text-white">{file.filename}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Size:</span>
                        <p className="text-gray-900 dark:text-white">{file.sizeFormatted}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Records:</span>
                        <p className="text-gray-900 dark:text-white">{file.metadata.recordCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Version:</span>
                        <p className="text-gray-900 dark:text-white">{file.metadata.version}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-500 dark:text-gray-400">Content Types:</span>
                        <p className="text-gray-900 dark:text-white">{file.contentTypes.join(', ')}</p>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-gray-500 dark:text-gray-400">Checksum:</span>
                        <p className="font-mono text-gray-900 dark:text-white text-xs break-all">
                          {file.checksum}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {verifications.length === 0 && (
            <div className="p-12 text-center">
              <Shield className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No verification results
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Run verification on your backup files to see results here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackupVerification;