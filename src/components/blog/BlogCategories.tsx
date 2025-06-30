// BlogCategories Component for Harmony Farm Sanctuary
// Category navigation and selection interface

import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { BlogCategory } from '../../types/blog';
import { blogCategories } from '../../data/blogCategories';

interface BlogCategoriesProps {
  selectedCategory?: string;
  onCategorySelect?: (categorySlug: string) => void;
  variant?: 'horizontal' | 'vertical' | 'grid' | 'pills';
  showCounts?: boolean;
  showIcons?: boolean;
  showAllOption?: boolean;
  className?: string;
}

export const BlogCategories: React.FC<BlogCategoriesProps> = ({
  selectedCategory,
  onCategorySelect,
  variant = 'horizontal',
  showCounts = true,
  showIcons = true,
  showAllOption = true,
  className = ''
}) => {
  console.log('BlogCategories rendering:', { selectedCategory, variant, showCounts });

  const handleCategoryClick = (categorySlug: string) => {
    if (onCategorySelect) {
      onCategorySelect(categorySlug);
    }
  };

  const renderCategoryItem = (category: BlogCategory, isActive: boolean) => {
    const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
    
    const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium";
    const activeClasses = isActive 
      ? "bg-sanctuary-primary text-white" 
      : "text-gray-700 hover:bg-gray-100 hover:text-sanctuary-primary";
    
    const content = (
      <>
        {showIcons && IconComponent && (
          <IconComponent className="w-4 h-4" />
        )}
        <span>{category.name}</span>
        {showCounts && category.postCount > 0 && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {category.postCount}
          </span>
        )}
      </>
    );

    if (onCategorySelect) {
      return (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.slug)}
          className={`${baseClasses} ${activeClasses}`}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        key={category.id}
        to={`/blog/category/${category.slug}`}
        className={`${baseClasses} ${activeClasses}`}
      >
        {content}
      </Link>
    );
  };

  const renderAllOption = () => {
    const isActive = !selectedCategory;
    const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium";
    const activeClasses = isActive 
      ? "bg-sanctuary-primary text-white" 
      : "text-gray-700 hover:bg-gray-100 hover:text-sanctuary-primary";

    const content = (
      <>
        {showIcons && <Icons.Grid3X3 className="w-4 h-4" />}
        <span>All Articles</span>
      </>
    );

    if (onCategorySelect) {
      return (
        <button
          onClick={() => handleCategoryClick('')}
          className={`${baseClasses} ${activeClasses}`}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        to="/blog"
        className={`${baseClasses} ${activeClasses}`}
      >
        {content}
      </Link>
    );
  };

  const containerClasses = {
    horizontal: "flex flex-wrap gap-2",
    vertical: "flex flex-col gap-1",
    grid: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3",
    pills: "flex flex-wrap gap-2"
  };

  if (variant === 'pills') {
    return (
      <div className={`${containerClasses[variant]} ${className}`}>
        {showAllOption && renderAllOption()}
        {blogCategories.map(category => {
          const isActive = selectedCategory === category.slug;
          const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
          
          const pillClasses = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            isActive 
              ? 'bg-sanctuary-primary text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-sanctuary-primary'
          }`;

          const content = (
            <>
              {showIcons && IconComponent && (
                <IconComponent className="w-3 h-3" />
              )}
              <span>{category.name}</span>
              {showCounts && category.postCount > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-white text-gray-600'
                }`}>
                  {category.postCount}
                </span>
              )}
            </>
          );

          if (onCategorySelect) {
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className={pillClasses}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={category.id}
              to={`/blog/category/${category.slug}`}
              className={pillClasses}
            >
              {content}
            </Link>
          );
        })}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`${containerClasses[variant]} ${className}`}>
        {showAllOption && (
          <div className="col-span-full">
            {renderAllOption()}
          </div>
        )}
        {blogCategories.map(category => {
          const isActive = selectedCategory === category.slug;
          return (
            <div key={category.id} className="w-full">
              {renderCategoryItem(category, isActive)}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      {showAllOption && renderAllOption()}
      {blogCategories.map(category => {
        const isActive = selectedCategory === category.slug;
        return renderCategoryItem(category, isActive);
      })}
    </div>
  );
};