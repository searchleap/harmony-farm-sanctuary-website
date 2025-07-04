import React, { useState, useEffect } from 'react';
import { 
  Plug, 
  Mail, 
  CreditCard, 
  BarChart3, 
  Share2,
  Smartphone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { AdminFormField } from '../common/AdminFormField';
import { AdminButton } from '../common/AdminButton';
import { AdminStatusBadge } from '../common/AdminStatusBadge';
import { IntegrationSettings as IntegrationSettingsType } from '../../../types/settings';
import { sampleSettings } from '../../../data/settingsData';

interface IntegrationSettingsProps {
  onChange: () => void;
}

interface IntegrationStatus {
  name: string;
  status: 'connected' | 'error' | 'disconnected';
  lastChecked: Date;
  errorMessage?: string;
}

const IntegrationSettings: React.FC<IntegrationSettingsProps> = ({ onChange }) => {
  const [settings, setSettings] = useState<IntegrationSettingsType>(sampleSettings.integrations);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [testingConnection, setTestingConnection] = useState<string | null>(null);

  const [integrationStatuses] = useState<IntegrationStatus[]>([
    { name: 'Email Service', status: 'connected', lastChecked: new Date() },
    { name: 'Stripe Payments', status: 'connected', lastChecked: new Date() },
    { name: 'PayPal Payments', status: 'error', lastChecked: new Date(), errorMessage: 'Invalid credentials' },
    { name: 'Google Analytics', status: 'connected', lastChecked: new Date() },
    { name: 'Facebook Pixel', status: 'disconnected', lastChecked: new Date() },
    { name: 'Newsletter Service', status: 'connected', lastChecked: new Date() }
  ]);

  useEffect(() => {
    onChange();
  }, [settings, onChange]);

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const testConnection = async (service: string) => {
    setTestingConnection(service);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestingConnection(null);
    // TODO: Implement actual connection testing
  };

  const handleEmailChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [field]: value
      }
    }));
  };

  const handlePaymentChange = (provider: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        providers: {
          ...prev.payment.providers,
          [provider]: {
            ...prev.payment.providers[provider as keyof typeof prev.payment.providers],
            [field]: value
          }
        }
      }
    }));
  };

  const handleAnalyticsChange = (provider: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      analytics: {
        ...prev.analytics,
        [provider]: {
          ...prev.analytics[provider as keyof typeof prev.analytics],
          [field]: value
        }
      }
    }));
  };

  const handleSocialMediaChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [field]: value
      }
    }));
  };

  const handleNewsletterChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      newsletter: {
        ...prev.newsletter,
        [field]: value
      }
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'green';
      case 'error': return 'red';
      case 'disconnected': return 'gray';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle;
      case 'error': return XCircle;
      case 'disconnected': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const emailProviders = [
    { value: 'sendgrid', label: 'SendGrid' },
    { value: 'mailchimp', label: 'Mailchimp' },
    { value: 'aws-ses', label: 'AWS SES' },
    { value: 'custom', label: 'Custom SMTP' }
  ];

  const newsletterProviders = [
    { value: 'mailchimp', label: 'Mailchimp' },
    { value: 'sendgrid', label: 'SendGrid' },
    { value: 'constant-contact', label: 'Constant Contact' },
    { value: 'custom', label: 'Custom API' }
  ];

  return (
    <div className="space-y-8">
      {/* Integration Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-4">
          <Plug className="h-6 w-6 text-purple-500" />
          <div>
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              Third-Party Integrations
            </h3>
            <p className="text-purple-700 dark:text-purple-300">
              Connect your sanctuary's website with external services for email, payments, analytics, and more
            </p>
          </div>
        </div>
      </div>

      {/* Integration Status Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Integration Status
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrationStatuses.map((integration) => {
            const StatusIcon = getStatusIcon(integration.status);
            return (
              <div key={integration.name} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    {integration.name}
                  </h5>
                  <AdminStatusBadge color={getStatusColor(integration.status)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {integration.status}
                  </AdminStatusBadge>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last checked: {integration.lastChecked.toLocaleString()}
                </p>
                {integration.errorMessage && (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    {integration.errorMessage}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Email Service Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Email Service Configuration
            </h3>
          </div>
          <AdminButton
            size="sm"
            variant="outline"
            onClick={() => testConnection('email')}
            loading={testingConnection === 'email'}
            icon={RefreshCw}
          >
            Test Connection
          </AdminButton>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminFormField
              label="Email Provider"
              type="select"
              value={settings.email.provider}
              onChange={(value) => handleEmailChange('provider', value)}
              options={emailProviders}
              required
            />
            
            <div className="relative">
              <AdminFormField
                label="API Key"
                type={showSecrets.emailApiKey ? "text" : "password"}
                value={settings.email.apiKey}
                onChange={(value) => handleEmailChange('apiKey', value)}
                placeholder="SG.***"
                required
              />
              <button
                type="button"
                onClick={() => toggleSecretVisibility('emailApiKey')}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showSecrets.emailApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminFormField
              label="From Email"
              type="email"
              value={settings.email.fromEmail}
              onChange={(value) => handleEmailChange('fromEmail', value)}
              placeholder="noreply@yoursanctuary.org"
              required
            />
            
            <AdminFormField
              label="From Name"
              type="text"
              value={settings.email.fromName}
              onChange={(value) => handleEmailChange('fromName', value)}
              placeholder="Your Sanctuary Name"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminFormField
              label="Reply-To Email"
              type="email"
              value={settings.email.replyToEmail || ''}
              onChange={(value) => handleEmailChange('replyToEmail', value)}
              placeholder="info@yoursanctuary.org"
            />
            
            <div className="flex items-center gap-3 pt-8">
              <input
                id="enable-email-tracking"
                type="checkbox"
                checked={settings.email.enableTracking}
                onChange={(e) => handleEmailChange('enableTracking', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enable-email-tracking" className="text-sm text-gray-700 dark:text-gray-300">
                Enable email tracking and analytics
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Payment Gateway Configuration
          </h3>
        </div>
        
        <div className="space-y-8">
          {/* Stripe Settings */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Stripe Integration</h4>
              <div className="flex items-center gap-3">
                <input
                  id="enable-stripe"
                  type="checkbox"
                  checked={settings.payment.providers.stripe?.enabled || false}
                  onChange={(e) => handlePaymentChange('stripe', 'enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enable-stripe" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable Stripe
                </label>
              </div>
            </div>
            
            {settings.payment.providers.stripe?.enabled && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AdminFormField
                  label="Publishable Key"
                  type="text"
                  value={settings.payment.providers.stripe?.publicKey || ''}
                  onChange={(value) => handlePaymentChange('stripe', 'publicKey', value)}
                  placeholder="pk_test_***"
                />
                
                <div className="relative">
                  <AdminFormField
                    label="Secret Key"
                    type={showSecrets.stripeSecret ? "text" : "password"}
                    value={settings.payment.providers.stripe?.secretKey || ''}
                    onChange={(value) => handlePaymentChange('stripe', 'secretKey', value)}
                    placeholder="sk_test_***"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('stripeSecret')}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets.stripeSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                <div className="relative lg:col-span-2">
                  <AdminFormField
                    label="Webhook Secret"
                    type={showSecrets.stripeWebhook ? "text" : "password"}
                    value={settings.payment.providers.stripe?.webhookSecret || ''}
                    onChange={(value) => handlePaymentChange('stripe', 'webhookSecret', value)}
                    placeholder="whsec_***"
                    help="Required for processing webhook events"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('stripeWebhook')}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets.stripeWebhook ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* PayPal Settings */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">PayPal Integration</h4>
              <div className="flex items-center gap-3">
                <input
                  id="enable-paypal"
                  type="checkbox"
                  checked={settings.payment.providers.paypal?.enabled || false}
                  onChange={(e) => handlePaymentChange('paypal', 'enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enable-paypal" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable PayPal
                </label>
              </div>
            </div>
            
            {settings.payment.providers.paypal?.enabled && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AdminFormField
                  label="Client ID"
                  type="text"
                  value={settings.payment.providers.paypal?.clientId || ''}
                  onChange={(value) => handlePaymentChange('paypal', 'clientId', value)}
                  placeholder="paypal_client_***"
                />
                
                <div className="relative">
                  <AdminFormField
                    label="Client Secret"
                    type={showSecrets.paypalSecret ? "text" : "password"}
                    value={settings.payment.providers.paypal?.clientSecret || ''}
                    onChange={(value) => handlePaymentChange('paypal', 'clientSecret', value)}
                    placeholder="paypal_secret_***"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('paypalSecret')}
                    className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                  >
                    {showSecrets.paypalSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                <AdminFormField
                  label="Environment"
                  type="select"
                  value={settings.payment.providers.paypal?.environment || 'sandbox'}
                  onChange={(value) => handlePaymentChange('paypal', 'environment', value)}
                  options={[
                    { value: 'sandbox', label: 'Sandbox (Testing)' },
                    { value: 'production', label: 'Production (Live)' }
                  ]}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-5 w-5 text-orange-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Analytics & Tracking
          </h3>
        </div>
        
        <div className="space-y-6">
          {/* Google Analytics */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Google Analytics</h4>
              <div className="flex items-center gap-3">
                <input
                  id="enable-google-analytics"
                  type="checkbox"
                  checked={settings.analytics.google?.enabled || false}
                  onChange={(e) => handleAnalyticsChange('google', 'enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enable-google-analytics" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable Google Analytics
                </label>
              </div>
            </div>
            
            {settings.analytics.google?.enabled && (
              <div className="space-y-4">
                <AdminFormField
                  label="Tracking ID"
                  type="text"
                  value={settings.analytics.google?.trackingId || ''}
                  onChange={(value) => handleAnalyticsChange('google', 'trackingId', value)}
                  placeholder="GA-123456789"
                />
                
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      id="enable-ecommerce"
                      type="checkbox"
                      checked={settings.analytics.google?.enableEcommerce || false}
                      onChange={(e) => handleAnalyticsChange('google', 'enableEcommerce', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enable-ecommerce" className="text-sm text-gray-700 dark:text-gray-300">
                      Enable Enhanced Ecommerce
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      id="enable-reports"
                      type="checkbox"
                      checked={settings.analytics.google?.enableReports || false}
                      onChange={(e) => handleAnalyticsChange('google', 'enableReports', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="enable-reports" className="text-sm text-gray-700 dark:text-gray-300">
                      Enable Automated Reports
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Facebook Pixel */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Facebook Pixel</h4>
              <div className="flex items-center gap-3">
                <input
                  id="enable-facebook-pixel"
                  type="checkbox"
                  checked={settings.analytics.facebook?.enabled || false}
                  onChange={(e) => handleAnalyticsChange('facebook', 'enabled', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enable-facebook-pixel" className="text-sm text-gray-700 dark:text-gray-300">
                  Enable Facebook Pixel
                </label>
              </div>
            </div>
            
            {settings.analytics.facebook?.enabled && (
              <div className="space-y-4">
                <AdminFormField
                  label="Pixel ID"
                  type="text"
                  value={settings.analytics.facebook?.pixelId || ''}
                  onChange={(value) => handleAnalyticsChange('facebook', 'pixelId', value)}
                  placeholder="FB-987654321"
                />
                
                <div className="flex items-center gap-3">
                  <input
                    id="enable-conversions"
                    type="checkbox"
                    checked={settings.analytics.facebook?.enableConversions || false}
                    onChange={(e) => handleAnalyticsChange('facebook', 'enableConversions', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enable-conversions" className="text-sm text-gray-700 dark:text-gray-300">
                    Enable Conversion Tracking
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="h-5 w-5 text-pink-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Newsletter Service
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminFormField
              label="Newsletter Provider"
              type="select"
              value={settings.newsletter.provider}
              onChange={(value) => handleNewsletterChange('provider', value)}
              options={newsletterProviders}
              required
            />
            
            <div className="relative">
              <AdminFormField
                label="API Key"
                type={showSecrets.newsletterApiKey ? "text" : "password"}
                value={settings.newsletter.apiKey}
                onChange={(value) => handleNewsletterChange('apiKey', value)}
                placeholder="mc_***"
                required
              />
              <button
                type="button"
                onClick={() => toggleSecretVisibility('newsletterApiKey')}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showSecrets.newsletterApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminFormField
              label="Default List ID"
              type="text"
              value={settings.newsletter.listId}
              onChange={(value) => handleNewsletterChange('listId', value)}
              placeholder="newsletter-main"
              required
            />
            
            <div className="flex items-center gap-3 pt-8">
              <input
                id="enable-welcome-email"
                type="checkbox"
                checked={settings.newsletter.enableWelcomeEmail}
                onChange={(e) => handleNewsletterChange('enableWelcomeEmail', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enable-welcome-email" className="text-sm text-gray-700 dark:text-gray-300">
                Send welcome email to new subscribers
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Links */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">
          Integration Documentation
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Stripe Setup Guide', url: 'https://stripe.com/docs' },
            { name: 'PayPal Integration', url: 'https://developer.paypal.com' },
            { name: 'Google Analytics', url: 'https://analytics.google.com/analytics/academy' },
            { name: 'Mailchimp API', url: 'https://mailchimp.com/developer' }
          ].map((doc) => (
            <a
              key={doc.name}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <ExternalLink className="h-4 w-4" />
              {doc.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;