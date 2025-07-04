import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Send, 
  Users, 
  Megaphone,
  Bell,
  Calendar,
  Filter,
  Search,
  Plus,
  Eye,
  BarChart3,
  Download,
  Settings,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Message, Announcement, AnnouncementResponse, User } from '../../../types/user';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';

interface CommunicationCenterProps {
  messages: Message[];
  announcements: Announcement[];
  users: User[];
  onMessageSend?: (message: Omit<Message, 'id' | 'created_at'>) => void;
  onAnnouncementCreate?: (announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) => void;
  onAnnouncementUpdate?: (announcementId: string, updates: Partial<Announcement>) => void;
  currentUser: User;
}

export const CommunicationCenter: React.FC<CommunicationCenterProps> = ({
  messages,
  announcements,
  users,
  onMessageSend,
  onAnnouncementCreate,
  onAnnouncementUpdate,
  currentUser
}) => {
  const [activeTab, setActiveTab] = useState<'messages' | 'announcements' | 'campaigns' | 'analytics'>('messages');
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'direct' | 'announcement' | 'reminder'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Message form state
  const [messageForm, setMessageForm] = useState({
    subject: '',
    body: '',
    recipient_ids: [] as string[],
    message_type: 'direct' as const,
    priority: 'normal' as const,
    delivery_method: 'email' as const,
    tags: [] as string[]
  });

  // Announcement form state
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    target_audience: {
      roles: [] as string[],
      volunteer_status: [] as string[],
      skills: [] as string[]
    },
    publish_at: '',
    expires_at: '',
    delivery_methods: ['email'] as string[]
  });

  // Mock data for demonstration
  const mockMessages: Message[] = [
    {
      id: 'msg-1',
      sender_id: currentUser.id,
      recipient_ids: ['user-1', 'user-2'],
      subject: 'Volunteer Training Reminder',
      body: 'Don\'t forget about the volunteer training session this Saturday at 10 AM. Please bring comfortable clothes and closed-toe shoes.',
      message_type: 'reminder',
      priority: 'normal',
      sent_at: '2024-01-15T10:00:00Z',
      delivery_method: 'email',
      read_by: { 'user-1': '2024-01-15T11:00:00Z' },
      tags: ['training', 'reminder'],
      attachments: [],
      created_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 'msg-2',
      sender_id: 'coord-1',
      recipient_ids: [currentUser.id],
      subject: 'Event Schedule Change',
      body: 'The morning care shift has been moved from 8 AM to 9 AM due to weather conditions.',
      message_type: 'alert',
      priority: 'high',
      sent_at: '2024-01-16T06:00:00Z',
      delivery_method: 'email',
      read_by: { [currentUser.id]: '2024-01-16T06:30:00Z' },
      tags: ['schedule', 'alert'],
      attachments: [],
      created_at: '2024-01-16T06:00:00Z'
    }
  ];

  const mockAnnouncements: Announcement[] = [
    {
      id: 'ann-1',
      title: 'New Volunteer Orientation Schedule',
      content: 'We\'re excited to announce our new monthly volunteer orientation schedule! Starting February, orientations will be held on the first Saturday of each month at 2 PM. This will help us better accommodate new volunteers and provide more personalized training.',
      target_audience: {
        roles: ['volunteer', 'visitor'],
        volunteer_status: ['applicant', 'pending_review'],
        skills: []
      },
      publish_at: '2024-01-20T09:00:00Z',
      expires_at: '2024-02-20T09:00:00Z',
      delivery_methods: ['email', 'in_app'],
      views: 45,
      clicks: 12,
      responses: [
        {
          id: 'resp-1',
          announcement_id: 'ann-1',
          user_id: 'user-1',
          response_type: 'interested',
          created_at: '2024-01-20T10:30:00Z'
        }
      ],
      status: 'published',
      created_by: currentUser.id,
      created_at: '2024-01-18T14:00:00Z',
      updated_at: '2024-01-20T09:00:00Z'
    },
    {
      id: 'ann-2',
      title: 'Holiday Schedule Changes',
      content: 'Please note that during the holiday season (Dec 24 - Jan 2), our volunteer schedule will be adjusted. Essential care will continue, but educational tours and non-critical maintenance will be suspended.',
      target_audience: {
        roles: ['volunteer', 'volunteer_coordinator'],
        volunteer_status: ['active'],
        skills: []
      },
      publish_at: '2024-01-22T08:00:00Z',
      delivery_methods: ['email', 'sms', 'in_app'],
      views: 78,
      clicks: 23,
      responses: [],
      status: 'scheduled',
      created_by: 'coord-1',
      created_at: '2024-01-15T16:00:00Z',
      updated_at: '2024-01-15T16:00:00Z'
    }
  ];

  const allMessages = messages.length > 0 ? messages : mockMessages;
  const allAnnouncements = announcements.length > 0 ? announcements : mockAnnouncements;

  // Filter messages
  const filteredMessages = useMemo(() => {
    let filtered = allMessages;

    if (filterType !== 'all') {
      filtered = filtered.filter(msg => msg.message_type === filterType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(msg => 
        msg.subject.toLowerCase().includes(query) ||
        msg.body.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime());
  }, [allMessages, filterType, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalMessages = allMessages.length;
    const unreadMessages = allMessages.filter(msg => 
      msg.recipient_ids.includes(currentUser.id) && !msg.read_by[currentUser.id]
    ).length;
    const sentMessages = allMessages.filter(msg => msg.sender_id === currentUser.id).length;
    const activeAnnouncements = allAnnouncements.filter(ann => ann.status === 'published').length;
    const totalViews = allAnnouncements.reduce((sum, ann) => sum + ann.views, 0);
    const totalClicks = allAnnouncements.reduce((sum, ann) => sum + ann.clicks, 0);
    const engagementRate = totalViews > 0 ? ((totalClicks / totalViews) * 100) : 0;

    return {
      totalMessages,
      unreadMessages,
      sentMessages,
      activeAnnouncements,
      totalViews,
      totalClicks,
      engagementRate
    };
  }, [allMessages, allAnnouncements, currentUser.id]);

  const getMessagePriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'normal': return 'text-gray-600';
      case 'low': return 'text-gray-400';
      default: return 'text-gray-600';
    }
  };

  const getAnnouncementStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMessageSubmit = () => {
    if (messageForm.subject && messageForm.body && messageForm.recipient_ids.length > 0) {
      onMessageSend?.({
        ...messageForm,
        sender_id: currentUser.id,
        sent_at: new Date().toISOString(),
        read_by: {},
        attachments: []
      });
      
      setShowMessageForm(false);
      setMessageForm({
        subject: '',
        body: '',
        recipient_ids: [],
        message_type: 'direct',
        priority: 'normal',
        delivery_method: 'email',
        tags: []
      });
    }
  };

  const handleAnnouncementSubmit = () => {
    if (announcementForm.title && announcementForm.content) {
      onAnnouncementCreate?.({
        ...announcementForm,
        publish_at: announcementForm.publish_at || new Date().toISOString(),
        views: 0,
        clicks: 0,
        responses: [],
        status: announcementForm.publish_at && new Date(announcementForm.publish_at) > new Date() ? 'scheduled' : 'published',
        created_by: currentUser.id
      });
      
      setShowAnnouncementForm(false);
      setAnnouncementForm({
        title: '',
        content: '',
        target_audience: { roles: [], volunteer_status: [], skills: [] },
        publish_at: '',
        expires_at: '',
        delivery_methods: ['email']
      });
    }
  };

  const renderMessages = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Messages</h4>
        <AdminButton
          variant="primary"
          onClick={() => setShowMessageForm(true)}
          icon={Plus}
        >
          Compose Message
        </AdminButton>
      </div>

      <div className="space-y-3">
        {filteredMessages.map(message => {
          const isUnread = message.recipient_ids.includes(currentUser.id) && !message.read_by[currentUser.id];
          const isSent = message.sender_id === currentUser.id;
          
          return (
            <div key={message.id} className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
              isUnread ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h5 className={`font-medium ${isUnread ? 'text-blue-900' : 'text-gray-900'}`}>
                      {message.subject}
                    </h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      message.message_type === 'direct' ? 'bg-green-100 text-green-800' :
                      message.message_type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                      message.message_type === 'reminder' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {message.message_type}
                    </span>
                    <span className={`text-sm ${getMessagePriorityColor(message.priority)}`}>
                      {message.priority !== 'normal' && message.priority}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{message.body}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(message.sent_at).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{message.recipient_ids.length} recipients</span>
                    </div>
                    <span>{isSent ? 'Sent' : 'Received'}</span>
                  </div>
                  
                  {message.tags.length > 0 && (
                    <div className="flex space-x-1 mt-2">
                      {message.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex items-center space-x-2">
                  {isUnread && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                  <AdminButton
                    variant="outline"
                    size="xs"
                    icon={Eye}
                  >
                    View
                  </AdminButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-900">Announcements</h4>
        <AdminButton
          variant="primary"
          onClick={() => setShowAnnouncementForm(true)}
          icon={Megaphone}
        >
          Create Announcement
        </AdminButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {allAnnouncements.map(announcement => (
          <div key={announcement.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-3">
              <h5 className="font-semibold text-gray-900">{announcement.title}</h5>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getAnnouncementStatusColor(announcement.status)}`}>
                {announcement.status}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{announcement.content}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{announcement.views}</div>
                <div className="text-xs text-gray-500">Views</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{announcement.clicks}</div>
                <div className="text-xs text-gray-500">Clicks</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">{announcement.responses.length}</div>
                <div className="text-xs text-gray-500">Responses</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(announcement.publish_at).toLocaleDateString()}</span>
              </div>
              <div className="flex space-x-1">
                {announcement.delivery_methods.map(method => (
                  <span key={method} className="px-1 py-0.5 bg-gray-100 rounded">
                    {method}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedAnnouncement(announcement)}
                icon={Eye}
              >
                View Details
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                icon={BarChart3}
              >
                Analytics
              </AdminButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900">Communication Analytics</h4>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalMessages}</div>
          <div className="text-sm text-gray-600">Total Messages</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.activeAnnouncements}</div>
          <div className="text-sm text-gray-600">Active Announcements</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.totalViews.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Views</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.engagementRate.toFixed(1)}%</div>
          <div className="text-sm text-gray-600">Engagement Rate</div>
        </div>
      </div>
      
      {/* Engagement Chart Placeholder */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h5 className="font-semibold text-gray-900 mb-4">Communication Engagement Over Time</h5>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Chart visualization would go here</p>
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
            <MessageSquare className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Communication Center</h3>
              <p className="text-sm text-gray-600">
                Manage volunteer communication and announcements
              </p>
            </div>
          </div>
          
          <AdminButton
            variant="outline"
            size="sm"
            icon={Settings}
          >
            Settings
          </AdminButton>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-700">{stats.unreadMessages}</div>
            <div className="text-xs text-blue-600">Unread Messages</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">{stats.sentMessages}</div>
            <div className="text-xs text-green-600">Sent Messages</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">{stats.activeAnnouncements}</div>
            <div className="text-xs text-purple-600">Active Announcements</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-lg font-bold text-orange-700">{stats.engagementRate.toFixed(1)}%</div>
            <div className="text-xs text-orange-600">Engagement Rate</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex space-x-1 p-1 border-b border-gray-200">
          {[
            { id: 'messages', label: 'Messages', icon: Mail },
            { id: 'announcements', label: 'Announcements', icon: Megaphone },
            { id: 'campaigns', label: 'Campaigns', icon: Send },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 }
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

        {/* Filters for Messages */}
        {activeTab === 'messages' && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search messages..."
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
                <option value="direct">Direct Messages</option>
                <option value="announcement">Announcements</option>
                <option value="reminder">Reminders</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'messages' && renderMessages()}
          {activeTab === 'announcements' && renderAnnouncements()}
          {activeTab === 'campaigns' && (
            <div className="text-center py-8 text-gray-500">
              <Send className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Email campaigns feature coming soon</p>
            </div>
          )}
          {activeTab === 'analytics' && renderAnalytics()}
        </div>
      </div>

      {/* Message Form Modal */}
      {showMessageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Compose Message</h3>
            
            <div className="space-y-4">
              <AdminFormField
                label="Subject"
                type="text"
                value={messageForm.subject}
                onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                required
              />
              
              <AdminFormField
                label="Message"
                type="textarea"
                value={messageForm.body}
                onChange={(e) => setMessageForm(prev => ({ ...prev, body: e.target.value }))}
                rows={6}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <AdminFormField
                  label="Priority"
                  type="select"
                  value={messageForm.priority}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, priority: e.target.value as any }))}
                  options={[
                    { value: 'low', label: 'Low' },
                    { value: 'normal', label: 'Normal' },
                    { value: 'high', label: 'High' },
                    { value: 'urgent', label: 'Urgent' }
                  ]}
                />
                
                <AdminFormField
                  label="Delivery Method"
                  type="select"
                  value={messageForm.delivery_method}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, delivery_method: e.target.value as any }))}
                  options={[
                    { value: 'email', label: 'Email' },
                    { value: 'sms', label: 'SMS' },
                    { value: 'in_app', label: 'In-App' },
                    { value: 'push', label: 'Push Notification' }
                  ]}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <AdminButton
                variant="outline"
                onClick={() => setShowMessageForm(false)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={handleMessageSubmit}
                disabled={!messageForm.subject || !messageForm.body}
              >
                Send Message
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Form Modal */}
      {showAnnouncementForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Create Announcement</h3>
            
            <div className="space-y-4">
              <AdminFormField
                label="Title"
                type="text"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
              
              <AdminFormField
                label="Content"
                type="textarea"
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                rows={6}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <AdminFormField
                  label="Publish Date"
                  type="datetime-local"
                  value={announcementForm.publish_at}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, publish_at: e.target.value }))}
                />
                
                <AdminFormField
                  label="Expires On"
                  type="datetime-local"
                  value={announcementForm.expires_at}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, expires_at: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <AdminButton
                variant="outline"
                onClick={() => setShowAnnouncementForm(false)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={handleAnnouncementSubmit}
                disabled={!announcementForm.title || !announcementForm.content}
              >
                Create Announcement
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};