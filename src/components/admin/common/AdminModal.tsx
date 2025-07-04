import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  preventScroll?: boolean;
  className?: string;
}

export interface AdminConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  loading?: boolean;
}

// Size mappings
const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-full mx-4'
};

// Type icon mappings
const typeIcons = {
  danger: XCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle
};

const typeColors = {
  danger: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
  success: 'text-green-500'
};

export function AdminModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  preventScroll = true,
  className = ''
}: AdminModalProps) {
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      
      // Prevent body scroll
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (preventScroll) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, onClose, preventScroll]);

  if (!isOpen) return null;

  console.log('[AdminModal] Rendering modal:', title);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  loading = false
}: AdminConfirmModalProps) {
  
  const Icon = typeIcons[type];
  const iconColor = typeColors[type];

  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('[AdminConfirmModal] Confirm error:', error);
    }
  };

  const getConfirmButtonClass = () => {
    const baseClass = "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 flex items-center";
    
    switch (type) {
      case 'danger':
        return `${baseClass} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      case 'warning':
        return `${baseClass} bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500`;
      case 'success':
        return `${baseClass} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
      default:
        return `${baseClass} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={!loading}
    >
      <div className="flex items-start space-x-4">
        <div className={`flex-shrink-0 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-gray-600 leading-relaxed">
            {message}
          </p>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {cancelText}
            </button>
            
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={getConfirmButtonClass()}
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </AdminModal>
  );
}

// Utility hook for managing modal state
export function useAdminModal() {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);
  
  return { isOpen, open, close, toggle };
}