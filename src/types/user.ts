// User Management System Types
// Comprehensive TypeScript interfaces for user accounts, volunteers, and community management

export type UserRole = 'super_admin' | 'admin' | 'volunteer_coordinator' | 'event_manager' | 'volunteer' | 'visitor';

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending_verification';

export type VolunteerStatus = 'applicant' | 'pending_review' | 'background_check' | 'approved' | 'active' | 'inactive' | 'alumni';

export interface User {
  id: string;
  email: string;
  username?: string;
  
  // Personal Information
  first_name: string;
  last_name: string;
  display_name?: string;
  phone?: string;
  date_of_birth?: string;
  
  // Address Information
  address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  
  // Account Information
  role: UserRole;
  status: UserStatus;
  email_verified: boolean;
  phone_verified: boolean;
  
  // Profile
  avatar_url?: string;
  bio?: string;
  preferences: UserPreferences;
  
  // Security
  last_login?: string;
  password_changed_at?: string;
  failed_login_attempts: number;
  
  // Metadata
  created_at: string;
  updated_at: string;
  created_by?: string;
  notes?: string;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  email_notifications: {
    system_updates: boolean;
    volunteer_opportunities: boolean;
    event_reminders: boolean;
    newsletter: boolean;
    messages: boolean;
  };
  sms_notifications: {
    urgent_alerts: boolean;
    shift_reminders: boolean;
    cancellations: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'volunteers_only' | 'private';
    show_real_name: boolean;
    show_contact_info: boolean;
  };
}

export interface UserPermission {
  id: string;
  name: string;
  description: string;
  category: string;
  resource: string;
  action: string; // create, read, update, delete, manage
}

export interface RolePermissions {
  role: UserRole;
  permissions: string[]; // Permission IDs
  inherits_from?: UserRole;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'login' | 'logout' | 'profile_update' | 'volunteer_signup' | 'event_attendance' | 'message_sent' | 'content_created';
  description: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Volunteer Management Types

export interface Volunteer extends User {
  volunteer_id: string;
  volunteer_status: VolunteerStatus;
  
  // Application Information
  application: VolunteerApplication;
  
  // Skills and Interests
  skills: VolunteerSkill[];
  interests: string[];
  languages: string[];
  
  // Availability
  availability: VolunteerAvailability;
  
  // Experience and Background
  experience_level: 'none' | 'some' | 'experienced' | 'expert';
  previous_volunteer_experience: string;
  animal_experience: string;
  special_qualifications: string[];
  
  // Emergency Contact
  emergency_contact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  
  // Volunteer Specific
  volunteer_since?: string;
  total_hours: number;
  events_attended: number;
  preferred_roles: string[];
  coordinator_notes?: string;
  
  // Background Check
  background_check?: BackgroundCheck;
  
  // Training
  training_records: TrainingRecord[];
  certifications: Certification[];
}

export interface VolunteerApplication {
  id: string;
  user_id: string;
  
  // Application Questions
  motivation: string;
  availability_description: string;
  experience_description: string;
  special_skills: string;
  physical_limitations?: string;
  allergies?: string;
  
  // References
  references: Reference[];
  
  // Agreements
  agreements: {
    code_of_conduct: boolean;
    liability_waiver: boolean;
    media_release: boolean;
    background_check_consent: boolean;
  };
  
  // Application Status
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'withdrawn';
  submitted_at?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  review_notes?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Reference {
  id: string;
  name: string;
  relationship: string;
  email: string;
  phone: string;
  contacted: boolean;
  contacted_at?: string;
  response?: string;
  recommendation: 'positive' | 'neutral' | 'negative' | 'pending';
}

export interface VolunteerSkill {
  id: string;
  name: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  verified: boolean;
  verified_by?: string;
  verified_at?: string;
  description?: string;
}

export interface VolunteerAvailability {
  id: string;
  user_id: string;
  
  // Regular Availability
  weekly_schedule: WeeklySchedule;
  
  // Seasonal Availability
  seasonal_preferences: {
    spring: boolean;
    summer: boolean;
    fall: boolean;
    winter: boolean;
  };
  
  // Specific Dates
  unavailable_dates: string[]; // ISO date strings
  available_dates: string[]; // Special availability dates
  
  // Preferences
  max_hours_per_week: number;
  max_consecutive_hours: number;
  preferred_notice_period: number; // days
  travel_distance_miles: number;
  
  updated_at: string;
}

export interface WeeklySchedule {
  monday: TimeSlot[];
  tuesday: TimeSlot[];
  wednesday: TimeSlot[];
  thursday: TimeSlot[];
  friday: TimeSlot[];
  saturday: TimeSlot[];
  sunday: TimeSlot[];
}

export interface TimeSlot {
  start_time: string; // HH:MM format
  end_time: string;   // HH:MM format
  flexible: boolean;
}

export interface BackgroundCheck {
  id: string;
  user_id: string;
  provider: string;
  reference_number: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result: 'clear' | 'flag' | 'fail' | 'pending';
  completed_at?: string;
  expires_at?: string;
  notes?: string;
  documents: string[]; // File URLs
}

export interface TrainingRecord {
  id: string;
  user_id: string;
  training_name: string;
  training_type: 'orientation' | 'animal_handling' | 'safety' | 'specialized' | 'continuing_education';
  provider: string;
  completed_at: string;
  expires_at?: string;
  certificate_url?: string;
  notes?: string;
}

export interface Certification {
  id: string;
  user_id: string;
  certification_name: string;
  issuing_organization: string;
  issued_at: string;
  expires_at?: string;
  certificate_number?: string;
  certificate_url?: string;
  verified: boolean;
}

// Event and Scheduling Types

export interface VolunteerEvent {
  id: string;
  title: string;
  description: string;
  event_type: 'daily_care' | 'special_event' | 'maintenance' | 'fundraiser' | 'education' | 'transport' | 'emergency';
  
  // Scheduling
  start_date: string;
  end_date: string;
  recurrence?: EventRecurrence;
  
  // Location
  location: {
    name: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Volunteer Requirements
  volunteer_requirements: {
    min_volunteers: number;
    max_volunteers: number;
    required_skills: string[];
    preferred_skills: string[];
    experience_level: 'any' | 'some' | 'experienced';
    age_requirement?: number;
    background_check_required: boolean;
  };
  
  // Event Details
  coordinator: string; // User ID
  instructions: string;
  equipment_provided: string[];
  equipment_to_bring: string[];
  
  // Status
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  published_at?: string;
  registration_deadline?: string;
  
  // Volunteers
  assigned_volunteers: VolunteerAssignment[];
  waitlist: string[]; // User IDs
  
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface EventRecurrence {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number; // Every X days/weeks/months
  days_of_week?: number[]; // 0-6, Sunday-Saturday
  end_date?: string;
  max_occurrences?: number;
}

export interface VolunteerAssignment {
  id: string;
  event_id: string;
  user_id: string;
  
  // Assignment Details
  role: string;
  shift_start?: string; // If different from event start
  shift_end?: string;   // If different from event end
  
  // Status
  status: 'assigned' | 'confirmed' | 'declined' | 'no_show' | 'completed';
  assigned_at: string;
  confirmed_at?: string;
  completed_at?: string;
  
  // Notes
  notes?: string;
  hours_worked?: number;
  performance_rating?: number; // 1-5
  feedback?: string;
}

// Communication Types

export interface Message {
  id: string;
  sender_id: string;
  recipient_ids: string[];
  
  // Message Content
  subject: string;
  body: string;
  message_type: 'direct' | 'announcement' | 'reminder' | 'alert';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Delivery
  sent_at: string;
  delivery_method: 'email' | 'sms' | 'in_app' | 'push';
  read_by: Record<string, string>; // user_id -> read_at timestamp
  
  // Metadata
  tags: string[];
  attachments: string[]; // File URLs
  
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  
  // Targeting
  target_audience: {
    roles: UserRole[];
    volunteer_status?: VolunteerStatus[];
    skills?: string[];
    custom_filter?: string;
  };
  
  // Scheduling
  publish_at: string;
  expires_at?: string;
  
  // Delivery
  delivery_methods: ('email' | 'sms' | 'in_app' | 'push')[];
  
  // Engagement
  views: number;
  clicks: number;
  responses: AnnouncementResponse[];
  
  // Status
  status: 'draft' | 'scheduled' | 'published' | 'expired';
  
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AnnouncementResponse {
  id: string;
  announcement_id: string;
  user_id: string;
  response_type: 'rsvp_yes' | 'rsvp_no' | 'interested' | 'comment';
  response_text?: string;
  created_at: string;
}

// Analytics Types

export interface VolunteerAnalytics {
  period: string; // Date range
  
  // Volunteer Metrics
  total_volunteers: number;
  active_volunteers: number;
  new_volunteers: number;
  retained_volunteers: number;
  
  // Engagement Metrics
  total_hours: number;
  average_hours_per_volunteer: number;
  events_attended: number;
  attendance_rate: number;
  
  // Application Metrics
  applications_received: number;
  applications_approved: number;
  approval_rate: number;
  time_to_approval: number; // days
  
  // Retention Metrics
  retention_rate_30d: number;
  retention_rate_90d: number;
  retention_rate_1y: number;
  churn_rate: number;
  
  // Skills and Training
  most_needed_skills: SkillDemand[];
  training_completion_rate: number;
  certification_expiring_soon: number;
  
  // Events
  events_created: number;
  events_completed: number;
  volunteer_shortage_events: number;
  overstaffed_events: number;
  
  // Communication
  messages_sent: number;
  message_open_rate: number;
  announcement_engagement_rate: number;
}

export interface SkillDemand {
  skill_name: string;
  demand_score: number; // 0-100
  volunteers_with_skill: number;
  events_requiring_skill: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// Component Props Interfaces

export interface UserManagementProps {
  users: User[];
  onUserCreate?: (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => void;
  onUserUpdate?: (userId: string, updates: Partial<User>) => void;
  onUserDelete?: (userId: string) => void;
  onBulkAction?: (action: string, userIds: string[]) => void;
  currentUser: User;
}

export interface VolunteerApplicationsProps {
  applications: VolunteerApplication[];
  onApplicationReview?: (applicationId: string, decision: 'approved' | 'rejected', notes?: string) => void;
  onApplicationUpdate?: (applicationId: string, updates: Partial<VolunteerApplication>) => void;
  currentUser: User;
}

export interface VolunteerSchedulingProps {
  events: VolunteerEvent[];
  volunteers: Volunteer[];
  onEventCreate?: (event: Omit<VolunteerEvent, 'id' | 'created_at' | 'updated_at'>) => void;
  onEventUpdate?: (eventId: string, updates: Partial<VolunteerEvent>) => void;
  onVolunteerAssign?: (eventId: string, volunteerId: string, assignment: Partial<VolunteerAssignment>) => void;
  currentUser: User;
}