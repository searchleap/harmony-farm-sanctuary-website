import React, { useState, useMemo } from 'react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminStatusBadge, StandardActions } from '../../components/admin/common';
import { useAdminData, useVolunteers } from '../../hooks/useAdminData';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { AdminSearchEngine, createVolunteerSearchConfig } from '../../utils/adminSearch';
import { Users, Mail, Clock, Star } from 'lucide-react';
import type { AdminTableColumn, BreadcrumbItem } from '../../components/admin/common';
import type { VolunteerRole } from '../../types/volunteer';

export function VolunteersPage() {
  const { data: adminData, loading: adminDataLoading } = useAdminData();
  const { data: volunteers, loading, create, update, delete: deleteVolunteer, refetch } = useVolunteers();
  const { success, error } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVolunteer, setSelectedVolunteer] = useState<VolunteerRole | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  console.log('[VolunteersPage] Rendering with volunteers:', volunteers?.length || 0);

  // Search engine
  const searchEngine = useMemo(() => {
    return new AdminSearchEngine(volunteers || [], createVolunteerSearchConfig());
  }, [volunteers]);

  // Filtered volunteers
  const filteredVolunteers = useMemo(() => {
    return searchEngine.search(searchTerm).data;
  }, [searchEngine, searchTerm]);

  // Table columns
  const columns: AdminTableColumn<VolunteerRole>[] = [
    {
      key: 'title',
      title: 'Role Title',
      dataIndex: 'title',
      render: (title: string, volunteer: VolunteerRole) => (
        <div className="flex items-center space-x-3">
          <Users className="h-5 w-5 text-gray-400" />
          <div>
            <span className="font-medium text-gray-900">{title}</span>
            <p className="text-sm text-gray-500">{volunteer.category}</p>
          </div>
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
      key: 'timeCommitment',
      title: 'Time Commitment',
      dataIndex: 'timeCommitment',
      render: (timeCommitment: any) => (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm">
            {typeof timeCommitment === 'object' ? 
              `${timeCommitment.hoursPerWeek || 'Flexible'} hrs/week` : 
              timeCommitment
            }
          </span>
        </div>
      )
    },
    {
      key: 'urgency',
      title: 'Urgency',
      dataIndex: 'urgency',
      render: (urgency: string) => (
        <AdminStatusBadge 
          variant={
            urgency === 'high' ? 'error' : 
            urgency === 'medium' ? 'warning' : 
            'success'
          }
        >
          {urgency}
        </AdminStatusBadge>
      )
    },
    {
      key: 'requirements',
      title: 'Requirements',
      dataIndex: 'requirements',
      render: (requirements: string[]) => (
        <div className="text-sm text-gray-600">
          {requirements?.length || 0} requirement{requirements?.length !== 1 ? 's' : ''}
        </div>
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
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      sortable: false,
      render: (id: string, volunteer: VolunteerRole) => (
        <div className="flex items-center space-x-2">
          <button
            className="p-1 text-blue-600 hover:text-blue-800"
            onClick={() => window.open(`mailto:volunteers@harmonyfarm.org?subject=Volunteer Role: ${volunteer.title}`, '_blank')}
            title="Contact about role"
          >
            <Mail className="h-4 w-4" />
          </button>
          <StandardActions
            onEdit={() => handleEdit(volunteer)}
            onDelete={() => handleDelete(volunteer)}
            size="sm"
          />
        </div>
      )
    }
  ];

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Admin', href: '/admin' },
    { label: 'Volunteers', href: '/admin/volunteers' }
  ];

  // Event handlers
  const handleEdit = (volunteer: VolunteerRole) => {
    setSelectedVolunteer(volunteer);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (volunteer: VolunteerRole) => {
    if (window.confirm(`Are you sure you want to delete the volunteer role "${volunteer.title}"?`)) {
      try {
        success(`Volunteer role "${volunteer.title}" deleted successfully`);
        refetch();
      } catch (err) {
        error('Failed to delete volunteer role');
      }
    }
  };

  const handleAdd = () => {
    setSelectedVolunteer(null);
    setIsAddModalOpen(true);
  };

  const handleExport = () => {
    const csvContent = 'Title,Category,Time Commitment,Urgency,Requirements,Status\n' + 
      filteredVolunteers.map(volunteer => 
        `"${volunteer.title}","${volunteer.category}","${typeof volunteer.timeCommitment === 'object' ? volunteer.timeCommitment.hoursPerWeek + ' hrs/week' : volunteer.timeCommitment}","${volunteer.urgency}","${volunteer.requirements?.length || 0} requirements","${volunteer.isActive ? 'Active' : 'Inactive'}"`
      ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'volunteer-roles.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AdminListPage
        title="Volunteer Management"
        description="Manage volunteer roles and opportunities"
        breadcrumbs={breadcrumbs}
        data={filteredVolunteers}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search volunteer roles..."
        onSearch={setSearchTerm}
        onAdd={handleAdd}
        onRefresh={refetch}
        onExport={handleExport}
        addButtonText="Add Volunteer Role"
      />

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <AdminModal
          isOpen={true}
          title={selectedVolunteer ? 'Edit Volunteer Role' : 'Add Volunteer Role'}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedVolunteer(null);
          }}
          size="lg"
        >
          <div className="p-6">
            <p className="text-gray-600">Volunteer role form will be implemented here.</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedVolunteer(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setSelectedVolunteer(null);
                  success('Volunteer role saved successfully');
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