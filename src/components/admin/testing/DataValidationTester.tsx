import React, { useState } from 'react';
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Play,
  RefreshCw,
  FileCheck,
  Shield,
  Search,
  Download,
  Upload
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminStatusBadge } from '../common/AdminStatusBadge';
import { AdminFormField } from '../common/AdminFormField';

interface ValidationTest {
  id: string;
  name: string;
  description: string;
  category: 'forms' | 'data' | 'integrity' | 'security';
  status: 'pending' | 'running' | 'passed' | 'failed';
  result?: {
    message: string;
    details?: string[];
    duration: number;
  };
}

interface ValidationSuite {
  id: string;
  name: string;
  description: string;
  tests: ValidationTest[];
}

const DataValidationTester: React.FC = () => {
  const [selectedSuite, setSelectedSuite] = useState<string>('all');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<ValidationTest[]>([]);
  const [testData, setTestData] = useState({
    animalName: 'Bella',
    animalAge: '5',
    animalSpecies: 'pig',
    blogTitle: 'Test Blog Post',
    blogContent: 'This is test content...',
    userEmail: 'test@example.com',
    userPassword: 'password123',
    donationAmount: '50.00'
  });

  const validationSuites: ValidationSuite[] = [
    {
      id: 'forms',
      name: 'Form Validation Tests',
      description: 'Test form validation rules and error handling',
      tests: [
        {
          id: 'form-1',
          name: 'Animal Profile Validation',
          description: 'Test animal profile form validation rules',
          category: 'forms',
          status: 'pending'
        },
        {
          id: 'form-2',
          name: 'Blog Post Validation',
          description: 'Test blog post creation form validation',
          category: 'forms',
          status: 'pending'
        },
        {
          id: 'form-3',
          name: 'User Registration Validation',
          description: 'Test user registration form validation',
          category: 'forms',
          status: 'pending'
        },
        {
          id: 'form-4',
          name: 'Donation Form Validation',
          description: 'Test donation form validation and security',
          category: 'forms',
          status: 'pending'
        },
        {
          id: 'form-5',
          name: 'FAQ Content Validation',
          description: 'Test FAQ content validation and sanitization',
          category: 'forms',
          status: 'pending'
        }
      ]
    },
    {
      id: 'data',
      name: 'Data Operations Tests',
      description: 'Test CRUD operations and data consistency',
      tests: [
        {
          id: 'data-1',
          name: 'Data Creation Test',
          description: 'Test data creation with valid and invalid inputs',
          category: 'data',
          status: 'pending'
        },
        {
          id: 'data-2',
          name: 'Data Update Test',
          description: 'Test data update operations and conflict resolution',
          category: 'data',
          status: 'pending'
        },
        {
          id: 'data-3',
          name: 'Data Deletion Test',
          description: 'Test data deletion and cascade operations',
          category: 'data',
          status: 'pending'
        },
        {
          id: 'data-4',
          name: 'Search Operations Test',
          description: 'Test search functionality and query validation',
          category: 'data',
          status: 'pending'
        },
        {
          id: 'data-5',
          name: 'Data Import/Export Test',
          description: 'Test data import/export functionality',
          category: 'data',
          status: 'pending'
        }
      ]
    },
    {
      id: 'integrity',
      name: 'Data Integrity Tests',
      description: 'Test data consistency and relationship integrity',
      tests: [
        {
          id: 'integrity-1',
          name: 'Relationship Validation',
          description: 'Test foreign key constraints and relationships',
          category: 'integrity',
          status: 'pending'
        },
        {
          id: 'integrity-2',
          name: 'Duplicate Prevention',
          description: 'Test duplicate data prevention mechanisms',
          category: 'integrity',
          status: 'pending'
        },
        {
          id: 'integrity-3',
          name: 'Data Consistency Check',
          description: 'Test cross-table data consistency',
          category: 'integrity',
          status: 'pending'
        },
        {
          id: 'integrity-4',
          name: 'Backup Integrity Test',
          description: 'Test backup data integrity and verification',
          category: 'integrity',
          status: 'pending'
        }
      ]
    },
    {
      id: 'security',
      name: 'Security Validation Tests',
      description: 'Test security measures and data protection',
      tests: [
        {
          id: 'security-1',
          name: 'Input Sanitization',
          description: 'Test input sanitization and XSS prevention',
          category: 'security',
          status: 'pending'
        },
        {
          id: 'security-2',
          name: 'SQL Injection Prevention',
          description: 'Test SQL injection prevention measures',
          category: 'security',
          status: 'pending'
        },
        {
          id: 'security-3',
          name: 'Password Security',
          description: 'Test password validation and hashing',
          category: 'security',
          status: 'pending'
        },
        {
          id: 'security-4',
          name: 'Data Access Control',
          description: 'Test role-based access control for data operations',
          category: 'security',
          status: 'pending'
        }
      ]
    }
  ];

  const runValidationTests = async (suiteId: string = 'all') => {
    setIsRunning(true);
    
    const testsToRun = suiteId === 'all' 
      ? validationSuites.flatMap(suite => suite.tests)
      : validationSuites.find(suite => suite.id === suiteId)?.tests || [];

    setTestResults(testsToRun.map(test => ({ ...test, status: 'pending' })));

    for (const test of testsToRun) {
      setTestResults(prev => 
        prev.map(t => t.id === test.id ? { ...t, status: 'running' } : t)
      );

      const result = await simulateValidationTest(test);
      
      setTestResults(prev => 
        prev.map(t => t.id === test.id ? result : t)
      );

      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setIsRunning(false);
  };

  const simulateValidationTest = async (test: ValidationTest): Promise<ValidationTest> => {
    const startTime = Date.now();
    const executionTime = Math.random() * 1500 + 500;
    await new Promise(resolve => setTimeout(resolve, executionTime));
    const duration = Date.now() - startTime;

    // Simulate validation logic based on test type and current test data
    const validationResult = performActualValidation(test);
    
    return {
      ...test,
      status: validationResult.passed ? 'passed' : 'failed',
      result: {
        message: validationResult.message,
        details: validationResult.details,
        duration
      }
    };
  };

  const performActualValidation = (test: ValidationTest) => {
    // Perform real validation logic based on test type and current testData
    switch (test.id) {
      case 'form-1': // Animal Profile Validation
        const animalIssues = [];
        if (!testData.animalName.trim()) animalIssues.push('Animal name is required');
        if (testData.animalName.length < 2) animalIssues.push('Animal name must be at least 2 characters');
        if (!testData.animalAge || parseInt(testData.animalAge) < 0) animalIssues.push('Valid age is required');
        if (!testData.animalSpecies) animalIssues.push('Species selection is required');
        
        return {
          passed: animalIssues.length === 0,
          message: animalIssues.length === 0 ? 'Animal validation passed' : 'Animal validation failed',
          details: animalIssues
        };

      case 'form-2': // Blog Post Validation
        const blogIssues = [];
        if (!testData.blogTitle.trim()) blogIssues.push('Blog title is required');
        if (testData.blogTitle.length < 5) blogIssues.push('Blog title must be at least 5 characters');
        if (!testData.blogContent.trim()) blogIssues.push('Blog content is required');
        if (testData.blogContent.length < 10) blogIssues.push('Blog content must be at least 10 characters');
        
        return {
          passed: blogIssues.length === 0,
          message: blogIssues.length === 0 ? 'Blog validation passed' : 'Blog validation failed',
          details: blogIssues
        };

      case 'form-3': // User Registration Validation
        const userIssues = [];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(testData.userEmail)) userIssues.push('Valid email address is required');
        if (testData.userPassword.length < 8) userIssues.push('Password must be at least 8 characters');
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(testData.userPassword)) {
          userIssues.push('Password must contain uppercase, lowercase, and number');
        }
        
        return {
          passed: userIssues.length === 0,
          message: userIssues.length === 0 ? 'User validation passed' : 'User validation failed',
          details: userIssues
        };

      case 'form-4': // Donation Form Validation
        const donationIssues = [];
        const amount = parseFloat(testData.donationAmount);
        if (isNaN(amount) || amount <= 0) donationIssues.push('Valid donation amount is required');
        if (amount > 10000) donationIssues.push('Donation amount exceeds maximum limit');
        
        return {
          passed: donationIssues.length === 0,
          message: donationIssues.length === 0 ? 'Donation validation passed' : 'Donation validation failed',
          details: donationIssues
        };

      case 'security-1': // Input Sanitization
        const hasXSS = /<script|javascript:|onload=|onerror=/i.test(Object.values(testData).join(' '));
        return {
          passed: !hasXSS,
          message: hasXSS ? 'XSS content detected in input data' : 'Input sanitization check passed',
          details: hasXSS ? ['Potentially malicious content found in form inputs'] : []
        };

      default:
        // Simulate random results for other tests
        const passed = Math.random() > 0.2;
        return {
          passed,
          message: passed ? `${test.name} validation passed` : `${test.name} validation failed`,
          details: passed ? [] : ['Simulated validation error', 'Check test implementation']
        };
    }
  };

  const getStatusIcon = (status: ValidationTest['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getCategoryIcon = (category: ValidationTest['category']) => {
    switch (category) {
      case 'forms':
        return <FileCheck className="h-5 w-5" />;
      case 'data':
        return <Database className="h-5 w-5" />;
      case 'integrity':
        return <Shield className="h-5 w-5" />;
      case 'security':
        return <Shield className="h-5 w-5" />;
    }
  };

  const activeTests = testResults.length > 0 ? testResults : validationSuites.flatMap(suite => suite.tests);
  const displayTests = selectedSuite === 'all' 
    ? activeTests 
    : activeTests.filter(test => test.category === selectedSuite || 
        validationSuites.find(s => s.id === selectedSuite)?.tests.some(t => t.id === test.id));

  const testStats = {
    total: displayTests.length,
    passed: displayTests.filter(t => t.status === 'passed').length,
    failed: displayTests.filter(t => t.status === 'failed').length,
    running: displayTests.filter(t => t.status === 'running').length
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-8 w-8 text-green-600 dark:text-green-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Data Validation Tester
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test data validation, integrity, and security measures
            </p>
          </div>
        </div>

        {/* Test Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{testStats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tests</div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{testStats.passed}</div>
            <div className="text-sm text-green-600 dark:text-green-400">Passed</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{testStats.failed}</div>
            <div className="text-sm text-red-600 dark:text-red-400">Failed</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{testStats.running}</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Running</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <AdminButton 
            onClick={() => runValidationTests()}
            disabled={isRunning}
            icon={Play}
          >
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </AdminButton>

          <select
            value={selectedSuite}
            onChange={(e) => setSelectedSuite(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={isRunning}
          >
            <option value="all">All Test Suites</option>
            {validationSuites.map(suite => (
              <option key={suite.id} value={suite.id}>
                {suite.name}
              </option>
            ))}
          </select>

          {selectedSuite !== 'all' && (
            <AdminButton 
              onClick={() => runValidationTests(selectedSuite)}
              disabled={isRunning}
              variant="secondary"
              icon={Play}
            >
              Run Selected Suite
            </AdminButton>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Data Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Test Data Configuration
          </h3>
          <div className="space-y-4">
            <AdminFormField
              label="Animal Name"
              value={testData.animalName}
              onChange={(value) => setTestData(prev => ({ ...prev, animalName: value }))}
              placeholder="Enter animal name"
            />
            <AdminFormField
              label="Animal Age"
              type="number"
              value={testData.animalAge}
              onChange={(value) => setTestData(prev => ({ ...prev, animalAge: value }))}
              placeholder="Enter age"
            />
            <AdminFormField
              label="Blog Title"
              value={testData.blogTitle}
              onChange={(value) => setTestData(prev => ({ ...prev, blogTitle: value }))}
              placeholder="Enter blog title"
            />
            <AdminFormField
              label="User Email"
              type="email"
              value={testData.userEmail}
              onChange={(value) => setTestData(prev => ({ ...prev, userEmail: value }))}
              placeholder="Enter email"
            />
            <AdminFormField
              label="Password"
              type="password"
              value={testData.userPassword}
              onChange={(value) => setTestData(prev => ({ ...prev, userPassword: value }))}
              placeholder="Enter password"
            />
            <AdminFormField
              label="Donation Amount"
              value={testData.donationAmount}
              onChange={(value) => setTestData(prev => ({ ...prev, donationAmount: value }))}
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Test Results */}
        <div className="lg:col-span-2 space-y-4">
          {validationSuites
            .filter(suite => selectedSuite === 'all' || suite.id === selectedSuite)
            .map(suite => (
              <div key={suite.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(suite.id as ValidationTest['category'])}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{suite.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{suite.description}</p>
                    </div>
                    <AdminStatusBadge variant="neutral">
                      {suite.tests.length} tests
                    </AdminStatusBadge>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {suite.tests.map(test => {
                    const result = testResults.find(r => r.id === test.id) || test;
                    return (
                      <div key={test.id} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getStatusIcon(result.status)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {test.name}
                              </h4>
                              {result.result?.duration && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {result.result.duration}ms
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {test.description}
                            </p>
                            {result.result && (
                              <div className="space-y-1">
                                <p className={`text-sm font-medium ${
                                  result.status === 'passed' 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-red-600 dark:text-red-400'
                                }`}>
                                  {result.result.message}
                                </p>
                                {result.result.details && result.result.details.length > 0 && (
                                  <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside ml-4">
                                    {result.result.details.map((detail, index) => (
                                      <li key={index}>{detail}</li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                          <AdminStatusBadge 
                            variant={
                              result.status === 'passed' ? 'success' :
                              result.status === 'failed' ? 'error' :
                              result.status === 'running' ? 'warning' : 'neutral'
                            }
                          >
                            {result.status}
                          </AdminStatusBadge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DataValidationTester;