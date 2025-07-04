import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Edit, 
  Plus, 
  Minus,
  Eye,
  EyeOff,
  Filter,
  RefreshCw
} from 'lucide-react';
import { ChangeRecord, VersionDiff } from '../../../types/faq';
import { AdminButton } from '../common/AdminButton';

interface ChangeTrackerProps {
  contentId: string;
  contentType: 'faq' | 'resource';
  currentContent: any;
  previousContent?: any;
  changes: ChangeRecord[];
  onTrackChanges?: (changes: VersionDiff[]) => void;
  autoTrack?: boolean;
}

export const ChangeTracker: React.FC<ChangeTrackerProps> = ({
  contentId,
  contentType,
  currentContent,
  previousContent,
  changes,
  onTrackChanges,
  autoTrack = true
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [isTracking, setIsTracking] = useState(autoTrack);
  const [detectedChanges, setDetectedChanges] = useState<VersionDiff[]>([]);

  // Field configurations for different content types
  const fieldConfigs = {
    faq: {
      question: { label: 'Question', type: 'text', important: true },
      answer: { label: 'Answer', type: 'text', important: true },
      category: { label: 'Category', type: 'object', important: true },
      tags: { label: 'Tags', type: 'array', important: false },
      difficulty: { label: 'Difficulty', type: 'text', important: false },
      keywords: { label: 'Keywords', type: 'array', important: false },
      priority: { label: 'Priority', type: 'number', important: false }
    },
    resource: {
      title: { label: 'Title', type: 'text', important: true },
      description: { label: 'Description', type: 'text', important: true },
      category: { label: 'Category', type: 'object', important: true },
      tags: { label: 'Tags', type: 'array', important: false },
      type: { label: 'Type', type: 'text', important: true },
      difficulty: { label: 'Difficulty', type: 'text', important: false },
      targetAudience: { label: 'Target Audience', type: 'array', important: false },
      url: { label: 'URL', type: 'text', important: true }
    }
  };

  const currentFieldConfig = fieldConfigs[contentType] || {};

  // Detect changes between current and previous content
  const detectChanges = useMemo(() => {
    if (!previousContent || !currentContent) return [];

    const changes: VersionDiff[] = [];
    const fields = Object.keys(currentFieldConfig);

    fields.forEach(field => {
      const config = currentFieldConfig[field];
      const oldValue = previousContent[field];
      const newValue = currentContent[field];

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        let changeType: 'added' | 'removed' | 'modified' = 'modified';
        
        if (oldValue === undefined || oldValue === null) {
          changeType = 'added';
        } else if (newValue === undefined || newValue === null) {
          changeType = 'removed';
        }

        changes.push({
          field,
          field_label: config.label,
          old_value: oldValue,
          new_value: newValue,
          change_type: changeType
        });
      }
    });

    return changes;
  }, [currentContent, previousContent, currentFieldConfig]);

  useEffect(() => {
    if (isTracking && detectChanges.length > 0) {
      setDetectedChanges(detectChanges);
      onTrackChanges?.(detectChanges);
    }
  }, [detectChanges, isTracking, onTrackChanges]);

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'removed':
        return <Minus className="w-4 h-4 text-red-600" />;
      case 'modified':
        return <Edit className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'added':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'removed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'modified':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'None';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return value.name || JSON.stringify(value);
    return String(value);
  };

  const getImportanceLevel = (field: string): 'high' | 'medium' | 'low' => {
    const config = currentFieldConfig[field];
    if (!config) return 'low';
    return config.important ? 'high' : 'medium';
  };

  const filteredChanges = useMemo(() => {
    let changesToShow = detectedChanges.length > 0 ? detectedChanges : 
      changes.flatMap(change => change.changes);

    if (filterType !== 'all') {
      changesToShow = changesToShow.filter(change => change.change_type === filterType);
    }

    return changesToShow;
  }, [detectedChanges, changes, filterType]);

  const changesSummary = useMemo(() => {
    const total = filteredChanges.length;
    const added = filteredChanges.filter(c => c.change_type === 'added').length;
    const removed = filteredChanges.filter(c => c.change_type === 'removed').length;
    const modified = filteredChanges.filter(c => c.change_type === 'modified').length;
    const majorChanges = filteredChanges.filter(c => getImportanceLevel(c.field) === 'high').length;

    return { total, added, removed, modified, majorChanges };
  }, [filteredChanges]);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Activity className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Change Tracker</h3>
              <p className="text-sm text-gray-600">
                {changesSummary.total} changes detected
                {changesSummary.majorChanges > 0 && (
                  <span className="ml-2 text-orange-600">
                    ({changesSummary.majorChanges} major)
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AdminButton
              variant={isTracking ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setIsTracking(!isTracking)}
              icon={isTracking ? Eye : EyeOff}
            >
              {isTracking ? 'Tracking' : 'Paused'}
            </AdminButton>
            
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              icon={showDetails ? EyeOff : Eye}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </AdminButton>
          </div>
        </div>
      </div>

      {/* Change Summary */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{changesSummary.added}</div>
            <div className="text-xs text-gray-600">Added</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{changesSummary.modified}</div>
            <div className="text-xs text-gray-600">Modified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{changesSummary.removed}</div>
            <div className="text-xs text-gray-600">Removed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{changesSummary.majorChanges}</div>
            <div className="text-xs text-gray-600">Major</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter changes:</span>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Changes</option>
            <option value="added">Added Fields</option>
            <option value="modified">Modified Fields</option>
            <option value="removed">Removed Fields</option>
          </select>
        </div>
      </div>

      {/* Changes List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredChanges.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">
              {isTracking ? 'No changes detected' : 'Change tracking is paused'}
            </p>
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {filteredChanges.map((change, index) => {
              const importance = getImportanceLevel(change.field);
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {getChangeTypeIcon(change.change_type)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {change.field_label}
                          </span>
                          
                          {importance === 'high' && (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                              Major Change
                            </span>
                          )}
                          
                          <span className={`px-2 py-1 text-xs rounded-full border ${getChangeTypeColor(change.change_type)}`}>
                            {change.change_type}
                          </span>
                        </div>
                        
                        {showDetails && (
                          <div className="mt-2 space-y-2">
                            {change.change_type !== 'added' && (
                              <div>
                                <div className="text-xs text-gray-500">Before:</div>
                                <div className="text-sm text-gray-700 bg-red-50 p-2 rounded border border-red-200">
                                  {formatValue(change.old_value)}
                                </div>
                              </div>
                            )}
                            
                            {change.change_type !== 'removed' && (
                              <div>
                                <div className="text-xs text-gray-500">After:</div>
                                <div className="text-sm text-gray-700 bg-green-50 p-2 rounded border border-green-200">
                                  {formatValue(change.new_value)}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {importance === 'high' && (
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Actions */}
      {filteredChanges.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {changesSummary.majorChanges > 0 ? (
                <div className="flex items-center space-x-1 text-orange-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Major changes detected - consider creating a new version</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Changes look good</span>
                </div>
              )}
            </div>
            
            <AdminButton
              variant="primary"
              size="sm"
              onClick={() => onTrackChanges?.(filteredChanges)}
              icon={RefreshCw}
            >
              Save Changes
            </AdminButton>
          </div>
        </div>
      )}
    </div>
  );
};