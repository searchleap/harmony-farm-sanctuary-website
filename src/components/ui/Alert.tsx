import { HTMLAttributes, ReactNode } from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import { cn } from '../../utils/cn'

interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
}

const alertVariants = {
  default: 'bg-gray-50 border-gray-200 text-gray-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}

const alertIcons = {
  default: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info
}

export function Alert({ 
  children, 
  variant = 'default', 
  title,
  dismissible = false,
  onDismiss,
  className, 
  ...props 
}: AlertProps) {
  const Icon = alertIcons[variant]
  
  console.log('🚨 Alert rendered:', { variant, title, dismissible })
  
  return (
    <div
      role="alert"
      className={cn(
        'relative rounded-lg border p-4',
        alertVariants[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-start">
        <Icon className="h-5 w-5 flex-shrink-0 mt-0.5 mr-3" />
        <div className="flex-1">
          {title && (
            <h5 className="font-medium mb-1">
              {title}
            </h5>
          )}
          <div className="text-sm">
            {children}
          </div>
        </div>
        {dismissible && (
          <button
            onClick={onDismiss}
            className="ml-3 flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}