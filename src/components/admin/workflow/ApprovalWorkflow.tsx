import React, { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare, 
  ArrowRight,
  AlertTriangle,
  FileText,
  Send,
  Eye,
  GitCommit
} from 'lucide-react';
import { ApprovalData, ApprovalStage, ApprovalComment, WorkflowState } from '../../../types/faq';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';

interface ApprovalWorkflowProps {
  contentId: string;
  contentType: 'faq' | 'resource';
  currentState: WorkflowState;
  approvalData?: ApprovalData;
  userRole: string;
  onStateChange?: (newState: WorkflowState, comment?: string) => void;
  onAddComment?: (stageId: string, comment: string, isInternal: boolean) => void;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  contentId,
  contentType,
  currentState,
  approvalData,
  userRole,
  onStateChange,
  onAddComment
}) => {
  const [activeCommentStage, setActiveCommentStage] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [actionComment, setActionComment] = useState('');
  const [showActionModal, setShowActionModal] = useState<{ action: string; newState: WorkflowState } | null>(null);

  // Default approval workflow stages
  const defaultStages: ApprovalStage[] = [
    {
      id: 'content-review',
      name: 'Content Review',
      role_required: 'content_reviewer',
      order: 1,
      status: 'pending'
    },
    {
      id: 'editorial-review',
      name: 'Editorial Review',
      role_required: 'editor',
      order: 2,
      status: 'pending'
    },
    {
      id: 'final-approval',
      name: 'Final Approval',
      role_required: 'admin',
      order: 3,
      status: 'pending'
    }
  ];

  const stages = approvalData?.stages || defaultStages;
  const comments = approvalData?.comments || [];

  const getStageStatus = (stage: ApprovalStage, currentState: WorkflowState) => {
    if (currentState === 'draft') return 'pending';
    if (currentState === 'archived') return 'skipped';
    
    // If we're past this stage, it's approved
    if (stage.order < getCurrentStageOrder(currentState)) {
      return 'approved';
    }
    
    // If this is the current stage
    if (stage.order === getCurrentStageOrder(currentState)) {
      return currentState === 'review' ? 'pending' : 'approved';
    }
    
    // Future stages
    return 'pending';
  };

  const getCurrentStageOrder = (state: WorkflowState): number => {
    switch (state) {
      case 'draft': return 0;
      case 'review': return 1;
      case 'approved': return 4;
      case 'published': return 5;
      case 'archived': return 6;
      default: return 0;
    }
  };

  const canUserActOnStage = (stage: ApprovalStage): boolean => {
    return stage.role_required === userRole || userRole === 'admin';
  };

  const getAvailableActions = (currentState: WorkflowState) => {
    const actions = [];
    
    switch (currentState) {
      case 'draft':
        actions.push({ label: 'Submit for Review', newState: 'review' as WorkflowState, variant: 'primary' });
        break;
      case 'review':
        if (userRole === 'content_reviewer' || userRole === 'editor' || userRole === 'admin') {
          actions.push({ label: 'Approve', newState: 'approved' as WorkflowState, variant: 'primary' });
          actions.push({ label: 'Request Changes', newState: 'draft' as WorkflowState, variant: 'secondary' });
        }
        break;
      case 'approved':
        if (userRole === 'admin' || userRole === 'editor') {
          actions.push({ label: 'Publish', newState: 'published' as WorkflowState, variant: 'primary' });
          actions.push({ label: 'Send Back to Review', newState: 'review' as WorkflowState, variant: 'secondary' });
        }
        break;
      case 'published':
        if (userRole === 'admin') {
          actions.push({ label: 'Archive', newState: 'archived' as WorkflowState, variant: 'secondary' });
        }
        break;
    }
    
    return actions;
  };

  const handleAction = (action: string, newState: WorkflowState) => {
    setShowActionModal({ action, newState });
  };

  const confirmAction = () => {
    if (showActionModal) {
      onStateChange?.(showActionModal.newState, actionComment || undefined);
      setShowActionModal(null);
      setActionComment('');
    }
  };

  const handleAddComment = (stageId: string) => {
    if (commentText.trim()) {
      onAddComment?.(stageId, commentText, isInternalComment);
      setCommentText('');
      setActiveCommentStage(null);
    }
  };

  const getStageIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'skipped':
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

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

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GitCommit className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Approval Workflow</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-600">Current Status:</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStateColor(currentState)}`}>
                  {currentState.charAt(0).toUpperCase() + currentState.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          {approvalData && (
            <div className="text-right text-sm text-gray-600">
              <div>Submitted by {approvalData.submitted_by}</div>
              <div>{new Date(approvalData.submitted_at).toLocaleDateString()}</div>
            </div>
          )}
        </div>
      </div>

      {/* Workflow Progress */}
      <div className="p-6 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Approval Progress</h4>
        
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage, currentState);
            const isActive = getCurrentStageOrder(currentState) === stage.order;
            const stageComments = comments.filter(c => c.stage_id === stage.id);
            
            return (
              <div key={stage.id} className={`relative ${isActive ? 'ring-2 ring-blue-500 ring-opacity-50 rounded-lg' : ''}`}>
                <div className="flex items-start space-x-4 p-4">
                  {/* Stage Icon */}
                  <div className="flex-shrink-0">
                    {getStageIcon(status)}
                  </div>
                  
                  {/* Stage Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">{stage.name}</h5>
                        <p className="text-xs text-gray-500">
                          Required Role: {stage.role_required}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {status === 'approved' && stage.approved_by && (
                          <span className="text-xs text-green-600">
                            Approved by {stage.approved_by}
                          </span>
                        )}
                        
                        {canUserActOnStage(stage) && status === 'pending' && isActive && (
                          <AdminButton
                            variant="outline"
                            size="xs"
                            onClick={() => setActiveCommentStage(activeCommentStage === stage.id ? null : stage.id)}
                            icon={MessageSquare}
                          >
                            Comment
                          </AdminButton>
                        )}
                      </div>
                    </div>
                    
                    {/* Stage Notes */}
                    {stage.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                        {stage.notes}
                      </div>
                    )}
                    
                    {/* Comments for this stage */}
                    {stageComments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {stageComments.map(comment => (
                          <div key={comment.id} className="p-2 bg-blue-50 rounded border border-blue-200">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-blue-900">
                                {comment.author}
                              </span>
                              <div className="flex items-center space-x-2">
                                {comment.is_internal && (
                                  <span className="px-1.5 py-0.5 text-xs bg-orange-100 text-orange-800 rounded">
                                    Internal
                                  </span>
                                )}
                                <span className="text-xs text-blue-600">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-blue-800">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Add Comment Form */}
                    {activeCommentStage === stage.id && (
                      <div className="mt-3 p-3 bg-gray-50 rounded border">
                        <AdminFormField
                          label="Add Comment"
                          type="textarea"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Enter your comment..."
                          rows={3}
                        />
                        
                        <div className="flex items-center justify-between mt-2">
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isInternalComment}
                              onChange={(e) => setIsInternalComment(e.target.checked)}
                              className="rounded border-gray-300"
                            />
                            <span className="text-xs text-gray-600">Internal comment</span>
                          </label>
                          
                          <div className="flex space-x-2">
                            <AdminButton
                              variant="outline"
                              size="xs"
                              onClick={() => {
                                setActiveCommentStage(null);
                                setCommentText('');
                                setIsInternalComment(false);
                              }}
                            >
                              Cancel
                            </AdminButton>
                            <AdminButton
                              variant="primary"
                              size="xs"
                              onClick={() => handleAddComment(stage.id)}
                              icon={Send}
                              disabled={!commentText.trim()}
                            >
                              Add Comment
                            </AdminButton>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Connection Line */}
                {index < stages.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-8 bg-gray-200"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Actions */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Available Actions</h4>
        
        <div className="flex space-x-3">
          {getAvailableActions(currentState).map(action => (
            <AdminButton
              key={action.label}
              variant={action.variant as any}
              onClick={() => handleAction(action.label, action.newState)}
            >
              {action.label}
            </AdminButton>
          ))}
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Action: {showActionModal.action}
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              This will change the workflow state to "{showActionModal.newState}". 
              You can add an optional comment explaining this action.
            </p>
            
            <AdminFormField
              label="Comment (Optional)"
              type="textarea"
              value={actionComment}
              onChange={(e) => setActionComment(e.target.value)}
              placeholder="Add a comment about this action..."
              rows={3}
            />
            
            <div className="flex space-x-3 mt-6">
              <AdminButton
                variant="outline"
                onClick={() => {
                  setShowActionModal(null);
                  setActionComment('');
                }}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={confirmAction}
              >
                Confirm {showActionModal.action}
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};