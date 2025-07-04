import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminRole, AdminResource, AdminAction } from '../../types/admin';
import { AlertTriangle, Lock, Shield } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: AdminRole[];
  resource?: AdminResource;
  action?: AdminAction;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [],
  resource,
  action,
  fallbackPath = '/admin/login'
}) => {
  const { user, isAuthenticated, isLoading, hasPermission } = useAdminAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return <AccessDenied userRole={user.role} requiredRoles={requiredRoles} />;
  }

  // Check resource/action permissions
  if (resource && action && !hasPermission(resource, action)) {
    return <AccessDenied userRole={user?.role} requiredPermission={{ resource, action }} />;
  }

  return <>{children}</>;
};

interface AccessDeniedProps {
  userRole?: AdminRole;
  requiredRoles?: AdminRole[];
  requiredPermission?: {
    resource: AdminResource;
    action: AdminAction;
  };
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ userRole, requiredRoles, requiredPermission }) => {
  const { logout } = useAdminAuth();

  const roleDescriptions = {
    admin: 'Administrator - Full system access',
    editor: 'Editor - Content management access',
    viewer: 'Viewer - Read-only access'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            {userRole && (
              <>
                <div className="flex items-center mb-2">
                  <Shield className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Your Role:</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  {roleDescriptions[userRole]}
                </p>
              </>
            )}
            
            {requiredRoles && requiredRoles.length > 0 && (
              <>
                <div className="flex items-center mt-4 mb-2">
                  <Lock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Required Roles:</span>
                </div>
                <div className="ml-6 space-y-1">
                  {requiredRoles.map(role => (
                    <p key={role} className="text-sm text-gray-600">
                      {roleDescriptions[role]}
                    </p>
                  ))}
                </div>
              </>
            )}

            {requiredPermission && (
              <>
                <div className="flex items-center mt-4 mb-2">
                  <Lock className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Required Permission:</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  {requiredPermission.action} access to {requiredPermission.resource}
                </p>
              </>
            )}
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              Go Back
            </button>
            
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 transition-colors"
            >
              Sign Out & Login as Different User
            </button>
            
            <a
              href="/admin"
              className="block w-full px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-colors"
            >
              Return to Admin Dashboard
            </a>
          </div>
        </div>
        
        <p className="mt-6 text-sm text-gray-500">
          Contact your administrator if you need additional permissions.
        </p>
      </div>
    </div>
  );
};

export default ProtectedRoute;