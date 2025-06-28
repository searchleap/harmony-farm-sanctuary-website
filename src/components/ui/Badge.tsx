import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'sponsored'
  size?: 'sm' | 'md' | 'lg'
}

const badgeVariants = {
  default: 'bg-gray-100 text-gray-800 border-gray-200',
  success: 'bg-green-100 text-green-800 border-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200',
  sponsored: 'bg-sanctuary-100 text-sanctuary-800 border-sanctuary-200'
}

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base'
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className, 
  ...props 
}: BadgeProps) {
  console.log('🏷️ Badge rendered:', { variant, size })
  
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}