// Enhanced Animal Management Components (Phase 2, Step 5)
// Comprehensive animal profile management with photos, stories, and care tracking

export { AnimalPhotoGallery } from './AnimalPhotoGallery';
export { AnimalStoryEditor } from './AnimalStoryEditor';
export { EnhancedAnimalForm } from './EnhancedAnimalForm';

// Re-export types for convenience
export type { 
  AnimalPhoto, 
  EnhancedAnimal, 
  AnimalFormData,
  MedicalRecord,
  Sponsor,
  CareNote,
  AnimalAnalytics
} from '../../../types/admin';