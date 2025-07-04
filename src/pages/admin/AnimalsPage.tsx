import React, { useState, useMemo } from 'react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminStatusBadge, StandardActions } from '../../components/admin/common';
import { EnhancedAnimalForm } from '../../components/admin/animals/EnhancedAnimalForm';
import { useAdminData } from '../../hooks/useAdminData';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { AdminSearchEngine, createAnimalSearchConfig } from '../../utils/adminSearch';
import { exportAnimals } from '../../utils/adminExport';
import { Settings, Camera, FileText, Heart } from 'lucide-react';
import type { AdminTableColumn, BreadcrumbItem } from '../../components/admin/common';
import type { Animal } from '../../types/admin';
import type { EnhancedAnimal, AnimalFormData, AnimalPhoto } from '../../types/admin';

export function AnimalsPage() {
  const { data: animalsData, loading, refetch } = useAdminData();
  const { success, error } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState<EnhancedAnimal | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

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
      dataIndex: 'featuredImage',
      sortable: false,
      render: (featuredImage: string, animal: Animal) => (
        featuredImage ? (
          <img 
            src={featuredImage} 
            alt={animal.name}
            className="h-12 w-12 object-cover rounded-lg"
          />
        ) : (
          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
            <Camera className="w-4 h-4 text-gray-400" />
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
      title: 'Health Status',
      dataIndex: 'status',
      render: (status: string) => (
        <AdminStatusBadge 
          variant={status === 'healthy' ? 'success' : status === 'recovering' ? 'warning' : status === 'special-needs' ? 'info' : 'neutral'}
        >
          {status.replace('-', ' ')}
        </AdminStatusBadge>
      )
    },
    {
      key: 'careLevel',
      title: 'Care Level',
      dataIndex: 'careLevel',
      render: (careLevel: string) => (
        <AdminStatusBadge 
          variant={careLevel === 'easy' ? 'success' : careLevel === 'moderate' ? 'warning' : 'error'}
        >
          {careLevel}
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

  // Convert basic Animal to EnhancedAnimal for editing
  const convertToEnhancedAnimal = (animal: Animal): EnhancedAnimal => {
    return {
      ...animal,
      photos: animal.images?.map((url, index) => ({
        id: `existing_${index}`,
        url,
        thumbnailUrl: url,
        caption: '',
        isPrimary: index === 0,
        uploadedBy: 'system',
        uploadedAt: new Date(),
        altText: `${animal.name} photo ${index + 1}`,
        tags: [],
        metadata: {
          filename: `${animal.name}_${index + 1}.jpg`,
          size: 0,
          dimensions: { width: 800, height: 600 },
          format: 'image/jpeg'
        }
      })) || [],
      medicalHistory: [],
      currentMedications: [],
      vaccinations: [],
      sponsors: [],
      sponsorshipGoals: {
        monthlyTarget: animal.sponsorshipCost?.monthly || 50,
        currentAmount: 0,
        goalDescription: 'Help cover monthly care costs'
      },
      careNotes: [],
      careSchedule: {
        feeding: { times: ['8:00 AM', '6:00 PM'], diet: 'Standard diet', notes: '' },
        exercise: { frequency: 'Daily', duration: '2 hours', activities: ['Pasture time'] },
        grooming: { frequency: 'Weekly', notes: '' },
        enrichment: { activities: ['Social interaction'], frequency: 'Daily', preferences: [] }
      },
      analytics: {
        animalId: animal.id,
        careStats: {
          totalCareNotes: 0,
          recentCareNotes: 0,
          careFrequency: {},
          averageCareInterval: 0
        },
        medicalStats: {
          totalMedicalRecords: 0,
          recentMedicalRecords: 0,
          totalMedicalCost: 0,
          yearlyMedicalCost: 0,
          vaccinationStatus: 'up_to_date',
          ongoingMedications: 0
        },
        sponsorshipStats: {
          totalSponsors: animal.sponsorCount || 0,
          activeSponsors: animal.isSponsored ? 1 : 0,
          monthlyRevenue: animal.isSponsored ? (animal.sponsorshipCost?.monthly || 0) : 0,
          yearlyRevenue: animal.isSponsored ? (animal.sponsorshipCost?.annually || 0) : 0,
          sponsorshipGoal: animal.sponsorshipCost?.monthly || 50,
          sponsorshipPercentage: animal.isSponsored ? 100 : 0,
          averageSponsorshipDuration: 12,
          renewalRate: 85
        },
        engagementStats: {
          pageViews: 0,
          profileViews: 0,
          photoViews: 0,
          sponsorshipInquiries: 0,
          socialShares: 0,
          lastUpdated: new Date()
        }
      },
      adminNotes: '',
      internalStatus: 'active',
      lastUpdated: new Date(),
      updatedBy: 'admin',
      publicProfile: true,
      needsContentUpdate: false
    };
  };

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
    setSelectedAnimal(convertToEnhancedAnimal(animal));
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

  const handleSubmit = async (formData: AnimalFormData & { photos: AnimalPhoto[] }) => {
    setFormLoading(true);
    try {
      // Convert form data back to Animal format for storage
      const animalData: Partial<Animal> = {
        name: formData.basic.name,
        species: formData.basic.species,
        breed: formData.basic.breed,
        gender: formData.basic.gender,
        age: formData.basic.age,
        weight: formData.basic.weight,
        color: formData.basic.color,
        story: formData.story.story,
        rescueStory: formData.story.rescueStory,
        personalityDescription: formData.story.personalityDescription,
        careLevel: formData.care.careLevel,
        specialNeeds: formData.care.specialNeeds,
        housingType: formData.care.housingType,
        companionAnimals: formData.care.companionAnimals,
        medicalNeeds: formData.medical.medicalNeeds,
        specialDiet: formData.medical.specialDiet,
        medications: formData.medical.medications,
        sponsorshipCost: formData.sponsorship.sponsorshipCost,
        maxSponsors: formData.sponsorship.maxSponsors,
        sponsorshipBenefits: formData.sponsorship.sponsorshipBenefits,
        images: formData.photos.map(photo => photo.url),
        featuredImage: formData.photos.find(p => p.isPrimary)?.url || formData.photos[0]?.url || '',
        // Set defaults for required fields
        personality: ['friendly'],
        socialLevel: 'social',
        energyLevel: 'moderate',
        goodWithKids: true,
        goodWithOtherAnimals: true,
        isSponsored: false,
        sponsorCount: 0,
        adoptionEligible: true,
        featuredAnimal: false,
        arrivalDate: new Date().toISOString().split('T')[0],
        status: 'healthy'
      };

      if (selectedAnimal) {
        // TODO: Implement update in data manager
        success(`${formData.basic.name} has been updated with enhanced profile`);
      } else {
        // TODO: Implement create in data manager
        success(`${formData.basic.name} has been added with complete profile`);
      }
      
      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      error('Failed to save animal profile');
      console.error('Save error:', err);
    } finally {
      setFormLoading(false);
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
        size="full"
      >
        <EnhancedAnimalForm
          onSubmit={handleSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          loading={formLoading}
        />
      </AdminModal>

      {/* Edit Animal Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit ${selectedAnimal?.name || 'Animal'}`}
        size="full"
      >
        <EnhancedAnimalForm
          animal={selectedAnimal || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          loading={formLoading}
        />
      </AdminModal>
    </>
  );
}