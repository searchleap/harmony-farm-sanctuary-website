import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Filter,
  Search,
  Download,
  UserPlus,
  UserMinus,
  Send
} from 'lucide-react';
import { VolunteerEvent, VolunteerAssignment, Volunteer } from '../../../types/user';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';

interface VolunteerSchedulingProps {
  events: VolunteerEvent[];
  volunteers: Volunteer[];
  onEventCreate?: (event: Omit<VolunteerEvent, 'id' | 'created_at' | 'updated_at'>) => void;
  onEventUpdate?: (eventId: string, updates: Partial<VolunteerEvent>) => void;
  onEventDelete?: (eventId: string) => void;
  onVolunteerAssign?: (eventId: string, volunteerId: string) => void;
  onVolunteerUnassign?: (eventId: string, volunteerId: string) => void;
  onSendReminders?: (eventId: string) => void;
  currentUser: any;
}

export const VolunteerScheduling: React.FC<VolunteerSchedulingProps> = ({
  events,
  volunteers,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  onVolunteerAssign,
  onVolunteerUnassign,
  onSendReminders,
  currentUser
}) => {
  const [selectedEvent, setSelectedEvent] = useState<VolunteerEvent | null>(null);
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'assignments'>('list');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<VolunteerEvent | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'daily_care' | 'special_event' | 'maintenance'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Event form state
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_type: 'daily_care' as const,
    start_date: '',
    end_date: '',
    location: {
      name: '',
      address: ''
    },
    volunteer_requirements: {
      min_volunteers: 1,
      max_volunteers: 5,
      required_skills: [] as string[],
      preferred_skills: [] as string[],
      experience_level: 'any' as const,
      background_check_required: false
    },
    instructions: '',
    equipment_provided: [] as string[],
    equipment_to_bring: [] as string[]
  });

  // Mock events data for demonstration
  const mockEvents: VolunteerEvent[] = [
    {
      id: 'event-1',
      title: 'Morning Animal Care',
      description: 'Daily feeding and health checks for farm animals',
      event_type: 'daily_care',
      start_date: '2024-01-20T08:00:00Z',
      end_date: '2024-01-20T12:00:00Z',
      location: {
        name: 'Main Barn',
        address: '123 Farm Road, Sanctuary Valley'
      },
      volunteer_requirements: {
        min_volunteers: 2,
        max_volunteers: 4,
        required_skills: ['Animal Handling'],
        preferred_skills: ['Large Animal Care'],
        experience_level: 'some',
        background_check_required: true
      },
      coordinator: 'coord-1',
      instructions: 'Please arrive 15 minutes early for briefing. Wear closed-toe shoes and work clothes.',
      equipment_provided: ['Gloves', 'Feed buckets', 'First aid kit'],
      equipment_to_bring: ['Water bottle', 'Hat', 'Sunscreen'],
      status: 'published',
      published_at: '2024-01-15T10:00:00Z',
      assigned_volunteers: [
        {
          id: 'assign-1',
          event_id: 'event-1',
          user_id: 'vol-1',
          role: 'Lead Volunteer',
          status: 'confirmed',
          assigned_at: '2024-01-16T10:00:00Z',
          confirmed_at: '2024-01-16T15:00:00Z'
        },
        {
          id: 'assign-2',
          event_id: 'event-1',
          user_id: 'vol-2',
          role: 'Assistant',
          status: 'assigned',
          assigned_at: '2024-01-17T09:00:00Z'
        }
      ],
      waitlist: ['vol-3'],
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-17T09:00:00Z',
      created_by: 'coord-1'
    },
    {
      id: 'event-2',
      title: 'Educational Tour Assistance',
      description: 'Help guide visitors through educational tour of the sanctuary',
      event_type: 'education',
      start_date: '2024-01-22T14:00:00Z',
      end_date: '2024-01-22T16:00:00Z',
      location: {
        name: 'Visitor Center',
        address: '123 Farm Road, Sanctuary Valley'
      },
      volunteer_requirements: {
        min_volunteers: 1,
        max_volunteers: 2,
        required_skills: ['Public Speaking'],
        preferred_skills: ['Education', 'Animal Knowledge'],
        experience_level: 'experienced',
        background_check_required: true
      },
      coordinator: 'coord-2',
      instructions: 'Review tour script and animal facts. Dress professionally.',
      equipment_provided: ['Tour materials', 'Name tags'],
      equipment_to_bring: ['Comfortable walking shoes'],
      status: 'published',
      published_at: '2024-01-18T10:00:00Z',
      assigned_volunteers: [],
      waitlist: [],
      created_at: '2024-01-18T10:00:00Z',
      updated_at: '2024-01-18T10:00:00Z',
      created_by: 'coord-2'
    }
  ];

  const allEvents = events.length > 0 ? events : mockEvents;

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = allEvents;

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(event => event.event_type === filterType);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.name.toLowerCase().includes(query)
      );
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    return filtered;
  }, [allEvents, filterType, filterStatus, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allEvents.length;
    const upcoming = allEvents.filter(event => new Date(event.start_date) > new Date()).length;
    const needsVolunteers = allEvents.filter(event => 
      event.assigned_volunteers.length < event.volunteer_requirements.min_volunteers
    ).length;
    const totalAssignments = allEvents.reduce((sum, event) => sum + event.assigned_volunteers.length, 0);
    
    return { total, upcoming, needsVolunteers, totalAssignments };
  }, [allEvents]);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'daily_care': return 'bg-blue-100 text-blue-800';
      case 'special_event': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'fundraiser': return 'bg-green-100 text-green-800';
      case 'education': return 'bg-indigo-100 text-indigo-800';
      case 'transport': return 'bg-yellow-100 text-yellow-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-gray-600';
      case 'published': return 'text-green-600';
      case 'cancelled': return 'text-red-600';
      case 'completed': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'no_show': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVolunteerName = (volunteerId: string) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    return volunteer ? `${volunteer.first_name} ${volunteer.last_name}` : `Volunteer ${volunteerId}`;
  };

  const handleEventSubmit = () => {
    const eventData = {
      ...eventForm,
      coordinator: currentUser.id,
      status: 'draft' as const,
      assigned_volunteers: [],
      waitlist: [],
      created_by: currentUser.id
    };

    if (editingEvent) {
      onEventUpdate?.(editingEvent.id, eventData);
    } else {
      onEventCreate?.(eventData);
    }

    setShowEventForm(false);
    setEditingEvent(null);
    // Reset form
    setEventForm({
      title: '',
      description: '',
      event_type: 'daily_care',
      start_date: '',
      end_date: '',
      location: { name: '', address: '' },
      volunteer_requirements: {
        min_volunteers: 1,
        max_volunteers: 5,
        required_skills: [],
        preferred_skills: [],
        experience_level: 'any',
        background_check_required: false
      },
      instructions: '',
      equipment_provided: [],
      equipment_to_bring: []
    });
  };

  const handleEditEvent = (event: VolunteerEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      event_type: event.event_type,
      start_date: event.start_date.substring(0, 16), // Format for datetime-local input
      end_date: event.end_date.substring(0, 16),
      location: event.location,
      volunteer_requirements: event.volunteer_requirements,
      instructions: event.instructions,
      equipment_provided: event.equipment_provided,
      equipment_to_bring: event.equipment_to_bring
    });
    setShowEventForm(true);
  };

  const renderEventList = () => (
    <div className="space-y-4">
      {filteredEvents.map(event => (
        <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEventTypeColor(event.event_type)}`}>
                  {event.event_type.replace('_', ' ')}
                </span>
                <span className={`text-sm ${getStatusColor(event.status)} capitalize`}>
                  {event.status}
                </span>
              </div>
              
              <p className="text-gray-600 mb-3">{event.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.start_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                    {new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {event.assigned_volunteers.length}/{event.volunteer_requirements.max_volunteers} volunteers
                  </span>
                  {event.assigned_volunteers.length < event.volunteer_requirements.min_volunteers && (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
              </div>
              
              {/* Assigned Volunteers */}
              {event.assigned_volunteers.length > 0 && (
                <div className="mt-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Assigned Volunteers</h6>
                  <div className="flex flex-wrap gap-2">
                    {event.assigned_volunteers.map(assignment => (
                      <div key={assignment.id} className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">{getVolunteerName(assignment.user_id)}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getAssignmentStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="ml-6 flex flex-col space-y-2">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedEvent(event)}
                icon={Users}
              >
                Manage
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => handleEditEvent(event)}
                icon={Edit}
              >
                Edit
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => onSendReminders?.(event.id)}
                icon={Send}
              >
                Remind
              </AdminButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEventManagement = (event: VolunteerEvent) => (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-xl font-semibold text-gray-900">{event.title}</h4>
            <p className="text-gray-600 mt-1">{event.description}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{event.location.name}</span>
              </div>
            </div>
          </div>
          
          <AdminButton
            variant="outline"
            size="sm"
            onClick={() => setSelectedEvent(null)}
          >
            Back to List
          </AdminButton>
        </div>
      </div>

      {/* Volunteer Requirements */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h5 className="font-semibold text-gray-900 mb-4">Volunteer Requirements</h5>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Number Needed</label>
            <p className="text-sm text-gray-900">
              {event.volunteer_requirements.min_volunteers} - {event.volunteer_requirements.max_volunteers} volunteers
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Experience Level</label>
            <p className="text-sm text-gray-900 capitalize">{event.volunteer_requirements.experience_level}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Required Skills</label>
            <p className="text-sm text-gray-900">
              {event.volunteer_requirements.required_skills.join(', ') || 'None specified'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Background Check</label>
            <p className="text-sm text-gray-900">
              {event.volunteer_requirements.background_check_required ? 'Required' : 'Not required'}
            </p>
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-semibold text-gray-900">
            Assigned Volunteers ({event.assigned_volunteers.length}/{event.volunteer_requirements.max_volunteers})
          </h5>
          <AdminButton
            variant="primary"
            size="sm"
            onClick={() => setShowAssignModal(true)}
            icon={UserPlus}
          >
            Assign Volunteer
          </AdminButton>
        </div>
        
        <div className="space-y-3">
          {event.assigned_volunteers.map(assignment => (
            <div key={assignment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded">
              <div className="flex items-center space-x-3">
                <div>
                  <h6 className="font-medium text-gray-900">{getVolunteerName(assignment.user_id)}</h6>
                  <p className="text-sm text-gray-600">{assignment.role}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAssignmentStatusColor(assignment.status)}`}>
                  {assignment.status}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {assignment.status === 'assigned' && (
                  <AdminButton
                    variant="outline"
                    size="xs"
                    onClick={() => {
                      // Update assignment status
                      console.log('Mark as confirmed');
                    }}
                  >
                    Mark Confirmed
                  </AdminButton>
                )}
                <AdminButton
                  variant="outline"
                  size="xs"
                  onClick={() => onVolunteerUnassign?.(event.id, assignment.user_id)}
                  icon={UserMinus}
                >
                  Unassign
                </AdminButton>
              </div>
            </div>
          ))}
          
          {event.assigned_volunteers.length === 0 && (
            <p className="text-gray-500 text-center py-4">No volunteers assigned yet</p>
          )}
        </div>
      </div>

      {/* Waitlist */}
      {event.waitlist.length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h5 className="font-semibold text-gray-900 mb-4">Waitlist ({event.waitlist.length})</h5>
          <div className="space-y-2">
            {event.waitlist.map(volunteerId => (
              <div key={volunteerId} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                <span className="text-sm text-gray-900">{getVolunteerName(volunteerId)}</span>
                <AdminButton
                  variant="outline"
                  size="xs"
                  onClick={() => onVolunteerAssign?.(event.id, volunteerId)}
                >
                  Assign
                </AdminButton>
              </div>
            ))}
          </div>
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
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Volunteer Scheduling</h3>
              <p className="text-sm text-gray-600">
                Manage events and volunteer assignments
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <AdminButton
              variant="outline"
              size="sm"
              onClick={() => onSendReminders?.('all')}
              icon={Send}
            >
              Send Reminders
            </AdminButton>
            <AdminButton
              variant="primary"
              onClick={() => setShowEventForm(true)}
              icon={Plus}
            >
              Create Event
            </AdminButton>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-700">{stats.total}</div>
            <div className="text-xs text-blue-600">Total Events</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">{stats.upcoming}</div>
            <div className="text-xs text-green-600">Upcoming</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-700">{stats.needsVolunteers}</div>
            <div className="text-xs text-yellow-600">Need Volunteers</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">{stats.totalAssignments}</div>
            <div className="text-xs text-purple-600">Total Assignments</div>
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
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Types</option>
            <option value="daily_care">Daily Care</option>
            <option value="special_event">Special Event</option>
            <option value="maintenance">Maintenance</option>
            <option value="fundraiser">Fundraiser</option>
            <option value="education">Education</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="completed">Completed</option>
          </select>
          
          <div className="flex border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'list' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-sm ${
                viewMode === 'calendar' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {selectedEvent ? (
        renderEventManagement(selectedEvent)
      ) : (
        renderEventList()
      )}

      {/* Create/Edit Event Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {editingEvent ? 'Edit Event' : 'Create New Event'}
            </h3>
            
            <div className="space-y-4">
              <AdminFormField
                label="Event Title"
                type="text"
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              
              <AdminFormField
                label="Description"
                type="textarea"
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <AdminFormField
                  label="Event Type"
                  type="select"
                  value={eventForm.event_type}
                  onChange={(e) => setEventForm(prev => ({ ...prev, event_type: e.target.value as any }))}
                  options={[
                    { value: 'daily_care', label: 'Daily Care' },
                    { value: 'special_event', label: 'Special Event' },
                    { value: 'maintenance', label: 'Maintenance' },
                    { value: 'fundraiser', label: 'Fundraiser' },
                    { value: 'education', label: 'Education' },
                    { value: 'transport', label: 'Transport' },
                    { value: 'emergency', label: 'Emergency' }
                  ]}
                  required
                />
                
                <AdminFormField
                  label="Location Name"
                  type="text"
                  value={eventForm.location.name}
                  onChange={(e) => setEventForm(prev => ({ 
                    ...prev, 
                    location: { ...prev.location, name: e.target.value }
                  }))}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <AdminFormField
                  label="Start Date & Time"
                  type="datetime-local"
                  value={eventForm.start_date}
                  onChange={(e) => setEventForm(prev => ({ ...prev, start_date: e.target.value }))}
                  required
                />
                
                <AdminFormField
                  label="End Date & Time"
                  type="datetime-local"
                  value={eventForm.end_date}
                  onChange={(e) => setEventForm(prev => ({ ...prev, end_date: e.target.value }))}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <AdminFormField
                  label="Min Volunteers"
                  type="number"
                  value={eventForm.volunteer_requirements.min_volunteers.toString()}
                  onChange={(e) => setEventForm(prev => ({ 
                    ...prev, 
                    volunteer_requirements: { 
                      ...prev.volunteer_requirements, 
                      min_volunteers: parseInt(e.target.value) || 1 
                    }
                  }))}
                  min="1"
                  required
                />
                
                <AdminFormField
                  label="Max Volunteers"
                  type="number"
                  value={eventForm.volunteer_requirements.max_volunteers.toString()}
                  onChange={(e) => setEventForm(prev => ({ 
                    ...prev, 
                    volunteer_requirements: { 
                      ...prev.volunteer_requirements, 
                      max_volunteers: parseInt(e.target.value) || 1 
                    }
                  }))}
                  min="1"
                  required
                />
              </div>
              
              <AdminFormField
                label="Instructions for Volunteers"
                type="textarea"
                value={eventForm.instructions}
                onChange={(e) => setEventForm(prev => ({ ...prev, instructions: e.target.value }))}
                rows={3}
              />
            </div>
            
            <div className="flex space-x-3 mt-6">
              <AdminButton
                variant="outline"
                onClick={() => {
                  setShowEventForm(false);
                  setEditingEvent(null);
                }}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={handleEventSubmit}
                disabled={!eventForm.title || !eventForm.start_date || !eventForm.end_date}
              >
                {editingEvent ? 'Update Event' : 'Create Event'}
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};