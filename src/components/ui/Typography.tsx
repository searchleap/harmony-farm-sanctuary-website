import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  variant?: 'default' | 'sanctuary' | 'muted'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
}

// Headings
export function H1({ children, className, variant = 'default', weight = 'bold', ...props }: TypographyProps) {
  const variants = {
    default: 'text-gray-900',
    sanctuary: 'text-sanctuary-800',
    muted: 'text-gray-600'
  }
  
  const weights = {
    normal: 'font-normal',
    medium: 'font-medium', 
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  
  console.log('📝 H1 rendered:', { variant, weight })
  
  return (
    <h1 
      className={cn(
        'text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight',
        variants[variant],
        weights[weight],
        className
      )} 
      {...props}
    >
      {children}
    </h1>
  )
}

export function H2({ children, className, variant = 'default', weight = 'semibold', ...props }: TypographyProps) {
  const variants = {
    default: 'text-gray-900',
    sanctuary: 'text-sanctuary-800',
    muted: 'text-gray-600'
  }
  
  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold', 
    bold: 'font-bold'
  }
  
  return (
    <h2 
      className={cn(
        'text-3xl md:text-4xl leading-tight tracking-tight',
        variants[variant],
        weights[weight],
        className
      )} 
      {...props}
    >
      {children}
    </h2>
  )
}

export function H3({ children, className, variant = 'default', weight = 'semibold', ...props }: TypographyProps) {
  const variants = {
    default: 'text-gray-900',
    sanctuary: 'text-sanctuary-800',
    muted: 'text-gray-600'
  }
  
  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  
  return (
    <h3 
      className={cn(
        'text-2xl md:text-3xl leading-tight tracking-tight',
        variants[variant],
        weights[weight],
        className
      )} 
      {...props}
    >
      {children}
    </h3>
  )
}

export function H4({ children, className, variant = 'default', weight = 'semibold', ...props }: TypographyProps) {
  const variants = {
    default: 'text-gray-900',
    sanctuary: 'text-sanctuary-800',
    muted: 'text-gray-600'
  }
  
  const weights = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
  
  return (
    <h4 
      className={cn(
        'text-xl md:text-2xl leading-tight tracking-tight',
        variants[variant],
        weights[weight],
        className
      )} 
      {...props}
    >
      {children}
    </h4>
  )
}

// Body text
export function BodyLarge({ children, className, variant = 'default', ...props }: TypographyProps) {
  const variants = {
    default: 'text-gray-700',
    sanctuary: 'text-sanctuary-700',
    muted: 'text-gray-500'
  }
  
  return (
    <p 
      className={cn(
        'text-lg md:text-xl leading-relaxed',
        variants[variant],
        className
      )} 
      {...props}
    >
      {children}
    </p>
  )
}

export function BodyText({ children, className, variant = 'default', ...props }: TypographyProps) {
  const variants = {
    default: 'text-gray-700',
    sanctuary: 'text-sanctuary-700',
    muted: 'text-gray-500'
  }
  
  return (
    <p 
      className={cn(
        'text-base leading-relaxed',
        variants[variant],
        className
      )} 
      {...props}
    >
      {children}
    </p>
  )
}

export function BodySmall({ children, className, variant = 'default', ...props }: TypographyProps) {
  const variants = {
    default: 'text-gray-600',
    sanctuary: 'text-sanctuary-600',
    muted: 'text-gray-400'
  }
  
  return (
    <p 
      className={cn(
        'text-sm leading-relaxed',
        variants[variant],
        className
      )} 
      {...props}
    >
      {children}
    </p>
  )
}

// Special text styles
export function GradientText({ children, className, ...props }: Omit<TypographyProps, 'variant'>) {
  return (
    <span 
      className={cn('gradient-text', className)}
      {...props}
    >
      {children}
    </span>
  )
}