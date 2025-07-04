import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export interface AdminBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  homeHref?: string;
  onHomeClick?: () => void;
  separator?: React.ReactNode;
}

export function AdminBreadcrumbs({
  items,
  className = '',
  showHome = true,
  homeHref = '/admin',
  onHomeClick,
  separator
}: AdminBreadcrumbsProps) {
  
  const defaultSeparator = <ChevronRight className="w-4 h-4 text-gray-400" />;

  console.log('[AdminBreadcrumbs] Rendering with items:', items.length);

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {showHome && (
          <li>
            {homeHref ? (
              <a
                href={homeHref}
                onClick={(e) => {
                  if (onHomeClick) {
                    e.preventDefault();
                    onHomeClick();
                  }
                }}
                className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
              >
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
              </a>
            ) : (
              <button
                onClick={onHomeClick}
                className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
              >
                <Home className="w-4 h-4" />
                <span className="sr-only">Home</span>
              </button>
            )}
          </li>
        )}

        {items.map((item, index) => (
          <React.Fragment key={index}>
            {/* Separator */}
            {(showHome || index > 0) && (
              <li className="flex items-center">
                {separator || defaultSeparator}
              </li>
            )}

            {/* Breadcrumb Item */}
            <li>
              {item.isActive || (!item.href && !item.onClick) ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a
                  href={item.href}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                  }}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  onClick={item.onClick}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
                >
                  {item.label}
                </button>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

// Hook for managing breadcrumb state
export function useAdminBreadcrumbs() {
  const [breadcrumbs, setBreadcrumbs] = React.useState<BreadcrumbItem[]>([]);

  const setBreadcrumb = React.useCallback((items: BreadcrumbItem[]) => {
    setBreadcrumbs(items);
  }, []);

  const addBreadcrumb = React.useCallback((item: BreadcrumbItem) => {
    setBreadcrumbs(prev => [...prev, item]);
  }, []);

  const removeBreadcrumb = React.useCallback((index: number) => {
    setBreadcrumbs(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearBreadcrumbs = React.useCallback(() => {
    setBreadcrumbs([]);
  }, []);

  return {
    breadcrumbs,
    setBreadcrumb,
    addBreadcrumb,
    removeBreadcrumb,
    clearBreadcrumbs
  };
}