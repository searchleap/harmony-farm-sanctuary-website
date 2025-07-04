import React, { useState, useMemo } from 'react';
import { 
  User, 
  Award, 
  Clock, 
  Calendar, 
  Star, 
  MapPin,
  Phone,
  Mail,
  Shield,
  BookOpen,
  TrendingUp,
  Edit,
  Filter,
  Search,
  Download,
  Plus,
  CheckCircle,
  AlertTriangle,
  Users
} from 'lucide-react';
import { Volunteer, VolunteerSkill, TrainingRecord, Certification, BackgroundCheck } from '../../../types/user';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';

interface VolunteerProfilesProps {
  volunteers: Volunteer[];
  onVolunteerUpdate?: (volunteerId: string, updates: Partial<Volunteer>) => void;
  onSkillAdd?: (volunteerId: string, skill: Omit<VolunteerSkill, 'id'>) => void;
  onTrainingAdd?: (volunteerId: string, training: Omit<TrainingRecord, 'id'>) => void;
  onCertificationAdd?: (volunteerId: string, certification: Omit<Certification, 'id'>) => void;
  onExportProfiles?: () => void;
  currentUser: any;
}

export const VolunteerProfiles: React.FC<VolunteerProfilesProps> = ({
  volunteers,
  onVolunteerUpdate,
  onSkillAdd,
  onTrainingAdd,
  onCertificationAdd,
  onExportProfiles,
  currentUser
}) => {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'training' | 'availability' | 'history'>('overview');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [filterSkill, setFilterSkill] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showTrainingForm, setShowTrainingForm] = useState(false);

  // Skill and training form state
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: '',
    level: 'beginner' as const,
    description: ''
  });

  const [trainingForm, setTrainingForm] = useState({
    training_name: '',
    training_type: 'orientation' as const,
    provider: '',
    completed_at: '',
    certificate_url: ''
  });

  // Mock volunteer data for demonstration
  const mockVolunteers: Volunteer[] = [
    {
      id: 'vol-1',
      volunteer_id: 'HFS-001',
      email: 'sarah.wilson@email.com',
      first_name: 'Sarah',
      last_name: 'Wilson',
      phone: '(555) 123-4567',
      role: 'volunteer',
      status: 'active',
      volunteer_status: 'active',
      email_verified: true,
      phone_verified: true,
      preferences: {
        language: 'en',
        timezone: 'America/Los_Angeles',
        email_notifications: {
          system_updates: true,
          volunteer_opportunities: true,
          event_reminders: true,
          newsletter: true,
          messages: true
        },
        sms_notifications: {
          urgent_alerts: true,
          shift_reminders: true,
          cancellations: true
        },
        privacy: {
          profile_visibility: 'volunteers_only',
          show_real_name: true,
          show_contact_info: false
        }
      },
      failed_login_attempts: 0,
      created_at: '2023-08-15T10:00:00Z',
      updated_at: '2024-01-15T08:30:00Z',
      application: {
        id: 'app-1',
        user_id: 'vol-1',
        motivation: 'Passionate about animal welfare',
        availability_description: 'Weekends and evenings',
        experience_description: 'Farm background, 2 years at animal shelter',
        special_skills: 'Large animal experience, first aid',
        references: [],
        agreements: {
          code_of_conduct: true,
          liability_waiver: true,
          media_release: true,
          background_check_consent: true
        },
        status: 'approved',
        created_at: '2023-08-15T10:00:00Z',
        updated_at: '2023-08-15T10:00:00Z'
      },
      skills: [
        {
          id: 'skill-1',
          name: 'Large Animal Handling',
          category: 'Animal Care',
          level: 'advanced',
          verified: true,
          verified_by: 'coordinator-1',
          verified_at: '2023-09-01T10:00:00Z',
          description: 'Experience with horses, cattle, and farm animals'
        },
        {
          id: 'skill-2',
          name: 'Veterinary First Aid',
          category: 'Medical',
          level: 'intermediate',
          verified: true,
          verified_by: 'vet-1',
          verified_at: '2023-08-20T10:00:00Z'
        }
      ],
      interests: ['animal welfare', 'education', 'fundraising'],
      languages: ['English', 'Spanish'],
      availability: {
        id: 'avail-1',
        user_id: 'vol-1',
        weekly_schedule: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [{ start_time: '09:00', end_time: '17:00', flexible: false }],
          sunday: [{ start_time: '09:00', end_time: '15:00', flexible: true }]
        },
        seasonal_preferences: {
          spring: true,
          summer: true,
          fall: true,
          winter: false
        },
        unavailable_dates: ['2024-01-25', '2024-02-15'],
        available_dates: [],
        max_hours_per_week: 12,
        max_consecutive_hours: 6,
        preferred_notice_period: 7,
        travel_distance_miles: 25,
        updated_at: '2024-01-01T00:00:00Z'
      },
      experience_level: 'experienced',
      previous_volunteer_experience: 'Animal shelter volunteer for 2 years',
      animal_experience: 'Grew up on farm with various animals',
      special_qualifications: ['First Aid Certified', 'Bilingual'],
      emergency_contact: {
        name: 'John Wilson',
        relationship: 'Spouse',
        phone: '(555) 123-4568',
        email: 'john.wilson@email.com'
      },
      volunteer_since: '2023-08-15T10:00:00Z',
      total_hours: 156,
      events_attended: 23,
      preferred_roles: ['Animal Care', 'Education'],
      coordinator_notes: 'Excellent volunteer, very reliable and skilled with large animals',
      background_check: {
        id: 'bg-1',
        user_id: 'vol-1',
        provider: 'SecureCheck Inc',
        reference_number: 'SC-2023-1001',
        status: 'completed',
        result: 'clear',
        completed_at: '2023-08-20T10:00:00Z',
        expires_at: '2024-08-20T10:00:00Z',
        documents: []
      },
      training_records: [
        {
          id: 'train-1',
          user_id: 'vol-1',
          training_name: 'Volunteer Orientation',
          training_type: 'orientation',
          provider: 'Harmony Farm Sanctuary',
          completed_at: '2023-08-20T10:00:00Z',
          certificate_url: '/certificates/vol-1-orientation.pdf'
        },
        {
          id: 'train-2',
          user_id: 'vol-1',
          training_name: 'Animal Safety & Handling',
          training_type: 'animal_handling',
          provider: 'Harmony Farm Sanctuary',
          completed_at: '2023-09-05T10:00:00Z',
          expires_at: '2024-09-05T10:00:00Z',
          certificate_url: '/certificates/vol-1-safety.pdf'
        }
      ],
      certifications: [
        {
          id: 'cert-1',
          user_id: 'vol-1',
          certification_name: 'Pet First Aid & CPR',
          issuing_organization: 'American Red Cross',
          issued_at: '2023-07-15T10:00:00Z',
          expires_at: '2025-07-15T10:00:00Z',
          certificate_number: 'ARC-PFA-2023-001',
          verified: true
        }
      ]
    }
  ];

  const allVolunteers = volunteers.length > 0 ? volunteers : mockVolunteers;

  // Get unique skills for filtering
  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    allVolunteers.forEach(volunteer => {
      volunteer.skills.forEach(skill => skills.add(skill.category));
    });
    return Array.from(skills);
  }, [allVolunteers]);

  // Filter volunteers
  const filteredVolunteers = useMemo(() => {
    let filtered = allVolunteers;

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(volunteer => {
        switch (filterStatus) {
          case 'active': return volunteer.volunteer_status === 'active';
          case 'inactive': return volunteer.volunteer_status === 'inactive';
          case 'pending': return volunteer.volunteer_status === 'pending_review';
          default: return true;
        }
      });
    }

    // Apply skill filter
    if (filterSkill !== 'all') {
      filtered = filtered.filter(volunteer => 
        volunteer.skills.some(skill => skill.category === filterSkill)
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(volunteer => 
        volunteer.first_name.toLowerCase().includes(query) ||
        volunteer.last_name.toLowerCase().includes(query) ||
        volunteer.volunteer_id.toLowerCase().includes(query) ||
        volunteer.skills.some(skill => skill.name.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [allVolunteers, filterStatus, filterSkill, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allVolunteers.length;
    const active = allVolunteers.filter(v => v.volunteer_status === 'active').length;
    const totalHours = allVolunteers.reduce((sum, v) => sum + v.total_hours, 0);
    const avgHours = total > 0 ? totalHours / total : 0;
    const expiringSoon = allVolunteers.filter(v => {
      const hasExpiringCerts = v.certifications.some(cert => {
        if (!cert.expires_at) return false;
        const daysUntilExpiry = (new Date(cert.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      });
      const hasExpiringTraining = v.training_records.some(training => {
        if (!training.expires_at) return false;
        const daysUntilExpiry = (new Date(training.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
        return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
      });
      return hasExpiringCerts || hasExpiringTraining;
    }).length;

    return { total, active, totalHours, avgHours, expiringSoon };
  }, [allVolunteers]);

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSkillSubmit = () => {
    if (selectedVolunteer && skillForm.name && skillForm.category) {
      onSkillAdd?.(selectedVolunteer.id, skillForm);
      setShowSkillForm(false);
      setSkillForm({ name: '', category: '', level: 'beginner', description: '' });
    }
  };

  const handleTrainingSubmit = () => {
    if (selectedVolunteer && trainingForm.training_name && trainingForm.provider) {
      onTrainingAdd?.(selectedVolunteer.id, {
        ...trainingForm,
        user_id: selectedVolunteer.id
      });
      setShowTrainingForm(false);
      setTrainingForm({
        training_name: '',
        training_type: 'orientation',
        provider: '',
        completed_at: '',
        certificate_url: ''
      });
    }
  };

  const renderVolunteerOverview = (volunteer: Volunteer) => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">
                {volunteer.first_name} {volunteer.last_name}
              </h4>
              <p className="text-gray-600">Volunteer ID: {volunteer.volunteer_id}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Mail className="w-3 h-3" />
                  <span>{volunteer.email}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="w-3 h-3" />
                  <span>{volunteer.phone}</span>
                </div>
              </div>
            </div>
          </div>
          
          <AdminButton
            variant="outline"
            size="sm"
            icon={Edit}
          >
            Edit Profile
          </AdminButton>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{volunteer.total_hours}</div>
          <div className="text-sm text-gray-600">Total Hours</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{volunteer.events_attended}</div>
          <div className="text-sm text-gray-600">Events</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">{volunteer.skills.length}</div>
          <div className="text-sm text-gray-600">Skills</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-orange-600">{volunteer.training_records.length}</div>
          <div className="text-sm text-gray-600">Training</div>
        </div>
      </div>

      {/* Experience & Background */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h5 className="font-semibold text-gray-900 mb-3">Experience</h5>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Level</label>
              <p className="text-sm text-gray-900 capitalize">{volunteer.experience_level}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Previous Volunteer Experience</label>
              <p className="text-sm text-gray-900">{volunteer.previous_volunteer_experience}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Animal Experience</label>
              <p className="text-sm text-gray-900">{volunteer.animal_experience}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h5 className="font-semibold text-gray-900 mb-3">Background Check</h5>
          {volunteer.background_check ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700 capitalize">
                  {volunteer.background_check.result}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Completed: {new Date(volunteer.background_check.completed_at!).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Expires: {new Date(volunteer.background_check.expires_at!).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">Not completed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderVolunteerSkills = (volunteer: Volunteer) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Skills & Qualifications</h4>
        <AdminButton
          variant="primary"
          size="sm"
          onClick={() => setShowSkillForm(true)}
          icon={Plus}
        >
          Add Skill
        </AdminButton>
      </div>

      {/* Skills */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h5 className="font-semibold text-gray-900 mb-4">Verified Skills</h5>
        <div className="grid grid-cols-2 gap-4">
          {volunteer.skills.map(skill => (
            <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h6 className="font-medium text-gray-900">{skill.name}</h6>
                  <p className="text-sm text-gray-600">{skill.category}</p>
                  {skill.description && (
                    <p className="text-sm text-gray-500 mt-1">{skill.description}</p>
                  )}
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSkillLevelColor(skill.level)}`}>
                  {skill.level}
                </span>
              </div>
              
              {skill.verified && (
                <div className="flex items-center space-x-1 mt-2 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  <span>Verified by {skill.verified_by}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h5 className="font-semibold text-gray-900 mb-4">Certifications</h5>
        <div className="space-y-3">
          {volunteer.certifications.map(cert => (
            <div key={cert.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div>
                <h6 className="font-medium text-gray-900">{cert.certification_name}</h6>
                <p className="text-sm text-gray-600">{cert.issuing_organization}</p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                  <span>Issued: {new Date(cert.issued_at).toLocaleDateString()}</span>
                  {cert.expires_at && (
                    <span>Expires: {new Date(cert.expires_at).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {cert.verified && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                <Award className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Volunteer Profiles</h3>
              <p className="text-sm text-gray-600">
                Manage volunteer information, skills, and training
              </p>
            </div>
          </div>
          
          <AdminButton
            variant="outline"
            size="sm"
            onClick={onExportProfiles}
            icon={Download}
          >
            Export
          </AdminButton>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">{stats.total}</div>
            <div className="text-xs text-purple-600">Total Volunteers</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">{stats.active}</div>
            <div className="text-xs text-green-600">Active</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-700">{stats.totalHours.toLocaleString()}</div>
            <div className="text-xs text-blue-600">Total Hours</div>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <div className="text-lg font-bold text-indigo-700">{Math.round(stats.avgHours)}</div>
            <div className="text-xs text-indigo-600">Avg Hours</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-700">{stats.expiringSoon}</div>
            <div className="text-xs text-orange-600">Expiring Soon</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search volunteers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          
          <select
            value={filterSkill}
            onChange={(e) => setFilterSkill(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volunteer List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Volunteers ({filteredVolunteers.length})</h4>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {filteredVolunteers.map(volunteer => (
                <div
                  key={volunteer.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedVolunteer?.id === volunteer.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedVolunteer(volunteer)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {volunteer.first_name[0]}{volunteer.last_name[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        {volunteer.first_name} {volunteer.last_name}
                      </h5>
                      <p className="text-sm text-gray-600">{volunteer.volunteer_id}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{volunteer.total_hours}h</span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">{volunteer.skills.length} skills</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Volunteer Details */}
        <div className="lg:col-span-2">
          {selectedVolunteer ? (
            <div>
              {/* Tab Navigation */}
              <div className="bg-white rounded-t-lg border border-gray-200 border-b-0">
                <div className="flex space-x-1 p-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: User },
                    { id: 'skills', label: 'Skills', icon: Award },
                    { id: 'training', label: 'Training', icon: BookOpen },
                    { id: 'availability', label: 'Availability', icon: Calendar },
                    { id: 'history', label: 'History', icon: Clock }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                        activeTab === tab.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-b-lg border border-gray-200 p-6">
                {activeTab === 'overview' && renderVolunteerOverview(selectedVolunteer)}
                {activeTab === 'skills' && renderVolunteerSkills(selectedVolunteer)}
                {activeTab === 'training' && (
                  <div>Training content for {selectedVolunteer.first_name}</div>
                )}
                {activeTab === 'availability' && (
                  <div>Availability content for {selectedVolunteer.first_name}</div>
                )}
                {activeTab === 'history' && (
                  <div>History content for {selectedVolunteer.first_name}</div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Select a volunteer to view their profile</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Skill Modal */}
      {showSkillForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Skill</h3>
            
            <div className="space-y-4">
              <AdminFormField
                label="Skill Name"
                type="text"
                value={skillForm.name}
                onChange={(e) => setSkillForm(prev => ({ ...prev, name: e.target.value }))}
                required
              />
              
              <AdminFormField
                label="Category"
                type="text"
                value={skillForm.category}
                onChange={(e) => setSkillForm(prev => ({ ...prev, category: e.target.value }))}
                required
              />
              
              <AdminFormField
                label="Level"
                type="select"
                value={skillForm.level}
                onChange={(e) => setSkillForm(prev => ({ ...prev, level: e.target.value as any }))}
                options={[
                  { value: 'beginner', label: 'Beginner' },
                  { value: 'intermediate', label: 'Intermediate' },
                  { value: 'advanced', label: 'Advanced' },
                  { value: 'expert', label: 'Expert' }
                ]}
                required
              />
              
              <AdminFormField
                label="Description"
                type="textarea"
                value={skillForm.description}
                onChange={(e) => setSkillForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <AdminButton
                variant="outline"
                onClick={() => setShowSkillForm(false)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={handleSkillSubmit}
                disabled={!skillForm.name || !skillForm.category}
              >
                Add Skill
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};