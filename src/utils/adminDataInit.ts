// Admin Data Initialization
// Loads existing sanctuary data into the admin management system

import { AdminDataManager } from './adminData';
import { animals } from '../data/animals';
import { blogPosts } from '../data/blogPosts';
import { faqs } from '../data/faqs';
import { educationalResources } from '../data/educationalResources';
import { volunteerRoles } from '../data/volunteerRoles';

// Sample data for development
export const sampleInquiries = [
  {
    id: 'inquiry_1',
    type: 'volunteer' as const,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    subject: 'Volunteer Application - Animal Care',
    message: 'Hi! I would love to volunteer with animal care. I have experience with dogs and cats, and I\'m available weekends. When can I start?',
    status: 'new' as const,
    priority: 'medium' as const,
    tags: ['volunteer', 'animal-care', 'weekends'],
    submittedAt: new Date('2024-01-15T10:30:00'),
    notes: [],
    attachments: [],
  },
  {
    id: 'inquiry_2',
    type: 'visit' as const,
    name: 'Mike Chen',
    email: 'mike.chen@email.com',
    phone: '(555) 234-5678',
    subject: 'Family Tour Booking',
    message: 'We would like to schedule a family tour for this weekend. We have two children ages 8 and 12. What time slots are available?',
    status: 'responded' as const,
    priority: 'medium' as const,
    tags: ['tour', 'family', 'weekend'],
    submittedAt: new Date('2024-01-14T14:15:00'),
    respondedAt: new Date('2024-01-14T16:45:00'),
    notes: [
      {
        id: 'note_1',
        content: 'Responded with available tour times for Saturday 2pm and Sunday 10am',
        author: 'Sarah Thompson',
        createdAt: new Date('2024-01-14T16:45:00'),
        type: 'response',
      }
    ],
    attachments: [],
  },
  {
    id: 'inquiry_3',
    type: 'donation' as const,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    subject: 'Memorial Donation',
    message: 'I would like to make a memorial donation in honor of my grandmother who loved animals. Could you provide information about memorial donation options?',
    status: 'resolved' as const,
    priority: 'high' as const,
    tags: ['donation', 'memorial', 'follow-up'],
    submittedAt: new Date('2024-01-13T09:20:00'),
    respondedAt: new Date('2024-01-13T11:30:00'),
    resolvedAt: new Date('2024-01-13T15:45:00'),
    notes: [
      {
        id: 'note_2',
        content: 'Sent memorial donation information and tribute options',
        author: 'Mike Thompson',
        createdAt: new Date('2024-01-13T11:30:00'),
        type: 'response',
      },
      {
        id: 'note_3',
        content: 'Donation completed - $250 memorial donation for Bella the Cow',
        author: 'Sarah Thompson',
        createdAt: new Date('2024-01-13T15:45:00'),
        type: 'note',
      }
    ],
    attachments: [],
  },
  {
    id: 'inquiry_4',
    type: 'general' as const,
    name: 'David Kim',
    email: 'david.kim@email.com',
    phone: '(555) 345-6789',
    subject: 'Educational Program Inquiry',
    message: 'I\'m a teacher at Roosevelt Elementary and would like to bring my 4th grade class for an educational visit. Do you have programs suitable for this age group?',
    status: 'new' as const,
    priority: 'high' as const,
    assignedTo: 'Sarah Thompson',
    tags: ['education', 'school-group', 'elementary'],
    submittedAt: new Date('2024-01-16T08:45:00'),
    notes: [],
    attachments: [],
  },
  {
    id: 'inquiry_5',
    type: 'adoption' as const,
    name: 'Lisa Garcia',
    email: 'lisa.garcia@email.com',
    phone: '(555) 456-7890',
    subject: 'Animal Adoption Inquiry',
    message: 'I saw Luna the Sheep on your website and would like to know more about the adoption process. I have a small farm and experience with sheep.',
    status: 'responded' as const,
    priority: 'medium' as const,
    tags: ['adoption', 'sheep', 'experienced'],
    submittedAt: new Date('2024-01-12T16:30:00'),
    respondedAt: new Date('2024-01-13T09:15:00'),
    notes: [
      {
        id: 'note_4',
        content: 'Explained that Luna is not available for adoption as she\'s a permanent sanctuary resident, but provided info about sponsorship program',
        author: 'Mike Thompson',
        createdAt: new Date('2024-01-13T09:15:00'),
        type: 'response',
      }
    ],
    attachments: [],
  },
];

export const sampleDonations = [
  {
    id: 'donation_1',
    type: 'monthly' as const,
    amount: 50,
    currency: 'USD',
    donorName: 'Jennifer Wilson',
    donorEmail: 'jennifer.wilson@email.com',
    donorPhone: '(555) 123-0001',
    paymentMethod: 'credit-card' as const,
    transactionId: 'txn_1234567890',
    status: 'completed' as const,
    designation: 'General Support',
    anonymous: false,
    recurring: true,
    recurringFrequency: 'monthly' as const,
    donatedAt: new Date('2024-01-15T12:00:00'),
    processedAt: new Date('2024-01-15T12:05:00'),
    notes: 'Monthly recurring donation - auto-renewal enabled',
    taxDeductible: true,
    receiptSent: true,
  },
  {
    id: 'donation_2',
    type: 'memorial' as const,
    amount: 250,
    currency: 'USD',
    donorName: 'Emily Rodriguez',
    donorEmail: 'emily.rodriguez@email.com',
    paymentMethod: 'paypal' as const,
    transactionId: 'pp_9876543210',
    status: 'completed' as const,
    designation: 'Memorial for Maria Rodriguez - Bella the Cow',
    anonymous: false,
    recurring: false,
    donatedAt: new Date('2024-01-13T15:45:00'),
    processedAt: new Date('2024-01-13T15:47:00'),
    notes: 'Memorial donation in honor of grandmother Maria Rodriguez',
    taxDeductible: true,
    receiptSent: true,
  },
  {
    id: 'donation_3',
    type: 'one-time' as const,
    amount: 100,
    currency: 'USD',
    donorName: 'Anonymous Donor',
    donorEmail: 'anonymous@sanctuary.local',
    paymentMethod: 'credit-card' as const,
    transactionId: 'txn_5555555555',
    status: 'completed' as const,
    designation: 'Winter Feed Fund',
    anonymous: true,
    recurring: false,
    donatedAt: new Date('2024-01-14T09:30:00'),
    processedAt: new Date('2024-01-14T09:35:00'),
    notes: 'Anonymous donation for winter feed',
    taxDeductible: true,
    receiptSent: false,
  },
  {
    id: 'donation_4',
    type: 'corporate' as const,
    amount: 1000,
    currency: 'USD',
    donorName: 'GreenTech Solutions Inc.',
    donorEmail: 'donations@greentech.com',
    donorPhone: '(555) 999-0000',
    donorAddress: {
      street: '123 Business Park Dr',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA',
    },
    paymentMethod: 'bank-transfer' as const,
    transactionId: 'bt_corp_2024_001',
    status: 'completed' as const,
    designation: 'Annual Corporate Sponsorship',
    anonymous: false,
    recurring: false,
    donatedAt: new Date('2024-01-10T14:00:00'),
    processedAt: new Date('2024-01-11T10:00:00'),
    notes: 'Annual corporate sponsorship - includes volunteer day for employees',
    taxDeductible: true,
    receiptSent: true,
  },
  {
    id: 'donation_5',
    type: 'tribute' as const,
    amount: 75,
    currency: 'USD',
    donorName: 'Robert Anderson',
    donorEmail: 'robert.anderson@email.com',
    donorPhone: '(555) 777-1234',
    paymentMethod: 'credit-card' as const,
    transactionId: 'txn_7777777777',
    status: 'completed' as const,
    designation: 'Birthday tribute for Sarah Anderson',
    anonymous: false,
    recurring: false,
    donatedAt: new Date('2024-01-12T18:20:00'),
    processedAt: new Date('2024-01-12T18:25:00'),
    notes: 'Birthday tribute donation for daughter Sarah\'s 16th birthday',
    taxDeductible: true,
    receiptSent: true,
  },
];

// Admin settings template
export const defaultSettings = {
  site: {
    name: 'Harmony Farm Sanctuary',
    description: 'A safe haven for rescued farm animals in Central Oregon',
    url: 'https://harmonyfarm.org',
    contactEmail: 'hello@harmonyfarm.org',
    contactPhone: '(555) 123-4567',
    address: '1234 Sanctuary Lane, Bend, OR 97701',
    timezone: 'America/Los_Angeles',
    language: 'en',
    maintenanceMode: false,
  },
  email: {
    smtpHost: 'smtp.harmonyfarm.org',
    smtpPort: 587,
    smtpUsername: 'admin@harmonyfarm.org',
    fromEmail: 'hello@harmonyfarm.org',
    fromName: 'Harmony Farm Sanctuary',
    templates: [
      {
        id: 'welcome_volunteer',
        name: 'Volunteer Welcome Email',
        subject: 'Welcome to Harmony Farm Sanctuary!',
        body: 'Dear {{name}},\n\nThank you for joining our volunteer family...',
        variables: ['name', 'volunteer_role', 'start_date'],
        active: true,
      },
      {
        id: 'donation_receipt',
        name: 'Donation Receipt',
        subject: 'Thank you for your donation - Receipt #{{receipt_number}}',
        body: 'Dear {{donor_name}},\n\nThank you for your generous donation...',
        variables: ['donor_name', 'amount', 'date', 'receipt_number'],
        active: true,
      },
    ],
  },
  notifications: {
    emailNotifications: true,
    volunteerApplications: true,
    contactForms: true,
    donations: true,
    systemAlerts: true,
  },
  backup: {
    autoBackup: true,
    frequency: 'weekly' as const,
    maxBackups: 10,
    includeImages: false,
  },
};

export class AdminDataInitializer {
  private static isInitialized(): boolean {
    const metadata = AdminDataManager.getMetadata();
    return Object.keys(metadata.resources).length > 0;
  }

  static async initializeData(force: boolean = false): Promise<void> {
    if (this.isInitialized() && !force) {
      console.log('Admin data already initialized');
      return;
    }

    console.log('Initializing admin data...');

    try {
      // Initialize animals data
      if (AdminDataManager.count('animals') === 0) {
        console.log('Loading animals data...');
        animals.forEach(animal => {
          AdminDataManager.create('animals', {
            ...animal,
            // Add admin-specific fields
            notes: `Imported from sanctuary database on ${new Date().toISOString()}`,
            lastHealthCheck: new Date(),
            nextHealthCheck: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          });
        });
        console.log(`Loaded ${animals.length} animals`);
      }

      // Initialize blog posts data
      if (AdminDataManager.count('blog') === 0) {
        console.log('Loading blog posts data...');
        blogPosts.forEach(post => {
          AdminDataManager.create('blog', {
            ...post,
            // Convert publishedAt string to Date if needed
            publishedAt: new Date(post.publishedAt),
            status: 'published',
            views: Math.floor(Math.random() * 500) + 100,
            likes: Math.floor(Math.random() * 50) + 10,
          });
        });
        console.log(`Loaded ${blogPosts.length} blog posts`);
      }

      // Initialize FAQs data
      if (AdminDataManager.count('faq') === 0) {
        console.log('Loading FAQs data...');
        faqs.forEach(faq => {
          AdminDataManager.create('faq', {
            ...faq,
            status: 'published',
            helpfulCount: Math.floor(Math.random() * 20) + 5,
            order: faqs.indexOf(faq),
          });
        });
        console.log(`Loaded ${faqs.length} FAQs`);
      }

      // Initialize resources data
      if (AdminDataManager.count('resources') === 0) {
        console.log('Loading educational resources data...');
        educationalResources.forEach(resource => {
          AdminDataManager.create('resources', {
            ...resource,
            status: 'published',
            downloads: Math.floor(Math.random() * 100) + 20,
            rating: 4 + Math.random(),
            ratingCount: Math.floor(Math.random() * 15) + 5,
          });
        });
        console.log(`Loaded ${educationalResources.length} resources`);
      }

      // Initialize volunteer roles data
      if (AdminDataManager.count('volunteers') === 0) {
        console.log('Loading volunteer roles data...');
        volunteerRoles.forEach(role => {
          AdminDataManager.create('volunteers', {
            ...role,
            status: 'active',
            applications: Math.floor(Math.random() * 10) + 2,
            lastUpdated: new Date(),
          });
        });
        console.log(`Loaded ${volunteerRoles.length} volunteer roles`);
      }

      // Initialize sample inquiries
      if (AdminDataManager.count('inquiries') === 0) {
        console.log('Loading sample inquiries...');
        sampleInquiries.forEach(inquiry => {
          AdminDataManager.create('inquiries', inquiry);
        });
        console.log(`Loaded ${sampleInquiries.length} inquiries`);
      }

      // Initialize sample donations
      if (AdminDataManager.count('donations') === 0) {
        console.log('Loading sample donations...');
        sampleDonations.forEach(donation => {
          AdminDataManager.create('donations', donation);
        });
        console.log(`Loaded ${sampleDonations.length} donations`);
      }

      // Initialize settings
      const existingSettings = AdminDataManager.getAll('settings');
      if (existingSettings.length === 0) {
        console.log('Loading default settings...');
        AdminDataManager.create('settings', {
          ...defaultSettings,
          id: 'default_settings',
        });
        console.log('Loaded default settings');
      }

      console.log('Admin data initialization complete!');
      
      // Log summary
      const metadata = AdminDataManager.getMetadata();
      console.log('Data summary:', {
        animals: AdminDataManager.count('animals'),
        blogPosts: AdminDataManager.count('blog'),
        faqs: AdminDataManager.count('faq'),
        resources: AdminDataManager.count('resources'),
        volunteers: AdminDataManager.count('volunteers'),
        inquiries: AdminDataManager.count('inquiries'),
        donations: AdminDataManager.count('donations'),
        settings: AdminDataManager.count('settings'),
      });

    } catch (error) {
      console.error('Error initializing admin data:', error);
      throw error;
    }
  }

  static clearAllData(): void {
    AdminDataManager.clearAllData();
    console.log('All admin data cleared');
  }

  static async reinitializeData(): Promise<void> {
    this.clearAllData();
    await this.initializeData(true);
  }
}