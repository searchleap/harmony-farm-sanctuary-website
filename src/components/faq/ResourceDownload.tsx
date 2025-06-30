import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Download, 
  FileText, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  Shield,
  Info,
  CheckCircle,
  X
} from 'lucide-react';

interface DownloadProgress {
  resourceId: string;
  progress: number; // 0-100
  status: 'pending' | 'downloading' | 'completed' | 'error';
  fileName?: string;
  fileSize?: number;
  downloadedSize?: number;
  speed?: number; // bytes per second
  timeRemaining?: number; // seconds
  error?: string;
}

interface ResourceDownloadProps {
  resourceId: string;
  title: string;
  fileSize?: number;
  fileName?: string;
  downloadUrl?: string;
  requiresEmail?: boolean;
  requiresAgreement?: boolean;
  onDownload?: (resourceId: string, options?: DownloadOptions) => void;
  onCancel?: (resourceId: string) => void;
  progress?: DownloadProgress;
  variant?: 'default' | 'compact' | 'inline' | 'modal';
  showAnalytics?: boolean;
  className?: string;
}

interface DownloadOptions {
  email?: string;
  agreementAccepted?: boolean;
  format?: string;
  quality?: string;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const formatSpeed = (bytesPerSecond: number): string => {
  return formatFileSize(bytesPerSecond) + '/s';
};

const formatTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}m ${remainingSeconds}s`;
};

export const ResourceDownload: React.FC<ResourceDownloadProps> = ({
  resourceId,
  title,
  fileSize,
  fileName,
  downloadUrl,
  requiresEmail = false,
  requiresAgreement = false,
  onDownload,
  onCancel,
  progress,
  variant = 'default',
  showAnalytics = true,
  className = ''
}) => {
  const [email, setEmail] = React.useState('');
  const [agreementAccepted, setAgreementAccepted] = React.useState(false);
  const [selectedFormat, setSelectedFormat] = React.useState('pdf');
  const [selectedQuality, setSelectedQuality] = React.useState('high');
  const [showOptions, setShowOptions] = React.useState(false);
  const [isEmailValid, setIsEmailValid] = React.useState(false);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const handleDownload = () => {
    if (requiresEmail && !isEmailValid) return;
    if (requiresAgreement && !agreementAccepted) return;

    const options: DownloadOptions = {
      email: requiresEmail ? email : undefined,
      agreementAccepted: requiresAgreement ? agreementAccepted : undefined,
      format: selectedFormat,
      quality: selectedQuality
    };

    onDownload?.(resourceId, options);
  };

  const canDownload = () => {
    if (requiresEmail && !isEmailValid) return false;
    if (requiresAgreement && !agreementAccepted) return false;
    return true;
  };

  const renderProgressBar = () => {
    if (!progress) return null;

    const { status, progress: percent, downloadedSize, fileSize: totalSize, speed, timeRemaining, error } = progress;

    if (status === 'error') {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700 mb-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Download Failed</span>
          </div>
          <p className="text-sm text-red-600 mb-3">{error || 'An error occurred during download'}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              Try Again
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onCancel?.(resourceId)}>
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    if (status === 'completed') {
      return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Download Complete!</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            {fileName || 'Resource'} has been downloaded successfully.
          </p>
        </div>
      );
    }

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-blue-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-medium">Downloading...</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCancel?.(resourceId)}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm text-blue-600">
          <span>{percent}% complete</span>
          <div className="flex items-center gap-4">
            {downloadedSize && totalSize && (
              <span>{formatFileSize(downloadedSize)} / {formatFileSize(totalSize)}</span>
            )}
            {speed && <span>{formatSpeed(speed)}</span>}
            {timeRemaining && <span>{formatTime(timeRemaining)} remaining</span>}
          </div>
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          disabled={!canDownload() || progress?.status === 'downloading'}
          className="flex items-center gap-2"
        >
          {progress?.status === 'downloading' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Download
        </Button>
        {fileSize && (
          <span className="text-sm text-gray-600">
            {formatFileSize(fileSize)}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <div>
              <h4 className="font-medium text-gray-900">{fileName || title}</h4>
              {fileSize && (
                <p className="text-sm text-gray-600">{formatFileSize(fileSize)}</p>
              )}
            </div>
          </div>
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleDownload}
            disabled={!canDownload() || progress?.status === 'downloading'}
          >
            {progress?.status === 'downloading' ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            Download
          </Button>
        </div>
        
        {renderProgressBar()}
      </div>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Download Resource</h3>
          <p className="text-gray-600">{title}</p>
        </div>
        
        {fileSize && (
          <Badge variant="default" className="text-sm">
            {formatFileSize(fileSize)}
          </Badge>
        )}
      </div>

      {renderProgressBar()}

      {!progress || progress.status === 'error' ? (
        <div className="space-y-4">
          {/* Download Options */}
          {!showOptions ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOptions(true)}
              className="text-primary hover:text-primary-dark"
            >
              <Info className="w-4 h-4 mr-2" />
              Download Options
            </Button>
          ) : (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Download Options</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOptions(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Format
                  </label>
                  <select
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="pdf">PDF</option>
                    <option value="epub">EPUB</option>
                    <option value="docx">Word Document</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quality
                  </label>
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                  >
                    <option value="high">High Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="low">Low Quality (Smaller Size)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Email Requirement */}
          {requiresEmail && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="Enter your email address"
                className={`w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary ${
                  email && !isEmailValid ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {email && !isEmailValid && (
                <p className="text-sm text-red-600 mt-1">Please enter a valid email address</p>
              )}
              <p className="text-xs text-gray-600 mt-1">
                We'll send you a download link and occasional updates about our resources.
              </p>
            </div>
          )}

          {/* Agreement Requirement */}
          {requiresAgreement && (
            <div>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="text-sm">
                  <span className="text-gray-700">
                    I agree to the{' '}
                    <a href="/terms" className="text-primary hover:underline">
                      Terms of Use
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                  <span className="text-red-500 ml-1">*</span>
                </div>
              </label>
            </div>
          )}

          {/* Download Button */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleDownload}
              disabled={!canDownload()}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Resource
            </Button>
            
            {downloadUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(downloadUrl, '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Security Notice */}
          {showAnalytics && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-1">Secure Download</p>
                  <p className="text-blue-700">
                    Your download is secure and anonymous. We track downloads to improve our resources 
                    but don't store personal information unless you provide an email address.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </Card>
  );
};