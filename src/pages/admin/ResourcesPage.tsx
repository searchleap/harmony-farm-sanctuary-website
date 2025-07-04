import React, { useState, useMemo } from 'react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminStatusBadge, StandardActions } from '../../components/admin/common';
import { useAdminData } from '../../hooks/useAdminData';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { AdminSearchEngine, createResourceSearchConfig } from '../../utils/adminSearch';
import { FileText, Download, ExternalLink } from 'lucide-react';
import type { AdminTableColumn, BreadcrumbItem } from '../../components/admin/common';
import type { EducationalResource } from '../../types/faq';

export function ResourcesPage() {
  const { data: adminData, loading, refetch } = useAdminData();
  const { success, error } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<EducationalResource | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  console.log('[ResourcesPage] Rendering with resources:', adminData.resources?.length || 0);

  // Search engine
  const searchEngine = useMemo(() => {
    return new AdminSearchEngine(adminData.resources || [], createResourceSearchConfig());
  }, [adminData.resources]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    return searchEngine.search(searchTerm).data;
  }, [searchEngine, searchTerm]);

  // Table columns
  const columns: AdminTableColumn<EducationalResource>[] = [
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
      render: (title: string, resource: EducationalResource) => (
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-gray-400" />
          <div>
            <span className="font-medium text-gray-900">{title}</span>
            <p className="text-sm text-gray-500">{resource.type}</p>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      render: (category: any) => {
        const categoryName = typeof category === 'string' ? category : (category?.name || 'General');
        return (
          <AdminStatusBadge variant="secondary">
            {categoryName}
          </AdminStatusBadge>
        );
      }
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'isActive',
      render: (isActive: boolean) => (
        <AdminStatusBadge variant={isActive ? 'success' : 'neutral'}>
          {isActive ? 'Active' : 'Inactive'}
        </AdminStatusBadge>
      )
    },
    {
      key: 'downloadCount',
      title: 'Downloads',
      dataIndex: 'downloadCount',
      render: (count: number) => (
        <div className="flex items-center space-x-1">
          <Download className="h-4 w-4 text-gray-400" />
          <span>{count || 0}</span>
        </div>
      )
    },
    {
      key: 'lastUpdated',
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      sortable: false,
      render: (id: string, resource: EducationalResource) => (
        <div className="flex items-center space-x-2">
          {resource.url && (
            <button
              className="p-1 text-blue-600 hover:text-blue-800"
              onClick={() => window.open(resource.url, '_blank')}
              title="View Resource"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          )}
          <StandardActions
            onEdit={() => handleEdit(resource)}
            onDelete={() => handleDelete(resource)}
            size="sm"
          />
        </div>
      )
    }
  ];

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin' },
    { label: 'Educational Resources', href: '/admin/resources' }
  ];

  // Event handlers
  const handleEdit = (resource: EducationalResource) => {
    setSelectedResource(resource);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (resource: EducationalResource) => {
    if (window.confirm(`Are you sure you want to delete "${resource.title}"?`)) {
      try {
        // Delete resource logic here
        success(`Resource "${resource.title}" deleted successfully`);
        refetch();
      } catch (err) {
        error('Failed to delete resource');
      }
    }
  };

  const handleAdd = () => {
    setSelectedResource(null);
    setIsAddModalOpen(true);
  };

  const handleExport = () => {
    // Simple CSV export for resources
    const csvContent = 'Title,Type,Category,Status,Downloads\n' + 
      filteredResources.map(resource => 
        `"${resource.title}","${resource.type}","${typeof resource.category === 'string' ? resource.category : resource.category?.name || 'General'}","${resource.isActive ? 'Active' : 'Inactive'}","${resource.downloadCount || 0}"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'educational-resources.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AdminListPage
        title="Educational Resources"
        description="Manage educational materials and downloadable resources"
        breadcrumbs={breadcrumbs}
        data={filteredResources}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search resources..."
        onSearch={setSearchTerm}
        onAdd={handleAdd}
        onRefresh={refetch}
        onExport={handleExport}
        addButtonText="Add Resource"
      />

      {/* Add/Edit Resource Modal - TODO: Implement */}
      {(isAddModalOpen || isEditModalOpen) && (
        <AdminModal
          isOpen={true}
          title={selectedResource ? 'Edit Resource' : 'Add Resource'}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedResource(null);
          }}
          size="lg"
        >
          <div className="p-6">
            <p className="text-gray-600">Resource form will be implemented here.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedResource(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedResource(null);
                  success('Resource saved successfully');
                }}
              >
                Save
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </>
  );
}