// CategoryBadge Component for Harmony Farm Sanctuary
// Visual badge for blog post categories with consistent styling

import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { BlogCategory } from '../../types/blog';

interface CategoryBadgeProps {
  category: BlogCategory;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'light' | 'outline';
  showIcon?: boolean;
  clickable?: boolean;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'md',
  variant = 'default',
  showIcon = true,
  clickable = true,
  className = ''
}) => {
  console.log('CategoryBadge rendering:', { categoryName: category.name, size, variant });

  // Get the icon component from Lucide React
  const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3 h-3', 
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Map category colors to Tailwind classes based on variant
  const getVariantClasses = () => {
    const categoryColorMap: { [key: string]: { default: string; light: string; outline: string } } = {
      'bg-blue-100 text-blue-800': {
        default: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        light: 'bg-white/20 text-white hover:bg-white/30',
        outline: 'border border-blue-300 text-blue-700 hover:bg-blue-50'
      },
      'bg-green-100 text-green-800': {
        default: 'bg-green-100 text-green-800 hover:bg-green-200',
        light: 'bg-white/20 text-white hover:bg-white/30',
        outline: 'border border-green-300 text-green-700 hover:bg-green-50'
      },
      'bg-purple-100 text-purple-800': {
        default: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        light: 'bg-white/20 text-white hover:bg-white/30',
        outline: 'border border-purple-300 text-purple-700 hover:bg-purple-50'
      },
      'bg-orange-100 text-orange-800': {
        default: 'bg-orange-100 text-orange-800 hover:bg-orange-200',
        light: 'bg-white/20 text-white hover:bg-white/30',
        outline: 'border border-orange-300 text-orange-700 hover:bg-orange-50'
      },
      'bg-pink-100 text-pink-800': {
        default: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
        light: 'bg-white/20 text-white hover:bg-white/30',
        outline: 'border border-pink-300 text-pink-700 hover:bg-pink-50'
      },
      'bg-yellow-100 text-yellow-800': {
        default: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        light: 'bg-white/20 text-white hover:bg-white/30',
        outline: 'border border-yellow-300 text-yellow-700 hover:bg-yellow-50'
      },
      'bg-red-100 text-red-800': {
        default: 'bg-red-100 text-red-800 hover:bg-red-200',
        light: 'bg-white/20 text-white hover:bg-white/30',
        outline: 'border border-red-300 text-red-700 hover:bg-red-50'
      },
      'bg-indigo-100 text-indigo-800': {
        default: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
        light: 'bg-white/20 text-white hover:bg-white/30',
        outline: 'border border-indigo-300 text-indigo-700 hover:bg-indigo-50'
      }
    };

    return categoryColorMap[category.color]?.[variant] || category.color;
  };

  const baseClasses = `
    inline-flex items-center gap-1.5 font-semibold rounded-full
    ${sizeClasses[size]}
    ${getVariantClasses()}
    ${clickable ? 'transition-colors cursor-pointer' : ''}
    ${className}
  `.trim();

  const content = (
    <>
      {showIcon && IconComponent && (
        <IconComponent className={iconSizes[size]} />
      )}
      <span>{category.name}</span>
    </>
  );

  if (clickable) {
    return (
      <Link
        to={`/blog/category/${category.slug}`}
        className={baseClasses}
        title={`View all posts in ${category.name}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <span className={baseClasses}>
      {content}
    </span>
  );
};