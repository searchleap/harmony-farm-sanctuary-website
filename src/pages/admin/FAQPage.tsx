import React, { useState, useMemo } from 'react';
import { Settings, BarChart3, FolderTree, Plus, GitCommit, MessageSquare } from 'lucide-react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminForm, AdminStatusBadge, StandardActions, AdminButton } from '../../components/admin/common';
import { FAQCategoryManager } from '../../components/admin/faq/FAQCategoryManager';
import { EnhancedFAQForm } from '../../components/admin/faq/EnhancedFAQForm';
import { FAQAnalytics } from '../../components/admin/faq/FAQAnalytics';
import { FAQBulkActions } from '../../components/admin/faq/FAQBulkActions';
import { ContentVersionControl, ApprovalWorkflow, ChangeTracker, WorkflowDashboard } from '../../components/admin/workflow';
import { FeedbackCollection, RatingSystem, FeedbackAnalytics, FeedbackModeration } from '../../components/admin/feedback';
import { useAdminData } from '../../hooks/useAdminData';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { AdminSearchEngine, createFAQSearchConfig } from '../../utils/adminSearch';
import type { AdminTableColumn, AdminFormField, BreadcrumbItem } from '../../components/admin/common';
import type { FAQ, FAQCategory, FAQTag, FAQBulkOperation, FAQHelpfulness } from '../../types/faq';

export function FAQPage() {
  const { data: adminData, loading } = useAdminData();
  const { success, error } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeView, setActiveView] = useState('list');
  const [selectedFAQs, setSelectedFAQs] = useState<string[]>([]);

  console.log('[FAQPage] Rendering with FAQs:', adminData.faqs?.length || 0);

  // Enhanced FAQ mock data
  const faqCategories: FAQCategory[] = [
    {
      id: 'visiting',
      name: 'Visiting',
      description: 'Information about tours and visits',
      slug: 'visiting',
      icon: 'MapPin',
      color: '#3B82F6',
      questionCount: 12,
      priority: 1,
      depth: 0,
      path: 'Visiting',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 'visiting-tours',
      name: 'Tours',
      description: 'Guided tour information',
      slug: 'tours',
      icon: 'Users',
      color: '#3B82F6',
      questionCount: 8,
      priority: 1,
      parentId: 'visiting',
      depth: 1,
      path: 'Visiting > Tours',
      isActive: true,
      createdAt: '2024-01-15T10:05:00Z',
      updatedAt: '2024-01-15T10:05:00Z'
    },
    {
      id: 'animal-care',
      name: 'Animal Care',
      description: 'Information about animal welfare and care',
      slug: 'animal-care',
      icon: 'Heart',
      color: '#10B981',
      questionCount: 18,
      priority: 2,
      depth: 0,
      path: 'Animal Care',
      isActive: true,
      createdAt: '2024-01-15T10:10:00Z',
      updatedAt: '2024-01-15T10:10:00Z'
    },
    {
      id: 'volunteering',
      name: 'Volunteering',
      description: 'How to get involved and volunteer',
      slug: 'volunteering',
      icon: 'Users',
      color: '#F59E0B',
      questionCount: 15,
      priority: 3,
      depth: 0,
      path: 'Volunteering',
      isActive: true,
      createdAt: '2024-01-15T10:15:00Z',
      updatedAt: '2024-01-15T10:15:00Z'
    },
    {
      id: 'donations',
      name: 'Donations',
      description: 'Support and funding information',
      slug: 'donations',
      icon: 'Gift',
      color: '#8B5CF6',
      questionCount: 9,
      priority: 4,
      depth: 0,
      path: 'Donations',
      isActive: true,
      createdAt: '2024-01-15T10:20:00Z',
      updatedAt: '2024-01-15T10:20:00Z'
    }
  ];

  const faqTags: FAQTag[] = [
    { id: 'beginner', name: 'Beginner Friendly', slug: 'beginner', count: 25 },
    { id: 'scheduling', name: 'Scheduling', slug: 'scheduling', count: 12 },
    { id: 'requirements', name: 'Requirements', slug: 'requirements', count: 18 },
    { id: 'safety', name: 'Safety', slug: 'safety', count: 14 },
    { id: 'educational', name: 'Educational', slug: 'educational', count: 16 },
    { id: 'group-visits', name: 'Group Visits', slug: 'group-visits', count: 8 },
    { id: 'children', name: 'Children', slug: 'children', count: 11 },
    { id: 'medical', name: 'Medical', slug: 'medical', count: 9 },
    { id: 'feeding', name: 'Feeding', slug: 'feeding', count: 7 },
    { id: 'housing', name: 'Housing', slug: 'housing', count: 6 }
  ];

  const enhancedFAQs: FAQ[] = (adminData || []).map((faq: any, index: number) => ({
    ...faq,
    category: faqCategories[index % faqCategories.length],
    tags: [faqTags[index % faqTags.length], faqTags[(index + 1) % faqTags.length]],
    status: ['published', 'published', 'published', 'pending_review', 'draft'][index % 5] as any,
    version: 1,
    seoScore: 70 + Math.floor(Math.random() * 30),
    readabilityScore: 60 + Math.floor(Math.random() * 40),
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    publishedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
  }));

  const faqHelpfulness: FAQHelpfulness[] = enhancedFAQs.map(faq => ({
    faqId: faq.id,
    helpful: faq.helpful,
    notHelpful: faq.notHelpful,
    comments: [],
    improvementSuggestions: [
      'Add more visual content',
      'Break down into steps',
      'Include video explanation'
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    lastAnalyzed: new Date().toISOString()
  }));

  // Enhanced handlers
  const handleCategoryCreate = (category: Omit<FAQCategory, 'id'>) => {
    console.log('Creating category:', category);
    success('Category created successfully');
  };

  const handleCategoryUpdate = (id: string, category: Partial<FAQCategory>) => {
    console.log('Updating category:', id, category);
    success('Category updated successfully');
  };

  const handleCategoryDelete = (id: string) => {
    console.log('Deleting category:', id);
    success('Category deleted successfully');
  };

  const handleCategoryMove = (categoryId: string, newParentId?: string) => {
    console.log('Moving category:', categoryId, 'to parent:', newParentId);
    success('Category moved successfully');
  };

  const handleFAQSubmit = (faq: Omit<FAQ, 'id'>) => {
    console.log('FAQ submitted:', faq);
    success(selectedFAQ ? 'FAQ updated successfully' : 'FAQ created successfully');
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedFAQ(null);
  };

  const handleBulkOperation = (operation: FAQBulkOperation) => {
    console.log('Bulk operation:', operation);
    success(`Bulk operation "${operation.type}" completed successfully`);
    setSelectedFAQs([]);
  };

  // Search engine
  const searchEngine = useMemo(() => {
    return new AdminSearchEngine(enhancedFAQs || [], createFAQSearchConfig());
  }, [enhancedFAQs]);

  // Filtered FAQs
  const filteredFAQs = useMemo(() => {
    return searchEngine.search(searchTerm).data;
  }, [searchEngine, searchTerm]);

  // View navigation
  const views = [
    { id: 'list', label: 'FAQ List', icon: 'List' },
    { id: 'categories', label: 'Categories', icon: 'FolderTree' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'workflow', label: 'Workflow', icon: 'GitCommit' },
    { id: 'feedback', label: 'Feedback', icon: 'MessageSquare' }
  ];

  const renderViewContent = () => {
    switch (activeView) {
      case 'categories':
        return (
          <FAQCategoryManager
            categories={faqCategories}
            onCategoryCreate={handleCategoryCreate}
            onCategoryUpdate={handleCategoryUpdate}
            onCategoryDelete={handleCategoryDelete}
            onCategoryMove={handleCategoryMove}
          />
        );

      case 'analytics':
        return (
          <FAQAnalytics
            faqs={enhancedFAQs}
            categories={faqCategories}
            helpfulness={faqHelpfulness}
          />
        );

      case 'workflow':
        return (
          <div className="space-y-6">
            <WorkflowDashboard
              items={[]}
              currentUser="current_user"
              userRole="admin"
              onItemClick={(item) => console.log('View item:', item)}
              onBulkAction={(action, itemIds) => console.log('Bulk action:', action, itemIds)}
              onStateChange={(itemId, newState) => console.log('State change:', itemId, newState)}
            />
          </div>
        );

      case 'feedback':
        return (
          <div className="space-y-6">
            <FeedbackAnalytics
              feedback={[]} // Mock data would go here
              metrics={[]} // Mock metrics would go here
              suggestions={[]} // Mock suggestions would go here
              onExportData={() => console.log('Export feedback data')}
              onImplementSuggestion={(id) => console.log('Implement suggestion:', id)}
            />
            
            <div className="grid grid-cols-2 gap-6">
              <RatingSystem
                contentId="example-faq-1"
                contentType="faq"
                metrics={{
                  content_id: 'example-faq-1',
                  content_type: 'faq',
                  helpful_count: 45,
                  not_helpful_count: 8,
                  helpfulness_ratio: 84.9,
                  average_rating: 4.2,
                  rating_count: 38,
                  rating_distribution: { 1: 1, 2: 2, 3: 5, 4: 15, 5: 15 },
                  category_ratings: {
                    'clarity': { average: 4.1, count: 25 },
                    'accuracy': { average: 4.5, count: 22 },
                    'helpfulness': { average: 4.0, count: 30 }
                  },
                  total_feedback_count: 53,
                  comment_count: 12,
                  suggestion_count: 3,
                  quality_score: 85,
                  improvement_priority: 'low',
                  last_updated: new Date().toISOString()
                }}
                feedback={[]}
                onRatingSubmit={(rating, categories) => console.log('Rating submitted:', rating, categories)}
                onMetricsRefresh={() => console.log('Refresh metrics')}
                allowInteraction={true}
              />
              
              <FeedbackModeration
                feedback={[]}
                currentUser={{ id: 'admin1', name: 'Admin User', role: 'admin' }}
                onFeedbackUpdate={(id, updates) => console.log('Update feedback:', id, updates)}
                onFeedbackDelete={(id) => console.log('Delete feedback:', id)}
                onBulkAction={(action, ids) => console.log('Bulk action:', action, ids)}
                onResponseSubmit={(id, response) => console.log('Response:', id, response)}
              />
            </div>
          </div>
        );

      case 'list':
      default:
        return (
          <div className="space-y-6">
            <FAQBulkActions
              faqs={filteredFAQs}
              categories={faqCategories}
              tags={faqTags}
              selectedFAQs={selectedFAQs}
              onSelectionChange={setSelectedFAQs}
              onBulkOperation={handleBulkOperation}
            />
            
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">FAQ List</h3>
                <p className="text-sm text-gray-600">Manage your frequently asked questions</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div key={faq.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 line-clamp-2">{faq.question}</h4>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {faq.answer.length > 100 ? `${faq.answer.substring(0, 100)}...` : faq.answer}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                            faq.status === 'published' ? 'bg-green-100 text-green-800' :
                            faq.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                            faq.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {faq.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-gray-500">{faq.category.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(faq)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(faq)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  // Table columns
  const columns: AdminTableColumn<FAQ>[] = [
    {
      key: 'question',
      title: 'Question',
      dataIndex: 'question',
      render: (question: string) => (
        <div className="max-w-md">
          <span className="font-medium text-gray-900">{question}</span>
        </div>
      )
    },
    {
      key: 'answer',
      title: 'Answer',
      dataIndex: 'answer',
      render: (answer: string) => (
        <div className="max-w-lg">
          <span className="text-gray-600">
            {answer.length > 100 ? `${answer.substring(0, 100)}...` : answer}
          </span>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      render: (category: string) => (
        <AdminStatusBadge variant="secondary">
          {category}
        </AdminStatusBadge>
      )
    },
    {
      key: 'isActive',
      title: 'Status',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <AdminStatusBadge variant={isActive ? 'success' : 'neutral'}>
          {isActive ? 'Active' : 'Inactive'}
        </AdminStatusBadge>
      )
    },
    {
      key: 'order',
      title: 'Order',
      dataIndex: 'order',
      render: (order: number) => (
        <span className="text-sm text-gray-500">{order || 0}</span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      sortable: false,
      render: (id: string, faq: FAQ) => (
        <StandardActions
          onEdit={() => handleEdit(faq)}
          onDelete={() => handleDelete(faq)}
          size="sm"
        />
      )
    }
  ];

  // Form fields
  const formFields: AdminFormField[] = [
    {
      name: 'question',
      label: 'Question',
      type: 'textarea',
      rows: 2,
      required: true,
      placeholder: 'Enter the frequently asked question...'
    },
    {
      name: 'answer',
      label: 'Answer',
      type: 'textarea',
      rows: 6,
      required: true,
      placeholder: 'Provide a comprehensive answer...'
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      required: true,
      options: [
        { value: 'adoption', label: 'Adoption' },
        { value: 'volunteering', label: 'Volunteering' },
        { value: 'donations', label: 'Donations' },
        { value: 'visiting', label: 'Visiting' },
        { value: 'animal_care', label: 'Animal Care' },
        { value: 'sponsorship', label: 'Sponsorship' },
        { value: 'general', label: 'General' },
        { value: 'events', label: 'Events' },
        { value: 'education', label: 'Education' }
      ]
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'text',
      placeholder: 'animals, care, adoption (comma-separated)',
      description: 'Separate tags with commas for better organization'
    },
    {
      name: 'order',
      label: 'Display Order',
      type: 'number',
      placeholder: '0',
      description: 'Lower numbers appear first (0 = highest priority)',
      validation: {
        min: 0,
        max: 1000
      }
    },
    {
      name: 'isActive',
      label: 'Is Active',
      type: 'checkbox',
      description: 'Whether this FAQ should be displayed on the website'
    }
  ];

  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'FAQ Management', isActive: true }
  ];

  // Handlers
  const handleAdd = () => {
    setSelectedFAQ(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsEditModalOpen(true);
  };

  const handleView = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (faq: FAQ) => {
    if (window.confirm(`Are you sure you want to delete this FAQ?\n\n"${faq.question}"`)) {
      try {
        // TODO: Implement delete in data manager
        success('FAQ has been deleted');
      } catch (err) {
        error('Failed to delete FAQ');
      }
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      // Process tags
      if (values.tags && typeof values.tags === 'string') {
        values.tags = values.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      }

      // Ensure order is a number
      if (values.order) {
        values.order = parseInt(values.order, 10);
      }

      if (selectedFAQ) {
        // TODO: Implement update in data manager
        success('FAQ has been updated');
      } else {
        // TODO: Implement create in data manager
        success('FAQ has been created');
      }
      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      error('Failed to save FAQ');
    }
  };

  const handleExport = () => {
    // Simple CSV export for FAQs
    const csvContent = 'Question,Answer,Category,Status\n' + 
      filteredFAQs.map(faq => 
        `"${faq.question}","${faq.answer}","${faq.category}","${faq.isActive ? 'Active' : 'Inactive'}"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'faqs-export.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    success('FAQs data exported successfully');
  };

  const handleRefresh = async () => {
    await refetch();
    success('FAQs data refreshed');
  };

  // Prepare initial values for edit form
  const getInitialValues = (faq: FAQ | null) => {
    if (!faq) return { isActive: true, order: 0 };
    
    const values = { ...faq };
    // Convert tags array to comma-separated string for the form
    if (values.tags && Array.isArray(values.tags)) {
      values.tags = values.tags.join(', ');
    }
    return values;
  };

  // Filter options for better UX
  const categoryFilter = (
    <div className="flex items-center space-x-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
        <select 
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          onChange={(e) => {
            // TODO: Implement category filtering
          }}
        >
          <option value="">All Categories</option>
          <option value="adoption">Adoption</option>
          <option value="volunteering">Volunteering</option>
          <option value="donations">Donations</option>
          <option value="visiting">Visiting</option>
          <option value="animal_care">Animal Care</option>
          <option value="sponsorship">Sponsorship</option>
          <option value="general">General</option>
          <option value="events">Events</option>
          <option value="education">Education</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select 
          className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          onChange={(e) => {
            // TODO: Implement status filtering
          }}
        >
          <option value="">All FAQs</option>
          <option value="active">Active Only</option>
          <option value="inactive">Inactive Only</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header with View Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enhanced FAQ Management</h1>
          <p className="text-gray-600">Comprehensive FAQ management with analytics and categorization</p>
        </div>
        <div className="flex items-center gap-3">
          {activeView === 'list' && (
            <AdminButton
              variant="primary"
              icon={Plus}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add FAQ
            </AdminButton>
          )}
        </div>
      </div>

      {/* View Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === view.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {view.icon === 'List' && <Settings className="w-4 h-4" />}
              {view.icon === 'FolderTree' && <FolderTree className="w-4 h-4" />}
              {view.icon === 'BarChart3' && <BarChart3 className="w-4 h-4" />}
              {view.label}
            </button>
          ))}
        </nav>
      </div>

      {/* View Content */}
      {renderViewContent()}

      {/* Add FAQ Modal */}
      {isAddModalOpen && (
        <AdminModal
          isOpen={isAddModalOpen}
          title="Create New FAQ"
          onClose={() => setIsAddModalOpen(false)}
          size="xl"
        >
          <EnhancedFAQForm
            categories={faqCategories}
            tags={faqTags}
            onSubmit={handleFAQSubmit}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </AdminModal>
      )}

      {/* Edit FAQ Modal */}
      {isEditModalOpen && selectedFAQ && (
        <AdminModal
          isOpen={isEditModalOpen}
          title="Edit FAQ"
          onClose={() => setIsEditModalOpen(false)}
          size="xl"
        >
          <EnhancedFAQForm
            faq={selectedFAQ}
            categories={faqCategories}
            tags={faqTags}
            onSubmit={handleFAQSubmit}
            onCancel={() => setIsEditModalOpen(false)}
          />
        </AdminModal>
      )}
    </div>
  );
}