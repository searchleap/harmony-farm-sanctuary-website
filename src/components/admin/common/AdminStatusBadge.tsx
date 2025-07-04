import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Clock, Eye, EyeOff, Heart, DollarSign } from 'lucide-react';

export type BadgeVariant = 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'info' 
  | 'neutral'
  | 'primary'
  | 'secondary';

export type BadgeSize = 'sm' | 'md' | 'lg';

export interface AdminStatusBadgeProps {
  variant: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
  showIcon?: boolean;
  className?: string;
  onClick?: () => void;
}

// Predefined status badges for common use cases
export interface StatusBadgeProps {
  size?: BadgeSize;
  className?: string;
  onClick?: () => void;
}

const variantStyles = {
  success: 'bg-green-100 text-green-800 border-green-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  primary: 'bg-green-100 text-green-800 border-green-200',
  secondary: 'bg-purple-100 text-purple-800 border-purple-200'
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base'
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5'
};

export function AdminStatusBadge({
  variant,
  size = 'md',
  children,
  icon,
  showIcon = true,
  className = '',
  onClick
}: AdminStatusBadgeProps) {
  
  const defaultIcons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: AlertCircle,
    neutral: null,
    primary: CheckCircle,
    secondary: Heart
  };

  const Icon = icon ? null : (showIcon ? defaultIcons[variant] : null);

  const badgeClass = `
    inline-flex items-center font-medium rounded-full border
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${onClick ? 'cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' : ''}
    ${className}
  `.trim();

  const content = (
    <>
      {(Icon || icon) && (
        <span className={`mr-1 ${iconSizes[size]}`}>
          {icon || (Icon && <Icon className={iconSizes[size]} />)}
        </span>
      )}
      {children}
    </>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className={badgeClass}>
        {content}
      </button>
    );
  }

  return (
    <span className={badgeClass}>
      {content}
    </span>
  );
}

// Predefined status badges for common use cases
export function ActiveBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="success" size={size} className={className} onClick={onClick}>
      Active
    </AdminStatusBadge>
  );
}

export function InactiveBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="neutral" size={size} className={className} onClick={onClick}>
      Inactive
    </AdminStatusBadge>
  );
}

export function PendingBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="warning" size={size} className={className} onClick={onClick} icon={<Clock className={iconSizes[size || 'md']} />}>
      Pending
    </AdminStatusBadge>
  );
}

export function PublishedBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="success" size={size} className={className} onClick={onClick} icon={<Eye className={iconSizes[size || 'md']} />}>
      Published
    </AdminStatusBadge>
  );
}

export function DraftBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="neutral" size={size} className={className} onClick={onClick} icon={<EyeOff className={iconSizes[size || 'md']} />}>
      Draft
    </AdminStatusBadge>
  );
}

export function SponsoredBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="primary" size={size} className={className} onClick={onClick} icon={<Heart className={iconSizes[size || 'md']} />}>
      Sponsored
    </AdminStatusBadge>
  );
}

export function AvailableBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="info" size={size} className={className} onClick={onClick}>
      Available
    </AdminStatusBadge>
  );
}

export function AdoptedBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="success" size={size} className={className} onClick={onClick} icon={<Heart className={iconSizes[size || 'md']} />}>
      Adopted
    </AdminStatusBadge>
  );
}

export function DonatedBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="success" size={size} className={className} onClick={onClick} icon={<DollarSign className={iconSizes[size || 'md']} />}>
      Donated
    </AdminStatusBadge>
  );
}

export function ProcessingBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="warning" size={size} className={className} onClick={onClick}>
      Processing
    </AdminStatusBadge>
  );
}

export function CompletedBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="success" size={size} className={className} onClick={onClick}>
      Completed
    </AdminStatusBadge>
  );
}

export function ErrorBadge({ size, className, onClick }: StatusBadgeProps) {
  return (
    <AdminStatusBadge variant="error" size={size} className={className} onClick={onClick}>
      Error
    </AdminStatusBadge>
  );
}

// Utility function to get badge component by status
export function getBadgeByStatus(status: string, props: StatusBadgeProps = {}) {
  const statusMap: Record<string, React.ComponentType<StatusBadgeProps>> = {
    active: ActiveBadge,
    inactive: InactiveBadge,
    pending: PendingBadge,
    published: PublishedBadge,
    draft: DraftBadge,
    sponsored: SponsoredBadge,
    available: AvailableBadge,
    adopted: AdoptedBadge,
    donated: DonatedBadge,
    processing: ProcessingBadge,
    completed: CompletedBadge,
    error: ErrorBadge
  };

  const BadgeComponent = statusMap[status.toLowerCase()];
  
  if (!BadgeComponent) {
    return (
      <AdminStatusBadge variant="neutral" {...props}>
        {status}
      </AdminStatusBadge>
    );
  }

  return <BadgeComponent {...props} />;
}