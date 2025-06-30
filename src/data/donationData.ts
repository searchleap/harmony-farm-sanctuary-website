import { 
  DonationAmount, 
  DonationType, 
  DonationImpact, 
  DonorTestimonial, 
  DonationCampaign, 
  DonationStats, 
  PaymentProvider 
} from '../types/donation';

export const donationAmounts: DonationAmount[] = [
  {
    id: 'amount-25',
    amount: 25,
    label: '$25',
    description: 'Feeds a rescued pig for a week',
    impact: 'Provides nutritious meals and treats for one of our pig residents for 7 days',
    animalEquivalent: '1 pig, 7 days of food'
  },
  {
    id: 'amount-50',
    amount: 50,
    label: '$50',
    description: 'Medical care for a chicken',
    impact: 'Covers basic veterinary care, vaccinations, and health monitoring for a rescued chicken',
    animalEquivalent: '1 chicken, complete medical care',
    isPopular: true
  },
  {
    id: 'amount-100',
    amount: 100,
    label: '$100',
    description: 'Monthly care for a goat',
    impact: 'Provides food, shelter maintenance, and basic medical care for a goat for one month',
    animalEquivalent: '1 goat, 1 month of comprehensive care',
    isPopular: true
  },
  {
    id: 'amount-250',
    amount: 250,
    label: '$250',
    description: 'Emergency medical fund',
    impact: 'Contributes to emergency veterinary care and life-saving treatments for critically injured animals',
    animalEquivalent: 'Emergency surgery or intensive care'
  },
  {
    id: 'amount-500',
    amount: 500,
    label: '$500',
    description: 'Shelter construction materials',
    impact: 'Funds building materials for new animal shelters or facility improvements',
    animalEquivalent: 'Materials for 1 animal shelter',
    isPopular: true
  },
  {
    id: 'amount-1000',
    amount: 1000,
    label: '$1,000',
    description: 'Sponsor an animal for a year',
    impact: 'Covers all expenses for one rescued animal including food, medical care, and shelter for 12 months',
    animalEquivalent: '1 animal, full year sponsorship'
  }
];

export const donationTypes: DonationType[] = [
  {
    id: 'one-time',
    label: 'One-Time Donation',
    description: 'Make a single donation to support immediate animal care needs',
    benefits: [
      'Immediate impact on animal welfare',
      'Tax-deductible receipt provided',
      'Updates on how your donation helps',
      'Recognition in annual report (optional)'
    ],
    taxDeductible: true,
    processingFee: 2.9
  },
  {
    id: 'monthly',
    label: 'Monthly Giving',
    description: 'Become a sustaining supporter with automatic monthly donations',
    benefits: [
      'Predictable income helps plan animal care',
      'Exclusive monthly impact updates',
      'Priority access to sanctuary events',
      'Special donor recognition program',
      'Easy to modify or cancel anytime'
    ],
    minimumAmount: 10,
    taxDeductible: true,
    processingFee: 2.9
  },
  {
    id: 'memorial',
    label: 'Memorial Donation',
    description: 'Honor the memory of a loved one with a meaningful gift',
    benefits: [
      'Personalized memorial acknowledgment',
      'Notification sent to family (optional)',
      'Memorial plaque in sanctuary garden',
      'Annual memorial tribute ceremony',
      'Dedicated memorial webpage'
    ],
    minimumAmount: 25,
    taxDeductible: true,
    processingFee: 2.9
  },
  {
    id: 'tribute',
    label: 'Tribute Donation',
    description: 'Celebrate someone special with a donation in their honor',
    benefits: [
      'Beautiful tribute acknowledgment card',
      'Notification sent to honoree (optional)',
      'Tribute recognition on donor wall',
      'Special occasion celebration options',
      'Recurring tribute donation available'
    ],
    minimumAmount: 25,
    taxDeductible: true,
    processingFee: 2.9
  },
  {
    id: 'corporate',
    label: 'Corporate Partnership',
    description: 'Partner with us for corporate social responsibility and team building',
    benefits: [
      'Corporate recognition and branding',
      'Team volunteer opportunities',
      'Annual partnership report',
      'Networking events with other partners',
      'Custom partnership agreements'
    ],
    minimumAmount: 500,
    taxDeductible: true,
    processingFee: 2.5
  }
];

export const paymentProviders: PaymentProvider[] = [
  {
    id: 'stripe',
    name: 'Credit/Debit Card',
    description: 'Secure payment processing via Stripe',
    fees: { percentage: 2.9, fixed: 0.30 },
    supported: true,
    icon: 'credit-card',
    processingTime: 'Immediate',
    securityFeatures: ['PCI DSS Level 1', 'SSL Encryption', 'Fraud Protection']
  },
  {
    id: 'paypal',
    name: 'PayPal',
    description: 'Pay securely with your PayPal account',
    fees: { percentage: 3.49, fixed: 0.49 },
    supported: true,
    icon: 'paypal',
    processingTime: 'Immediate',
    securityFeatures: ['Buyer Protection', 'Secure Authentication', 'Fraud Monitoring']
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    description: 'Direct bank transfer (ACH)',
    fees: { percentage: 0.8, fixed: 0.25 },
    supported: true,
    icon: 'building-bank',
    processingTime: '3-5 business days',
    securityFeatures: ['Bank-Level Security', 'Account Verification', 'Encrypted Transmission']
  },
  {
    id: 'square',
    name: 'Square Cash App',
    description: 'Quick payment via Cash App',
    fees: { percentage: 2.75, fixed: 0.00 },
    supported: false,
    icon: 'smartphone',
    processingTime: 'Immediate',
    securityFeatures: ['PIN Protection', 'Biometric Security', 'Real-time Notifications']
  }
];

export const activeCampaigns: DonationCampaign[] = [
  {
    id: 'winter-shelter-2024',
    title: 'Winter Shelter Improvements',
    description: 'Upgrade heating systems and weatherproofing for our animal shelters before winter arrives. Ensure all our rescued animals stay warm and comfortable.',
    goal: 15000,
    raised: 11250,
    donors: 89,
    daysLeft: 23,
    imageUrl: 'https://images.unsplash.com/photo-1519139270028-b75d122af2e8?w=600&h=400&fit=crop',
    urgency: 'high',
    category: 'infrastructure',
    progress: 75,
    updates: [
      {
        date: '2024-01-10',
        title: 'Heating System Installation Begins',
        description: 'Thanks to your generous donations, we\'ve started installing new heating systems in the main barn.',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop'
      },
      {
        date: '2024-01-05',
        title: '75% Funding Reached!',
        description: 'We\'re thrilled to announce we\'ve reached 75% of our winter shelter goal. Every donation brings us closer to ensuring our animals stay warm.'
      }
    ]
  },
  {
    id: 'emergency-medical-fund',
    title: 'Emergency Medical Fund',
    description: 'Support life-saving veterinary care for rescued animals with serious injuries or chronic conditions requiring ongoing treatment.',
    goal: 25000,
    raised: 8900,
    donors: 156,
    daysLeft: 45,
    imageUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop',
    urgency: 'medium',
    category: 'medical',
    progress: 36,
    updates: [
      {
        date: '2024-01-08',
        title: 'Luna\'s Surgery Successful',
        description: 'Thanks to your donations, Luna the goat underwent successful surgery and is recovering well.',
        imageUrl: 'https://images.unsplash.com/photo-1581888227599-779811939961?w=400&h=300&fit=crop'
      }
    ]
  },
  {
    id: 'sanctuary-expansion',
    title: 'Sanctuary Expansion Project',
    description: 'Expand our capacity to rescue more animals by building new facilities and increasing our pasture space from 45 to 65 acres.',
    goal: 75000,
    raised: 23400,
    donors: 203,
    daysLeft: 90,
    imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&h=400&fit=crop',
    urgency: 'low',
    category: 'expansion',
    progress: 31,
    updates: [
      {
        date: '2024-01-01',
        title: 'Environmental Impact Assessment Complete',
        description: 'We\'ve completed all environmental assessments for the expansion project and received approval to proceed.'
      }
    ]
  }
];

export const donorTestimonials: DonorTestimonial[] = [
  {
    id: 'donor-michael-s',
    name: 'Michael S.',
    donationType: 'Monthly Donor',
    amount: 75,
    quote: 'Knowing that my monthly donation directly supports these amazing animals gives me such joy. The updates I receive show exactly how my contributions help, and visiting the sanctuary is always heartwarming.',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    yearsSupporting: 3,
    favoriteProgram: 'Animal Medical Care',
    totalContributed: 2700,
    isRecurring: true
  },
  {
    id: 'donor-patricia-l',
    name: 'Patricia L.',
    donationType: 'Memorial Donor',
    quote: 'I made a memorial donation in honor of my late husband who loved farm animals. The beautiful acknowledgment and memorial plaque mean so much to our family.',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    yearsSupporting: 2,
    favoriteProgram: 'Memorial Garden',
    totalContributed: 1500,
    isRecurring: false
  },
  {
    id: 'donor-james-k',
    name: 'James K.',
    donationType: 'Corporate Partner',
    quote: 'Our company partnership with Harmony Farm has been incredibly rewarding. Our employees love the volunteer days, and we\'re proud to support such meaningful work.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    yearsSupporting: 1,
    favoriteProgram: 'Corporate Volunteer Days',
    totalContributed: 5000,
    isRecurring: true
  },
  {
    id: 'donor-susan-m',
    name: 'Susan M.',
    donationType: 'One-time Donor',
    quote: 'I was so moved by Bella the cow\'s rescue story that I had to donate. Seeing how much care and love goes into helping these animals is truly inspiring.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
    yearsSupporting: 1,
    favoriteProgram: 'Animal Rescue Operations',
    totalContributed: 250,
    isRecurring: false
  }
];

export const donationStats: DonationStats = {
  totalRaised: 324567,
  totalDonors: 1247,
  averageDonation: 127,
  recurringDonors: 398,
  recurringPercentage: 32,
  largestDonation: 5000,
  monthlyGoal: 25000,
  monthlyProgress: 18750,
  animalsCared: 150,
  impactMetrics: [
    {
      label: 'Animals Fed Daily',
      value: 150,
      unit: 'animals',
      description: 'Rescued animals receiving daily care and nutrition'
    },
    {
      label: 'Medical Treatments',
      value: 89,
      unit: 'treatments',
      description: 'Veterinary procedures and treatments this month'
    },
    {
      label: 'Volunteer Hours',
      value: 1250,
      unit: 'hours',
      description: 'Hours of volunteer support coordinated this month'
    },
    {
      label: 'Educational Visitors',
      value: 340,
      unit: 'visitors',
      description: 'People educated about animal welfare this month'
    }
  ]
};

// Helper functions
export const calculateDonationImpact = (amount: number): DonationImpact => {
  const feedingDays = Math.floor(amount / 3.5); // $3.50 per animal per day
  const medicalCare = Math.floor(amount / 45); // $45 average medical care
  const shelterMaintenance = Math.floor(amount / 25); // $25 shelter maintenance

  return {
    amount,
    impacts: [
      {
        category: 'Animal Feeding',
        description: 'Days of nutritious meals for rescued animals',
        quantity: feedingDays,
        unit: 'feeding days',
        icon: 'utensils'
      },
      {
        category: 'Medical Care',
        description: 'Veterinary treatments and health check-ups',
        quantity: medicalCare,
        unit: 'treatments',
        icon: 'heart-pulse'
      },
      {
        category: 'Shelter Maintenance',
        description: 'Days of shelter upkeep and improvements',
        quantity: shelterMaintenance,
        unit: 'maintenance days',
        icon: 'home'
      },
      {
        category: 'Educational Outreach',
        description: 'Visitors educated about animal welfare',
        quantity: Math.floor(amount / 15), // $15 per educational visit
        unit: 'educational visits',
        icon: 'graduation-cap'
      }
    ],
    animalCare: {
      feedingDays,
      medicalCare,
      shelterMaintenance
    },
    operationalSupport: {
      percentage: 85, // 85% goes directly to animal care
      categories: ['Animal Care', 'Medical Expenses', 'Facility Maintenance', 'Staff Support']
    }
  };
};

export const getDonationAmountById = (id: string): DonationAmount | undefined => {
  return donationAmounts.find(amount => amount.id === id);
};

export const getDonationTypeById = (id: string): DonationType | undefined => {
  return donationTypes.find(type => type.id === id);
};

export const getActiveCampaigns = (): DonationCampaign[] => {
  return activeCampaigns.filter(campaign => campaign.daysLeft > 0);
};

export const getUrgentCampaigns = (): DonationCampaign[] => {
  return activeCampaigns.filter(campaign => campaign.urgency === 'high' && campaign.daysLeft > 0);
};

export const calculateTotalFees = (amount: number, provider: PaymentProvider): number => {
  return (amount * provider.fees.percentage / 100) + provider.fees.fixed;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};