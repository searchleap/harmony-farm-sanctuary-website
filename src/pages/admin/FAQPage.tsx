import React, { useState, useMemo } from 'react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminForm, AdminStatusBadge, StandardActions } from '../../components/admin/common';
import { useAdminData } from '../../hooks/useAdminData';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { AdminSearchEngine, createFAQSearchConfig } from '../../utils/adminSearch';
import type { AdminTableColumn, AdminFormField, BreadcrumbItem } from '../../components/admin/common';
import type { FAQ } from '../../types/admin';

export function FAQPage() {
  const { data: adminData, loading, refetch } = useAdminData();
  const { success, error } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  console.log('[FAQPage] Rendering with FAQs:', adminData.faqs?.length || 0);

  // Search engine
  const searchEngine = useMemo(() => {
    return new AdminSearchEngine(adminData.faqs || [], createFAQSearchConfig());
  }, [adminData.faqs]);

  // Filtered FAQs
  const filteredFAQs = useMemo(() => {
    return searchEngine.search(searchTerm).data;
  }, [searchEngine, searchTerm]);

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

  const handleDelete = async (faq: FAQ) => {
    if (window.confirm(`Are you sure you want to delete this FAQ?\n\n"${faq.question}"`)) {
      try {
        // TODO: Implement delete in data manager
        success('FAQ has been deleted');
        refetch();
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
    <>
      <AdminListPage
        title="FAQ Management"
        description="Manage frequently asked questions and their categories"
        breadcrumbs={breadcrumbs}
        data={filteredFAQs}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search FAQs by question, answer, category..."
        onSearch={setSearchTerm}
        onAdd={handleAdd}
        onRefresh={handleRefresh}
        onExport={handleExport}
        addButtonText="Add FAQ"
        filters={categoryFilter}
      />

      {/* Add FAQ Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New FAQ"
        size="lg"
      >
        <AdminForm
          fields={formFields}
          initialValues={getInitialValues(null)}
          onSubmit={handleSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          submitText="Add FAQ"
        />
      </AdminModal>

      {/* Edit FAQ Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit FAQ"
        size="lg"
      >
        <AdminForm
          fields={formFields}
          initialValues={getInitialValues(selectedFAQ)}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          submitText="Save Changes"
        />
      </AdminModal>
    </>
  );
}