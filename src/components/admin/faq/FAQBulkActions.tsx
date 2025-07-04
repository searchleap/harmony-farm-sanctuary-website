import React, { useState } from 'react';
import { 
  Download, 
  Upload, 
  Tag, 
  FolderOpen, 
  Eye, 
  Trash2, 
  CheckSquare, 
  Square,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { FAQ, FAQCategory, FAQTag, FAQBulkOperation } from '../../../types/faq';
import { AdminButton, AdminModal } from '../common';

interface FAQBulkActionsProps {
  faqs: FAQ[];
  categories: FAQCategory[];
  tags: FAQTag[];
  selectedFAQs: string[];
  onSelectionChange: (faqIds: string[]) => void;
  onBulkOperation: (operation: FAQBulkOperation) => void;
}

type BulkActionType = 'categorize' | 'tag' | 'status_change' | 'delete' | 'export';

interface BulkActionConfig {
  type: BulkActionType;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  requiresConfirmation: boolean;
  requiresData: boolean;
}

const bulkActions: BulkActionConfig[] = [
  {
    type: 'categorize',
    label: 'Change Category',
    icon: FolderOpen,
    color: 'blue',
    requiresConfirmation: true,
    requiresData: true
  },
  {
    type: 'tag',
    label: 'Add/Remove Tags',
    icon: Tag,
    color: 'green',
    requiresConfirmation: false,
    requiresData: true
  },
  {
    type: 'status_change',
    label: 'Change Status',
    icon: Eye,
    color: 'yellow',
    requiresConfirmation: true,
    requiresData: true
  },
  {
    type: 'export',
    label: 'Export Selected',
    icon: Download,
    color: 'purple',
    requiresConfirmation: false,
    requiresData: false
  },
  {
    type: 'delete',
    label: 'Delete Selected',
    icon: Trash2,
    color: 'red',
    requiresConfirmation: true,
    requiresData: false
  }
];

export const FAQBulkActions: React.FC<FAQBulkActionsProps> = ({
  faqs,
  categories,
  tags,
  selectedFAQs,
  onSelectionChange,
  onBulkOperation
}) => {
  const [showModal, setShowModal] = useState(false);
  const [currentAction, setCurrentAction] = useState<BulkActionType | null>(null);
  const [actionData, setActionData] = useState<Record<string, any>>({});
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);

  const selectedFAQObjects = faqs.filter(faq => selectedFAQs.includes(faq.id));
  const allSelected = faqs.length > 0 && selectedFAQs.length === faqs.length;
  const someSelected = selectedFAQs.length > 0 && selectedFAQs.length < faqs.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(faqs.map(faq => faq.id));
    }
  };

  const handleActionClick = (action: BulkActionType) => {
    if (selectedFAQs.length === 0) return;

    setCurrentAction(action);
    setActionData({});

    if (action === 'export') {
      handleExport();
      return;
    }

    if (action === 'delete') {
      setShowModal(true);
      return;
    }

    setShowModal(true);
  };

  const handleExport = () => {
    const exportData = selectedFAQObjects.map(faq => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category.name,
      tags: faq.tags.map(tag => tag.name).join(', '),
      difficulty: faq.difficulty,
      status: faq.status,
      priority: faq.priority,
      author: faq.author,
      helpful: faq.helpful,
      notHelpful: faq.notHelpful,
      views: faq.views,
      lastUpdated: faq.lastUpdated
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => 
        Object.values(row).map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value
        ).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faq-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = () => {
    if (!currentAction) return;

    const operation: FAQBulkOperation = {
      type: currentAction,
      faqIds: selectedFAQs,
      data: actionData,
      createdBy: 'Current User',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    onBulkOperation(operation);
    setShowModal(false);
    setCurrentAction(null);
    onSelectionChange([]);
  };

  const handleImport = async () => {
    if (!importFile) return;

    // In a real implementation, this would parse the CSV file
    // and create FAQ entries
    console.log('Importing file:', importFile.name);
    
    // Mock import operation
    console.log('Importing file:', importFile.name);

    setShowImportModal(false);
    setImportFile(null);
  };

  const renderActionForm = () => {
    if (!currentAction) return null;

    switch (currentAction) {
      case 'categorize':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                New Category
              </label>
              <select
                value={actionData.categoryId || ''}
                onChange={(e) => setActionData({ ...actionData, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.path}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                This will change the category for {selectedFAQs.length} selected FAQ{selectedFAQs.length > 1 ? 's' : ''}.
              </p>
            </div>
          </div>
        );

      case 'tag':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tag Action
              </label>
              <select
                value={actionData.action || 'add'}
                onChange={(e) => setActionData({ ...actionData, action: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="add">Add Tags</option>
                <option value="remove">Remove Tags</option>
                <option value="replace">Replace All Tags</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Tags
              </label>
              <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                {tags.map(tag => (
                  <label key={tag.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={(actionData.tagIds || []).includes(tag.id)}
                      onChange={(e) => {
                        const tagIds = actionData.tagIds || [];
                        const newTagIds = e.target.checked
                          ? [...tagIds, tag.id]
                          : tagIds.filter((id: string) => id !== tag.id);
                        setActionData({ ...actionData, tagIds: newTagIds });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-700">{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'status_change':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                New Status
              </label>
              <select
                value={actionData.status || ''}
                onChange={(e) => setActionData({ ...actionData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a status</option>
                <option value="draft">Draft</option>
                <option value="pending_review">Pending Review</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-sm text-yellow-800">
                This will change the status for {selectedFAQs.length} selected FAQ{selectedFAQs.length > 1 ? 's' : ''}.
                Published FAQs will be visible to users immediately.
              </p>
            </div>
          </div>
        );

      case 'delete':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800">Confirm Deletion</h4>
                  <p className="text-sm text-red-700 mt-1">
                    You are about to delete {selectedFAQs.length} FAQ{selectedFAQs.length > 1 ? 's' : ''}. 
                    This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">FAQs to be deleted:</h5>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {selectedFAQObjects.map(faq => (
                  <div key={faq.id} className="text-sm text-gray-700 truncate">
                    • {faq.question}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getActionButtonColor = (action: BulkActionConfig) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      yellow: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white',
      red: 'bg-red-600 hover:bg-red-700 text-white'
    };
    return colors[action.color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-4">
      {/* Selection Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={handleSelectAll}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {allSelected ? (
              <CheckSquare className="w-4 h-4 text-blue-600" />
            ) : someSelected ? (
              <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-sm" />
              </div>
            ) : (
              <Square className="w-4 h-4" />
            )}
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
          
          {selectedFAQs.length > 0 && (
            <span className="text-sm text-gray-600">
              {selectedFAQs.length} of {faqs.length} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <AdminButton
            variant="outline"
            icon={Upload}
            onClick={() => setShowImportModal(true)}
          >
            Import FAQs
          </AdminButton>
          
          {selectedFAQs.length > 0 && (
            <div className="flex items-center gap-2">
              {bulkActions.map(action => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.type}
                    onClick={() => handleActionClick(action.type)}
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${getActionButtonColor(action)}`}
                    disabled={selectedFAQs.length === 0}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Items Preview */}
      {selectedFAQs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-3">
            Selected FAQs ({selectedFAQs.length})
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {selectedFAQObjects.slice(0, 5).map(faq => (
              <div key={faq.id} className="text-sm text-blue-800 truncate">
                • {faq.question}
              </div>
            ))}
            {selectedFAQObjects.length > 5 && (
              <div className="text-sm text-blue-700 italic">
                ... and {selectedFAQObjects.length - 5} more
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bulk Action Modal */}
      {showModal && currentAction && (
        <AdminModal
          isOpen={showModal}
          title={`${bulkActions.find(a => a.type === currentAction)?.label} - ${selectedFAQs.length} FAQ${selectedFAQs.length > 1 ? 's' : ''}`}
          onClose={() => setShowModal(false)}
          size="lg"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            {renderActionForm()}
            
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <AdminButton 
                type="button" 
                variant="outline" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </AdminButton>
              <AdminButton 
                type="submit" 
                variant={currentAction === 'delete' ? 'danger' : 'primary'}
              >
                {currentAction === 'delete' ? 'Delete FAQs' : 'Apply Changes'}
              </AdminButton>
            </div>
          </form>
        </AdminModal>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <AdminModal
          isOpen={showImportModal}
          title="Import FAQs"
          onClose={() => setShowImportModal(false)}
          size="lg"
        >
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Import Instructions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload a CSV file with FAQ data</li>
                <li>• Required columns: question, answer, category, difficulty</li>
                <li>• Optional columns: tags, priority, status, author</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {importFile && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">{importFile.name}</span>
                    <span className="text-xs text-green-600">
                      ({(importFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <AdminButton 
                type="button" 
                variant="outline" 
                onClick={() => setShowImportModal(false)}
              >
                Cancel
              </AdminButton>
              <AdminButton 
                type="button" 
                variant="primary"
                onClick={handleImport}
                disabled={!importFile}
              >
                Import FAQs
              </AdminButton>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};