import React, { useState } from 'react';
import { Users, UserPlus, Calendar, MessageSquare, FileText } from 'lucide-react';
import { UserManagement, VolunteerApplications, VolunteerProfiles, VolunteerScheduling, CommunicationCenter } from '../../components/admin/users';
import { AdminButton } from '../../components/admin/common';

export function UsersPage() {
  const [activeView, setActiveView] = useState('users');

  // Mock current user
  const currentUser = {
    id: 'admin-1',
    email: 'admin@harmonyfarm.org',
    first_name: 'Admin',
    last_name: 'User',
    role: 'admin' as const,
    status: 'active' as const,
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
        profile_visibility: 'volunteers_only' as const,
        show_real_name: true,
        show_contact_info: false
      }
    },
    failed_login_attempts: 0,
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  // View navigation
  const views = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'profiles', label: 'Volunteer Profiles', icon: UserPlus },
    { id: 'scheduling', label: 'Scheduling', icon: Calendar },
    { id: 'communication', label: 'Communication', icon: MessageSquare }
  ];

  const renderViewContent = () => {
    switch (activeView) {
      case 'users':
        return (
          <UserManagement
            users={[]}
            activities={[]}
            currentUser={currentUser}
            onUserCreate={(user) => console.log('Create user:', user)}
            onUserUpdate={(id, updates) => console.log('Update user:', id, updates)}
            onUserDelete={(id) => console.log('Delete user:', id)}
            onBulkAction={(action, ids) => console.log('Bulk action:', action, ids)}
            onExportUsers={() => console.log('Export users')}
          />
        );

      case 'applications':
        return (
          <VolunteerApplications
            applications={[]}
            currentUser={currentUser}
            onApplicationReview={(id, decision, notes) => console.log('Review application:', id, decision, notes)}
            onApplicationUpdate={(id, updates) => console.log('Update application:', id, updates)}
            onExportApplications={() => console.log('Export applications')}
          />
        );

      case 'profiles':
        return (
          <VolunteerProfiles
            volunteers={[]}
            currentUser={currentUser}
            onVolunteerUpdate={(id, updates) => console.log('Update volunteer:', id, updates)}
            onSkillAdd={(id, skill) => console.log('Add skill:', id, skill)}
            onTrainingAdd={(id, training) => console.log('Add training:', id, training)}
            onCertificationAdd={(id, cert) => console.log('Add certification:', id, cert)}
            onExportProfiles={() => console.log('Export profiles')}
          />
        );

      case 'scheduling':
        return (
          <VolunteerScheduling
            events={[]}
            volunteers={[]}
            currentUser={currentUser}
            onEventCreate={(event) => console.log('Create event:', event)}
            onEventUpdate={(id, updates) => console.log('Update event:', id, updates)}
            onEventDelete={(id) => console.log('Delete event:', id)}
            onVolunteerAssign={(eventId, volunteerId) => console.log('Assign volunteer:', eventId, volunteerId)}
            onVolunteerUnassign={(eventId, volunteerId) => console.log('Unassign volunteer:', eventId, volunteerId)}
            onSendReminders={(eventId) => console.log('Send reminders:', eventId)}
          />
        );

      case 'communication':
        return (
          <CommunicationCenter
            messages={[]}
            announcements={[]}
            users={[]}
            currentUser={currentUser}
            onMessageSend={(message) => console.log('Send message:', message)}
            onAnnouncementCreate={(announcement) => console.log('Create announcement:', announcement)}
            onAnnouncementUpdate={(id, updates) => console.log('Update announcement:', id, updates)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User & Volunteer Management</h1>
              <p className="text-gray-600">
                Comprehensive user account and volunteer coordination system
              </p>
            </div>
          </div>
        </div>

        {/* View Navigation */}
        <div className="flex space-x-1 mt-6 border-b border-gray-200">
          {views.map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === view.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <view.icon className="w-4 h-4" />
              <span>{view.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* View Content */}
      <div className="min-h-screen">
        {renderViewContent()}
      </div>
    </div>
  );
}

export default UsersPage;