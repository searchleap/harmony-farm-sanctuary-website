// Common Admin Components
// Barrel export for easy importing

// Table Component
export { AdminTable } from './AdminTable';
export type { AdminTableColumn, AdminTableProps } from './AdminTable';

// Form Component
export { AdminForm } from './AdminForm';
export type { AdminFormField, AdminFormProps, AdminFormErrors } from './AdminForm';

// Modal Components
export { AdminModal, AdminConfirmModal, useAdminModal } from './AdminModal';
export type { AdminModalProps, AdminConfirmModalProps } from './AdminModal';

// Breadcrumbs Component
export { AdminBreadcrumbs, useAdminBreadcrumbs } from './AdminBreadcrumbs';
export type { BreadcrumbItem, AdminBreadcrumbsProps } from './AdminBreadcrumbs';

// Status Badge Components
export { 
  AdminStatusBadge,
  ActiveBadge,
  InactiveBadge,
  PendingBadge,
  PublishedBadge,
  DraftBadge,
  SponsoredBadge,
  AvailableBadge,
  AdoptedBadge,
  DonatedBadge,
  ProcessingBadge,
  CompletedBadge,
  ErrorBadge,
  getBadgeByStatus
} from './AdminStatusBadge';
export type { AdminStatusBadgeProps, StatusBadgeProps, BadgeVariant, BadgeSize } from './AdminStatusBadge';

// Action Button Components
export {
  AdminActionButtonGroup,
  EditButton,
  DeleteButton,
  ViewButton,
  CopyButton,
  DownloadButton,
  UploadButton,
  AddButton,
  SaveButton,
  CancelButton,
  ConfirmButton,
  MoreButton,
  SettingsButton,
  ShareButton,
  ArchiveButton,
  RefreshButton,
  StandardActions
} from './AdminActionButtons';
export type { 
  ActionButtonProps, 
  ActionButtonGroupProps, 
  StandardActionsProps 
} from './AdminActionButtons';