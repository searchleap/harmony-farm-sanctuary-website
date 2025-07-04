import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Activity, 
  Search, 
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Upload
} from 'lucide-react';
import { User, UserRole, UserStatus, UserActivity } from '../../../types/user';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';

interface UserManagementProps {
  users: User[];
  activities: UserActivity[];
  onUserCreate?: (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => void;
  onUserUpdate?: (userId: string, updates: Partial<User>) => void;
  onUserDelete?: (userId: string) => void;
  onBulkAction?: (action: string, userIds: string[]) => void;
  onExportUsers?: () => void;
  currentUser: User;
}

export const UserManagement: React.FC<UserManagementProps> = ({
  users,
  activities,
  onUserCreate,
  onUserUpdate,
  onUserDelete,
  onBulkAction,
  onExportUsers,
  currentUser
}) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'cards' | 'activity'>('list');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<UserStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'created_at' | 'last_login' | 'role'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // User form state
  const [userForm, setUserForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'volunteer' as UserRole,
    status: 'active' as UserStatus
  });

  // Mock data for demonstration
  const mockUsers: User[] = [
    {
      id: 'user-1',
      email: 'sarah.wilson@email.com',
      first_name: 'Sarah',
      last_name: 'Wilson',
      display_name: 'Sarah W.',
      phone: '(555) 123-4567',
      role: 'volunteer_coordinator',
      status: 'active',
      email_verified: true,
      phone_verified: true,
      avatar_url: undefined,
      bio: 'Experienced volunteer coordinator with passion for animal welfare.',
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
      last_login: '2024-01-15T08:30:00Z',
      password_changed_at: '2024-01-01T00:00:00Z',
      failed_login_attempts: 0,
      created_at: '2023-08-15T10:00:00Z',
      updated_at: '2024-01-15T08:30:00Z',
      created_by: 'admin-1'
    },
    {
      id: 'user-2',
      email: 'mike.chen@email.com',
      first_name: 'Mike',
      last_name: 'Chen',
      phone: '(555) 234-5678',
      role: 'volunteer',
      status: 'active',
      email_verified: true,
      phone_verified: false,
      preferences: {
        language: 'en',
        timezone: 'America/Los_Angeles',
        email_notifications: {
          system_updates: false,
          volunteer_opportunities: true,
          event_reminders: true,
          newsletter: false,
          messages: true
        },
        sms_notifications: {
          urgent_alerts: false,
          shift_reminders: true,
          cancellations: true
        },
        privacy: {
          profile_visibility: 'public',
          show_real_name: true,
          show_contact_info: true
        }
      },
      last_login: '2024-01-14T19:15:00Z',
      failed_login_attempts: 0,
      created_at: '2024-01-10T14:20:00Z',
      updated_at: '2024-01-14T19:15:00Z'
    }
  ];

  const allUsers = users.length > 0 ? users : mockUsers;

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = allUsers;

    // Apply role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.display_name && user.display_name.toLowerCase().includes(query))
      );
    }

    // Sort users
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
          break;
        case 'created_at':
          comparison = new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case 'last_login':
          const aLogin = a.last_login ? new Date(a.last_login).getTime() : 0;
          const bLogin = b.last_login ? new Date(b.last_login).getTime() : 0;
          comparison = bLogin - aLogin;
          break;
        case 'role':
          comparison = a.role.localeCompare(b.role);
          break;
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return filtered;
  }, [allUsers, filterRole, filterStatus, searchQuery, sortBy, sortOrder]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allUsers.length;
    const active = allUsers.filter(u => u.status === 'active').length;
    const volunteers = allUsers.filter(u => u.role === 'volunteer').length;
    const coordinators = allUsers.filter(u => u.role === 'volunteer_coordinator').length;
    const recentlyActive = allUsers.filter(u => {
      if (!u.last_login) return false;
      const daysSinceLogin = (Date.now() - new Date(u.last_login).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceLogin <= 7;
    }).length;

    return { total, active, volunteers, coordinators, recentlyActive };
  }, [allUsers]);

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      case 'volunteer_coordinator': return 'bg-blue-100 text-blue-800';
      case 'event_manager': return 'bg-green-100 text-green-800';
      case 'volunteer': return 'bg-yellow-100 text-yellow-800';
      case 'visitor': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'inactive': return 'text-gray-600';
      case 'suspended': return 'text-red-600';
      case 'pending_verification': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <XCircle className="w-4 h-4" />;
      case 'suspended': return <Lock className="w-4 h-4" />;
      case 'pending_verification': return <AlertTriangle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleUserAction = (userId: string, action: string) => {
    switch (action) {
      case 'edit':
        const user = allUsers.find(u => u.id === userId);
        if (user) {
          setEditingUser(user);
          setUserForm({
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            status: user.status
          });
          setShowUserForm(true);
        }
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this user?')) {
          onUserDelete?.(userId);
        }
        break;
      case 'suspend':
        onUserUpdate?.(userId, { status: 'suspended' });
        break;
      case 'activate':
        onUserUpdate?.(userId, { status: 'active' });
        break;
      case 'send_message':
        // Open messaging interface
        console.log('Send message to user:', userId);
        break;
    }
  };

  const handleFormSubmit = () => {
    if (editingUser) {
      // Update existing user
      onUserUpdate?.(editingUser.id, userForm);
    } else {
      // Create new user
      const newUser = {
        ...userForm,
        email_verified: false,
        phone_verified: false,
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
        failed_login_attempts: 0
      };
      onUserCreate?.(newUser);
    }
    
    setShowUserForm(false);
    setEditingUser(null);
    setUserForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      role: 'volunteer',
      status: 'active'
    });
  };

  const renderUserList = () => (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Table Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300"
            />
          </div>
          <div className="col-span-3">User</div>
          <div className="col-span-2">Contact</div>
          <div className="col-span-2">Role</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1">Last Login</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* User Rows */}
      <div className="max-h-96 overflow-y-auto">
        {filteredUsers.map(user => (
          <div key={user.id} className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50">
            <div className="col-span-1">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleSelectUser(user.id)}
                className="rounded border-gray-300"
              />
            </div>
            
            <div className="col-span-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-8 h-8 rounded-full" />
                  ) : (
                    <span className="text-sm font-medium text-gray-600">
                      {user.first_name[0]}{user.last_name[0]}
                    </span>
                  )}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </div>
                  {user.display_name && (
                    <div className="text-sm text-gray-500">"{user.display_name}"</div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <div className="space-y-1">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{user.email}</span>
                  {user.email_verified && (
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  )}
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Phone className="w-3 h-3" />
                    <span>{user.phone}</span>
                    {user.phone_verified && (
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="col-span-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                {user.role.replace('_', ' ')}
              </span>
            </div>
            
            <div className="col-span-2">
              <div className={`flex items-center space-x-1 ${getStatusColor(user.status)}`}>
                {getStatusIcon(user.status)}
                <span className="text-sm capitalize">{user.status.replace('_', ' ')}</span>
              </div>
            </div>
            
            <div className="col-span-1">
              <span className="text-sm text-gray-600">
                {user.last_login 
                  ? new Date(user.last_login).toLocaleDateString()
                  : 'Never'
                }
              </span>
            </div>
            
            <div className="col-span-1">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleUserAction(user.id, 'edit')}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit User"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                  className={user.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                  title={user.status === 'active' ? 'Suspend User' : 'Activate User'}
                >
                  {user.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleUserAction(user.id, 'send_message')}
                  className="text-gray-600 hover:text-gray-800"
                  title="Send Message"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">
                Manage user accounts, roles, and permissions
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <AdminButton
              variant="outline"
              size="sm"
              onClick={onExportUsers}
              icon={Download}
            >
              Export
            </AdminButton>
            <AdminButton
              variant="primary"
              onClick={() => setShowUserForm(true)}
              icon={UserPlus}
            >
              Add User
            </AdminButton>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-5 gap-4 mt-6">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-700">{stats.total}</div>
            <div className="text-xs text-blue-600">Total Users</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-700">{stats.active}</div>
            <div className="text-xs text-green-600">Active</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-lg font-bold text-yellow-700">{stats.volunteers}</div>
            <div className="text-xs text-yellow-600">Volunteers</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-lg font-bold text-purple-700">{stats.coordinators}</div>
            <div className="text-xs text-purple-600">Coordinators</div>
          </div>
          <div className="text-center p-3 bg-indigo-50 rounded-lg">
            <div className="text-lg font-bold text-indigo-700">{stats.recentlyActive}</div>
            <div className="text-xs text-indigo-600">Recent Activity</div>
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
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
          
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="volunteer_coordinator">Volunteer Coordinator</option>
            <option value="event_manager">Event Manager</option>
            <option value="volunteer">Volunteer</option>
            <option value="visitor">Visitor</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as UserStatus | 'all')}
            className="border border-gray-300 rounded px-3 py-1 text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending_verification">Pending Verification</option>
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
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="last_login-desc">Recent Login</option>
            <option value="role-asc">Role</option>
          </select>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex items-center justify-between mt-3 p-3 bg-blue-50 rounded">
            <span className="text-sm text-blue-900">
              {selectedUsers.length} users selected
            </span>
            <div className="flex space-x-2">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => onBulkAction?.('activate', selectedUsers)}
              >
                Activate
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => onBulkAction?.('suspend', selectedUsers)}
              >
                Suspend
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => onBulkAction?.('send_message', selectedUsers)}
              >
                Message
              </AdminButton>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setSelectedUsers([])}
              >
                Clear Selection
              </AdminButton>
            </div>
          </div>
        )}
      </div>

      {/* User List */}
      {renderUserList()}

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <AdminFormField
                  label="First Name"
                  type="text"
                  value={userForm.first_name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, first_name: e.target.value }))}
                  required
                />
                <AdminFormField
                  label="Last Name"
                  type="text"
                  value={userForm.last_name}
                  onChange={(e) => setUserForm(prev => ({ ...prev, last_name: e.target.value }))}
                  required
                />
              </div>
              
              <AdminFormField
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              
              <AdminFormField
                label="Phone"
                type="tel"
                value={userForm.phone}
                onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <AdminFormField
                  label="Role"
                  type="select"
                  value={userForm.role}
                  onChange={(e) => setUserForm(prev => ({ ...prev, role: e.target.value as UserRole }))}
                  options={[
                    { value: 'volunteer', label: 'Volunteer' },
                    { value: 'event_manager', label: 'Event Manager' },
                    { value: 'volunteer_coordinator', label: 'Volunteer Coordinator' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'super_admin', label: 'Super Admin' }
                  ]}
                  required
                />
                <AdminFormField
                  label="Status"
                  type="select"
                  value={userForm.status}
                  onChange={(e) => setUserForm(prev => ({ ...prev, status: e.target.value as UserStatus }))}
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                    { value: 'pending_verification', label: 'Pending Verification' },
                    { value: 'suspended', label: 'Suspended' }
                  ]}
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <AdminButton
                variant="outline"
                onClick={() => {
                  setShowUserForm(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="primary"
                onClick={handleFormSubmit}
                disabled={!userForm.first_name || !userForm.last_name || !userForm.email}
              >
                {editingUser ? 'Update User' : 'Create User'}
              </AdminButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};