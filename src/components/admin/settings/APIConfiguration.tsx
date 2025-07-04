import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Server, 
  Clock, 
  Activity, 
  Shield, 
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Copy,
  Settings
} from 'lucide-react';
import { AdminFormField } from '../common/AdminFormField';
import { AdminButton } from '../common/AdminButton';
import { AdminBadge } from '../common/AdminBadge';
import { AdminModal } from '../common/AdminModal';
import { APIConfiguration as APIConfigurationType, APIEndpoint } from '../../../types/settings';
import { sampleSettings } from '../../../data/settingsData';

interface APIConfigurationProps {
  onChange: () => void;
}

interface EditEndpointModalProps {
  endpoint: APIEndpoint | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (endpoint: APIEndpoint) => void;
}

const EditEndpointModal: React.FC<EditEndpointModalProps> = ({ endpoint, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<APIEndpoint>>({
    name: '',
    url: '',
    method: 'GET',
    enabled: true,
    headers: {}
  });

  useEffect(() => {
    if (endpoint) {
      setFormData(endpoint);
    } else {
      setFormData({
        name: '',
        url: '',
        method: 'GET',
        enabled: true,
        headers: {}
      });
    }
  }, [endpoint]);

  const handleSubmit = () => {
    if (!formData.name || !formData.url) return;

    const endpointData: APIEndpoint = {
      id: endpoint?.id || `endpoint-${Date.now()}`,
      name: formData.name,
      url: formData.url,
      method: formData.method || 'GET',
      headers: formData.headers,
      enabled: formData.enabled ?? true,
      status: 'unknown',
      lastChecked: endpoint?.lastChecked
    };

    onSave(endpointData);
    onClose();
  };

  const methods = ['GET', 'POST', 'PUT', 'DELETE'];

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={endpoint ? 'Edit API Endpoint' : 'Add New Endpoint'}
      size="large"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminFormField
            label="Endpoint Name"
            type="text"
            value={formData.name || ''}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
            placeholder="Animals API"
            required
          />
          
          <AdminFormField
            label="HTTP Method"
            type="select"
            value={formData.method || 'GET'}
            onChange={(value) => setFormData(prev => ({ ...prev, method: value as any }))}
            options={methods.map(method => ({ value: method, label: method }))}
            required
          />
        </div>
        
        <AdminFormField
          label="Endpoint URL"
          type="text"
          value={formData.url || ''}
          onChange={(value) => setFormData(prev => ({ ...prev, url: value }))}
          placeholder="/api/v1/animals"
          help="Relative to base URL or full URL"
          required
        />
        
        <AdminFormField
          label="Custom Headers (JSON)"
          type="textarea"
          value={JSON.stringify(formData.headers || {}, null, 2)}
          onChange={(value) => {
            try {
              const headers = JSON.parse(value);
              setFormData(prev => ({ ...prev, headers }));
            } catch (e) {
              // Invalid JSON, don't update
            }
          }}
          placeholder='{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'
          rows={4}
          help="Valid JSON object with header key-value pairs"
        />
        
        <div className="flex items-center gap-3">
          <input
            id="endpoint-enabled"
            type="checkbox"
            checked={formData.enabled ?? true}
            onChange={(e) => setFormData(prev => ({ ...prev, enabled: e.target.checked }))}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="endpoint-enabled" className="text-sm text-gray-700 dark:text-gray-300">
            Enable this endpoint
          </label>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <AdminButton variant="outline" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!formData.name || !formData.url}
          >
            {endpoint ? 'Update Endpoint' : 'Add Endpoint'}
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
};

const APIConfiguration: React.FC<APIConfigurationProps> = ({ onChange }) => {
  const [settings, setSettings] = useState<APIConfigurationType>(sampleSettings.api);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [testingEndpoint, setTestingEndpoint] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  useEffect(() => {
    onChange();
  }, [settings, onChange]);

  const handleInputChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAuthChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      authentication: {
        ...prev.authentication,
        [field]: value
      }
    }));
  };

  const handleMonitoringChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      monitoring: {
        ...prev.monitoring,
        [field]: value
      }
    }));
  };

  const handleOAuthChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      authentication: {
        ...prev.authentication,
        oauth: {
          ...prev.authentication.oauth,
          [field]: value
        }
      }
    }));
  };

  const testEndpoint = async (endpointId: string) => {
    setTestingEndpoint(endpointId);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update endpoint status
    setSettings(prev => ({
      ...prev,
      endpoints: prev.endpoints.map(endpoint => 
        endpoint.id === endpointId 
          ? { 
              ...endpoint, 
              status: Math.random() > 0.5 ? 'healthy' : 'error',
              lastChecked: new Date(),
              responseTime: Math.floor(Math.random() * 1000) + 100
            }
          : endpoint
      )
    }));
    
    setTestingEndpoint(null);
  };

  const handleCreateEndpoint = () => {
    setSelectedEndpoint(null);
    setIsEditModalOpen(true);
  };

  const handleEditEndpoint = (endpoint: APIEndpoint) => {
    setSelectedEndpoint(endpoint);
    setIsEditModalOpen(true);
  };

  const handleDeleteEndpoint = (endpointId: string) => {
    if (window.confirm('Are you sure you want to delete this endpoint?')) {
      setSettings(prev => ({
        ...prev,
        endpoints: prev.endpoints.filter(endpoint => endpoint.id !== endpointId)
      }));
    }
  };

  const handleSaveEndpoint = (endpoint: APIEndpoint) => {
    if (selectedEndpoint) {
      setSettings(prev => ({
        ...prev,
        endpoints: prev.endpoints.map(e => e.id === endpoint.id ? endpoint : e)
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        endpoints: [...prev.endpoints, endpoint]
      }));
    }
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Add toast notification
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'green';
      case 'warning': return 'yellow';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      default: return AlertTriangle;
    }
  };

  const authTypes = [
    { value: 'none', label: 'No Authentication' },
    { value: 'api-key', label: 'API Key' },
    { value: 'bearer', label: 'Bearer Token' },
    { value: 'oauth', label: 'OAuth 2.0' }
  ];

  const healthyEndpoints = settings.endpoints.filter(e => e.status === 'healthy').length;
  const totalEndpoints = settings.endpoints.length;
  const averageResponseTime = settings.endpoints.reduce((sum, e) => sum + (e.responseTime || 0), 0) / settings.endpoints.length;

  return (
    <div className="space-y-8">
      {/* API Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-4">
          <Database className="h-6 w-6 text-green-500" />
          <div>
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              API Configuration & Monitoring
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Manage API endpoints, authentication, and monitor the health of your external service connections
            </p>
          </div>
        </div>
      </div>

      {/* API Health Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">API Health</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalEndpoints > 0 ? Math.round((healthyEndpoints / totalEndpoints) * 100) : 0}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Endpoints</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalEndpoints}</p>
            </div>
            <Server className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {averageResponseTime ? Math.round(averageResponseTime) : 0}ms
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monitoring</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {settings.monitoring.enableHealthChecks ? 'Active' : 'Disabled'}
              </p>
            </div>
            <Shield className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Base Configuration */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Base Configuration
          </h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminFormField
            label="Base URL"
            type="text"
            value={settings.baseUrl}
            onChange={(value) => handleInputChange('baseUrl', value)}
            placeholder="https://api.yoursanctuary.org"
            help="Base URL for all API endpoints"
            required
          />
          
          <AdminFormField
            label="API Version"
            type="text"
            value={settings.version}
            onChange={(value) => handleInputChange('version', value)}
            placeholder="v1"
            required
          />
          
          <AdminFormField
            label="Request Timeout (seconds)"
            type="number"
            value={settings.timeout}
            onChange={(value) => handleInputChange('timeout', parseInt(value))}
            min={5}
            max={300}
            required
          />
          
          <AdminFormField
            label="Retry Attempts"
            type="number"
            value={settings.retryAttempts}
            onChange={(value) => handleInputChange('retryAttempts', parseInt(value))}
            min={0}
            max={10}
            required
          />
        </div>
      </div>

      {/* Authentication Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Authentication
          </h3>
        </div>
        
        <div className="space-y-6">
          <AdminFormField
            label="Authentication Type"
            type="select"
            value={settings.authentication.type}
            onChange={(value) => handleAuthChange('type', value)}
            options={authTypes}
            required
          />
          
          {settings.authentication.type === 'api-key' && (
            <div className="relative">
              <AdminFormField
                label="API Key"
                type={showSecrets.apiKey ? "text" : "password"}
                value={settings.authentication.apiKey || ''}
                onChange={(value) => handleAuthChange('apiKey', value)}
                placeholder="your-api-key"
              />
              <button
                type="button"
                onClick={() => toggleSecretVisibility('apiKey')}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showSecrets.apiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}
          
          {settings.authentication.type === 'bearer' && (
            <div className="relative">
              <AdminFormField
                label="Bearer Token"
                type={showSecrets.bearerToken ? "text" : "password"}
                value={settings.authentication.bearerToken || ''}
                onChange={(value) => handleAuthChange('bearerToken', value)}
                placeholder="your-bearer-token"
              />
              <button
                type="button"
                onClick={() => toggleSecretVisibility('bearerToken')}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showSecrets.bearerToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}
          
          {settings.authentication.type === 'oauth' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdminFormField
                label="Client ID"
                type="text"
                value={settings.authentication.oauth?.clientId || ''}
                onChange={(value) => handleOAuthChange('clientId', value)}
                placeholder="oauth-client-id"
              />
              
              <div className="relative">
                <AdminFormField
                  label="Client Secret"
                  type={showSecrets.clientSecret ? "text" : "password"}
                  value={settings.authentication.oauth?.clientSecret || ''}
                  onChange={(value) => handleOAuthChange('clientSecret', value)}
                  placeholder="oauth-client-secret"
                />
                <button
                  type="button"
                  onClick={() => toggleSecretVisibility('clientSecret')}
                  className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                >
                  {showSecrets.clientSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              <AdminFormField
                label="Auth URL"
                type="text"
                value={settings.authentication.oauth?.authUrl || ''}
                onChange={(value) => handleOAuthChange('authUrl', value)}
                placeholder="https://oauth.provider.com/auth"
              />
              
              <AdminFormField
                label="Token URL"
                type="text"
                value={settings.authentication.oauth?.tokenUrl || ''}
                onChange={(value) => handleOAuthChange('tokenUrl', value)}
                placeholder="https://oauth.provider.com/token"
              />
            </div>
          )}
        </div>
      </div>

      {/* API Endpoints */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            API Endpoints
          </h3>
          <AdminButton
            variant="primary"
            onClick={handleCreateEndpoint}
            icon={Plus}
          >
            Add Endpoint
          </AdminButton>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {settings.endpoints.map((endpoint) => {
            const StatusIcon = getStatusIcon(endpoint.status);
            return (
              <div key={endpoint.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h5 className="text-lg font-medium text-gray-900 dark:text-white">
                        {endpoint.name}
                      </h5>
                      <AdminBadge color="blue">{endpoint.method}</AdminBadge>
                      <AdminBadge color={getStatusColor(endpoint.status)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {endpoint.status}
                      </AdminBadge>
                      {!endpoint.enabled && (
                        <AdminBadge color="gray">Disabled</AdminBadge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm text-gray-900 dark:text-white">
                        {settings.baseUrl}{endpoint.url}
                      </code>
                      <button
                        onClick={() => copyToClipboard(`${settings.baseUrl}${endpoint.url}`)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy URL"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <a
                        href={`${settings.baseUrl}${endpoint.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      {endpoint.lastChecked && (
                        <span>Last checked: {endpoint.lastChecked.toLocaleString()}</span>
                      )}
                      {endpoint.responseTime && (
                        <span>Response time: {endpoint.responseTime}ms</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <AdminButton
                      size="sm"
                      variant="outline"
                      onClick={() => testEndpoint(endpoint.id)}
                      loading={testingEndpoint === endpoint.id}
                      icon={RefreshCw}
                    >
                      Test
                    </AdminButton>
                    <AdminButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditEndpoint(endpoint)}
                      icon={Edit}
                    >
                      Edit
                    </AdminButton>
                    <AdminButton
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteEndpoint(endpoint.id)}
                      icon={Trash2}
                    >
                      Delete
                    </AdminButton>
                  </div>
                </div>
              </div>
            );
          })}
          
          {settings.endpoints.length === 0 && (
            <div className="p-12 text-center">
              <Database className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No API endpoints configured
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Get started by adding your first API endpoint.
              </p>
              <AdminButton
                variant="primary"
                onClick={handleCreateEndpoint}
                icon={Plus}
                className="mt-4"
              >
                Add Your First Endpoint
              </AdminButton>
            </div>
          )}
        </div>
      </div>

      {/* Monitoring Settings */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Monitoring & Health Checks
          </h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdminFormField
              label="Health Check Interval (minutes)"
              type="number"
              value={settings.monitoring.checkInterval}
              onChange={(value) => handleMonitoringChange('checkInterval', parseInt(value))}
              min={1}
              max={60}
              disabled={!settings.monitoring.enableHealthChecks}
              required
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                id="enable-health-checks"
                type="checkbox"
                checked={settings.monitoring.enableHealthChecks}
                onChange={(e) => handleMonitoringChange('enableHealthChecks', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enable-health-checks" className="text-sm text-gray-700 dark:text-gray-300">
                Enable automatic health checks
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                id="enable-logging"
                type="checkbox"
                checked={settings.monitoring.enableLogging}
                onChange={(e) => handleMonitoringChange('enableLogging', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enable-logging" className="text-sm text-gray-700 dark:text-gray-300">
                Enable API request logging
              </label>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                id="enable-metrics"
                type="checkbox"
                checked={settings.monitoring.enableMetrics}
                onChange={(e) => handleMonitoringChange('enableMetrics', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enable-metrics" className="text-sm text-gray-700 dark:text-gray-300">
                Enable performance metrics collection
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Endpoint Modal */}
      <EditEndpointModal
        endpoint={selectedEndpoint}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEndpoint}
      />
    </div>
  );
};

export default APIConfiguration;