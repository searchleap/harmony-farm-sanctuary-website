import React from 'react';
import { 
  AdminBreadcrumbs,
  AdminActionButtonGroup,
  EditButton,
  DeleteButton,
  AdminStatusBadge
} from '../common';
import type { BreadcrumbItem, BadgeVariant } from '../common';

export interface DetailField {
  label: string;
  value: any;
  render?: (value: any) => React.ReactNode;
  type?: 'text' | 'email' | 'url' | 'date' | 'badge' | 'image' | 'list' | 'json';
  badgeVariant?: BadgeVariant;
  className?: string;
  fullWidth?: boolean;
  hidden?: boolean;
}

export interface DetailSection {
  title: string;
  fields: DetailField[];
  className?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface AdminDetailPageProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  sections: DetailSection[];
  loading?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  editText?: string;
  deleteText?: string;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  headerActions?: React.ReactNode;
  sidebarContent?: React.ReactNode;
  className?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function AdminDetailPage({
  title,
  subtitle,
  description,
  breadcrumbs = [],
  sections,
  loading = false,
  onEdit,
  onDelete,
  editText = 'Edit',
  deleteText = 'Delete',
  editDisabled = false,
  deleteDisabled = false,
  headerActions,
  sidebarContent,
  className = '',
  imageUrl,
  imageAlt
}: AdminDetailPageProps) {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({});

  console.log('[AdminDetailPage] Rendering detail page for:', title);

  // Initialize expanded state for collapsible sections
  React.useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    sections.forEach((section, index) => {
      if (section.collapsible) {
        initialExpanded[`section-${index}`] = section.defaultExpanded !== false;
      }
    });
    setExpandedSections(initialExpanded);
  }, [sections]);

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const renderFieldValue = (field: DetailField) => {
    if (field.render) {
      return field.render(field.value);
    }

    if (field.value === null || field.value === undefined || field.value === '') {
      return <span className="text-gray-400 italic">Not provided</span>;
    }

    switch (field.type) {
      case 'email':
        return (
          <a 
            href={`mailto:${field.value}`} 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {field.value}
          </a>
        );
      
      case 'url':
        return (
          <a 
            href={field.value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {field.value}
          </a>
        );
      
      case 'date':
        const date = new Date(field.value);
        return date.toLocaleDateString();
      
      case 'badge':
        return (
          <AdminStatusBadge variant={field.badgeVariant || 'neutral'}>
            {field.value}
          </AdminStatusBadge>
        );
      
      case 'image':
        return (
          <img 
            src={field.value} 
            alt={field.label}
            className="h-20 w-20 object-cover rounded-lg"
          />
        );
      
      case 'list':
        if (Array.isArray(field.value)) {
          return (
            <ul className="list-disc list-inside space-y-1">
              {field.value.map((item, index) => (
                <li key={index} className="text-sm">{item}</li>
              ))}
            </ul>
          );
        }
        return field.value;
      
      case 'json':
        return (
          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(field.value, null, 2)}
          </pre>
        );
      
      default:
        return field.value;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="grid grid-cols-3 gap-4">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <AdminBreadcrumbs items={breadcrumbs} />
      )}

      {/* Header */}
      <div className="md:flex md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start space-x-4">
            {/* Image */}
            {imageUrl && (
              <div className="flex-shrink-0">
                <img 
                  src={imageUrl} 
                  alt={imageAlt || title}
                  className="h-16 w-16 object-cover rounded-lg"
                />
              </div>
            )}
            
            {/* Title & Description */}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-lg text-gray-600">{subtitle}</p>
              )}
              {description && (
                <p className="mt-2 text-sm text-gray-500">{description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <AdminActionButtonGroup spacing="normal">
            {headerActions}
            {onEdit && (
              <EditButton 
                onClick={onEdit} 
                disabled={editDisabled}
                size="md"
              >
                {editText}
              </EditButton>
            )}
            {onDelete && (
              <DeleteButton 
                onClick={onDelete} 
                disabled={deleteDisabled}
                size="md"
              >
                {deleteText}
              </DeleteButton>
            )}
          </AdminActionButtonGroup>
        </div>
      </div>

      {/* Main Content */}
      <div className={sidebarContent ? 'lg:grid lg:grid-cols-12 lg:gap-x-8' : ''}>
        {/* Detail Sections */}
        <div className={sidebarContent ? 'lg:col-span-8' : ''}>
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => {
              const sectionKey = `section-${sectionIndex}`;
              const isExpanded = section.collapsible ? expandedSections[sectionKey] : true;
              const visibleFields = section.fields.filter(field => !field.hidden);

              return (
                <div key={sectionIndex} className={`bg-white shadow rounded-lg ${section.className || ''}`}>
                  {/* Section Header */}
                  <div 
                    className={`px-6 py-4 border-b border-gray-200 ${
                      section.collapsible ? 'cursor-pointer hover:bg-gray-50' : ''
                    }`}
                    onClick={section.collapsible ? () => toggleSection(sectionKey) : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {section.title}
                      </h3>
                      {section.collapsible && (
                        <button className="text-gray-400 hover:text-gray-600">
                          <svg 
                            className={`w-5 h-5 transform transition-transform ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="px-6 py-4">
                      <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                        {visibleFields.map((field, fieldIndex) => (
                          <div 
                            key={fieldIndex} 
                            className={`${field.fullWidth ? 'sm:col-span-2' : ''} ${field.className || ''}`}
                          >
                            <dt className="text-sm font-medium text-gray-500 mb-1">
                              {field.label}
                            </dt>
                            <dd className="text-sm text-gray-900">
                              {renderFieldValue(field)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
    </div>
  );
}