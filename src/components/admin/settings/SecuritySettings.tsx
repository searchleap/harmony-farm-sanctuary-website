import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  Clock, 
  Key, 
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Smartphone,
  Mail
} from 'lucide-react';
import { AdminFormField } from '../common/AdminFormField';
import { AdminButton } from '../common/AdminButton';
import { AdminStatusBadge } from '../common/AdminStatusBadge';
import { SecuritySettings as SecuritySettingsType } from '../../../types/settings';
import { sampleSettings } from '../../../data/settingsData';

interface SecuritySettingsProps {
  onChange: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onChange }) => {
  const [settings, setSettings] = useState<SecuritySettingsType>(sampleSettings.security);
  const [showApiKeys, setShowApiKeys] = useState(false);

  useEffect(() => {
    onChange();
  }, [settings, onChange]);

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordPolicyChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [field]: value
      }
    }));
  };

  const handleTwoFactorChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      twoFactorAuth: {
        ...prev.twoFactorAuth,
        [field]: value
      }
    }));
  };

  const handleApiRateLimitChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      apiRateLimit: {
        ...prev.apiRateLimit,
        [field]: value
      }
    }));
  };

  const handleContentApprovalChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      contentApproval: {
        ...prev.contentApproval,
        [field]: value
      }
    }));
  };

  const handleLoginAttemptsChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      loginAttempts: {
        ...prev.loginAttempts,
        [field]: value
      }
    }));
  };

  const getPasswordStrength = () => {
    const policy = settings.passwordPolicy;
    let score = 0;
    let maxScore = 6;

    if (policy.minLength >= 8) score += 1;
    if (policy.requireUppercase) score += 1;
    if (policy.requireLowercase) score += 1;
    if (policy.requireNumbers) score += 1;
    if (policy.requireSpecialChars) score += 1;
    if (policy.preventReuse >= 3) score += 1;

    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return { level: 'Strong', color: 'green' };
    if (percentage >= 60) return { level: 'Good', color: 'yellow' };
    if (percentage >= 40) return { level: 'Fair', color: 'orange' };
    return { level: 'Weak', color: 'red' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="space-y-8">
      {/* Security Overview */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
        <div className="flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-red-500 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
              Security Configuration
            </h3>
            <p className="text-red-700 dark:text-red-300 mt-1">
              These settings control access to your admin system and protect your sanctuary's data. 
              Changes to security settings should be made carefully.
            </p>
          </div>
        </div>
      </div>

      {/* Password Policy */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Password Policy
            </h3>
          </div>
          <AdminStatusBadge color={passwordStrength.color}>
            {passwordStrength.level} Policy
          </AdminStatusBadge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminFormField
            label="Minimum Length"
            type="number"
            value={settings.passwordPolicy.minLength}
            onChange={(value) => handlePasswordPolicyChange('minLength', parseInt(value))}
            min={6}
            max={32}
            required
          />
          
          <AdminFormField
            label="Password Reuse Prevention"
            type="number"
            value={settings.passwordPolicy.preventReuse}
            onChange={(value) => handlePasswordPolicyChange('preventReuse', parseInt(value))}
            min={0}
            max={20}
            help="Number of previous passwords to prevent reuse"
          />
          
          <AdminFormField
            label="Password Expiration (Days)"
            type="number"
            value={settings.passwordPolicy.expirationDays || ''}
            onChange={(value) => handlePasswordPolicyChange('expirationDays', value ? parseInt(value) : undefined)}
            min={30}
            max={365}
            help="Leave empty for no expiration"
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">Password Requirements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'requireUppercase', label: 'Require uppercase letters (A-Z)' },
              { key: 'requireLowercase', label: 'Require lowercase letters (a-z)' },
              { key: 'requireNumbers', label: 'Require numbers (0-9)' },
              { key: 'requireSpecialChars', label: 'Require special characters (!@#$...)' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center gap-3">
                <input
                  id={key}
                  type="checkbox"
                  checked={settings.passwordPolicy[key as keyof typeof settings.passwordPolicy] as boolean}
                  onChange={(e) => handlePasswordPolicyChange(key, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={key} className="text-sm text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                {settings.passwordPolicy[key as keyof typeof settings.passwordPolicy] ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Session Management
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminFormField
            label="Session Timeout (Minutes)"
            type="number"
            value={settings.sessionTimeout}
            onChange={(value) => handleInputChange('sessionTimeout', parseInt(value))}
            min={15}
            max={480}
            help="Users will be logged out after this period of inactivity"
            required
          />
          
          <AdminFormField
            label="Max Login Attempts"
            type="number"
            value={settings.loginAttempts.maxAttempts}
            onChange={(value) => handleLoginAttemptsChange('maxAttempts', parseInt(value))}
            min={3}
            max={10}
            required
          />
          
          <AdminFormField
            label="Lockout Duration (Minutes)"
            type="number"
            value={settings.loginAttempts.lockoutDuration}
            onChange={(value) => handleLoginAttemptsChange('lockoutDuration', parseInt(value))}
            min={5}
            max={120}
            help="How long to lock accounts after failed attempts"
            required
          />
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Two-Factor Authentication
            </h3>
          </div>
          <AdminStatusBadge color={settings.twoFactorAuth.enabled ? 'green' : 'red'}>
            {settings.twoFactorAuth.enabled ? 'Enabled' : 'Disabled'}
          </AdminStatusBadge>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <input
              id="enable-2fa"
              type="checkbox"
              checked={settings.twoFactorAuth.enabled}
              onChange={(e) => handleTwoFactorChange('enabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <div>
              <label htmlFor="enable-2fa" className="text-sm font-medium text-gray-900 dark:text-white">
                Enable Two-Factor Authentication
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Require users to provide a second form of authentication when logging in
              </p>
            </div>
          </div>
          
          {settings.twoFactorAuth.enabled && (
            <>
              <div className="flex items-start gap-4">
                <input
                  id="require-2fa"
                  type="checkbox"
                  checked={settings.twoFactorAuth.required}
                  onChange={(e) => handleTwoFactorChange('required', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                />
                <div>
                  <label htmlFor="require-2fa" className="text-sm font-medium text-gray-900 dark:text-white">
                    Require for All Users
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Force all users to set up two-factor authentication
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Available Methods</h4>
                <div className="space-y-3">
                  {[
                    { key: 'email', label: 'Email', icon: Mail, description: 'Send codes via email' },
                    { key: 'sms', label: 'SMS', icon: Smartphone, description: 'Send codes via text message' },
                    { key: 'app', label: 'Authenticator App', icon: Key, description: 'Use apps like Google Authenticator' }
                  ].map(({ key, label, icon: Icon, description }) => (
                    <div key={key} className="flex items-start gap-4">
                      <input
                        id={`2fa-${key}`}
                        type="checkbox"
                        checked={settings.twoFactorAuth.methods.includes(key as any)}
                        onChange={(e) => {
                          const methods = settings.twoFactorAuth.methods;
                          if (e.target.checked) {
                            handleTwoFactorChange('methods', [...methods, key]);
                          } else {
                            handleTwoFactorChange('methods', methods.filter(m => m !== key));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                      />
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-gray-500" />
                        <div>
                          <label htmlFor={`2fa-${key}`} className="text-sm font-medium text-gray-900 dark:text-white">
                            {label}
                          </label>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* API Security */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            API Security
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <input
              id="enable-rate-limit"
              type="checkbox"
              checked={settings.apiRateLimit.enabled}
              onChange={(e) => handleApiRateLimitChange('enabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <div className="flex-1">
              <label htmlFor="enable-rate-limit" className="text-sm font-medium text-gray-900 dark:text-white">
                Enable API Rate Limiting
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Limit the number of API requests per minute to prevent abuse
              </p>
              {settings.apiRateLimit.enabled && (
                <div className="mt-3 max-w-sm">
                  <AdminFormField
                    label="Requests per Minute"
                    type="number"
                    value={settings.apiRateLimit.requestsPerMinute}
                    onChange={(value) => handleApiRateLimitChange('requestsPerMinute', parseInt(value))}
                    min={10}
                    max={1000}
                    required
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Approval */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle className="h-5 w-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Content Approval Workflow
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <input
              id="enable-approval"
              type="checkbox"
              checked={settings.contentApproval.enabled}
              onChange={(e) => handleContentApprovalChange('enabled', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <div>
              <label htmlFor="enable-approval" className="text-sm font-medium text-gray-900 dark:text-white">
                Enable Content Approval
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Require approval before publishing certain types of content
              </p>
            </div>
          </div>
          
          {settings.contentApproval.enabled && (
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Content Types Requiring Approval</h4>
              <div className="space-y-3">
                {['blog', 'news', 'events', 'animals', 'resources'].map((type) => (
                  <div key={type} className="flex items-center gap-3">
                    <input
                      id={`approval-${type}`}
                      type="checkbox"
                      checked={settings.contentApproval.requiresApproval.includes(type)}
                      onChange={(e) => {
                        const types = settings.contentApproval.requiresApproval;
                        if (e.target.checked) {
                          handleContentApprovalChange('requiresApproval', [...types, type]);
                        } else {
                          handleContentApprovalChange('requiresApproval', types.filter(t => t !== type));
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`approval-${type}`} className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {type} Posts
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* IP Access Control */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Ban className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            IP Access Control
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminFormField
            label="IP Whitelist"
            type="textarea"
            value={settings.ipWhitelist?.join('\n') || ''}
            onChange={(value) => handleInputChange('ipWhitelist', value.split('\n').filter(ip => ip.trim()))}
            placeholder="192.168.1.1&#10;10.0.0.0/24"
            rows={4}
            help="Only these IPs can access admin (leave empty to allow all)"
          />
          
          <AdminFormField
            label="IP Blacklist"
            type="textarea"
            value={settings.ipBlacklist?.join('\n') || ''}
            onChange={(value) => handleInputChange('ipBlacklist', value.split('\n').filter(ip => ip.trim()))}
            placeholder="192.168.1.100&#10;10.0.0.50"
            rows={4}
            help="These IPs are blocked from accessing the site"
          />
        </div>
      </div>

      {/* Security Status */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">Security Status Overview</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${passwordStrength.color === 'green' ? 'bg-green-500' : passwordStrength.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <p className="font-medium">Password Policy</p>
            <p className="text-gray-600 dark:text-gray-400">{passwordStrength.level}</p>
          </div>
          <div className="text-center">
            <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${settings.twoFactorAuth.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className="font-medium">Two-Factor Auth</p>
            <p className="text-gray-600 dark:text-gray-400">{settings.twoFactorAuth.enabled ? 'Enabled' : 'Disabled'}</p>
          </div>
          <div className="text-center">
            <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${settings.apiRateLimit.enabled ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <p className="font-medium">Rate Limiting</p>
            <p className="text-gray-600 dark:text-gray-400">{settings.apiRateLimit.enabled ? 'Active' : 'Disabled'}</p>
          </div>
          <div className="text-center">
            <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${settings.contentApproval.enabled ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <p className="font-medium">Content Approval</p>
            <p className="text-gray-600 dark:text-gray-400">{settings.contentApproval.enabled ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;