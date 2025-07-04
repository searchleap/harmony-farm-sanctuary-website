import React, { useState } from 'react';
import { 
  AdminForm, 
  AdminBreadcrumbs,
  AdminActionButtonGroup,
  SaveButton,
  CancelButton
} from '../common';
import type { AdminFormField, BreadcrumbItem } from '../common';

export interface AdminEditPageProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  fields: AdminFormField[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  submitText?: string;
  cancelText?: string;
  layout?: 'vertical' | 'horizontal';
  className?: string;
  headerActions?: React.ReactNode;
  footerContent?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
}

export function AdminEditPage({
  title,
  description,
  breadcrumbs = [],
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  loading = false,
  submitText = 'Save Changes',
  cancelText = 'Cancel',
  layout = 'vertical',
  className = '',
  headerActions,
  footerContent,
  sidebarContent,
  validationMode = 'onBlur'
}: AdminEditPageProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  console.log('[AdminEditPage] Rendering edit form for:', title);

  const handleSubmit = async (values: Record<string, any>) => {
    setIsSaving(true);
    try {
      await onSubmit(values);
      setIsDirty(false);
    } catch (error) {
      console.error('[AdminEditPage] Submit error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      if (isDirty) {
        const confirmed = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
        if (!confirmed) return;
      }
      onCancel();
    }
  };

  const handleFormChange = () => {
    if (!isDirty) {
      setIsDirty(true);
    }
  };

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
          {isDirty && (
            <p className="mt-1 text-sm text-yellow-600">
              * You have unsaved changes
            </p>
          )}
        </div>

        {/* Header Actions */}
        {headerActions && (
          <div className="mt-4 flex md:mt-0 md:ml-4">
            {headerActions}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={sidebarContent ? 'lg:grid lg:grid-cols-12 lg:gap-x-8' : ''}>
        {/* Form Content */}
        <div className={sidebarContent ? 'lg:col-span-8' : ''}>
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <AdminForm
                fields={fields}
                initialValues={initialValues}
                onSubmit={handleSubmit}
                loading={isSaving || loading}
                layout={layout}
                submitText={submitText}
                cancelText={cancelText}
                onCancel={onCancel ? handleCancel : undefined}
              />
            </div>
          </div>

          {/* Footer Content */}
          {footerContent && (
            <div className="mt-6">
              {footerContent}
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        {sidebarContent && (
          <div className="mt-6 lg:mt-0 lg:col-span-4">
            <div className="bg-white shadow rounded-lg p-6">
              {sidebarContent}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions (Alternative to form buttons) */}
      {/* This can be used for complex forms that need persistent action buttons */}
      {false && ( // Disabled by default, can be enabled if needed
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-10">
          <div className="max-w-7xl mx-auto flex justify-end">
            <AdminActionButtonGroup spacing="normal">
              {onCancel && (
                <CancelButton onClick={handleCancel} disabled={isSaving || loading}>
                  {cancelText}
                </CancelButton>
              )}
              <SaveButton 
                onClick={() => {/* Form will handle submit */}} 
                loading={isSaving} 
                disabled={loading}
              >
                {submitText}
              </SaveButton>
            </AdminActionButtonGroup>
          </div>
        </div>
      )}
    </div>
  );
}