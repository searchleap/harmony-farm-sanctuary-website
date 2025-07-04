import React, { useState, useMemo } from 'react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminForm, AdminStatusBadge, StandardActions } from '../../components/admin/common';
import { useAdminData } from '../../hooks/useAdminData';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { AdminSearchEngine, createAnimalSearchConfig } from '../../utils/adminSearch';
import { exportAnimals } from '../../utils/adminExport';
import type { AdminTableColumn, AdminFormField, BreadcrumbItem } from '../../components/admin/common';
import type { Animal } from '../../types/admin';

export function AnimalsPage() {
  const { data: animalsData, loading, refetch } = useAdminData();
  const { success, error } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  console.log('[AnimalsPage] Rendering with animals:', animalsData.animals?.length || 0);

  // Search engine
  const searchEngine = useMemo(() => {
    return new AdminSearchEngine(animalsData.animals || [], createAnimalSearchConfig());
  }, [animalsData.animals]);

  // Filtered animals
  const filteredAnimals = useMemo(() => {
    return searchEngine.search(searchTerm).data;
  }, [searchEngine, searchTerm]);

  // Table columns
  const columns: AdminTableColumn<Animal>[] = [
    {
      key: 'photo',
      title: 'Photo',
      dataIndex: 'imageUrl',
      sortable: false,
      render: (imageUrl: string, animal: Animal) => (
        imageUrl ? (
          <img 
            src={imageUrl} 
            alt={animal.name}
            className="h-12 w-12 object-cover rounded-lg"
          />
        ) : (
          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-xs">No photo</span>
          </div>
        )
      )
    },
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      render: (name: string) => (
        <span className="font-medium text-gray-900">{name}</span>
      )
    },
    {
      key: 'species',
      title: 'Species',
      dataIndex: 'species'
    },
    {
      key: 'breed',
      title: 'Breed',
      dataIndex: 'breed'
    },
    {
      key: 'age',
      title: 'Age',
      dataIndex: 'age',
      render: (age: number) => age ? `${age} years` : 'Unknown'
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <AdminStatusBadge 
          variant={status === 'adopted' ? 'success' : status === 'available' ? 'info' : 'neutral'}
        >
          {status}
        </AdminStatusBadge>
      )
    },
    {
      key: 'isSponsored',
      title: 'Sponsored',
      dataIndex: 'isSponsored',
      render: (isSponsored: boolean) => (
        <AdminStatusBadge variant={isSponsored ? 'primary' : 'neutral'}>
          {isSponsored ? 'Yes' : 'No'}
        </AdminStatusBadge>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      sortable: false,
      render: (id: string, animal: Animal) => (
        <StandardActions
          onEdit={() => handleEdit(animal)}
          onDelete={() => handleDelete(animal)}
          size="sm"
        />
      )
    }
  ];

  // Form fields
  const formFields: AdminFormField[] = [
    {
      name: 'name',
      label: 'Animal Name',
      type: 'text',
      required: true,
      placeholder: 'Enter animal name'
    },
    {
      name: 'species',
      label: 'Species',
      type: 'select',
      required: true,
      options: [
        { value: 'dog', label: 'Dog' },
        { value: 'cat', label: 'Cat' },
        { value: 'horse', label: 'Horse' },
        { value: 'cow', label: 'Cow' },
        { value: 'pig', label: 'Pig' },
        { value: 'sheep', label: 'Sheep' },
        { value: 'goat', label: 'Goat' },
        { value: 'chicken', label: 'Chicken' },
        { value: 'duck', label: 'Duck' },
        { value: 'rabbit', label: 'Rabbit' },
        { value: 'other', label: 'Other' }
      ]
    },
    {
      name: 'breed',
      label: 'Breed',
      type: 'text',
      placeholder: 'Enter breed (optional)'
    },
    {
      name: 'age',
      label: 'Age (years)',
      type: 'number',
      validation: {
        min: 0,
        max: 50
      }
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'available', label: 'Available for Adoption' },
        { value: 'adopted', label: 'Adopted' },
        { value: 'sponsored', label: 'Sponsored' },
        { value: 'medical_care', label: 'Medical Care' },
        { value: 'quarantine', label: 'Quarantine' },
        { value: 'permanent_resident', label: 'Permanent Resident' }
      ]
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      rows: 4,
      placeholder: 'Tell us about this animal...'
    },
    {
      name: 'isSponsored',
      label: 'Currently Sponsored',
      type: 'checkbox'
    },
    {
      name: 'imageUrl',
      label: 'Photo URL',
      type: 'text',
      placeholder: 'https://example.com/animal-photo.jpg',
      description: 'URL to animal photo (optional)'
    }
  ];

  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Animals', isActive: true }
  ];

  // Handlers
  const handleAdd = () => {
    setSelectedAnimal(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (animal: Animal) => {
    setSelectedAnimal(animal);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (animal: Animal) => {
    if (window.confirm(`Are you sure you want to delete ${animal.name}?`)) {
      try {
        // TODO: Implement delete in data manager
        success(`${animal.name} has been deleted`);
        refetch();
      } catch (err) {
        error('Failed to delete animal');
      }
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      if (selectedAnimal) {
        // TODO: Implement update in data manager
        success(`${values.name} has been updated`);
      } else {
        // TODO: Implement create in data manager
        success(`${values.name} has been added`);
      }
      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      error('Failed to save animal');
    }
  };

  const handleExport = () => {
    exportAnimals(filteredAnimals, { format: 'csv' });
    success('Animals data exported successfully');
  };

  const handleRefresh = async () => {
    await refetch();
    success('Animals data refreshed');
  };

  return (
    <>
      <AdminListPage
        title="Animals Management"
        description="Manage animal profiles, adoption status, and sponsorship information"
        breadcrumbs={breadcrumbs}
        data={filteredAnimals}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search animals by name, species, breed..."
        onSearch={setSearchTerm}
        onAdd={handleAdd}
        onRefresh={handleRefresh}
        onExport={handleExport}
        addButtonText="Add Animal"
      />

      {/* Add Animal Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Animal"
        size="lg"
      >
        <AdminForm
          fields={formFields}
          onSubmit={handleSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          submitText="Add Animal"
        />
      </AdminModal>

      {/* Edit Animal Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${selectedAnimal?.name || 'Animal'}`}
        size="lg"
      >
        <AdminForm
          fields={formFields}
          initialValues={selectedAnimal || {}}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          submitText="Save Changes"
        />
      </AdminModal>
    </>
  );
}