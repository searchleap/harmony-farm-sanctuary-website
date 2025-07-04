import React from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Copy, 
  Download, 
  Upload, 
  Plus, 
  Save, 
  X, 
  Check,
  MoreHorizontal,
  Settings,
  Share,
  Archive,
  RefreshCw
} from 'lucide-react';

export interface ActionButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  className?: string;
  tooltip?: string;
  children?: React.ReactNode;
}

export interface ActionButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'tight' | 'normal' | 'loose';
}

const sizeClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-3'
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
};

const variantClasses = {
  primary: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500'
};

const spacingClasses = {
  tight: 'space-x-1',
  normal: 'space-x-2',
  loose: 'space-x-4'
};

const BaseActionButton: React.FC<ActionButtonProps & { icon: React.ComponentType<any>; children?: React.ReactNode }> = ({
  onClick,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'ghost',
  className = '',
  tooltip,
  icon: Icon,
  children
}) => {
  const buttonClass = `
    inline-flex items-center justify-center rounded-md border border-transparent
    focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `.trim();

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={buttonClass}
      title={tooltip}
      type="button"
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-b-2 border-current ${iconSizes[size]}`} />
      ) : (
        <Icon className={iconSizes[size]} />
      )}
      {children && <span className="ml-1.5">{children}</span>}
    </button>
  );
};

// Action Button Group
export function AdminActionButtonGroup({ 
  children, 
  className = '', 
  orientation = 'horizontal',
  spacing = 'normal'
}: ActionButtonGroupProps) {
  const groupClass = `
    inline-flex items-center
    ${orientation === 'vertical' ? 'flex-col space-y-1' : `${spacingClasses[spacing]}`}
    ${className}
  `.trim();

  return (
    <div className={groupClass}>
      {children}
    </div>
  );
}

// Individual Action Buttons
export function EditButton(props: ActionButtonProps) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Edit} 
      tooltip={props.tooltip || 'Edit'}
      variant={props.variant || 'ghost'}
    >
      {props.children}
    </BaseActionButton>
  );
}

export function DeleteButton(props: ActionButtonProps) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Trash2} 
      tooltip={props.tooltip || 'Delete'}
      variant={props.variant || 'danger'}
    >
      {props.children}
    </BaseActionButton>
  );
}

export function ViewButton(props: ActionButtonProps) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Eye} 
      tooltip={props.tooltip || 'View'}
      variant={props.variant || 'ghost'}
    >
      {props.children}
    </BaseActionButton>
  );
}

export function CopyButton(props: ActionButtonProps) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Copy} 
      tooltip={props.tooltip || 'Copy'}
      variant={props.variant || 'ghost'}
    />
  );
}

export function DownloadButton(props: ActionButtonProps) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Download} 
      tooltip={props.tooltip || 'Download'}
      variant={props.variant || 'ghost'}
    />
  );
}

export function UploadButton(props: ActionButtonProps) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Upload} 
      tooltip={props.tooltip || 'Upload'}
      variant={props.variant || 'primary'}
    />
  );
}

export function AddButton(props: ActionButtonProps & { children?: React.ReactNode }) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Plus} 
      tooltip={props.tooltip || 'Add'}
      variant={props.variant || 'primary'}
    >
      {props.children}
    </BaseActionButton>
  );
}

export function SaveButton(props: ActionButtonProps & { children?: React.ReactNode }) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Save} 
      tooltip={props.tooltip || 'Save'}
      variant={props.variant || 'success'}
    >
      {props.children}
    </BaseActionButton>
  );
}

export function CancelButton(props: ActionButtonProps & { children?: React.ReactNode }) {
  return (
    <BaseActionButton 
      {...props} 
      icon={X} 
      tooltip={props.tooltip || 'Cancel'}
      variant={props.variant || 'secondary'}
    >
      {props.children}
    </BaseActionButton>
  );
}

export function ConfirmButton(props: ActionButtonProps & { children?: React.ReactNode }) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Check} 
      tooltip={props.tooltip || 'Confirm'}
      variant={props.variant || 'success'}
    >
      {props.children}
    </BaseActionButton>
  );
}

export function MoreButton(props: ActionButtonProps) {
  return (
    <BaseActionButton 
      {...props} 
      icon={MoreHorizontal} 
      tooltip={props.tooltip || 'More actions'}
      variant={props.variant || 'ghost'}
    />
  );
}

export function SettingsButton(props: ActionButtonProps) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Settings} 
      tooltip={props.tooltip || 'Settings'}
      variant={props.variant || 'ghost'}
    />
  );
}

export function ShareButton(props: ActionButtonProps) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Share} 
      tooltip={props.tooltip || 'Share'}
      variant={props.variant || 'ghost'}
    />
  );
}

export function ArchiveButton(props: ActionButtonProps) {
  return (
    <BaseActionButton 
      {...props} 
      icon={Archive} 
      tooltip={props.tooltip || 'Archive'}
      variant={props.variant || 'warning'}
    />
  );
}

export function RefreshButton(props: ActionButtonProps) {
  return (
    <BaseActionButton 
      {...props} 
      icon={RefreshCw} 
      tooltip={props.tooltip || 'Refresh'}
      variant={props.variant || 'ghost'}
    />
  );
}

// Compound action patterns
export interface StandardActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  editDisabled?: boolean;
  deleteDisabled?: boolean;
  viewDisabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function StandardActions({
  onEdit,
  onDelete,
  onView,
  editDisabled = false,
  deleteDisabled = false,
  viewDisabled = false,
  size = 'md',
  showLabels = false
}: StandardActionsProps) {
  return (
    <AdminActionButtonGroup spacing="tight">
      {onView && (
        <ViewButton 
          onClick={onView} 
          disabled={viewDisabled} 
          size={size}
        >
          {showLabels && 'View'}
        </ViewButton>
      )}
      {onEdit && (
        <EditButton 
          onClick={onEdit} 
          disabled={editDisabled} 
          size={size}
        >
          {showLabels && 'Edit'}
        </EditButton>
      )}
      {onDelete && (
        <DeleteButton 
          onClick={onDelete} 
          disabled={deleteDisabled} 
          size={size}
        >
          {showLabels && 'Delete'}
        </DeleteButton>
      )}
    </AdminActionButtonGroup>
  );
}