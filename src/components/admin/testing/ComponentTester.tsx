import React, { useState } from 'react';
import { 
  Palette, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Sun, 
  Moon,
  Eye,
  Settings,
  Code,
  TestTube
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminStatusBadge } from '../common/AdminStatusBadge';
import { AdminModal } from '../common/AdminModal';
import { AdminFormField } from '../common/AdminFormField';
import { AdminTable } from '../common/AdminTable';

interface ComponentVariant {
  name: string;
  props: Record<string, any>;
  description: string;
}

interface ComponentTest {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  variants: ComponentVariant[];
  category: 'form' | 'display' | 'navigation' | 'feedback';
}

const ComponentTester: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('AdminButton');
  const [selectedVariant, setSelectedVariant] = useState<string>('default');
  const [viewportSize, setViewportSize] = useState<string>('desktop');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showCode, setShowCode] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Sample data for table testing
  const sampleTableData = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'Inactive' }
  ];

  const componentTests: ComponentTest[] = [
    {
      id: 'AdminButton',
      name: 'Admin Button',
      component: AdminButton,
      category: 'form',
      variants: [
        {
          name: 'default',
          props: { children: 'Default Button' },
          description: 'Default button styling'
        },
        {
          name: 'primary',
          props: { children: 'Primary Button', variant: 'primary' },
          description: 'Primary action button'
        },
        {
          name: 'secondary',
          props: { children: 'Secondary Button', variant: 'secondary' },
          description: 'Secondary action button'
        },
        {
          name: 'danger',
          props: { children: 'Delete', variant: 'danger' },
          description: 'Destructive action button'
        },
        {
          name: 'with-icon',
          props: { children: 'Settings', icon: Settings },
          description: 'Button with icon'
        },
        {
          name: 'loading',
          props: { children: 'Loading...', loading: true },
          description: 'Loading state button'
        },
        {
          name: 'disabled',
          props: { children: 'Disabled', disabled: true },
          description: 'Disabled button state'
        }
      ]
    },
    {
      id: 'AdminStatusBadge',
      name: 'Status Badge',
      component: AdminStatusBadge,
      category: 'display',
      variants: [
        {
          name: 'success',
          props: { children: 'Success', variant: 'success' },
          description: 'Success status badge'
        },
        {
          name: 'error',
          props: { children: 'Error', variant: 'error' },
          description: 'Error status badge'
        },
        {
          name: 'warning',
          props: { children: 'Warning', variant: 'warning' },
          description: 'Warning status badge'
        },
        {
          name: 'info',
          props: { children: 'Info', variant: 'info' },
          description: 'Info status badge'
        },
        {
          name: 'neutral',
          props: { children: 'Neutral', variant: 'neutral' },
          description: 'Neutral status badge'
        },
        {
          name: 'small',
          props: { children: 'Small', variant: 'success', size: 'sm' },
          description: 'Small sized badge'
        },
        {
          name: 'large',
          props: { children: 'Large', variant: 'primary', size: 'lg' },
          description: 'Large sized badge'
        }
      ]
    },
    {
      id: 'AdminFormField',
      name: 'Form Field',
      component: AdminFormField,
      category: 'form',
      variants: [
        {
          name: 'text',
          props: { 
            label: 'Name', 
            value: 'John Doe', 
            onChange: () => {}, 
            placeholder: 'Enter your name' 
          },
          description: 'Basic text input field'
        },
        {
          name: 'email',
          props: { 
            label: 'Email', 
            type: 'email',
            value: 'john@example.com', 
            onChange: () => {},
            placeholder: 'Enter your email' 
          },
          description: 'Email input field'
        },
        {
          name: 'password',
          props: { 
            label: 'Password', 
            type: 'password',
            value: 'secret123', 
            onChange: () => {},
            placeholder: 'Enter your password' 
          },
          description: 'Password input field'
        },
        {
          name: 'textarea',
          props: { 
            label: 'Description', 
            type: 'textarea',
            value: 'This is a longer description that spans multiple lines...', 
            onChange: () => {},
            rows: 4,
            placeholder: 'Enter description' 
          },
          description: 'Multi-line text area'
        },
        {
          name: 'required',
          props: { 
            label: 'Required Field', 
            value: '', 
            onChange: () => {},
            required: true,
            placeholder: 'This field is required' 
          },
          description: 'Required field with validation'
        },
        {
          name: 'error',
          props: { 
            label: 'Field with Error', 
            value: 'invalid@', 
            onChange: () => {},
            error: 'Please enter a valid email address',
            placeholder: 'Enter valid email' 
          },
          description: 'Field with error state'
        },
        {
          name: 'disabled',
          props: { 
            label: 'Disabled Field', 
            value: 'Cannot edit this', 
            onChange: () => {},
            disabled: true 
          },
          description: 'Disabled field state'
        }
      ]
    },
    {
      id: 'AdminTable',
      name: 'Data Table',
      component: AdminTable,
      category: 'display',
      variants: [
        {
          name: 'basic',
          props: {
            data: sampleTableData,
            columns: [
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role' },
              { key: 'status', label: 'Status' }
            ]
          },
          description: 'Basic data table'
        },
        {
          name: 'with-actions',
          props: {
            data: sampleTableData,
            columns: [
              { key: 'name', label: 'Name' },
              { key: 'email', label: 'Email' },
              { key: 'role', label: 'Role' }
            ],
            actions: [
              { label: 'Edit', onClick: () => alert('Edit clicked') },
              { label: 'Delete', onClick: () => alert('Delete clicked'), variant: 'danger' }
            ]
          },
          description: 'Table with action buttons'
        },
        {
          name: 'sortable',
          props: {
            data: sampleTableData,
            columns: [
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'role', label: 'Role', sortable: true }
            ]
          },
          description: 'Sortable table columns'
        }
      ]
    }
  ];

  const selectedTest = componentTests.find(test => test.id === selectedComponent);
  const selectedVariantData = selectedTest?.variants.find(variant => variant.name === selectedVariant);

  const getViewportClass = () => {
    switch (viewportSize) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-md';
      case 'desktop':
        return 'max-w-full';
      default:
        return 'max-w-full';
    }
  };

  const getViewportIcon = (size: string) => {
    switch (size) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      case 'desktop':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const generateCode = () => {
    if (!selectedTest || !selectedVariantData) return '';
    
    const { component, name } = selectedTest;
    const { props } = selectedVariantData;
    
    const propsString = Object.entries(props)
      .filter(([key]) => key !== 'children')
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}="${value}"`;
        } else if (typeof value === 'boolean') {
          return value ? key : '';
        } else if (typeof value === 'function') {
          return `${key}={() => {}}`;
        } else {
          return `${key}={${JSON.stringify(value)}}`;
        }
      })
      .filter(Boolean)
      .join('\n  ');

    const children = props.children || '';
    
    return `<${name}${propsString ? '\n  ' + propsString : ''}${children ? `>\n  ${children}\n</${name}>` : ' />'}`;
  };

  const renderComponent = () => {
    if (!selectedTest || !selectedVariantData) return null;

    const Component = selectedTest.component;
    const props = { ...selectedVariantData.props };

    try {
      return <Component {...props} />;
    } catch (error) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">
            Error rendering component: {(error as Error).message}
          </p>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <TestTube className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Component Tester
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Interactive testing for admin UI components
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <select
              value={selectedComponent}
              onChange={(e) => {
                setSelectedComponent(e.target.value);
                setSelectedVariant('default');
              }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {componentTests.map(test => (
                <option key={test.id} value={test.id}>
                  {test.name}
                </option>
              ))}
            </select>

            {selectedTest && (
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {selectedTest.variants.map(variant => (
                  <option key={variant.name} value={variant.name}>
                    {variant.name}
                  </option>
                ))}
              </select>
            )}

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Viewport:</span>
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                {['mobile', 'tablet', 'desktop'].map(size => (
                  <button
                    key={size}
                    onClick={() => setViewportSize(size)}
                    className={`px-3 py-2 text-sm transition-colors ${
                      viewportSize === size
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {getViewportIcon(size)}
                      {size}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <AdminButton
              onClick={() => setShowCode(!showCode)}
              variant="secondary"
              icon={Code}
            >
              {showCode ? 'Hide Code' : 'View Code'}
            </AdminButton>

            <AdminButton
              onClick={() => setShowModal(true)}
              icon={Eye}
            >
              Test Modal
            </AdminButton>
          </div>
        </div>

        {/* Component Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Component Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Preview: {selectedTest?.name} - {selectedVariantData?.name}
                </h2>
                <AdminStatusBadge variant="info">{viewportSize}</AdminStatusBadge>
              </div>
              
              <div className={`${getViewportClass()} mx-auto`}>
                <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  {renderComponent()}
                </div>
              </div>

              {selectedVariantData && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    {selectedVariantData.description}
                  </p>
                </div>
              )}
            </div>

            {/* Code Display */}
            {showCode && (
              <div className="mt-6 bg-gray-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Component Code</h3>
                  <button
                    onClick={() => navigator.clipboard.writeText(generateCode())}
                    className="px-3 py-1 bg-gray-700 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                  >
                    Copy
                  </button>
                </div>
                <pre className="text-green-400 text-sm overflow-x-auto">
                  <code>{generateCode()}</code>
                </pre>
              </div>
            )}
          </div>

          {/* Component List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Available Components
            </h3>
            <div className="space-y-2">
              {componentTests.map(test => (
                <button
                  key={test.id}
                  onClick={() => {
                    setSelectedComponent(test.id);
                    setSelectedVariant(test.variants[0]?.name || 'default');
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedComponent === test.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {test.variants.length} variants • {test.category}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test Modal */}
        <AdminModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Test Modal Component"
          size="lg"
        >
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This is a test modal to verify modal functionality works correctly across different screen sizes and themes.
            </p>
            <div className="space-y-4">
              <AdminFormField
                label="Test Input"
                value=""
                onChange={() => {}}
                placeholder="Type something here..."
              />
              <div className="flex gap-2">
                <AdminButton variant="primary">Save</AdminButton>
                <AdminButton variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </AdminButton>
              </div>
            </div>
          </div>
        </AdminModal>
      </div>
    </div>
  );
};

export default ComponentTester;