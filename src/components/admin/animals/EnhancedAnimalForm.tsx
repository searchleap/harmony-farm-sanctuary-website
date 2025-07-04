import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Camera, FileText, Heart, Stethoscope, Settings } from 'lucide-react';
import { AnimalPhotoGallery } from './AnimalPhotoGallery';
import { AnimalStoryEditor } from './AnimalStoryEditor';
import type { EnhancedAnimal, AnimalFormData, AnimalPhoto } from '../../../types/admin';

interface EnhancedAnimalFormProps {
  animal?: EnhancedAnimal;
  onSubmit: (formData: AnimalFormData & { photos: AnimalPhoto[] }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  readOnly?: boolean;
}

export function EnhancedAnimalForm({
  animal,
  onSubmit,
  onCancel,
  loading = false,
  readOnly = false
}: EnhancedAnimalFormProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'story' | 'photos' | 'care' | 'medical' | 'sponsorship' | 'admin'>('basic');
  const [formData, setFormData] = useState<AnimalFormData>({
    basic: {
      name: animal?.name || '',
      species: animal?.species || 'cow',
      breed: animal?.breed || '',
      gender: animal?.gender || 'unknown',
      age: animal?.age || 0,
      weight: animal?.weight || '',
      color: animal?.color || ''
    },
    story: {
      story: animal?.story || '',
      rescueStory: animal?.rescueStory || '',
      personalityDescription: animal?.personalityDescription || ''
    },
    care: {
      careLevel: animal?.careLevel || 'easy',
      specialNeeds: animal?.specialNeeds || [],
      housingType: animal?.housingType || 'pasture',
      companionAnimals: animal?.companionAnimals || []
    },
    medical: {
      medicalNeeds: animal?.medicalNeeds || [],
      specialDiet: animal?.specialDiet || '',
      medications: animal?.medications || []
    },
    sponsorship: {
      sponsorshipCost: animal?.sponsorshipCost || { monthly: 50, annually: 500 },
      maxSponsors: animal?.maxSponsors || 1,
      sponsorshipBenefits: animal?.sponsorshipBenefits || []
    },
    admin: {
      adminNotes: animal?.adminNotes || '',
      internalStatus: animal?.internalStatus || 'active',
      publicProfile: animal?.publicProfile ?? true
    }
  });

  const [photos, setPhotos] = useState<AnimalPhoto[]>(animal?.photos || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  console.log('[EnhancedAnimalForm] Rendering for animal:', animal?.name || 'new animal');

  useEffect(() => {
    setIsDirty(true);
  }, [formData, photos]);

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Settings, description: 'Name, species, physical details' },
    { id: 'story', label: 'Story', icon: FileText, description: 'Animal story and personality' },
    { id: 'photos', label: 'Photos', icon: Camera, description: 'Photo gallery management' },
    { id: 'care', label: 'Care', icon: Heart, description: 'Housing and care requirements' },
    { id: 'medical', label: 'Medical', icon: Stethoscope, description: 'Health and medical info' },
    { id: 'sponsorship', label: 'Sponsorship', icon: Heart, description: 'Sponsorship settings' },
    { id: 'admin', label: 'Admin', icon: Settings, description: 'Admin-only settings' }
  ] as const;

  const updateFormData = (section: keyof AnimalFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.basic.name.trim()) {
      newErrors.name = 'Animal name is required';
    }

    if (formData.basic.age && (formData.basic.age < 0 || formData.basic.age > 50)) {
      newErrors.age = 'Age must be between 0 and 50 years';
    }

    // Story validation
    if (formData.story.story.length < 50) {
      newErrors.story = 'Animal story should be at least 50 characters';
    }

    // Photo validation
    if (photos.length === 0) {
      newErrors.photos = 'At least one photo is required';
    }

    // Sponsorship validation
    if (formData.sponsorship.sponsorshipCost.monthly <= 0) {
      newErrors.monthlySponsorship = 'Monthly sponsorship cost must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({ ...formData, photos });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const getCurrentTabError = () => {
    const tabErrors = {
      basic: ['name', 'age'],
      story: ['story'],
      photos: ['photos'],
      care: [],
      medical: [],
      sponsorship: ['monthlySponsorship'],
      admin: []
    };

    return tabErrors[activeTab].some(field => errors[field]);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {animal ? `Edit ${animal.name}` : 'Add New Animal'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {readOnly ? 'Viewing animal details' : 'Fill out all sections to create a complete profile'}
            </p>
          </div>
          
          {isDirty && !readOnly && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="w-4 h-4" />
              Unsaved changes
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const hasError = getCurrentTabError();
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  ${hasError ? 'border-red-500 text-red-600' : ''}
                `}
              >
                <Icon className={`
                  w-4 h-4 mr-2
                  ${isActive ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500'}
                  ${hasError ? 'text-red-500' : ''}
                `} />
                {tab.label}
                {hasError && (
                  <AlertCircle className="w-3 h-3 ml-1 text-red-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Animal Name *
                  </label>
                  <input
                    type="text"
                    value={formData.basic.name}
                    onChange={(e) => updateFormData('basic', 'name', e.target.value)}
                    readOnly={readOnly}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter animal name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Species *
                  </label>
                  <select
                    value={formData.basic.species}
                    onChange={(e) => updateFormData('basic', 'species', e.target.value)}
                    disabled={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="cow">Cow</option>
                    <option value="pig">Pig</option>
                    <option value="goat">Goat</option>
                    <option value="sheep">Sheep</option>
                    <option value="chicken">Chicken</option>
                    <option value="turkey">Turkey</option>
                    <option value="horse">Horse</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Breed
                  </label>
                  <input
                    type="text"
                    value={formData.basic.breed}
                    onChange={(e) => updateFormData('basic', 'breed', e.target.value)}
                    readOnly={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Enter breed (optional)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.basic.gender}
                    onChange={(e) => updateFormData('basic', 'gender', e.target.value as any)}
                    disabled={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    value={formData.basic.age}
                    onChange={(e) => updateFormData('basic', 'age', parseInt(e.target.value) || 0)}
                    readOnly={readOnly}
                    min="0"
                    max="50"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.age ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter age"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <input
                    type="text"
                    value={formData.basic.weight}
                    onChange={(e) => updateFormData('basic', 'weight', e.target.value)}
                    readOnly={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="e.g., 1200 lbs, 450 kg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color/Markings
                  </label>
                  <input
                    type="text"
                    value={formData.basic.color}
                    onChange={(e) => updateFormData('basic', 'color', e.target.value)}
                    readOnly={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Describe color and markings"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Story Tab */}
          {activeTab === 'story' && (
            <div className="space-y-6">
              <AnimalStoryEditor
                value={formData.story.story}
                onChange={(value) => updateFormData('story', 'story', value)}
                label="Animal Story *"
                placeholder="Tell this animal's story - their personality, likes, dislikes, and what makes them special..."
                readOnly={readOnly}
              />
              {errors.story && (
                <p className="text-sm text-red-600">{errors.story}</p>
              )}

              <AnimalStoryEditor
                value={formData.story.rescueStory}
                onChange={(value) => updateFormData('story', 'rescueStory', value)}
                label="Rescue Story"
                placeholder="How did this animal come to the sanctuary? What was their background?"
                readOnly={readOnly}
              />

              <AnimalStoryEditor
                value={formData.story.personalityDescription}
                onChange={(value) => updateFormData('story', 'personalityDescription', value)}
                label="Personality Description"
                placeholder="Describe this animal's personality, temperament, and unique traits..."
                readOnly={readOnly}
              />
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div>
              <AnimalPhotoGallery
                photos={photos}
                onPhotosChange={setPhotos}
                readOnly={readOnly}
                maxPhotos={20}
              />
              {errors.photos && (
                <p className="mt-4 text-sm text-red-600">{errors.photos}</p>
              )}
            </div>
          )}

          {/* Care Tab */}
          {activeTab === 'care' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Care Level
                  </label>
                  <select
                    value={formData.care.careLevel}
                    onChange={(e) => updateFormData('care', 'careLevel', e.target.value as any)}
                    disabled={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="easy">Easy - Standard care</option>
                    <option value="moderate">Moderate - Some special needs</option>
                    <option value="intensive">Intensive - High maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Housing Type
                  </label>
                  <select
                    value={formData.care.housingType}
                    onChange={(e) => updateFormData('care', 'housingType', e.target.value as any)}
                    disabled={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="pasture">Pasture</option>
                    <option value="barn">Barn</option>
                    <option value="special-enclosure">Special Enclosure</option>
                    <option value="medical-facility">Medical Facility</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Needs
                </label>
                <textarea
                  value={formData.care.specialNeeds?.join('\n') || ''}
                  onChange={(e) => updateFormData('care', 'specialNeeds', e.target.value.split('\n').filter(Boolean))}
                  readOnly={readOnly}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="List any special care needs (one per line)"
                />
              </div>
            </div>
          )}

          {/* Medical Tab */}
          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Needs
                </label>
                <textarea
                  value={formData.medical.medicalNeeds?.join('\n') || ''}
                  onChange={(e) => updateFormData('medical', 'medicalNeeds', e.target.value.split('\n').filter(Boolean))}
                  readOnly={readOnly}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="List any ongoing medical needs (one per line)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Diet
                </label>
                <textarea
                  value={formData.medical.specialDiet}
                  onChange={(e) => updateFormData('medical', 'specialDiet', e.target.value)}
                  readOnly={readOnly}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Describe any special dietary requirements"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications
                </label>
                <textarea
                  value={formData.medical.medications?.join('\n') || ''}
                  onChange={(e) => updateFormData('medical', 'medications', e.target.value.split('\n').filter(Boolean))}
                  readOnly={readOnly}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="List current medications (one per line)"
                />
              </div>
            </div>
          )}

          {/* Sponsorship Tab */}
          {activeTab === 'sponsorship' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Sponsorship Cost *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.sponsorship.sponsorshipCost.monthly}
                      onChange={(e) => updateFormData('sponsorship', 'sponsorshipCost', {
                        ...formData.sponsorship.sponsorshipCost,
                        monthly: parseInt(e.target.value) || 0,
                        annually: (parseInt(e.target.value) || 0) * 12
                      })}
                      readOnly={readOnly}
                      min="1"
                      className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.monthlySponsorship ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="50"
                    />
                  </div>
                  {errors.monthlySponsorship && (
                    <p className="mt-1 text-sm text-red-600">{errors.monthlySponsorship}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Cost (auto-calculated)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={formData.sponsorship.sponsorshipCost.annually}
                      readOnly
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Sponsors
                  </label>
                  <input
                    type="number"
                    value={formData.sponsorship.maxSponsors}
                    onChange={(e) => updateFormData('sponsorship', 'maxSponsors', parseInt(e.target.value) || 1)}
                    readOnly={readOnly}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sponsorship Benefits
                </label>
                <textarea
                  value={formData.sponsorship.sponsorshipBenefits?.join('\n') || ''}
                  onChange={(e) => updateFormData('sponsorship', 'sponsorshipBenefits', e.target.value.split('\n').filter(Boolean))}
                  readOnly={readOnly}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="List sponsorship benefits (one per line)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  What do sponsors receive? (e.g., monthly updates, photos, visit privileges)
                </p>
              </div>
            </div>
          )}

          {/* Admin Tab */}
          {activeTab === 'admin' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Internal Status
                  </label>
                  <select
                    value={formData.admin.internalStatus}
                    onChange={(e) => updateFormData('admin', 'internalStatus', e.target.value as any)}
                    disabled={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="publicProfile"
                    checked={formData.admin.publicProfile}
                    onChange={(e) => updateFormData('admin', 'publicProfile', e.target.checked)}
                    disabled={readOnly}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <label htmlFor="publicProfile" className="ml-2 block text-sm text-gray-900">
                    Show on public website
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes
                </label>
                <textarea
                  value={formData.admin.adminNotes}
                  onChange={(e) => updateFormData('admin', 'adminNotes', e.target.value)}
                  readOnly={readOnly}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Internal notes for staff (not visible to public)"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!readOnly && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {Object.keys(errors).length > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  Please fix {Object.keys(errors).length} error{Object.keys(errors).length !== 1 ? 's' : ''} before saving
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {animal ? 'Save Changes' : 'Create Animal'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}