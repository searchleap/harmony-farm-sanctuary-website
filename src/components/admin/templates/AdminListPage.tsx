import React, { useState } from 'react';
import { 
  AdminTable, 
  AdminBreadcrumbs, 
  AdminActionButtonGroup,
  AddButton,
  RefreshButton,
  DownloadButton
} from '../common';
import type { AdminTableColumn, BreadcrumbItem } from '../common';

export interface AdminListPageProps<T = any> {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  data: T[];
  columns: AdminTableColumn<T>[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (searchTerm: string) => void;
  // Actions
  onAdd?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  addButtonText?: string;
  // Pagination
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  // Additional content
  headerActions?: React.ReactNode;
  filters?: React.ReactNode;
  className?: string;
  emptyStateContent?: React.ReactNode;
}

export function AdminListPage<T extends Record<string, any>>({
  title,
  description,
  breadcrumbs = [],
  data,
  columns,
  loading = false,
  searchable = true,
  searchPlaceholder,
  onSearch,
  onAdd,
  onRefresh,
  onExport,
  addButtonText = 'Add New',
  pagination,
  headerActions,
  filters,
  className = '',
  emptyStateContent
}: AdminListPageProps<T>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  console.log('[AdminListPage] Rendering with data count:', data.length);

  const handleRefresh = async () => {
    if (onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  const handleExport = async () => {
    if (onExport) {
      setIsExporting(true);
      try {
        await onExport();
      } finally {
        setIsExporting(false);
      }
    }
  };

  const defaultEmptyState = (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-gray-400">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
          />
        </svg>
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by creating a new item.</p>
      {onAdd && (
        <div className="mt-6">
          <AddButton onClick={onAdd} size="md">
            {addButtonText}
          </AddButton>
        </div>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <AdminBreadcrumbs items={breadcrumbs} />
      )}

      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>

        {/* Header Actions */}
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <AdminActionButtonGroup spacing="normal">
            {onRefresh && (
              <RefreshButton 
                onClick={handleRefresh} 
                loading={isRefreshing}
                disabled={loading}
              />
            )}
            {onExport && (
              <DownloadButton 
                onClick={handleExport} 
                loading={isExporting}
                disabled={loading}
                tooltip="Export data"
              />
            )}
            {headerActions}
            {onAdd && (
              <AddButton onClick={onAdd} disabled={loading}>
                {addButtonText}
              </AddButton>
            )}
          </AdminActionButtonGroup>
        </div>
      </div>

      {/* Filters */}
      {filters && (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          {filters}
        </div>
      )}

      {/* Data Table */}
      {data.length === 0 && !loading ? (
        <div className="bg-white rounded-lg shadow">
          {emptyStateContent || defaultEmptyState}
        </div>
      ) : (
        <AdminTable
          columns={columns}
          data={data}
          loading={loading}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          onSearch={onSearch}
          pagination={pagination}
          emptyText="No items found"
        />
      )}
    </div>
  );
}