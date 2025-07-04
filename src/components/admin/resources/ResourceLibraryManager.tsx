import React, { useState, useRef } from 'react';
import { 
  File, 
  FileText, 
  Image, 
  Video, 
  Download, 
  Eye, 
  Edit,
  Trash2,
  Search,
  Grid,
  List,
  FolderOpen,
  Plus,
  MoreVertical,
  Star
} from 'lucide-react';
import { EducationalResource, ResourceCategory } from '../../../types/faq';
import { AdminButton, AdminModal } from '../common';
import { FileUploadZone } from './FileUploadZone';
import { PDFViewer } from './PDFViewer';
import { ResourceMetadataEditor } from './ResourceMetadataEditor';

interface ResourceLibraryManagerProps {
  resources: EducationalResource[];
  categories: ResourceCategory[];
  onResourceCreate: (resource: Omit<EducationalResource, 'id'>) => void;
  onResourceUpdate: (id: string, resource: Partial<EducationalResource>) => void;
  onResourceDelete: (id: string) => void;
  onResourceDownload: (id: string) => void;
}

type ViewMode = 'grid' | 'list';
type SortOption = 'name' | 'date' | 'size' | 'downloads' | 'rating';

interface FileUpload {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

export const ResourceLibraryManager: React.FC<ResourceLibraryManagerProps> = ({
  resources,
  categories,
  onResourceCreate,
  onResourceUpdate,
  onResourceDelete,
  onResourceDownload
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [showMetadataEditor, setShowMetadataEditor] = useState(false);
  const [selectedResource, setSelectedResource] = useState<EducationalResource | null>(null);
  const [uploads, setUploads] = useState<FileUpload[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort resources
  const filteredResources = React.useMemo(() => {
    let filtered = resources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || resource.category.id === selectedCategory;
      const matchesType = selectedType === 'all' || resource.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    });

    // Sort resources
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
          break;
        case 'size':
          comparison = (a.fileSize || 0) - (b.fileSize || 0);
          break;
        case 'downloads':
          comparison = a.downloads - b.downloads;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [resources, searchTerm, selectedCategory, selectedType, sortBy, sortOrder]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach(file => {
      const uploadId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newUpload: FileUpload = {
        id: uploadId,
        file,
        progress: 0,
        status: 'uploading'
      };

      setUploads(prev => [...prev, newUpload]);
      simulateUpload(uploadId, file);
    });
  };

  const simulateUpload = async (uploadId: string, file: File) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploads(prev => prev.map(upload => 
        upload.id === uploadId ? { ...upload, progress } : upload
      ));
    }

    // Simulate processing
    setUploads(prev => prev.map(upload => 
      upload.id === uploadId ? { ...upload, status: 'processing' } : upload
    ));

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Complete upload
    setUploads(prev => prev.map(upload => 
      upload.id === uploadId ? { ...upload, status: 'complete' } : upload
    ));

    // Create resource from file
    const newResource: Omit<EducationalResource, 'id'> = {
      title: file.name.replace(/\.[^/.]+$/, ''),
      description: `Uploaded file: ${file.name}`,
      category: categories[0],
      tags: [],
      type: getFileType(file),
      fileSize: file.size,
      difficulty: 'beginner',
      targetAudience: ['visitors'],
      language: 'en',
      lastUpdated: new Date().toISOString(),
      downloads: 0,
      views: 0,
      rating: 0,
      ratingCount: 0,
      featured: false,
      isPopular: false,
      keywords: [],
      summary: `Resource file: ${file.name}`
    };

    onResourceCreate(newResource);

    // Remove from uploads after delay
    setTimeout(() => {
      setUploads(prev => prev.filter(upload => upload.id !== uploadId));
    }, 2000);
  };

  const getFileType = (file: File): EducationalResource['type'] => {
    if (file.type.startsWith('image/')) return 'infographic';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/pdf') return 'pdf';
    return 'article';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getResourceIcon = (type: EducationalResource['type']) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'infographic': return Image;
      default: return File;
    }
  };

  const handleResourceAction = (action: string, resource: EducationalResource) => {
    setSelectedResource(resource);
    
    switch (action) {
      case 'view':
        if (resource.type === 'pdf') {
          setShowPDFViewer(true);
        } else {
          window.open(resource.url, '_blank');
        }
        break;
      case 'edit':
        setShowMetadataEditor(true);
        break;
      case 'download':
        onResourceDownload(resource.id);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete "${resource.title}"?`)) {
          onResourceDelete(resource.id);
        }
        break;
    }
  };

  const renderResourceCard = (resource: EducationalResource) => {
    const Icon = getResourceIcon(resource.type);
    
    if (viewMode === 'list') {
      return (
        <div key={resource.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 truncate">{resource.title}</h3>
              {resource.featured && <Star className="w-4 h-4 text-yellow-500" />}
            </div>
            <p className="text-sm text-gray-600 truncate">{resource.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>{resource.category.name}</span>
              <span>{formatFileSize(resource.fileSize || 0)}</span>
              <span>{resource.downloads.toLocaleString()} downloads</span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3" />
                {resource.rating.toFixed(1)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleResourceAction('view', resource)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleResourceAction('download', resource)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <div className="relative group">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <MoreVertical className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => handleResourceAction('edit', resource)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleResourceAction('delete', resource)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={resource.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          {resource.featured && (
            <Star className="w-5 h-5 text-yellow-500" />
          )}
        </div>
        
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{resource.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{resource.category.name}</span>
            <span>{formatFileSize(resource.fileSize || 0)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{resource.downloads.toLocaleString()} downloads</span>
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {resource.rating.toFixed(1)} ({resource.ratingCount})
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <AdminButton
            size="sm"
            variant="outline"
            onClick={() => handleResourceAction('view', resource)}
            icon={Eye}
          >
            View
          </AdminButton>
          <AdminButton
            size="sm"
            variant="outline"
            onClick={() => handleResourceAction('download', resource)}
            icon={Download}
          >
            Download
          </AdminButton>
          <div className="relative group ml-auto">
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={() => handleResourceAction('edit', resource)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleResourceAction('delete', resource)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Resource Library</h3>
          <p className="text-sm text-gray-600">
            Manage educational resources, documents, and media files
          </p>
        </div>
        <AdminButton
          variant="primary"
          icon={Plus}
          onClick={() => setShowUploadModal(true)}
        >
          Upload Resources
        </AdminButton>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{resources.length}</div>
          <div className="text-sm text-blue-800">Total Resources</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {resources.reduce((sum, r) => sum + r.downloads, 0).toLocaleString()}
          </div>
          <div className="text-sm text-green-800">Total Downloads</div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {formatFileSize(resources.reduce((sum, r) => sum + (r.fileSize || 0), 0))}
          </div>
          <div className="text-sm text-orange-800">Storage Used</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {(resources.reduce((sum, r) => sum + r.rating, 0) / resources.length || 0).toFixed(1)}
          </div>
          <div className="text-sm text-purple-800">Average Rating</div>
        </div>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3">Upload Progress</h4>
          <div className="space-y-2">
            {uploads.map(upload => (
              <div key={upload.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-800">{upload.file.name}</span>
                    <span className="text-blue-600">
                      {upload.status === 'complete' ? 'Complete' : 
                       upload.status === 'processing' ? 'Processing...' : `${upload.progress}%`}
                    </span>
                  </div>
                  {upload.status !== 'complete' && (
                    <div className="mt-1 bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
          <option value="article">Article</option>
          <option value="infographic">Infographic</option>
          <option value="guide">Guide</option>
        </select>

        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field as SortOption);
            setSortOrder(order as 'asc' | 'desc');
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="downloads-desc">Most Downloads</option>
          <option value="rating-desc">Highest Rated</option>
          <option value="size-desc">Largest Files</option>
        </select>

        <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Resources Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
          : 'space-y-3'
      }>
        {filteredResources.map(renderResourceCard)}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
          <p className="text-gray-600">Try adjusting your filters or upload some resources to get started.</p>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <AdminModal
          isOpen={showUploadModal}
          title="Upload Resources"
          onClose={() => setShowUploadModal(false)}
          size="lg"
        >
          <FileUploadZone
            onFilesSelected={handleFileSelect}
            onClose={() => setShowUploadModal(false)}
          />
        </AdminModal>
      )}

      {/* PDF Viewer Modal */}
      {showPDFViewer && selectedResource && (
        <AdminModal
          isOpen={showPDFViewer}
          title={selectedResource.title}
          onClose={() => setShowPDFViewer(false)}
          size="xl"
        >
          <PDFViewer
            resource={selectedResource}
            onClose={() => setShowPDFViewer(false)}
          />
        </AdminModal>
      )}

      {/* Metadata Editor Modal */}
      {showMetadataEditor && selectedResource && (
        <AdminModal
          isOpen={showMetadataEditor}
          title="Edit Resource Metadata"
          onClose={() => setShowMetadataEditor(false)}
          size="lg"
        >
          <ResourceMetadataEditor
            resource={selectedResource}
            categories={categories}
            onSave={(updates) => {
              onResourceUpdate(selectedResource.id, updates);
              setShowMetadataEditor(false);
            }}
            onCancel={() => setShowMetadataEditor(false)}
          />
        </AdminModal>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
      />
    </div>
  );
};