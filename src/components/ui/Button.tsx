import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'donate'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
  loading?: boolean
}

const buttonVariants = {
  primary: 'bg-sanctuary-600 hover:bg-sanctuary-700 text-white shadow-md hover:shadow-lg',
  secondary: 'bg-earth-600 hover:bg-earth-700 text-white shadow-md hover:shadow-lg',
  outline: 'border-2 border-sanctuary-600 text-sanctuary-600 hover:bg-sanctuary-600 hover:text-white',
  ghost: 'text-sanctuary-600 hover:bg-sanctuary-50',
  donate: 'bg-gradient-to-r from-sanctuary-500 to-sanctuary-600 hover:from-sanctuary-600 hover:to-sanctuary-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl'
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  loading = false,
  disabled,
  ...props 
}: ButtonProps) {
  console.log('🔘 Button rendered:', { variant, size, loading, disabled })
  
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sanctuary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        loading && 'opacity-75 cursor-wait',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}