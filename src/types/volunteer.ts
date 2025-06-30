// Volunteer system TypeScript interfaces
export interface VolunteerRole {
  id: string;
  title: string;
  category: 'animal-care' | 'administration' | 'events' | 'education' | 'maintenance' | 'outreach';
  description: string;
  responsibilities: string[];
  timeCommitment: string;
  schedule: string;
  requirements: string[];
  training: string[];
  physicalRequirements?: string;
  minimumAge?: number;
  backgroundCheck: boolean;
  skillsNeeded: string[];
  benefits: string[];
  imageUrl: string;
  isActive: boolean;
  contactPerson?: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface VolunteerApplication {
  // Personal Information
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Availability and Interests
  availability: {
    days: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
    timeSlots: ('morning' | 'afternoon' | 'evening')[];
    frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'occasional';
    startDate: string;
  };
  
  // Role Preferences
  interestedRoles: string[]; // Array of role IDs
  primaryInterest: string;
  alternateInterests: string[];
  
  // Experience and Skills
  animalExperience: boolean;
  animalExperienceDetails?: string;
  relevantSkills: string[];
  previousVolunteerWork: boolean;
  previousVolunteerDetails?: string;
  professionalBackground?: string;
  
  // References
  references: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  }[];
  
  // Background and Health
  backgroundCheckConsent: boolean;
  healthConditions?: string;
  allergies?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Motivation and Goals
  motivation: string;
  goals: string[];
  specialRequests?: string;
  
  // Admin Fields
  applicationDate: string;
  status: 'pending' | 'review' | 'approved' | 'declined' | 'inactive';
  notes?: string;
  interviewDate?: string;
  orientationDate?: string;
  backgroundCheckStatus?: 'pending' | 'approved' | 'declined';
}

export interface VolunteerStats {
  totalActiveVolunteers: number;
  monthlyVolunteers: number;
  totalVolunteerHours: number;
  averageHoursPerVolunteer: number;
  retentionRate: number;
  mostNeededRoles: string[];
}

export interface VolunteerTestimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  imageUrl: string;
  yearsVolunteering: number;
  favoriteAspect: string;
  backgroundStory?: string;
}

export interface VolunteerEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  volunteersNeeded: number;
  volunteersRegistered: number;
  skills: string[];
  contactPerson: string;
  isRecurring: boolean;
  category: 'training' | 'work-party' | 'event' | 'appreciation' | 'orientation';
}

// Form state interfaces
export interface VolunteerApplicationFormData {
  currentStep: number;
  totalSteps: number;
  formData: Partial<VolunteerApplication>;
  errors: Record<string, string>;
  isValid: boolean;
}

export interface VolunteerFormStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
  isRequired: boolean;
  validationRules?: Record<string, any>;
}