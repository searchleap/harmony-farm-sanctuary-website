import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Share2,
  Upload,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { AdminFormField } from '../common/AdminFormField';
import { AdminButton } from '../common/AdminButton';
import { GeneralSettings as GeneralSettingsType } from '../../../types/settings';
import { sampleSettings } from '../../../data/settingsData';

interface GeneralSettingsProps {
  onChange: () => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ onChange }) => {
  const [settings, setSettings] = useState<GeneralSettingsType>(sampleSettings.general);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(settings.maintenanceMode);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    onChange();
  }, [settings, onChange]);

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof GeneralSettingsType],
        [field]: value
      }
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        address: {
          ...prev.contactInfo.address,
          [field]: value
        }
      }
    }));
  };

  const handleHoursChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        hours: {
          ...prev.contactInfo.hours,
          [field]: value
        }
      }
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const timezones = [
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Phoenix',
    'America/Anchorage',
    'Pacific/Honolulu',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo'
  ];

  const locales = [
    'en-US',
    'en-GB',
    'en-CA',
    'es-US',
    'fr-FR',
    'de-DE',
    'it-IT',
    'pt-BR',
    'ja-JP',
    'zh-CN'
  ];

  const currencies = [
    'USD',
    'EUR',
    'GBP',
    'CAD',
    'AUD',
    'JPY',
    'CHF',
    'SEK',
    'NOK',
    'DKK'
  ];

  return (
    <div className="space-y-8">
      {/* Site Information */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Site Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminFormField
            label="Site Name"
            type="text"
            value={settings.siteName}
            onChange={(value) => handleInputChange('siteName', value)}
            placeholder="Your sanctuary name"
            required
          />
          
          <AdminFormField
            label="Tagline"
            type="text"
            value={settings.tagline}
            onChange={(value) => handleInputChange('tagline', value)}
            placeholder="A short description of your mission"
          />
          
          <div className="lg:col-span-2">
            <AdminFormField
              label="Description"
              type="textarea"
              value={settings.description}
              onChange={(value) => handleInputChange('description', value)}
              placeholder="Detailed description of your sanctuary..."
              rows={4}
            />
          </div>
          
          <AdminFormField
            label="Logo URL"
            type="text"
            value={settings.logoUrl || ''}
            onChange={(value) => handleInputChange('logoUrl', value)}
            placeholder="/images/logo.png"
          />
          
          <AdminFormField
            label="Favicon URL"
            type="text"
            value={settings.faviconUrl || ''}
            onChange={(value) => handleInputChange('faviconUrl', value)}
            placeholder="/images/favicon.ico"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contact Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminFormField
            label="Phone Number"
            type="text"
            value={settings.contactInfo.phone}
            onChange={(value) => handleNestedInputChange('contactInfo', 'phone', value)}
            placeholder="(555) 123-4567"
            icon={Phone}
          />
          
          <AdminFormField
            label="Email Address"
            type="email"
            value={settings.contactInfo.email}
            onChange={(value) => handleNestedInputChange('contactInfo', 'email', value)}
            placeholder="info@yoursanctuary.org"
            icon={Mail}
          />
          
          <AdminFormField
            label="Street Address"
            type="text"
            value={settings.contactInfo.address.street}
            onChange={(value) => handleAddressChange('street', value)}
            placeholder="1234 Rural Route 56"
          />
          
          <AdminFormField
            label="City"
            type="text"
            value={settings.contactInfo.address.city}
            onChange={(value) => handleAddressChange('city', value)}
            placeholder="Your City"
          />
          
          <AdminFormField
            label="State/Province"
            type="text"
            value={settings.contactInfo.address.state}
            onChange={(value) => handleAddressChange('state', value)}
            placeholder="CA"
          />
          
          <AdminFormField
            label="ZIP/Postal Code"
            type="text"
            value={settings.contactInfo.address.zipCode}
            onChange={(value) => handleAddressChange('zipCode', value)}
            placeholder="95123"
          />
          
          <div className="lg:col-span-2">
            <AdminFormField
              label="General Hours"
              type="text"
              value={settings.contactInfo.hours.general}
              onChange={(value) => handleHoursChange('general', value)}
              placeholder="Mon-Fri: 9:00 AM - 5:00 PM"
              icon={Clock}
            />
          </div>
          
          <AdminFormField
            label="Tour Hours"
            type="text"
            value={settings.contactInfo.hours.tours}
            onChange={(value) => handleHoursChange('tours', value)}
            placeholder="Sat-Sun: 11:00 AM, 1:00 PM, 3:00 PM"
          />
          
          <AdminFormField
            label="Emergency Contact"
            type="text"
            value={settings.contactInfo.hours.emergency}
            onChange={(value) => handleHoursChange('emergency', value)}
            placeholder="24/7 Emergency Line: (555) 123-HELP"
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Social Media Links
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminFormField
            label="Facebook"
            type="text"
            value={settings.socialMedia.facebook || ''}
            onChange={(value) => handleSocialMediaChange('facebook', value)}
            placeholder="https://facebook.com/yoursanctuary"
          />
          
          <AdminFormField
            label="Instagram"
            type="text"
            value={settings.socialMedia.instagram || ''}
            onChange={(value) => handleSocialMediaChange('instagram', value)}
            placeholder="https://instagram.com/yoursanctuary"
          />
          
          <AdminFormField
            label="Twitter"
            type="text"
            value={settings.socialMedia.twitter || ''}
            onChange={(value) => handleSocialMediaChange('twitter', value)}
            placeholder="https://twitter.com/yoursanctuary"
          />
          
          <AdminFormField
            label="YouTube"
            type="text"
            value={settings.socialMedia.youtube || ''}
            onChange={(value) => handleSocialMediaChange('youtube', value)}
            placeholder="https://youtube.com/yoursanctuary"
          />
          
          <AdminFormField
            label="TikTok"
            type="text"
            value={settings.socialMedia.tiktok || ''}
            onChange={(value) => handleSocialMediaChange('tiktok', value)}
            placeholder="https://tiktok.com/@yoursanctuary"
          />
          
          <AdminFormField
            label="LinkedIn"
            type="text"
            value={settings.socialMedia.linkedin || ''}
            onChange={(value) => handleSocialMediaChange('linkedin', value)}
            placeholder="https://linkedin.com/company/yoursanctuary"
          />
        </div>
      </div>

      {/* Regional Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Regional Settings
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AdminFormField
            label="Timezone"
            type="select"
            value={settings.timezone}
            onChange={(value) => handleInputChange('timezone', value)}
            options={timezones.map(tz => ({ value: tz, label: tz }))}
          />
          
          <AdminFormField
            label="Locale"
            type="select"
            value={settings.locale}
            onChange={(value) => handleInputChange('locale', value)}
            options={locales.map(locale => ({ value: locale, label: locale }))}
          />
          
          <AdminFormField
            label="Currency"
            type="select"
            value={settings.currency}
            onChange={(value) => handleInputChange('currency', value)}
            options={currencies.map(currency => ({ value: currency, label: currency }))}
          />
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Advanced Settings
          </h3>
        </div>
        
        <div className="space-y-6">
          {/* Maintenance Mode */}
          <div className="flex items-start gap-4">
            <div className="flex items-center">
              <input
                id="maintenance-mode"
                type="checkbox"
                checked={isMaintenanceMode}
                onChange={(e) => {
                  setIsMaintenanceMode(e.target.checked);
                  handleInputChange('maintenanceMode', e.target.checked);
                }}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="maintenance-mode" className="text-sm font-medium text-gray-900 dark:text-white">
                Maintenance Mode
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                When enabled, your site will show a maintenance message to visitors
              </p>
              {isMaintenanceMode && (
                <div className="mt-3">
                  <AdminFormField
                    label="Maintenance Message"
                    type="textarea"
                    value={settings.maintenanceMessage || ''}
                    onChange={(value) => handleInputChange('maintenanceMessage', value)}
                    placeholder="We're performing scheduled maintenance. Please check back soon!"
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
          
          {/* Analytics IDs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminFormField
              label="Google Analytics ID"
              type="text"
              value={settings.googleAnalyticsId || ''}
              onChange={(value) => handleInputChange('googleAnalyticsId', value)}
              placeholder="GA-123456789"
            />
            
            <AdminFormField
              label="Facebook Pixel ID"
              type="text"
              value={settings.facebookPixelId || ''}
              onChange={(value) => handleInputChange('facebookPixelId', value)}
              placeholder="FB-987654321"
            />
          </div>
        </div>
      </div>

      {/* Preview Actions */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <AdminButton
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
          icon={showPreview ? EyeOff : Eye}
        >
          {showPreview ? 'Hide Preview' : 'Preview Changes'}
        </AdminButton>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last saved: Never • Auto-save: Enabled
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">Settings Preview</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Site Name:</strong> {settings.siteName}</p>
            <p><strong>Tagline:</strong> {settings.tagline}</p>
            <p><strong>Contact:</strong> {settings.contactInfo.email} • {settings.contactInfo.phone}</p>
            <p><strong>Location:</strong> {settings.contactInfo.address.city}, {settings.contactInfo.address.state}</p>
            <p><strong>Region:</strong> {settings.timezone} • {settings.locale} • {settings.currency}</p>
            {isMaintenanceMode && (
              <p className="text-red-600 dark:text-red-400">
                <strong>⚠️ Maintenance Mode:</strong> Enabled
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralSettings;