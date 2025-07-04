import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare,
  User,
  Mail,
  Phone,
  Calendar,
  Star,
  AlertTriangle,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { VolunteerApplication, Reference, User as UserType } from '../../../types/user';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';

interface VolunteerApplicationsProps {
  applications: VolunteerApplication[];
  onApplicationReview?: (applicationId: string, decision: 'approved' | 'rejected', notes?: string) => void;
  onApplicationUpdate?: (applicationId: string, updates: Partial<VolunteerApplication>) => void;
  onExportApplications?: () => void;
  currentUser: UserType;
}

export const VolunteerApplications: React.FC<VolunteerApplicationsProps> = ({
  applications,
  onApplicationReview,
  onApplicationUpdate,
  onExportApplications,
  currentUser
}) => {
  const [selectedApplication, setSelectedApplication] = useState<VolunteerApplication | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<'approved' | 'rejected'>('approved');
  const [reviewNotes, setReviewNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'submitted' | 'under_review' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'submitted_at' | 'status' | 'name'>('submitted_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data for demonstration
  const mockApplications: VolunteerApplication[] = [
    {
      id: 'app-1',
      user_id: 'user-3',
      motivation: 'I have always been passionate about animal welfare and would love to contribute to your sanctuary\'s mission. Having grown up on a farm, I understand the dedication required to care for animals.',
      availability_description: 'Available weekends and most weekday evenings. Can commit to 8-10 hours per week.',
      experience_description: 'Grew up on a family farm with horses, cattle, and chickens. Volunteered at local animal shelter for 2 years.',
      special_skills: 'Experience with large animals, basic veterinary first aid certification, Spanish fluency',
      physical_limitations: 'None',
      allergies: 'Mild hay fever (manageable with medication)',
      references: [
        {
          id: 'ref-1',
          name: 'Dr. Lisa Martinez',
          relationship: 'Veterinarian (former supervisor)',
          email: 'lisa.martinez@animalclinic.com',
          phone: '(555) 987-6543',
          contacted: true,
          contacted_at: '2024-01-10T10:00:00Z',
          response: 'Excellent volunteer, very reliable and compassionate with animals. Highly recommend.',
          recommendation: 'positive'
        },
        {
          id: 'ref-2',
          name: 'John Smith',
          relationship: 'Animal Shelter Manager',
          email: 'john.smith@shelter.org',
          phone: '(555) 876-5432',
          contacted: false,
          recommendation: 'pending'
        }
      ],
      agreements: {
        code_of_conduct: true,
        liability_waiver: true,
        media_release: true,
        background_check_consent: true
      },
      status: 'submitted',
      submitted_at: '2024-01-08T14:30:00Z',
      created_at: '2024-01-08T14:30:00Z',
      updated_at: '2024-01-08T14:30:00Z'
    },
    {
      id: 'app-2',
      user_id: 'user-4',
      motivation: 'After retiring, I want to give back to the community and spend time with animals. I believe in your mission to provide sanctuary for rescued animals.',
      availability_description: 'Very flexible schedule. Can volunteer 15-20 hours per week, any day.',
      experience_description: 'Pet owner for 30+ years. Some experience helping neighbors with their animals.',
      special_skills: 'Carpentry and handyman skills, reliable transportation',
      references: [
        {
          id: 'ref-3',
          name: 'Mary Johnson',
          relationship: 'Neighbor',
          email: 'mary.j@email.com',
          phone: '(555) 765-4321',
          contacted: false,
          recommendation: 'pending'
        }
      ],
      agreements: {
        code_of_conduct: true,
        liability_waiver: true,
        media_release: false,
        background_check_consent: true
      },
      status: 'under_review',
      submitted_at: '2024-01-12T09:15:00Z',
      reviewed_by: 'user-1',
      created_at: '2024-01-12T09:15:00Z',
      updated_at: '2024-01-13T16:20:00Z'
    }
  ];

  const allApplications = applications.length > 0 ? applications : mockApplications;

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    let filtered = allApplications;

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app => 
        app.motivation.toLowerCase().includes(query) ||
        app.special_skills.toLowerCase().includes(query) ||
        app.user_id.toLowerCase().includes(query)
      );
    }

    // Sort applications
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'submitted_at':
          comparison = new Date(b.submitted_at || b.created_at).getTime() - new Date(a.submitted_at || a.created_at).getTime();
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'name':
          comparison = a.user_id.localeCompare(b.user_id);
          break;
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }, [allApplications, filterStatus, searchQuery, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allApplications.length;
    const submitted = allApplications.filter(a => a.status === 'submitted').length;
    const underReview = allApplications.filter(a => a.status === 'under_review').length;
    const approved = allApplications.filter(a => a.status === 'approved').length;
    const rejected = allApplications.filter(a => a.status === 'rejected').length;
    
    return { total, submitted, underReview, approved, rejected };
  }, [allApplications]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />;
      case 'under_review': return <Eye className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getReferenceRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'positive': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'neutral': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'negative': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleReviewSubmit = () => {
    if (selectedApplication) {
      onApplicationReview?.(selectedApplication.id, reviewDecision, reviewNotes);
      setShowReviewModal(false);
      setSelectedApplication(null);
      setReviewNotes('');
    }
  };

  const handleStatusChange = (applicationId: string, newStatus: any) => {
    onApplicationUpdate?.(applicationId, { 
      status: newStatus,
      reviewed_by: currentUser.id,
      reviewed_at: new Date().toISOString()
    });
  };

  const renderApplicationDetail = (application: VolunteerApplication) => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Application Details</h4>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Motivation</label>
            <p className="mt-1 text-sm text-gray-900">{application.motivation}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Availability</label>
            <p className="mt-1 text-sm text-gray-900">{application.availability_description}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Experience</label>
            <p className="mt-1 text-sm text-gray-900">{application.experience_description}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700">Special Skills</label>
            <p className="mt-1 text-sm text-gray-900">{application.special_skills}</p>
          </div>
          
          {application.physical_limitations && (
            <div>
              <label className="text-sm font-medium text-gray-700">Physical Limitations</label>
              <p className="mt-1 text-sm text-gray-900">{application.physical_limitations}</p>
            </div>
          )}
          
          {application.allergies && (
            <div>
              <label className="text-sm font-medium text-gray-700">Allergies</label>
              <p className="mt-1 text-sm text-gray-900">{application.allergies}</p>
            </div>
          )}
        </div>
      </div>

      {/* References */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">References</h4>
        
        <div className="space-y-4">
          {application.references.map(reference => (
            <div key={reference.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-medium text-gray-900">{reference.name}</h5>
                    {getReferenceRecommendationIcon(reference.recommendation)}
                  </div>
                  <p className="text-sm text-gray-600">{reference.relationship}</p>
                  
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      <span>{reference.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      <span>{reference.phone}</span>
                    </div>
                  </div>
                  
                  {reference.response && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">{reference.response}</p>
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  {reference.contacted ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      Contacted
                    </span>
                  ) : (
                    <AdminButton
                      variant="outline"
                      size="xs"
                    >
                      Contact
                    </AdminButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agreements */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Agreements & Consent</h4>
        
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(application.agreements).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-2">
              {value ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm text-gray-700 capitalize">
                {key.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Actions */}
      {application.status === 'submitted' || application.status === 'under_review' ? (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Review Application</h4>
          
          <div className="flex space-x-3">
            <AdminButton
              variant="primary"
              onClick={() => {
                setSelectedApplication(application);
                setReviewDecision('approved');
                setShowReviewModal(true);
              }}
            >
              Approve
            </AdminButton>
            <AdminButton
              variant="secondary"
              onClick={() => {
                setSelectedApplication(application);
                setReviewDecision('rejected');
                setShowReviewModal(true);
              }}
            >
              Reject
            </AdminButton>
            <AdminButton
              variant="outline"
              onClick={() => handleStatusChange(application.id, 'under_review')}
            >
              Mark Under Review
            </AdminButton>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            {getStatusIcon(application.status)}
            <span className="text-lg font-medium text-gray-900 capitalize">
              {application.status.replace('_', ' ')}
            </span>
          </div>
          {application.reviewed_by && application.reviewed_at && (
            <p className="text-sm text-gray-600 mt-2">
              Reviewed by {application.reviewed_by} on {new Date(application.reviewed_at).toLocaleDateString()}
            </p>
          )}
          {application.review_notes && (
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Review Notes
              </label>
              <p className="text-sm text-gray-700 mt-1">{application.review_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Volunteer Applications</h3>
              <p className="text-sm text-gray-600">
                Review and manage volunteer applications
              </p>
            </div>
          </div>
          
          <AdminButton
            variant="outline"
            size="sm"
            onClick={onExportApplications}
            icon={Download}
          >
            Export
          </AdminButton>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-700">{stats.submitted}</div>
            <div className="text-xs text-blue-600">Submitted</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-700">{stats.underReview}</div>
            <div className="text-xs text-yellow-600">Under Review</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">{stats.approved}</div>
            <div className="text-xs text-green-600">Approved</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-lg font-bold text-red-700">{stats.rejected}</div>
            <div className="text-xs text-red-600">Rejected</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search applications..."
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
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as any);
              setSortOrder(order as any);
            }}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="submitted_at-desc">Newest First</option>
            <option value="submitted_at-asc">Oldest First</option>
            <option value="status-asc">Status</option>
            <option value="name-asc">Applicant Name</option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Applications ({filteredApplications.length})</h4>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {filteredApplications.map(application => (
                <div
                  key={application.id}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedApplication?.id === application.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(application.status)}
                      <span className="font-medium text-gray-900">
                        Applicant {application.user_id.slice(-3)}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {application.motivation.substring(0, 100)}...
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(application.submitted_at || application.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>{application.references.length} refs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedApplication ? (
            renderApplicationDetail(selectedApplication)
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">Select an application to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {reviewDecision === 'approved' ? 'Approve' : 'Reject'} Application
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              You are about to {reviewDecision === 'approved' ? 'approve' : 'reject'} this volunteer application.
              Please provide any notes for the applicant and your team.
            </p>
            
            <AdminFormField
              label="Review Notes"
              type="textarea"
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Add notes about your decision..."
              rows={4}
            />
            
            <div className="flex space-x-3 mt-6">
              <AdminButton
                variant="outline"
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedApplication(null);
                  setReviewNotes('');
                }}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant={reviewDecision === 'approved' ? 'primary' : 'secondary'}
                onClick={handleReviewSubmit}
              >
                {reviewDecision === 'approved' ? 'Approve' : 'Reject'} Application
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};