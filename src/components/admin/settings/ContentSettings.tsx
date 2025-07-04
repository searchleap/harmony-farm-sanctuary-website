import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Eye, 
  MessageSquare, 
  Star,
  Archive,
  Globe,
  Image,
  Shield,
  Zap,
  Mail
} from 'lucide-react';
import { AdminFormField } from '../common/AdminFormField';
import { AdminButton } from '../common/AdminButton';
import { AdminBadge } from '../common/AdminBadge';
import { ContentSettings as ContentSettingsType } from '../../../types/settings';
import { sampleSettings } from '../../../data/settingsData';

interface ContentSettingsProps {
  onChange: () => void;
}

const ContentSettings: React.FC<ContentSettingsProps> = ({ onChange }) => {
  const [settings, setSettings] = useState<ContentSettingsType>(sampleSettings.content);

  useEffect(() => {
    onChange();
  }, [settings, onChange]);

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMediaUploadChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      mediaUpload: {
        ...prev.mediaUpload,
        [field]: value
      }
    }));
  };

  const handleSEOChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        [field]: value
      }
    }));
  };

  const handleArchivalChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      archival: {
        ...prev.archival,
        [field]: value
      }
    }));
  };

  const handleNewsletterChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      newletter: {
        ...prev.newletter,
        [field]: value
      }
    }));
  };

  const handleAllowedTypesChange = (value: string) => {
    const types = value.split('\n').map(type => type.trim()).filter(type => type);
    handleMediaUploadChange('allowedTypes', types);
  };

  const visibilityOptions = [
    { value: 'public', label: 'Public - Visible to everyone' },
    { value: 'private', label: 'Private - Only visible to logged-in users' },
    { value: 'restricted', label: 'Restricted - Requires special permissions' }
  ];

  const getContentScore = () => {
    let score = 0;
    let total = 8;

    if (settings.enableComments) score += 1;
    if (settings.moderateComments) score += 1;
    if (settings.enableRatings) score += 1;
    if (settings.mediaUpload.enableImageOptimization) score += 1;
    if (settings.seo.enableMetaTags) score += 1;
    if (settings.seo.enableStructuredData) score += 1;
    if (settings.archival.enableVersioning) score += 1;
    if (settings.newletter.enableSignup) score += 1;

    const percentage = (score / total) * 100;
    if (percentage >= 80) return { level: 'Excellent', color: 'green' };
    if (percentage >= 60) return { level: 'Good', color: 'blue' };
    if (percentage >= 40) return { level: 'Fair', color: 'yellow' };
    return { level: 'Basic', color: 'red' };
  };

  const contentScore = getContentScore();

  return (
    <div className="space-y-8">
      {/* Content Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FileText className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Content Management Settings
              </h3>
              <p className="text-blue-700 dark:text-blue-300">
                Configure how content is created, managed, and displayed on your site
              </p>
            </div>
          </div>
          <AdminBadge color={contentScore.color}>
            {contentScore.level} Setup
          </AdminBadge>
        </div>
      </div>

      {/* Publishing Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Publishing & Visibility
          </h3>
        </div>
        
        <div className="space-y-6">
          <AdminFormField
            label="Default Content Visibility"
            type="select"
            value={settings.defaultVisibility}
            onChange={(value) => handleInputChange('defaultVisibility', value)}
            options={visibilityOptions}
            help="New content will default to this visibility setting"
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Comment Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="enable-comments"
                    type="checkbox"
                    checked={settings.enableComments}
                    onChange={(e) => handleInputChange('enableComments', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable-comments" className="text-sm text-gray-700 dark:text-gray-300">
                    Enable comments on content
                  </label>
                </div>
                
                {settings.enableComments && (
                  <>
                    <div className="flex items-center gap-3 ml-7">
                      <input
                        id="moderate-comments"
                        type="checkbox"
                        checked={settings.moderateComments}
                        onChange={(e) => handleInputChange('moderateComments', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="moderate-comments" className="text-sm text-gray-700 dark:text-gray-300">
                        Moderate comments before publishing
                      </label>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-7">
                      <input
                        id="guest-comments"
                        type="checkbox"
                        checked={settings.allowGuestComments}
                        onChange={(e) => handleInputChange('allowGuestComments', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="guest-comments" className="text-sm text-gray-700 dark:text-gray-300">
                        Allow guest comments (no login required)
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Rating Settings</h4>
              <div className="flex items-center gap-3">
                <input
                  id="enable-ratings"
                  type="checkbox"
                  checked={settings.enableRatings}
                  onChange={(e) => handleInputChange('enableRatings', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enable-ratings" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable content ratings and reviews
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Upload Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Upload className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Media Upload & Management
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminFormField
              label="Maximum File Size (MB)"
              type="number"
              value={settings.mediaUpload.maxFileSize}
              onChange={(value) => handleMediaUploadChange('maxFileSize', parseInt(value))}
              min={1}
              max={100}
              required
            />
            
            <div>
              <AdminFormField
                label="Allowed File Types"
                type="textarea"
                value={settings.mediaUpload.allowedTypes.join('\n')}
                onChange={handleAllowedTypesChange}
                placeholder="image/jpeg&#10;image/png&#10;video/mp4"
                rows={4}
                help="One MIME type per line"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900 dark:text-white">Image Processing</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  id="optimize-images"
                  type="checkbox"
                  checked={settings.mediaUpload.enableImageOptimization}
                  onChange={(e) => handleMediaUploadChange('enableImageOptimization', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="optimize-images" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable automatic image optimization
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  id="watermark-images"
                  type="checkbox"
                  checked={settings.mediaUpload.enableImageWatermark}
                  onChange={(e) => handleMediaUploadChange('enableImageWatermark', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="watermark-images" className="text-sm text-gray-700 dark:text-gray-300">
                  Add watermark to uploaded images
                </label>
              </div>
              
              {settings.mediaUpload.enableImageWatermark && (
                <div className="ml-7 max-w-sm">
                  <AdminFormField
                    label="Watermark Text"
                    type="text"
                    value={settings.mediaUpload.watermarkText || ''}
                    onChange={(value) => handleMediaUploadChange('watermarkText', value)}
                    placeholder="© Your Sanctuary Name"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Search className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            SEO & Search Engine Optimization
          </h3>
        </div>
        
        <div className="space-y-6">
          <AdminFormField
            label="Default Meta Description"
            type="textarea"
            value={settings.seo.defaultMetaDescription}
            onChange={(value) => handleSEOChange('defaultMetaDescription', value)}
            placeholder="A compelling description of your sanctuary..."
            rows={3}
            help="Used when content doesn't have a custom meta description"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Meta Tags & Schema</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="enable-meta-tags"
                    type="checkbox"
                    checked={settings.seo.enableMetaTags}
                    onChange={(e) => handleSEOChange('enableMetaTags', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable-meta-tags" className="text-sm text-gray-700 dark:text-gray-300">
                    Generate meta tags automatically
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    id="enable-structured-data"
                    type="checkbox"
                    checked={settings.seo.enableStructuredData}
                    onChange={(e) => handleSEOChange('enableStructuredData', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable-structured-data" className="text-sm text-gray-700 dark:text-gray-300">
                    Include structured data (JSON-LD)
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Search Engine Files</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    id="enable-sitemap"
                    type="checkbox"
                    checked={settings.seo.enableSitemap}
                    onChange={(e) => handleSEOChange('enableSitemap', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable-sitemap" className="text-sm text-gray-700 dark:text-gray-300">
                    Generate XML sitemap automatically
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    id="enable-robots-txt"
                    type="checkbox"
                    checked={settings.seo.enableRobotsTxt}
                    onChange={(e) => handleSEOChange('enableRobotsTxt', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable-robots-txt" className="text-sm text-gray-700 dark:text-gray-300">
                    Generate robots.txt file
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Archival & Versioning */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Archive className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Content Archival & Versioning
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminFormField
              label="Auto-Archive After (Days)"
              type="number"
              value={settings.archival.autoArchiveAfterDays || ''}
              onChange={(value) => handleArchivalChange('autoArchiveAfterDays', value ? parseInt(value) : undefined)}
              min={30}
              max={3650}
              help="Leave empty to disable auto-archiving"
            />
            
            <AdminFormField
              label="Maximum Versions to Keep"
              type="number"
              value={settings.archival.maxVersions}
              onChange={(value) => handleArchivalChange('maxVersions', parseInt(value))}
              min={1}
              max={50}
              required
            />
          </div>
          
          <div className="flex items-center gap-3">
            <input
              id="enable-versioning"
              type="checkbox"
              checked={settings.archival.enableVersioning}
              onChange={(e) => handleArchivalChange('enableVersioning', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enable-versioning" className="text-sm text-gray-700 dark:text-gray-300">
              Enable content versioning and revision history
            </label>
          </div>
        </div>
      </div>

      {/* Newsletter Integration */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="h-5 w-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Newsletter Integration
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <input
              id="enable-newsletter-signup"
              type="checkbox"
              checked={settings.newletter.enableSignup}
              onChange={(e) => handleNewsletterChange('enableSignup', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enable-newsletter-signup" className="text-sm text-gray-700 dark:text-gray-300">
              Enable newsletter signup on content pages
            </label>
          </div>
          
          {settings.newletter.enableSignup && (
            <div className="ml-7 space-y-6">
              <div className="flex items-center gap-3">
                <input
                  id="require-double-optin"
                  type="checkbox"
                  checked={settings.newletter.requireDoubleOptIn}
                  onChange={(e) => handleNewsletterChange('requireDoubleOptIn', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="require-double-optin" className="text-sm text-gray-700 dark:text-gray-300">
                  Require double opt-in confirmation
                </label>
              </div>
              
              <AdminFormField
                label="Default List ID"
                type="text"
                value={settings.newletter.defaultListId || ''}
                onChange={(value) => handleNewsletterChange('defaultListId', value)}
                placeholder="newsletter-main"
                help="Default mailing list for new subscribers"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content Performance Summary */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Content Configuration Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${settings.enableComments ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <p className="font-medium">Comments</p>
            <p className="text-gray-600 dark:text-gray-400">{settings.enableComments ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div className="text-center">
            <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${settings.mediaUpload.enableImageOptimization ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <p className="font-medium">Image Optimization</p>
            <p className="text-gray-600 dark:text-gray-400">{settings.mediaUpload.enableImageOptimization ? 'Active' : 'Disabled'}</p>
          </div>
          <div className="text-center">
            <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${settings.seo.enableMetaTags ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <p className="font-medium">SEO Features</p>
            <p className="text-gray-600 dark:text-gray-400">{settings.seo.enableMetaTags ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div className="text-center">
            <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${settings.archival.enableVersioning ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <p className="font-medium">Versioning</p>
            <p className="text-gray-600 dark:text-gray-400">{settings.archival.enableVersioning ? 'Active' : 'Disabled'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentSettings;