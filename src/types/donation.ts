// Donation system TypeScript interfaces

export interface DonationAmount {
  id: string;
  amount: number;
  label: string;
  description: string;
  impact: string;
  isPopular?: boolean;
  animalEquivalent?: string;
}

export interface DonationType {
  id: 'one-time' | 'monthly' | 'memorial' | 'tribute' | 'corporate';
  label: string;
  description: string;
  benefits: string[];
  minimumAmount?: number;
  taxDeductible: boolean;
  processingFee: number; // percentage
}

export interface DonationFormData {
  // Donation Details
  donationType: DonationType['id'];
  amount: number;
  customAmount?: number;
  currency: 'USD';
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'annually';
  
  // Donor Information
  donor: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    isAnonymous: boolean;
  };
  
  // Payment Information
  payment: {
    method: 'credit-card' | 'paypal' | 'bank-transfer' | 'crypto';
    cardDetails?: {
      number: string;
      expiryMonth: string;
      expiryYear: string;
      cvv: string;
      cardholderName: string;
    };
    billingAddress?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  
  // Special Donations
  memorial?: {
    honoringName: string;
    relationship: string;
    notifyFamily: boolean;
    familyContact?: {
      name: string;
      email: string;
      address: string;
    };
    message?: string;
  };
  
  tribute?: {
    honoringName: string;
    occasion: string;
    notifyHonoree: boolean;
    honoreeContact?: {
      name: string;
      email: string;
      address: string;
    };
    message?: string;
  };
  
  // Preferences
  preferences: {
    receiveUpdates: boolean;
    receiveNewsletter: boolean;
    publicRecognition: boolean;
    corporateMatch?: string;
    dedication?: string;
    specialInstructions?: string;
  };
  
  // Admin/Processing
  transactionId?: string;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  donationDate: string;
  taxReceiptSent: boolean;
  followupScheduled: boolean;
}

export interface DonationImpact {
  amount: number;
  impacts: {
    category: string;
    description: string;
    quantity: number;
    unit: string;
    icon: string;
  }[];
  animalCare: {
    feedingDays: number;
    medicalCare: number;
    shelterMaintenance: number;
  };
  operationalSupport: {
    percentage: number;
    categories: string[];
  };
}

export interface DonorTestimonial {
  id: string;
  name: string;
  donationType: string;
  amount?: number;
  quote: string;
  imageUrl?: string;
  yearsSupporting: number;
  favoriteProgram: string;
  totalContributed?: number;
  isRecurring: boolean;
}

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  donors: number;
  daysLeft: number;
  imageUrl: string;
  urgency: 'low' | 'medium' | 'high';
  category: 'medical' | 'infrastructure' | 'emergency' | 'general' | 'expansion';
  progress: number; // percentage
  updates: {
    date: string;
    title: string;
    description: string;
    imageUrl?: string;
  }[];
}

export interface DonationStats {
  totalRaised: number;
  totalDonors: number;
  averageDonation: number;
  recurringDonors: number;
  recurringPercentage: number;
  largestDonation: number;
  monthlyGoal: number;
  monthlyProgress: number;
  animalsCared: number;
  impactMetrics: {
    label: string;
    value: number;
    unit: string;
    description: string;
  }[];
}

export interface PaymentProvider {
  id: 'stripe' | 'paypal' | 'square' | 'bank-transfer';
  name: string;
  description: string;
  fees: {
    percentage: number;
    fixed: number;
  };
  supported: boolean;
  icon: string;
  processingTime: string;
  securityFeatures: string[];
}

export interface TaxReceipt {
  id: string;
  donationId: string;
  receiptNumber: string;
  donorName: string;
  donorAddress: string;
  amount: number;
  donationDate: string;
  issueDate: string;
  taxYear: number;
  organizationInfo: {
    name: string;
    ein: string;
    address: string;
    phone: string;
    email: string;
  };
}

// Form validation and state management
export interface DonationFormState {
  currentStep: number;
  totalSteps: number;
  formData: Partial<DonationFormData>;
  errors: Record<string, string>;
  isValid: boolean;
  isSubmitting: boolean;
  paymentProcessing: boolean;
}

export interface DonationFormStep {
  id: number;
  title: string;
  description: string;
  fields: string[];
  validationRules: Record<string, any>;
  isRequired: boolean;
}

// Recurring donation management
export interface RecurringDonation {
  id: string;
  donorId: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  nextPaymentDate: string;
  status: 'active' | 'paused' | 'cancelled';
  paymentMethod: string;
  startDate: string;
  totalContributed: number;
  failedPayments: number;
  lastPaymentDate?: string;
  cancelledDate?: string;
  pausedUntil?: string;
}