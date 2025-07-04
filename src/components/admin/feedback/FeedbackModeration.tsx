import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  Flag, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  MessageSquare,
  User,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Filter,
  Search,
  MoreHorizontal,
  AlertTriangle,
  Send
} from 'lucide-react';
import { UserFeedback } from '../../../types/faq';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';

interface FeedbackModerationProps {
  feedback: UserFeedback[];
  onFeedbackUpdate?: (feedbackId: string, updates: Partial<UserFeedback>) => void;
  onFeedbackDelete?: (feedbackId: string) => void;
  onBulkAction?: (action: string, feedbackIds: string[]) => void;
  onResponseSubmit?: (feedbackId: string, response: string) => void;
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
}

export const FeedbackModeration: React.FC<FeedbackModerationProps> = ({
  feedback,
  onFeedbackUpdate,
  onFeedbackDelete,
  onBulkAction,
  onResponseSubmit,
  currentUser
}) => {
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'flagged' | 'hidden'>('all');
  const [filterType, setFilterType] = useState<'all' | 'helpfulness' | 'rating' | 'comment'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'rating' | 'content_type'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [responseText, setResponseText] = useState<Record<string, string>>({});
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);

  // Filter and sort feedback
  const filteredFeedback = useMemo(() => {
    let filtered = feedback;

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(f => f.status === filterStatus);
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(f => f.feedback_type === filterType);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(f => 
        f.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.content_id.includes(searchQuery) ||
        f.content_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'created_at':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case 'rating':
          comparison = (b.rating || 0) - (a.rating || 0);
          break;
        case 'content_type':
          comparison = a.content_type.localeCompare(b.content_type);
          break;
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }, [feedback, filterStatus, filterType, searchQuery, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const pending = feedback.filter(f => f.status === 'pending').length;
    const flagged = feedback.filter(f => f.status === 'flagged').length;
    const approved = feedback.filter(f => f.status === 'approved').length;
    const total = feedback.length;
    
    return { pending, flagged, approved, total };
  }, [feedback]);

  const handleFeedbackAction = (feedbackId: string, action: 'approve' | 'flag' | 'hide' | 'delete') => {
    switch (action) {
      case 'approve':
        onFeedbackUpdate?.(feedbackId, { 
          status: 'approved', 
          moderated_by: currentUser.id,
          moderated_at: new Date().toISOString()
        });
        break;
      case 'flag':
        onFeedbackUpdate?.(feedbackId, { 
          status: 'flagged',
          moderated_by: currentUser.id,
          moderated_at: new Date().toISOString()
        });
        break;
      case 'hide':
        onFeedbackUpdate?.(feedbackId, { 
          status: 'hidden',
          moderated_by: currentUser.id,
          moderated_at: new Date().toISOString()
        });
        break;
      case 'delete':
        onFeedbackDelete?.(feedbackId);
        break;
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedFeedback.length > 0) {
      onBulkAction?.(action, selectedFeedback);
      setSelectedFeedback([]);
    }
  };

  const handleSelectAll = () => {
    if (selectedFeedback.length === filteredFeedback.length) {
      setSelectedFeedback([]);
    } else {
      setSelectedFeedback(filteredFeedback.map(f => f.id));
    }
  };

  const handleSelectFeedback = (feedbackId: string) => {
    setSelectedFeedback(prev => 
      prev.includes(feedbackId)
        ? prev.filter(id => id !== feedbackId)
        : [...prev, feedbackId]
    );
  };

  const handleResponseSubmit = (feedbackId: string) => {
    const response = responseText[feedbackId];
    if (response?.trim()) {
      onResponseSubmit?.(feedbackId, response);
      setResponseText(prev => ({ ...prev, [feedbackId]: '' }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      case 'hidden':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'helpfulness':
        return <ThumbsUp className="w-4 h-4" />;
      case 'rating':
        return <Star className="w-4 h-4" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Feedback Moderation</h3>
              <p className="text-sm text-gray-600">
                Review and manage user feedback
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-700">{stats.pending}</div>
            <div className="text-xs text-yellow-600">Pending</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-red-700">{stats.flagged}</div>
            <div className="text-xs text-red-600">Flagged</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">{stats.approved}</div>
            <div className="text-xs text-green-600">Approved</div>
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
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="flagged">Flagged</option>
            <option value="hidden">Hidden</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Types</option>
            <option value="helpfulness">Helpfulness</option>
            <option value="rating">Rating</option>
            <option value="comment">Comment</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="rating-desc">Highest Rating</option>
            <option value="rating-asc">Lowest Rating</option>
            <option value="content_type-asc">Content Type</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedFeedback.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
            <span className="text-sm text-blue-900">
              {selectedFeedback.length} items selected
            </span>
            <div className="flex space-x-2">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('approve')}
              >
                Approve All
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('flag')}
              >
                Flag All
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction('hide')}
              >
                Hide All
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedFeedback([])}
              >
                Clear Selection
              </AdminButton>
            </div>
          </div>
        )}
      </div>

      {/* Feedback List */}
      <div className="max-h-96 overflow-y-auto">
        {/* Table Header */}
        <div className="sticky top-0 bg-gray-50 border-b border-gray-200 p-4">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedFeedback.length === filteredFeedback.length && filteredFeedback.length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
            </div>
            <div className="col-span-2">Feedback</div>
            <div className="col-span-2">Content</div>
            <div className="col-span-1">Type</div>
            <div className="col-span-1">Rating</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">User</div>
            <div className="col-span-1">Actions</div>
          </div>
        </div>

        {/* Feedback Items */}
        {filteredFeedback.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p className="text-sm">No feedback matches your current filters</p>
          </div>
        ) : (
          <div>
            {filteredFeedback.map(item => (
              <div key={item.id} className="border-b border-gray-100">
                <div className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={selectedFeedback.includes(item.id)}
                      onChange={() => handleSelectFeedback(item.id)}
                      className="rounded border-gray-300"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(item.feedback_type)}
                      <div>
                        {item.feedback_type === 'helpfulness' && (
                          <span className={`text-sm ${item.helpful ? 'text-green-600' : 'text-red-600'}`}>
                            {item.helpful ? 'Helpful' : 'Not Helpful'}
                          </span>
                        )}
                        {item.feedback_type === 'rating' && item.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-sm">{item.rating}</span>
                          </div>
                        )}
                        {item.comment && (
                          <div 
                            className="text-sm text-gray-600 cursor-pointer truncate max-w-xs"
                            onClick={() => setExpandedFeedback(expandedFeedback === item.id ? null : item.id)}
                          >
                            {item.comment.length > 50 ? `${item.comment.substring(0, 50)}...` : item.comment}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600 capitalize">{item.content_type}</span>
                    <div className="text-xs text-gray-400 truncate">{item.content_id}</div>
                  </div>
                  
                  <div className="col-span-1">
                    <span className="text-sm text-gray-600 capitalize">{item.feedback_type}</span>
                  </div>
                  
                  <div className="col-span-1">
                    {item.rating ? (
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-sm">{item.rating}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.moderated_by && (
                      <div className="text-xs text-gray-500 mt-1">
                        by {item.moderated_by}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {item.user_id || 'Anonymous'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="flex items-center space-x-1">
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleFeedbackAction(item.id, 'approve')}
                            className="text-green-600 hover:text-green-800"
                            title="Approve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleFeedbackAction(item.id, 'flag')}
                            className="text-red-600 hover:text-red-800"
                            title="Flag"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleFeedbackAction(item.id, 'hide')}
                        className="text-gray-600 hover:text-gray-800"
                        title="Hide"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Expanded Details */}
                {expandedFeedback === item.id && (
                  <div className="px-4 pb-4 bg-gray-50">
                    {item.comment && (
                      <div className="mb-3">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Full Comment
                        </label>
                        <p className="text-sm text-gray-700 mt-1">{item.comment}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <label className="text-gray-500 uppercase tracking-wide">User Agent</label>
                        <p className="text-gray-700 truncate">{item.user_agent || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-gray-500 uppercase tracking-wide">Time Spent</label>
                        <p className="text-gray-700">{item.time_spent ? `${item.time_spent}s` : 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-gray-500 uppercase tracking-wide">Session ID</label>
                        <p className="text-gray-700 truncate">{item.session_id || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {/* Response Form */}
                    <div className="mt-4 p-3 bg-white rounded border">
                      <label className="block text-xs font-medium text-gray-700 mb-2">
                        Response to User
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          placeholder="Type your response..."
                          value={responseText[item.id] || ''}
                          onChange={(e) => setResponseText(prev => ({ ...prev, [item.id]: e.target.value }))}
                          className="flex-1 text-sm border border-gray-300 rounded px-3 py-1"
                        />
                        <AdminButton
                          variant="primary"
                          size="sm"
                          onClick={() => handleResponseSubmit(item.id)}
                          disabled={!responseText[item.id]?.trim()}
                          icon={Send}
                        >
                          Send
                        </AdminButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {filteredFeedback.length} of {feedback.length} feedback items
          </div>
          <div>
            Moderated by {currentUser.name}
          </div>
        </div>
      </div>
    </div>
  );
};