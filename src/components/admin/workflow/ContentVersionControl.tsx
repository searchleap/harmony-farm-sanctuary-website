import React, { useState, useMemo } from 'react';
import { 
  History, 
  GitCommit, 
  GitBranch, 
  Clock, 
  User, 
  RotateCcw, 
  Eye,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { ContentVersion, VersionDiff, WorkflowState } from '../../../types/faq';
import { AdminButton } from '../common/AdminButton';

interface ContentVersionControlProps {
  contentId: string;
  contentType: 'faq' | 'resource';
  currentVersion: ContentVersion;
  versions: ContentVersion[];
  onVersionSelect?: (version: ContentVersion) => void;
  onRollback?: (versionId: string) => void;
  onCompareVersions?: (version1: ContentVersion, version2: ContentVersion) => void;
}

export const ContentVersionControl: React.FC<ContentVersionControlProps> = ({
  contentId,
  contentType,
  currentVersion,
  versions,
  onVersionSelect,
  onRollback,
  onCompareVersions
}) => {
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<[ContentVersion?, ContentVersion?]>([]);
  const [showDiffDetails, setShowDiffDetails] = useState(false);

  // Mock diff data for demonstration
  const generateDiff = (version1: ContentVersion, version2: ContentVersion): VersionDiff[] => {
    return [
      {
        field: 'title',
        field_label: 'Title',
        old_value: version1.title,
        new_value: version2.title,
        change_type: version1.title !== version2.title ? 'modified' : 'modified'
      },
      {
        field: 'content',
        field_label: 'Content',
        old_value: 'Previous content version...',
        new_value: 'Updated content with new information...',
        change_type: 'modified'
      },
      {
        field: 'tags',
        field_label: 'Tags',
        old_value: ['animal-care', 'basics'],
        new_value: ['animal-care', 'basics', 'health'],
        change_type: 'modified'
      }
    ];
  };

  const getWorkflowStateColor = (state: WorkflowState) => {
    switch (state) {
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'review': return 'text-blue-600 bg-blue-100';
      case 'approved': return 'text-green-600 bg-green-100';
      case 'published': return 'text-emerald-600 bg-emerald-100';
      case 'archived': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWorkflowStateIcon = (state: WorkflowState) => {
    switch (state) {
      case 'draft': return <GitBranch className="w-4 h-4" />;
      case 'review': return <Eye className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'published': return <GitCommit className="w-4 h-4" />;
      case 'archived': return <XCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const handleVersionClick = (version: ContentVersion) => {
    if (compareMode) {
      const [first, second] = compareVersions;
      if (!first) {
        setCompareVersions([version, second]);
      } else if (!second && version.id !== first.id) {
        setCompareVersions([first, version]);
      } else {
        setCompareVersions([version]);
      }
    } else {
      setSelectedVersion(version);
      onVersionSelect?.(version);
    }
  };

  const handleCompare = () => {
    const [version1, version2] = compareVersions;
    if (version1 && version2) {
      onCompareVersions?.(version1, version2);
      setShowDiffDetails(true);
    }
  };

  const handleRollback = (version: ContentVersion) => {
    if (window.confirm(`Are you sure you want to rollback to version ${version.version_number}? This will create a new version with the previous content.`)) {
      onRollback?.(version.id);
    }
  };

  const sortedVersions = useMemo(() => {
    return [...versions].sort((a, b) => b.version_number - a.version_number);
  }, [versions]);

  const diffData = useMemo(() => {
    const [version1, version2] = compareVersions;
    if (version1 && version2) {
      return generateDiff(version1, version2);
    }
    return [];
  }, [compareVersions]);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Version History</h3>
              <p className="text-sm text-gray-600">
                {versions.length} versions • Current: v{currentVersion.version_number}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AdminButton
              variant={compareMode ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setCompareMode(!compareMode);
                setCompareVersions([]);
                setShowDiffDetails(false);
              }}
            >
              {compareMode ? 'Exit Compare' : 'Compare Versions'}
            </AdminButton>
            
            {compareMode && compareVersions.filter(Boolean).length === 2 && (
              <AdminButton
                variant="primary"
                size="sm"
                onClick={handleCompare}
              >
                Compare Selected
              </AdminButton>
            )}
          </div>
        </div>
      </div>

      {/* Compare Mode Instructions */}
      {compareMode && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center space-x-2 text-blue-800">
            <GitBranch className="w-4 h-4" />
            <span className="text-sm font-medium">
              Compare Mode: Select 2 versions to compare
              {compareVersions.filter(Boolean).length > 0 && (
                <span className="ml-2">
                  ({compareVersions.filter(Boolean).length}/2 selected)
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Version List */}
        <div className="w-1/2 border-r border-gray-200">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-medium text-gray-700">Version Timeline</h4>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {sortedVersions.map((version, index) => {
              const isSelected = selectedVersion?.id === version.id;
              const isInCompare = compareVersions.some(v => v?.id === version.id);
              const isCurrent = version.id === currentVersion.id;
              
              return (
                <div
                  key={version.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50' : 
                    isInCompare ? 'bg-green-50' : 
                    'hover:bg-gray-50'
                  }`}
                  onClick={() => handleVersionClick(version)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getWorkflowStateIcon(version.workflow_state)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">
                            v{version.version_number}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getWorkflowStateColor(version.workflow_state)}`}>
                          {version.workflow_state}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {version.changes_summary}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{version.created_by}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(version.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      {!isCurrent && !compareMode && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <AdminButton
                            variant="outline"
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRollback(version);
                            }}
                            icon={RotateCcw}
                          >
                            Rollback
                          </AdminButton>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Version Details / Comparison */}
        <div className="w-1/2">
          {showDiffDetails && diffData.length > 0 ? (
            <div>
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-700">
                    Version Comparison
                  </h4>
                  <AdminButton
                    variant="outline"
                    size="xs"
                    onClick={() => setShowDiffDetails(false)}
                  >
                    Close
                  </AdminButton>
                </div>
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-600">
                  <span>v{compareVersions[0]?.version_number}</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>v{compareVersions[1]?.version_number}</span>
                </div>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {diffData.map((diff, index) => (
                  <div key={index} className="p-4 border-b border-gray-100">
                    <div className="font-medium text-sm text-gray-900 mb-2">
                      {diff.field_label}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Before</div>
                        <div className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                          {Array.isArray(diff.old_value) 
                            ? diff.old_value.join(', ')
                            : String(diff.old_value)
                          }
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-500 mb-1">After</div>
                        <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                          {Array.isArray(diff.new_value) 
                            ? diff.new_value.join(', ')
                            : String(diff.new_value)
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedVersion ? (
            <div>
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">
                  Version v{selectedVersion.version_number} Details
                </h4>
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Title
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{selectedVersion.title}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Changes Summary
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{selectedVersion.changes_summary}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Workflow State
                  </label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getWorkflowStateColor(selectedVersion.workflow_state)}`}>
                      {getWorkflowStateIcon(selectedVersion.workflow_state)}
                      <span>{selectedVersion.workflow_state}</span>
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Created By
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{selectedVersion.created_by}</p>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Created At
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedVersion.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">
                  {compareMode 
                    ? 'Select 2 versions to compare'
                    : 'Select a version to view details'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};