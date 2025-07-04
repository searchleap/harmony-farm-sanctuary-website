import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  X, 
  Home, 
  Heart, 
  FileText, 
  HelpCircle, 
  BookOpen, 
  Users, 
  Mail, 
  BarChart3, 
  Settings, 
  Shield,
  Calendar,
  ShoppingBag,
  DollarSign,
  Database
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminResource, AdminAction } from '../../types/admin';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminMenuItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  description: string;
  permission?: {
    resource: AdminResource;
    action: AdminAction;
  };
  badge?: {
    text: string;
    color: 'red' | 'blue' | 'green' | 'yellow';
  };
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { user, hasPermission } = useAdminAuth();
  const location = useLocation();

  const menuItems: AdminMenuItem[] = [
    {
      title: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      path: '/admin',
      description: 'Overview and statistics'
    },
    {
      title: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/admin/analytics',
      description: 'Performance insights',
      permission: { resource: 'analytics', action: 'read' }
    },
    {
      title: 'Animals',
      icon: <Heart className="h-5 w-5" />,
      path: '/admin/animals',
      description: 'Manage animal profiles',
      permission: { resource: 'animals', action: 'read' },
      badge: { text: '12', color: 'blue' }
    },
    {
      title: 'Blog Posts',
      icon: <FileText className="h-5 w-5" />,
      path: '/admin/blog',
      description: 'Manage blog content',
      permission: { resource: 'blog', action: 'read' },
      badge: { text: '3', color: 'green' }
    },
    {
      title: 'FAQ',
      icon: <HelpCircle className="h-5 w-5" />,
      path: '/admin/faq',
      description: 'Manage FAQ entries',
      permission: { resource: 'faq', action: 'read' }
    },
    {
      title: 'Resources',
      icon: <BookOpen className="h-5 w-5" />,
      path: '/admin/resources',
      description: 'Educational resources',
      permission: { resource: 'resources', action: 'read' }
    },
    {
      title: 'Volunteers',
      icon: <Users className="h-5 w-5" />,
      path: '/admin/volunteers',
      description: 'Volunteer applications',
      permission: { resource: 'volunteers', action: 'read' },
      badge: { text: '5', color: 'yellow' }
    },
    {
      title: 'Inquiries',
      icon: <Mail className="h-5 w-5" />,
      path: '/admin/inquiries',
      description: 'Contact submissions',
      permission: { resource: 'users', action: 'read' },
      badge: { text: '8', color: 'red' }
    },
    {
      title: 'Events',
      icon: <Calendar className="h-5 w-5" />,
      path: '/admin/events',
      description: 'Tours and events',
      permission: { resource: 'settings', action: 'read' }
    },
    {
      title: 'Shop',
      icon: <ShoppingBag className="h-5 w-5" />,
      path: '/admin/shop',
      description: 'Merchandise store',
      permission: { resource: 'settings', action: 'read' }
    },
    {
      title: 'Donations',
      icon: <DollarSign className="h-5 w-5" />,
      path: '/admin/donations',
      description: 'Donation tracking',
      permission: { resource: 'donations', action: 'read' }
    },
    {
      title: 'Analytics',
      icon: <BarChart3 className="h-5 w-5" />,
      path: '/admin/analytics',
      description: 'Site analytics',
      permission: { resource: 'analytics', action: 'read' }
    },
    {
      title: 'Backup & Export',
      icon: <Database className="h-5 w-5" />,
      path: '/admin/backup',
      description: 'Data backup and export',
      permission: { resource: 'settings', action: 'read' }
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      path: '/admin/settings',
      description: 'System configuration',
      permission: { resource: 'settings', action: 'read' }
    },
  ];

  const filteredMenuItems = menuItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission.resource, item.permission.action);
  });

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-100 text-red-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'green': return 'bg-green-100 text-green-800';
      case 'yellow': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                <p className="text-sm text-gray-500">Sanctuary Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="h-12 w-12 rounded-full border-2 border-emerald-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2310B981"/><text x="50" y="58" text-anchor="middle" fill="white" font-size="24" font-family="Arial">${user.firstName[0]}${user.lastName[0]}</text></svg>`;
                  }}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.firstName[0]}{user?.lastName[0]}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose()}
                    className={`
                      group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200
                      ${isActive 
                        ? 'bg-emerald-100 text-emerald-700 border-r-4 border-emerald-600' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <span className={`mr-3 ${isActive ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.title}</span>
                        {item.badge && (
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(item.badge.color)}`}>
                            {item.badge.text}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {item.description}
                      </p>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Last login: {user?.lastLogin?.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-600 hover:text-emerald-700 mt-2 inline-block"
              >
                View Public Site →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;