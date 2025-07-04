import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle, 
  GitCommit, 
  TrendingUp,
  Filter,
  Search,
  Calendar,
  User,
  FileText,
  AlertTriangle,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { ContentVersion, WorkflowState, ApprovalData } from '../../../types/faq';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';

interface WorkflowItem {
  id: string;
  title: string;
  type: 'faq' | 'resource';
  current_state: WorkflowState;
  version: ContentVersion;
  approval_data?: ApprovalData;
  last_updated: string;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high';
  days_in_current_state: number;
}

interface WorkflowDashboardProps {
  items: WorkflowItem[];
  currentUser: string;
  userRole: string;
  onItemClick?: (item: WorkflowItem) => void;
  onBulkAction?: (action: string, itemIds: string[]) => void;
  onStateChange?: (itemId: string, newState: WorkflowState) => void;
}

export const WorkflowDashboard: React.FC<WorkflowDashboardProps> = ({
  items,
  currentUser,
  userRole,
  onItemClick,
  onBulkAction,
  onStateChange
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterState, setFilterState] = useState<WorkflowState | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | 'faq' | 'resource'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'updated' | 'priority' | 'state' | 'type'>('updated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data for demonstration
  const mockItems: WorkflowItem[] = [
    {
      id: 'faq-1',
      title: 'How do I volunteer at the sanctuary?',
      type: 'faq',
      current_state: 'review',
      version: {
        id: 'v1',
        content_id: 'faq-1',
        content_type: 'faq',
        version_number: 2,
        title: 'How do I volunteer at the sanctuary?',
        content: {},
        changes_summary: 'Updated volunteer requirements',
        created_by: 'editor1',
        created_at: '2024-01-15T10:00:00Z',
        is_current: true,
        workflow_state: 'review'
      },
      last_updated: '2024-01-15T10:00:00Z',
      assigned_to: 'reviewer1',
      priority: 'high',
      days_in_current_state: 2
    },
    {
      id: 'resource-1',
      title: 'Animal Care Guidelines PDF',
      type: 'resource',
      current_state: 'approved',
      version: {
        id: 'v2',
        content_id: 'resource-1',
        content_type: 'resource',
        version_number: 1,
        title: 'Animal Care Guidelines PDF',
        content: {},
        changes_summary: 'Initial version',
        created_by: 'content_creator',
        created_at: '2024-01-14T14:00:00Z',
        is_current: true,
        workflow_state: 'approved'
      },
      last_updated: '2024-01-14T14:00:00Z',
      assigned_to: 'admin1',
      priority: 'medium',
      days_in_current_state: 1
    }
  ];

  const allItems = items.length > 0 ? items : mockItems;

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalItems = allItems.length;
    const byState = allItems.reduce((acc, item) => {
      acc[item.current_state] = (acc[item.current_state] || 0) + 1;
      return acc;
    }, {} as Record<WorkflowState, number>);

    const avgTimeInState = allItems.reduce((sum, item) => sum + item.days_in_current_state, 0) / totalItems;
    const highPriorityItems = allItems.filter(item => item.priority === 'high').length;
    const overdueItems = allItems.filter(item => item.days_in_current_state > 7).length;
    
    const myAssignedItems = allItems.filter(item => item.assigned_to === currentUser).length;

    return {
      totalItems,
      byState,
      avgTimeInState: Math.round(avgTimeInState * 10) / 10,
      highPriorityItems,
      overdueItems,
      myAssignedItems
    };
  }, [allItems, currentUser]);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    let filtered = allItems;

    // Apply filters
    if (filterState !== 'all') {
      filtered = filtered.filter(item => item.current_state === filterState);
    }
    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }
    if (filterAssignee !== 'all') {
      if (filterAssignee === 'me') {
        filtered = filtered.filter(item => item.assigned_to === currentUser);
      } else {
        filtered = filtered.filter(item => item.assigned_to === filterAssignee);
      }
    }
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'updated':
          comparison = new Date(b.last_updated).getTime() - new Date(a.last_updated).getTime();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'state':
          comparison = a.current_state.localeCompare(b.current_state);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }, [allItems, filterState, filterType, filterAssignee, searchQuery, sortBy, sortOrder, currentUser]);

  const getStateColor = (state: WorkflowState) => {
    switch (state) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'published': return 'bg-emerald-100 text-emerald-800';
      case 'archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const uniqueAssignees = useMemo(() => {
    const assignees = new Set(allItems.map(item => item.assigned_to).filter(Boolean));
    return Array.from(assignees);
  }, [allItems]);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Workflow Dashboard</h3>
              <p className="text-sm text-gray-600">
                {analytics.totalItems} items in workflow • {analytics.myAssignedItems} assigned to you
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{analytics.byState.draft || 0}</div>
            <div className="text-xs text-gray-600">Draft</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{analytics.byState.review || 0}</div>
            <div className="text-xs text-gray-600">In Review</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{analytics.byState.approved || 0}</div>
            <div className="text-xs text-gray-600">Approved</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-600">{analytics.byState.published || 0}</div>
            <div className="text-xs text-gray-600">Published</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">{analytics.highPriorityItems}</div>
            <div className="text-xs text-gray-600">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">{analytics.overdueItems}</div>
            <div className="text-xs text-gray-600">Overdue</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
          
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value as WorkflowState | 'all')}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All States</option>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="approved">Approved</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'faq' | 'resource')}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Types</option>
            <option value="faq">FAQs</option>
            <option value="resource">Resources</option>
          </select>
          
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Assignees</option>
            <option value="me">Assigned to Me</option>
            {uniqueAssignees.map(assignee => (
              <option key={assignee} value={assignee}>{assignee}</option>
            ))}
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
            <span className="text-sm text-blue-900">
              {selectedItems.length} items selected
            </span>
            <div className="flex space-x-2">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => onBulkAction?.('approve', selectedItems)}
              >
                Bulk Approve
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => onBulkAction?.('reject', selectedItems)}
              >
                Bulk Reject
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedItems([])}
              >
                Clear Selection
              </AdminButton>
            </div>
          </div>
        )}
      </div>

      {/* Items List */}
      <div className="max-h-96 overflow-y-auto">
        {/* Table Header */}
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-4">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
            </div>
            <div className="col-span-4">Title</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-2">State</div>
            <div className="col-span-1">Priority</div>
            <div className="col-span-2">Assigned To</div>
            <div className="col-span-1">Actions</div>
          </div>
        </div>

        {/* Items */}
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No items match your current filters</p>
          </div>
        ) : (
          <div>
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => onItemClick?.(item)}
              >
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleSelectItem(item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300"
                  />
                </div>
                
                <div className="col-span-4">
                  <div className="font-medium text-gray-900 truncate">{item.title}</div>
                  <div className="text-xs text-gray-500">
                    v{item.version.version_number} • {item.days_in_current_state} days in state
                  </div>
                </div>
                
                <div className="col-span-1">
                  <span className="text-sm text-gray-600 capitalize">{item.type}</span>
                </div>
                
                <div className="col-span-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStateColor(item.current_state)}`}>
                    {item.current_state}
                  </span>
                </div>
                
                <div className="col-span-1">
                  <span className={`text-sm font-medium ${getPriorityColor(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 text-gray-400" />
                    <span className="text-sm text-gray-600">{item.assigned_to || 'Unassigned'}</span>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <AdminButton
                    variant="outline"
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemClick?.(item);
                    }}
                    icon={Eye}
                  >
                    View
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {filteredItems.length} of {analytics.totalItems} items
          </div>
          <div className="flex items-center space-x-4">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded px-2 py-1 text-xs"
            >
              <option value="updated">Last Updated</option>
              <option value="priority">Priority</option>
              <option value="state">State</option>
              <option value="type">Type</option>
            </select>
            <AdminButton
              variant="outline"
              size="xs"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </AdminButton>
          </div>
        </div>
      </div>
    </div>
  );
};