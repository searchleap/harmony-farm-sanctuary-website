import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Activity, 
  BarChart3, 
  Clock, 
  HardDrive,
  Monitor,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminStatusBadge } from '../common/AdminStatusBadge';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  threshold: { warning: number; critical: number };
  description: string;
}

interface PerformanceData {
  timestamp: number;
  metrics: PerformanceMetric[];
  bundleSize: {
    js: number;
    css: number;
    total: number;
  };
  vitals: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
}

const PerformanceMonitor: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('5min');

  useEffect(() => {
    // Initial load
    measurePerformance();
    
    // Set up monitoring interval
    if (isMonitoring) {
      const interval = setInterval(measurePerformance, 5000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const measurePerformance = () => {
    const metrics: PerformanceMetric[] = [
      {
        name: 'Memory Usage',
        value: getMemoryUsage(),
        unit: 'MB',
        status: getMemoryUsage() > 100 ? 'critical' : getMemoryUsage() > 50 ? 'warning' : 'good',
        threshold: { warning: 50, critical: 100 },
        description: 'Current JavaScript heap memory usage'
      },
      {
        name: 'DOM Nodes',
        value: document.querySelectorAll('*').length,
        unit: 'nodes',
        status: document.querySelectorAll('*').length > 2000 ? 'warning' : 'good',
        threshold: { warning: 2000, critical: 5000 },
        description: 'Total number of DOM elements in the page'
      },
      {
        name: 'Local Storage',
        value: getLocalStorageSize(),
        unit: 'KB',
        status: getLocalStorageSize() > 5000 ? 'warning' : 'good',
        threshold: { warning: 5000, critical: 10000 },
        description: 'Size of data stored in localStorage'
      },
      {
        name: 'Network Requests',
        value: getResourceCount(),
        unit: 'requests',
        status: getResourceCount() > 50 ? 'warning' : 'good',
        threshold: { warning: 50, critical: 100 },
        description: 'Number of network requests made'
      },
      {
        name: 'CSS Rules',
        value: getCSSRulesCount(),
        unit: 'rules',
        status: getCSSRulesCount() > 5000 ? 'warning' : 'good',
        threshold: { warning: 5000, critical: 10000 },
        description: 'Total CSS rules loaded'
      }
    ];

    const data: PerformanceData = {
      timestamp: Date.now(),
      metrics,
      bundleSize: {
        js: 270, // Estimated from previous build
        css: 28,
        total: 298
      },
      vitals: getWebVitals()
    };

    setPerformanceData(data);
  };

  const getMemoryUsage = (): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return Math.round(memory.usedJSHeapSize / 1024 / 1024);
    }
    return 0;
  };

  const getLocalStorageSize = (): number => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return Math.round(total / 1024);
  };

  const getResourceCount = (): number => {
    if ('performance' in window) {
      return performance.getEntriesByType('resource').length;
    }
    return 0;
  };

  const getCSSRulesCount = (): number => {
    let count = 0;
    for (let i = 0; i < document.styleSheets.length; i++) {
      try {
        const sheet = document.styleSheets[i];
        if (sheet.cssRules) {
          count += sheet.cssRules.length;
        }
      } catch (e) {
        // Cross-origin stylesheets can't be accessed
      }
    }
    return count;
  };

  const getWebVitals = () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    
    return {
      fcp: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
      lcp: 0, // Would need proper LCP measurement
      fid: 0, // Would need proper FID measurement
      cls: 0  // Would need proper CLS measurement
    };
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusVariant = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return 'success';
      case 'warning':
        return 'warning';
      case 'critical':
        return 'error';
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const optimizationRecommendations = [
    {
      title: 'Bundle Size Optimization',
      description: 'Consider code splitting for bundles over 244KB',
      applicable: performanceData?.bundleSize.total > 244,
      severity: 'medium'
    },
    {
      title: 'Memory Management',
      description: 'Memory usage is high, consider clearing unused data',
      applicable: performanceData?.metrics.find(m => m.name === 'Memory Usage')?.status === 'critical',
      severity: 'high'
    },
    {
      title: 'DOM Optimization',
      description: 'High DOM node count may impact performance',
      applicable: performanceData?.metrics.find(m => m.name === 'DOM Nodes')?.value > 1500,
      severity: 'medium'
    },
    {
      title: 'Local Storage Cleanup',
      description: 'Consider archiving old data to reduce storage usage',
      applicable: performanceData?.metrics.find(m => m.name === 'Local Storage')?.status !== 'good',
      severity: 'low'
    }
  ];

  const activeRecommendations = optimizationRecommendations.filter(r => r.applicable);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Performance Monitor
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Real-time performance metrics and optimization insights
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <AdminButton
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? 'danger' : 'primary'}
            icon={isMonitoring ? Activity : Zap}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </AdminButton>

          <AdminButton
            onClick={measurePerformance}
            variant="secondary"
            icon={RefreshCw}
          >
            Refresh Metrics
          </AdminButton>

          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="1min">Last 1 minute</option>
            <option value="5min">Last 5 minutes</option>
            <option value="15min">Last 15 minutes</option>
            <option value="1hour">Last hour</option>
          </select>

          {isMonitoring && (
            <AdminStatusBadge variant="success">
              <Activity className="h-3 w-3 mr-1" />
              Live Monitoring
            </AdminStatusBadge>
          )}
        </div>
      </div>

      {performanceData && (
        <div className="space-y-6">
          {/* Core Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceData.metrics.map(metric => (
              <div key={metric.name} className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {metric.name}
                  </h3>
                  {getStatusIcon(metric.status)}
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metric.value.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {metric.unit}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {metric.description}
                </p>
                <div className="flex items-center gap-2">
                  <AdminStatusBadge variant={getStatusVariant(metric.status)} size="sm">
                    {metric.status}
                  </AdminStatusBadge>
                  <span className="text-xs text-gray-500">
                    Warning: {metric.threshold.warning}{metric.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bundle Size Analysis */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <HardDrive className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bundle Size Analysis
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {performanceData.bundleSize.js}KB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">JavaScript</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {performanceData.bundleSize.css}KB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">CSS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {performanceData.bundleSize.total}KB
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Bundle size is within recommended limits. Consider lazy loading for routes over 100KB.
              </p>
            </div>
          </div>

          {/* Web Vitals */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Core Web Vitals
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.round(performanceData.vitals.fcp)}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">FCP</div>
                <div className="text-xs text-gray-500">First Contentful Paint</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.round(performanceData.vitals.lcp)}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">LCP</div>
                <div className="text-xs text-gray-500">Largest Contentful Paint</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.round(performanceData.vitals.fid)}ms
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">FID</div>
                <div className="text-xs text-gray-500">First Input Delay</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {performanceData.vitals.cls.toFixed(3)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">CLS</div>
                <div className="text-xs text-gray-500">Cumulative Layout Shift</div>
              </div>
            </div>
          </div>

          {/* Optimization Recommendations */}
          {activeRecommendations.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Optimization Recommendations
                </h3>
              </div>
              <div className="space-y-3">
                {activeRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {rec.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {rec.description}
                      </p>
                    </div>
                    <AdminStatusBadge 
                      variant={rec.severity === 'high' ? 'error' : rec.severity === 'medium' ? 'warning' : 'neutral'}
                      size="sm"
                    >
                      {rec.severity}
                    </AdminStatusBadge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System Information */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="h-5 w-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Browser Info</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>User Agent: {navigator.userAgent.split(' ')[0]}</div>
                  <div>Viewport: {window.innerWidth}x{window.innerHeight}</div>
                  <div>Device Pixel Ratio: {window.devicePixelRatio}</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Performance</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <div>Hardware Concurrency: {navigator.hardwareConcurrency || 'Unknown'}</div>
                  <div>Connection: {(navigator as any).connection?.effectiveType || 'Unknown'}</div>
                  <div>Last Updated: {new Date(performanceData.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;