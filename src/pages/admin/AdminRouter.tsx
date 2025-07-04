import React from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { ProtectedRoute } from '../../components/admin/ProtectedRoute';

// Admin page imports - will be added as we create them
// import { AnimalsPage } from './AnimalsPage';
// import { BlogPage } from './BlogPage';
// import { FAQPage } from './FAQPage';

export interface AdminRoute {
  path: string;
  component: React.ComponentType;
  title: string;
  permissions?: {
    resource: string;
    action: string;
  };
  exact?: boolean;
}

// Define admin routes
export const adminRoutes: AdminRoute[] = [
  // Dashboard is handled separately in AdminPage.tsx
  
  // Content Management Routes (to be added)
  // {
  //   path: '/admin/animals',
  //   component: AnimalsPage,
  //   title: 'Animals Management',
  //   permissions: { resource: 'animals', action: 'read' }
  // },
  // {
  //   path: '/admin/blog',
  //   component: BlogPage,
  //   title: 'Blog Management',
  //   permissions: { resource: 'blog', action: 'read' }
  // },
  // {
  //   path: '/admin/faq',
  //   component: FAQPage,
  //   title: 'FAQ Management',
  //   permissions: { resource: 'faq', action: 'read' }
  // }
];

export interface AdminRouterProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function AdminRouter({ currentPath, onNavigate }: AdminRouterProps) {
  console.log('[AdminRouter] Current path:', currentPath);

  // Find matching route
  const currentRoute = adminRoutes.find(route => {
    if (route.exact) {
      return currentPath === route.path;
    }
    return currentPath.startsWith(route.path);
  });

  // Render route component if found
  if (currentRoute) {
    const RouteComponent = currentRoute.component;
    
    return (
      <ProtectedRoute 
        resource={currentRoute.permissions?.resource}
        action={currentRoute.permissions?.action}
      >
        <AdminLayout>
          <RouteComponent />
        </AdminLayout>
      </ProtectedRoute>
    );
  }

  // Default fallback - this shouldn't happen in normal use
  return (
    <AdminLayout>
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
        <p className="mt-2 text-gray-600">The requested admin page could not be found.</p>
        <button
          onClick={() => onNavigate('/admin')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Go to Dashboard
        </button>
      </div>
    </AdminLayout>
  );
}

// Hook for managing admin navigation
export function useAdminNavigation() {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

  const navigate = React.useCallback((path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
  }, []);

  // Listen to browser back/forward
  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return {
    currentPath,
    navigate
  };
}