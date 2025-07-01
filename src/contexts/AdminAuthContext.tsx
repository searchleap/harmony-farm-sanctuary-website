import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AdminUser, 
  AdminAuthContextType, 
  AdminRole, 
  AdminResource, 
  AdminAction
} from '../types/admin';

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Default admin users for development
const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'admin-1',
    username: 'admin',
    email: 'admin@harmonyfarm.org',
    role: 'admin',
    firstName: 'Sarah',
    lastName: 'Thompson',
    avatar: '/images/team/sarah.jpg',
    lastLogin: new Date(),
    permissions: [
      { resource: 'animals', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'blog', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'faq', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'resources', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'volunteers', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'settings', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'analytics', actions: ['read'] },
      { resource: 'donations', actions: ['read', 'update'] },
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'editor-1',
    username: 'editor',
    email: 'editor@harmonyfarm.org',
    role: 'editor',
    firstName: 'Mike',
    lastName: 'Thompson',
    avatar: '/images/team/mike.jpg',
    lastLogin: new Date(),
    permissions: [
      { resource: 'animals', actions: ['create', 'read', 'update'] },
      { resource: 'blog', actions: ['create', 'read', 'update'] },
      { resource: 'faq', actions: ['create', 'read', 'update'] },
      { resource: 'resources', actions: ['create', 'read', 'update'] },
      { resource: 'volunteers', actions: ['read', 'update'] },
      { resource: 'analytics', actions: ['read'] },
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'viewer-1',
    username: 'viewer',
    email: 'viewer@harmonyfarm.org',
    role: 'viewer',
    firstName: 'Jessica',
    lastName: 'Martinez',
    permissions: [
      { resource: 'animals', actions: ['read'] },
      { resource: 'blog', actions: ['read'] },
      { resource: 'faq', actions: ['read'] },
      { resource: 'resources', actions: ['read'] },
      { resource: 'volunteers', actions: ['read'] },
      { resource: 'analytics', actions: ['read'] },
    ],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

// Admin credentials for development (in production this would be handled by backend)
const ADMIN_CREDENTIALS = {
  admin: 'admin123',
  editor: 'editor123',
  viewer: 'viewer123',
};

interface AdminAuthProviderProps {
  children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('harmony_admin_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        const expiresAt = new Date(session.expiresAt);
        
        if (expiresAt > new Date()) {
          setUser(session.user);
        } else {
          localStorage.removeItem('harmony_admin_session');
        }
      } catch (error) {
        console.error('Failed to parse admin session:', error);
        localStorage.removeItem('harmony_admin_session');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log('Admin login attempt:', username);
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials
      if (ADMIN_CREDENTIALS[username as keyof typeof ADMIN_CREDENTIALS] === password) {
        const adminUser = DEFAULT_ADMIN_USERS.find(u => u.username === username);
        
        if (adminUser && adminUser.isActive) {
          // Create session
          const session = {
            user: { ...adminUser, lastLogin: new Date() },
            token: `admin_token_${Date.now()}`,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          };
          
          // Save session
          localStorage.setItem('harmony_admin_session', JSON.stringify(session));
          setUser(session.user);
          
          console.log('Admin login successful:', session.user.role);
          return true;
        }
      }
      
      console.log('Admin login failed: Invalid credentials');
      return false;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    console.log('Admin logout');
    localStorage.removeItem('harmony_admin_session');
    setUser(null);
  };

  const hasPermission = (resource: AdminResource, action: AdminAction): boolean => {
    if (!user) return false;
    
    const permission = user.permissions.find(p => p.resource === resource);
    return permission ? permission.actions.includes(action) : false;
  };

  const hasRole = (role: AdminRole): boolean => {
    return user?.role === role;
  };

  const value: AdminAuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// Admin route protection utilities
export const requireAdminAuth = (allowedRoles?: AdminRole[]) => {
  return (WrappedComponent: React.ComponentType<any>) => {
    const AdminProtectedComponent: React.FC<any> = (props) => {
      const { user, isAuthenticated, isLoading } = useAdminAuth();
      
      if (isLoading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading admin interface...</p>
            </div>
          </div>
        );
      }
      
      if (!isAuthenticated) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
              <p className="text-gray-600 mb-4">Please log in to access the admin panel.</p>
              <a
                href="/admin/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Go to Login
              </a>
            </div>
          </div>
        );
      }
      
      if (allowedRoles && !allowedRoles.includes(user!.role)) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-4">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-gray-500">
                Required roles: {allowedRoles.join(', ')}<br/>
                Your role: {user!.role}
              </p>
            </div>
          </div>
        );
      }
      
      return <WrappedComponent {...props} />;
    };
    
    AdminProtectedComponent.displayName = `AdminProtected(${WrappedComponent.displayName || WrappedComponent.name})`;
    return AdminProtectedComponent;
  };
};