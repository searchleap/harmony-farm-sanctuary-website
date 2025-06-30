// AuthorByline Component for Harmony Farm Sanctuary
// Author information display for blog posts

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { Author } from '../../types/blog';
import { formatBlogDate } from '../../utils/blogHelpers';

interface AuthorBylineProps {
  author: Author;
  publishedAt: string;
  variant?: 'default' | 'compact' | 'light' | 'minimal';
  showDate?: boolean;
  showRole?: boolean;
  showAvatar?: boolean;
  clickable?: boolean;
  className?: string;
}

export const AuthorByline: React.FC<AuthorBylineProps> = ({
  author,
  publishedAt,
  variant = 'default',
  showDate = true,
  showRole = true,
  showAvatar = true,
  clickable = true,
  className = ''
}) => {
  console.log('AuthorByline rendering:', { authorName: author.name, variant, showDate });

  const variantClasses = {
    default: 'flex items-center gap-3',
    compact: 'flex items-center gap-2 text-sm',
    light: 'flex items-center gap-3 text-white/90',
    minimal: 'flex items-center gap-2 text-xs'
  };

  const avatarSizes = {
    default: 'w-10 h-10',
    compact: 'w-8 h-8',
    light: 'w-10 h-10',
    minimal: 'w-6 h-6'
  };

  const textColors = {
    default: 'text-gray-700',
    compact: 'text-gray-600',
    light: 'text-white/90',
    minimal: 'text-gray-500'
  };

  const mutedColors = {
    default: 'text-gray-500',
    compact: 'text-gray-500',
    light: 'text-white/70',
    minimal: 'text-gray-400'
  };

  const authorContent = (
    <div className={`${variantClasses[variant]} ${className}`}>
      {showAvatar && (
        <div className={`${avatarSizes[variant]} rounded-full overflow-hidden flex-shrink-0`}>
          {author.image ? (
            <img
              src={author.image}
              alt={`${author.name} profile photo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-sanctuary-primary/10 flex items-center justify-center">
              <User className="w-1/2 h-1/2 text-sanctuary-primary" />
            </div>
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-semibold ${textColors[variant]} ${clickable ? 'hover:text-sanctuary-primary transition-colors' : ''}`}>
            {author.name}
          </span>
          
          {showRole && variant !== 'minimal' && (
            <>
              <span className={mutedColors[variant]}>•</span>
              <span className={`${mutedColors[variant]} ${variant === 'compact' ? 'text-xs' : ''}`}>
                {author.role}
              </span>
            </>
          )}
        </div>

        {showDate && (
          <div className={`flex items-center gap-1 ${mutedColors[variant]} ${variant === 'compact' || variant === 'minimal' ? 'text-xs' : 'text-sm'} mt-0.5`}>
            <Calendar className="w-3 h-3" />
            <span>{formatBlogDate(publishedAt, 'relative')}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link
        to={`/blog/author/${author.id}`}
        className="block hover:opacity-80 transition-opacity"
        title={`View all posts by ${author.name}`}
      >
        {authorContent}
      </Link>
    );
  }

  return authorContent;
};