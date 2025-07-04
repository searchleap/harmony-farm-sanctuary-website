import React, { useState, useRef, useCallback } from 'react';
import { Upload, File, X, AlertCircle, CheckCircle, Image, Video, FileText } from 'lucide-react';
import { AdminButton } from '../common';

interface FileUploadZoneProps {
  onFilesSelected: (files: FileList) => void;
  onClose: () => void;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
}

interface FilePreview {
  file: File;
  id: string;
  preview?: string;
  error?: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFilesSelected,
  onClose,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  acceptedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo'
  ]
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | undefined => {
    if (file.size > maxFileSize) {
      return `File size exceeds ${formatFileSize(maxFileSize)} limit`;
    }
    
    if (!acceptedTypes.includes(file.type)) {
      return 'File type not supported';
    }
    
    return undefined;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.startsWith('video/')) return Video;
    if (type === 'application/pdf') return FileText;
    return File;
  };

  const createFilePreview = useCallback(async (file: File): Promise<FilePreview> => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const error = validateFile(file);
    
    let preview: string | undefined;
    
    // Create preview for images
    if (file.type.startsWith('image/') && !error) {
      try {
        preview = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      } catch (err) {
        console.error('Error creating preview:', err);
      }
    }
    
    return { file, id, preview, error };
  }, []);

  const processFiles = async (files: FileList) => {
    setIsProcessing(true);
    
    const fileArray = Array.from(files);
    
    if (fileArray.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} files at once`);
      setIsProcessing(false);
      return;
    }
    
    try {
      const previews = await Promise.all(fileArray.map(createFilePreview));
      setSelectedFiles(previews);
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleUpload = () => {
    const validFiles = selectedFiles.filter(f => !f.error);
    if (validFiles.length === 0) return;
    
    const dataTransfer = new DataTransfer();
    validFiles.forEach(filePreview => {
      dataTransfer.items.add(filePreview.file);
    });
    
    onFilesSelected(dataTransfer.files);
    onClose();
  };

  const hasValidFiles = selectedFiles.some(f => !f.error);
  const hasErrors = selectedFiles.some(f => f.error);

  return (
    <div className="space-y-6">
      {/* Upload Instructions */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Educational Resources</h3>
        <p className="text-sm text-gray-600">
          Drag and drop files here or click to browse. Supported formats: PDF, Word documents, images, and videos.
        </p>
      </div>

      {/* File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {isDragOver ? 'Drop files here' : 'Choose files to upload'}
          </p>
          <p className="text-sm text-gray-600">
            or drag and drop them here
          </p>
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Maximum file size: {formatFileSize(maxFileSize)}</p>
          <p>Maximum {maxFiles} files per upload</p>
        </div>

        {isProcessing && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="text-blue-600">Processing files...</div>
          </div>
        )}
      </div>

      {/* File Previews */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Selected Files ({selectedFiles.length})</h4>
          
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {selectedFiles.map((filePreview) => {
              const Icon = getFileIcon(filePreview.file.type);
              
              return (
                <div 
                  key={filePreview.id}
                  className={`flex items-center gap-3 p-3 border rounded-lg ${
                    filePreview.error ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  {/* File Preview/Icon */}
                  <div className="flex-shrink-0">
                    {filePreview.preview ? (
                      <img 
                        src={filePreview.preview} 
                        alt={filePreview.file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                        <Icon className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {filePreview.file.name}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{formatFileSize(filePreview.file.size)}</span>
                      <span>{filePreview.file.type}</span>
                    </div>
                    
                    {filePreview.error && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {filePreview.error}
                      </div>
                    )}
                  </div>
                  
                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {filePreview.error ? (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(filePreview.id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Upload Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="space-y-1">
                {hasValidFiles && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    {selectedFiles.filter(f => !f.error).length} files ready to upload
                  </div>
                )}
                {hasErrors && (
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    {selectedFiles.filter(f => f.error).length} files have errors
                  </div>
                )}
              </div>
              
              <div className="text-gray-600">
                Total size: {formatFileSize(
                  selectedFiles
                    .filter(f => !f.error)
                    .reduce((sum, f) => sum + f.file.size, 0)
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <AdminButton 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </AdminButton>
        <AdminButton 
          variant="primary"
          onClick={handleUpload}
          disabled={!hasValidFiles}
          icon={Upload}
        >
          Upload {selectedFiles.filter(f => !f.error).length} File{selectedFiles.filter(f => !f.error).length !== 1 ? 's' : ''}
        </AdminButton>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};