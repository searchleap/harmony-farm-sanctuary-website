import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X,
  Crown,
  UserCheck,
  AlertCircle,
  Eye,
  Settings
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminFormField } from '../common/AdminFormField';
import { AdminModal } from '../common/AdminModal';
import { AdminBadge } from '../common/AdminBadge';
import { UserRole, Permission } from '../../../types/settings';
import { sampleUserRoles, samplePermissions } from '../../../data/settingsData';

interface UserRoleManagerProps {
  onChange: () => void;
}

interface EditRoleModalProps {
  role: UserRole | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: UserRole) => void;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ role, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<UserRole>>({
    name: '',
    slug: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    if (role) {
      setFormData(role);
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        permissions: []
      });
    }
  }, [role]);

  const handleSubmit = () => {
    if (!formData.name || !formData.slug || !formData.description) return;

    const roleData: UserRole = {
      id: role?.id || `role-${Date.now()}`,
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      permissions: formData.permissions || [],
      users: role?.users || [],
      isSystemRole: role?.isSystemRole || false,
      createdAt: role?.createdAt || new Date(),
      updatedAt: new Date()
    };

    onSave(roleData);
    onClose();
  };

  const togglePermission = (permission: Permission) => {
    const currentPermissions = formData.permissions || [];
    const hasPermission = currentPermissions.some(p => p.id === permission.id);
    
    if (hasPermission) {
      setFormData(prev => ({
        ...prev,
        permissions: currentPermissions.filter(p => p.id !== permission.id)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: [...currentPermissions, permission]
      }));
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const groupedPermissions = samplePermissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = [];
    }
    acc[permission.resource].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={role ? 'Edit Role' : 'Create New Role'}
      size="large"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormField
            label="Role Name"
            type="text"
            value={formData.name || ''}
            onChange={(value) => {
              setFormData(prev => ({
                ...prev,
                name: value,
                slug: generateSlug(value)
              }));
            }}
            placeholder="Content Editor"
            required
          />
          
          <AdminFormField
            label="Role Slug"
            type="text"
            value={formData.slug || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, slug: value }))}
            placeholder="content-editor"
            help="URL-friendly identifier"
            required
          />
        </div>
        
        <AdminFormField
          label="Description"
          type="textarea"
          value={formData.description || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
          placeholder="Describe what this role can do..."
          rows={3}
          required
        />
        
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">Permissions</h4>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {Object.entries(groupedPermissions).map(([resource, permissions]) => (
              <div key={resource} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-3 capitalize">
                  {resource} Permissions
                </h5>
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <div key={permission.id} className="flex items-start gap-3">
                      <input
                        id={`permission-${permission.id}`}
                        type="checkbox"
                        checked={formData.permissions?.some(p => p.id === permission.id) || false}
                        onChange={() => togglePermission(permission)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={`permission-${permission.id}`}
                          className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                        >
                          {permission.name}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {permission.description}
                        </p>
                      </div>
                      <AdminBadge color="blue" size="sm">
                        {permission.action}
                      </AdminBadge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <AdminButton variant="outline" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.slug || !formData.description}
          >
            {role ? 'Update Role' : 'Create Role'}
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
};

const UserRoleManager: React.FC<UserRoleManagerProps> = ({ onChange }) => {
  const [roles, setRoles] = useState<UserRole[]>(sampleUserRoles);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  useEffect(() => {
    onChange();
  }, [roles, onChange]);

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsEditModalOpen(true);
  };

  const handleEditRole = (role: UserRole) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  };

  const handleDeleteRole = (roleId: string) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      setRoles(prev => prev.filter(role => role.id !== roleId));
    }
  };

  const handleSaveRole = (role: UserRole) => {
    if (selectedRole) {
      setRoles(prev => prev.map(r => r.id === role.id ? role : r));
    } else {
      setRoles(prev => [...prev, role]);
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    if (role.isSystemRole) return 'blue';
    if (role.permissions.length > 10) return 'purple';
    if (role.permissions.length > 5) return 'green';
    return 'gray';
  };

  const getPermissionsByResource = (permissions: Permission[]) => {
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    }, {} as Record<string, Permission[]>);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            User Roles & Permissions
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user roles and their permissions across the admin system
          </p>
        </div>
        <AdminButton
          variant="primary"
          onClick={handleCreateRole}
          icon={Plus}
        >
          Create New Role
        </AdminButton>
      </div>

      {/* Role Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Roles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{roles.length}</p>
            </div>
            <Shield className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">System Roles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {roles.filter(r => r.isSystemRole).length}
              </p>
            </div>
            <Crown className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Custom Roles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {roles.filter(r => !r.isSystemRole).length}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {roles.reduce((total, role) => total + role.users.length, 0)}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Roles List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Roles
          </h4>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {roles.map((role) => (
            <div key={role.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h5 className="text-lg font-medium text-gray-900 dark:text-white">
                      {role.name}
                    </h5>
                    <AdminBadge color={getRoleBadgeColor(role)}>
                      {role.isSystemRole ? 'System' : 'Custom'}
                    </AdminBadge>
                    {role.isSystemRole && <Crown className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {role.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>{role.permissions.length} permissions</span>
                    <span>{role.users.length} users</span>
                    <span>Created {role.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <AdminButton
                    size="sm"
                    variant="outline"
                    onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                    icon={Eye}
                  >
                    {expandedRole === role.id ? 'Hide' : 'View'} Details
                  </AdminButton>
                  <AdminButton
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditRole(role)}
                    icon={Edit}
                  >
                    Edit
                  </AdminButton>
                  {!role.isSystemRole && (
                    <AdminButton
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteRole(role.id)}
                      icon={Trash2}
                    >
                      Delete
                    </AdminButton>
                  )}
                </div>
              </div>
              
              {expandedRole === role.id && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h6 className="font-medium text-gray-900 dark:text-white mb-3">
                        Permissions ({role.permissions.length})
                      </h6>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {Object.entries(getPermissionsByResource(role.permissions)).map(([resource, permissions]) => (
                          <div key={resource} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                            <h7 className="font-medium text-gray-900 dark:text-white mb-2 capitalize">
                              {resource}
                            </h7>
                            <div className="flex flex-wrap gap-1">
                              {permissions.map((permission) => (
                                <AdminBadge key={permission.id} color="blue" size="sm">
                                  {permission.action}
                                </AdminBadge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="font-medium text-gray-900 dark:text-white mb-3">
                        Assigned Users ({role.users.length})
                      </h6>
                      <div className="space-y-2">
                        {role.users.length > 0 ? (
                          role.users.map((userId) => (
                            <div key={userId} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {userId.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">
                                User {userId}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                            No users assigned to this role
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <h6 className="font-medium text-amber-900 dark:text-amber-100">
              Security Best Practices
            </h6>
            <ul className="mt-2 text-sm text-amber-700 dark:text-amber-300 space-y-1">
              <li>• Regularly review user permissions and remove unnecessary access</li>
              <li>• Avoid creating roles with excessive permissions</li>
              <li>• System roles cannot be deleted but can be modified carefully</li>
              <li>• Always test role changes in a staging environment first</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Edit Role Modal */}
      <EditRoleModal
        role={selectedRole}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveRole}
      />
    </div>
  );
};

export default UserRoleManager;