// SocialShare Component for Harmony Farm Sanctuary
// Social media sharing buttons for blog posts

import React from 'react';
import { Share2, Facebook, Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { BlogPost, SocialPlatform } from '../../types/blog';
import { generateSocialShareData, generateSocialShareUrls } from '../../utils/seoHelpers';

interface SocialShareProps {
  post: BlogPost;
  variant?: 'horizontal' | 'vertical' | 'compact';
  showLabels?: boolean;
  showTitle?: boolean;
  className?: string;
}

export const SocialShare: React.FC<SocialShareProps> = ({
  post,
  variant = 'horizontal',
  showLabels = false,
  showTitle = false,
  className = ''
}) => {
  console.log('SocialShare rendering:', { title: post.title, variant, showLabels });

  const shareData = generateSocialShareData(post);
  const shareUrls = generateSocialShareUrls(shareData);

  const platforms: SocialPlatform[] = [
    {
      name: 'facebook',
      label: 'Facebook',
      icon: 'Facebook',
      shareUrl: shareUrls.facebook,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'twitter',
      label: 'Twitter',
      icon: 'Twitter',
      shareUrl: shareUrls.twitter,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      icon: 'Linkedin',
      shareUrl: shareUrls.linkedin,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      name: 'email',
      label: 'Email',
      icon: 'Mail',
      shareUrl: shareUrls.email,
      color: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      name: 'whatsapp',
      label: 'WhatsApp',
      icon: 'MessageCircle',
      shareUrl: shareUrls.whatsapp,
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  const handleShare = (platform: SocialPlatform) => {
    if (platform.name === 'email') {
      window.location.href = platform.shareUrl;
    } else {
      window.open(
        platform.shareUrl,
        `share-${platform.name}`,
        'width=600,height=400,menubar=no,toolbar=no,status=no,scrollbars=yes,resizable=yes'
      );
    }
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      Facebook,
      Twitter,
      Linkedin,
      Mail,
      MessageCircle
    };
    return icons[iconName as keyof typeof icons] || Share2;
  };

  const containerClasses = {
    horizontal: 'flex items-center gap-3 flex-wrap',
    vertical: 'flex flex-col gap-2',
    compact: 'flex items-center gap-2'
  };

  const buttonSizes = {
    horizontal: 'w-10 h-10',
    vertical: 'w-10 h-10',
    compact: 'w-8 h-8'
  };

  const iconSizes = {
    horizontal: 'w-5 h-5',
    vertical: 'w-5 h-5',
    compact: 'w-4 h-4'
  };

  return (
    <div className={`${className}`}>
      {showTitle && (
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Share This Article</h3>
        </div>
      )}

      <div className={containerClasses[variant]}>
        {platforms.map(platform => {
          const IconComponent = getIconComponent(platform.icon);
          
          if (showLabels && variant !== 'compact') {
            return (
              <button
                key={platform.name}
                onClick={() => handleShare(platform)}
                className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors ${platform.color}`}
                title={`Share on ${platform.label}`}
              >
                <IconComponent className={iconSizes[variant]} />
                <span className="font-medium">{platform.label}</span>
              </button>
            );
          }

          return (
            <button
              key={platform.name}
              onClick={() => handleShare(platform)}
              className={`${buttonSizes[variant]} ${platform.color} text-white rounded-lg flex items-center justify-center transition-colors`}
              title={`Share on ${platform.label}`}
            >
              <IconComponent className={iconSizes[variant]} />
            </button>
          );
        })}
        
        {/* Native Web Share API (if supported) */}
        {navigator.share && (
          <button
            onClick={() => {
              navigator.share({
                title: post.title,
                text: post.excerpt,
                url: shareData.url
              }).catch(console.error);
            }}
            className={`${buttonSizes[variant]} bg-gray-600 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center transition-colors`}
            title="Share using device options"
          >
            <Share2 className={iconSizes[variant]} />
          </button>
        )}
      </div>

      {/* Share count (if available) */}
      {post.shares > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {post.shares} {post.shares === 1 ? 'share' : 'shares'}
        </div>
      )}
    </div>
  );
};