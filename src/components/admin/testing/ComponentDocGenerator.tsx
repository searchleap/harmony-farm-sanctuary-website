import React, { useState } from 'react';
import { 
  Code2, 
  FileText, 
  Download, 
  Copy, 
  Eye, 
  Settings,
  Palette,
  Zap
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminStatusBadge } from '../common/AdminStatusBadge';
import { AdminFormField } from '../common/AdminFormField';
import { AdminTable } from '../common/AdminTable';
import { AdminModal } from '../common/AdminModal';

interface ComponentDoc {
  name: string;
  description: string;
  props: PropDoc[];
  examples: ExampleDoc[];
  category: 'form' | 'display' | 'navigation' | 'feedback' | 'layout';
  component: React.ComponentType<any>;
}

interface PropDoc {
  name: string;
  type: string;
  description: string;
  required: boolean;
  defaultValue?: string;
}

interface ExampleDoc {
  title: string;
  description: string;
  code: string;
  props: Record<string, any>;
}

const ComponentDocGenerator: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<string>('AdminButton');
  const [showLivePreview, setShowLivePreview] = useState(true);
  const [selectedExample, setSelectedExample] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  const componentDocs: ComponentDoc[] = [
    {
      name: 'AdminButton',
      description: 'A versatile button component with multiple variants, sizes, and states for admin interface actions.',
      category: 'form',
      component: AdminButton,
      props: [
        {
          name: 'variant',
          type: "'primary' | 'secondary' | 'danger' | 'success' | 'outline'",
          description: 'Visual style variant of the button',
          required: false,
          defaultValue: 'primary'
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          description: 'Size of the button',
          required: false,
          defaultValue: 'md'
        },
        {
          name: 'icon',
          type: 'React.ComponentType',
          description: 'Lucide React icon component to display',
          required: false
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Shows loading spinner and disables interaction',
          required: false,
          defaultValue: 'false'
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Disables button interaction',
          required: false,
          defaultValue: 'false'
        },
        {
          name: 'onClick',
          type: '(event: MouseEvent) => void',
          description: 'Click event handler',
          required: false
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Button content/text',
          required: true
        }
      ],
      examples: [
        {
          title: 'Basic Button',
          description: 'Simple button with default styling',
          code: `<AdminButton onClick={() => console.log('clicked')}>
  Click Me
</AdminButton>`,
          props: { children: 'Click Me' }
        },
        {
          title: 'Primary Button with Icon',
          description: 'Primary style button with an icon',
          code: `<AdminButton 
  variant="primary" 
  icon={Settings}
  onClick={() => console.log('settings')}
>
  Settings
</AdminButton>`,
          props: { variant: 'primary', icon: Settings, children: 'Settings' }
        },
        {
          title: 'Loading State',
          description: 'Button showing loading spinner',
          code: `<AdminButton 
  loading={true}
  onClick={() => console.log('loading')}
>
  Saving...
</AdminButton>`,
          props: { loading: true, children: 'Saving...' }
        },
        {
          title: 'Danger Button',
          description: 'Destructive action button',
          code: `<AdminButton 
  variant="danger"
  onClick={() => console.log('delete')}
>
  Delete
</AdminButton>`,
          props: { variant: 'danger', children: 'Delete' }
        }
      ]
    },
    {
      name: 'AdminStatusBadge',
      description: 'Status indicator badge with color variants for displaying states and categories.',
      category: 'display',
      component: AdminStatusBadge,
      props: [
        {
          name: 'variant',
          type: "'success' | 'error' | 'warning' | 'info' | 'neutral' | 'primary' | 'secondary'",
          description: 'Color variant of the badge',
          required: true
        },
        {
          name: 'size',
          type: "'sm' | 'md' | 'lg'",
          description: 'Size of the badge',
          required: false,
          defaultValue: 'md'
        },
        {
          name: 'icon',
          type: 'React.ReactNode',
          description: 'Optional icon to display in badge',
          required: false
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Badge content/text',
          required: true
        }
      ],
      examples: [
        {
          title: 'Success Badge',
          description: 'Green badge for positive status',
          code: `<AdminStatusBadge variant="success">
  Active
</AdminStatusBadge>`,
          props: { variant: 'success', children: 'Active' }
        },
        {
          title: 'Error Badge',
          description: 'Red badge for error states',
          code: `<AdminStatusBadge variant="error">
  Failed
</AdminStatusBadge>`,
          props: { variant: 'error', children: 'Failed' }
        },
        {
          title: 'Small Info Badge',
          description: 'Small size info badge',
          code: `<AdminStatusBadge variant="info" size="sm">
  New
</AdminStatusBadge>`,
          props: { variant: 'info', size: 'sm', children: 'New' }
        }
      ]
    },
    {
      name: 'AdminFormField',
      description: 'Standardized form input component with validation, labels, and error handling.',
      category: 'form',
      component: AdminFormField,
      props: [
        {
          name: 'label',
          type: 'string',
          description: 'Label text for the input field',
          required: true
        },
        {
          name: 'value',
          type: 'string',
          description: 'Current value of the input',
          required: true
        },
        {
          name: 'onChange',
          type: '(value: string) => void',
          description: 'Callback function when value changes',
          required: true
        },
        {
          name: 'type',
          type: "'text' | 'email' | 'password' | 'number' | 'textarea' | 'date'",
          description: 'Input type for validation and UI',
          required: false,
          defaultValue: 'text'
        },
        {
          name: 'placeholder',
          type: 'string',
          description: 'Placeholder text for empty input',
          required: false
        },
        {
          name: 'required',
          type: 'boolean',
          description: 'Whether the field is required',
          required: false,
          defaultValue: 'false'
        },
        {
          name: 'error',
          type: 'string',
          description: 'Error message to display',
          required: false
        },
        {
          name: 'helpText',
          type: 'string',
          description: 'Help text below the input',
          required: false
        },
        {
          name: 'disabled',
          type: 'boolean',
          description: 'Whether the input is disabled',
          required: false,
          defaultValue: 'false'
        }
      ],
      examples: [
        {
          title: 'Basic Text Input',
          description: 'Simple text input with label',
          code: `<AdminFormField
  label="Animal Name"
  value={name}
  onChange={setName}
  placeholder="Enter animal name"
/>`,
          props: { 
            label: 'Animal Name', 
            value: 'Bella', 
            onChange: () => {}, 
            placeholder: 'Enter animal name' 
          }
        },
        {
          title: 'Email Input with Validation',
          description: 'Email input with error state',
          code: `<AdminFormField
  label="Email Address"
  type="email"
  value={email}
  onChange={setEmail}
  error="Please enter a valid email"
  required
/>`,
          props: { 
            label: 'Email Address', 
            type: 'email',
            value: 'invalid@', 
            onChange: () => {}, 
            error: 'Please enter a valid email',
            required: true 
          }
        },
        {
          title: 'Textarea with Help Text',
          description: 'Multi-line text input with help',
          code: `<AdminFormField
  label="Animal Story"
  type="textarea"
  value={story}
  onChange={setStory}
  helpText="Tell us about this animal's background"
  rows={4}
/>`,
          props: { 
            label: 'Animal Story', 
            type: 'textarea',
            value: 'Bella is a wonderful pig who loves...',
            onChange: () => {}, 
            helpText: "Tell us about this animal's background"
          }
        }
      ]
    },
    {
      name: 'AdminTable',
      description: 'Data table component with sorting, actions, and responsive design for displaying admin data.',
      category: 'display',
      component: AdminTable,
      props: [
        {
          name: 'data',
          type: 'Array<Record<string, any>>',
          description: 'Array of data objects to display',
          required: true
        },
        {
          name: 'columns',
          type: 'Array<{ key: string; label: string; sortable?: boolean }>',
          description: 'Column configuration for the table',
          required: true
        },
        {
          name: 'actions',
          type: 'Array<{ label: string; onClick: (item: any) => void; variant?: string }>',
          description: 'Action buttons for each row',
          required: false
        },
        {
          name: 'loading',
          type: 'boolean',
          description: 'Show loading state',
          required: false,
          defaultValue: 'false'
        },
        {
          name: 'emptyMessage',
          type: 'string',
          description: 'Message to show when no data',
          required: false,
          defaultValue: 'No data available'
        }
      ],
      examples: [
        {
          title: 'Basic Data Table',
          description: 'Simple table with data and columns',
          code: `<AdminTable
  data={animals}
  columns={[
    { key: 'name', label: 'Name' },
    { key: 'species', label: 'Species' },
    { key: 'age', label: 'Age' }
  ]}
/>`,
          props: {
            data: [
              { id: '1', name: 'Bella', species: 'Pig', age: 5 },
              { id: '2', name: 'Charlie', species: 'Goat', age: 3 }
            ],
            columns: [
              { key: 'name', label: 'Name' },
              { key: 'species', label: 'Species' },
              { key: 'age', label: 'Age' }
            ]
          }
        },
        {
          title: 'Table with Actions',
          description: 'Table with action buttons',
          code: `<AdminTable
  data={animals}
  columns={columns}
  actions={[
    { label: 'Edit', onClick: editAnimal },
    { label: 'Delete', onClick: deleteAnimal, variant: 'danger' }
  ]}
/>`,
          props: {
            data: [
              { id: '1', name: 'Bella', species: 'Pig', age: 5 },
              { id: '2', name: 'Charlie', species: 'Goat', age: 3 }
            ],
            columns: [
              { key: 'name', label: 'Name' },
              { key: 'species', label: 'Species' }
            ],
            actions: [
              { label: 'Edit', onClick: () => alert('Edit') },
              { label: 'Delete', onClick: () => alert('Delete'), variant: 'danger' }
            ]
          }
        }
      ]
    }
  ];

  const selectedDoc = componentDocs.find(doc => doc.name === selectedComponent);
  const currentExample = selectedDoc?.examples[selectedExample];

  const generateMarkdownDoc = (doc: ComponentDoc) => {
    const markdown = `# ${doc.name}

${doc.description}

## Category
${doc.category}

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
${doc.props.map(prop => 
  `| \`${prop.name}\` | \`${prop.type}\` | ${prop.required ? '✅' : '❌'} | \`${prop.defaultValue || 'undefined'}\` | ${prop.description} |`
).join('\n')}

## Examples

${doc.examples.map((example, index) => `
### ${index + 1}. ${example.title}

${example.description}

\`\`\`tsx
${example.code}
\`\`\`
`).join('\n')}

## Usage Notes

- Import from: \`../common/${doc.name}\`
- Category: ${doc.category}
- Part of admin component library

## Related Components

${componentDocs
  .filter(other => other.category === doc.category && other.name !== doc.name)
  .map(other => `- ${other.name}`)
  .join('\n')}
`;

    return markdown;
  };

  const copyMarkdown = () => {
    if (selectedDoc) {
      const markdown = generateMarkdownDoc(selectedDoc);
      navigator.clipboard.writeText(markdown);
    }
  };

  const downloadMarkdown = () => {
    if (selectedDoc) {
      const markdown = generateMarkdownDoc(selectedDoc);
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedDoc.name}-documentation.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const renderLiveExample = () => {
    if (!selectedDoc || !currentExample) return null;

    const Component = selectedDoc.component;
    try {
      return <Component {...currentExample.props} />;
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
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Code2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Component Documentation Generator
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Auto-generated documentation for admin UI components
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <select
            value={selectedComponent}
            onChange={(e) => {
              setSelectedComponent(e.target.value);
              setSelectedExample(0);
            }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {componentDocs.map(doc => (
              <option key={doc.name} value={doc.name}>
                {doc.name}
              </option>
            ))}
          </select>

          <AdminButton
            onClick={() => setShowLivePreview(!showLivePreview)}
            variant="secondary"
            icon={Eye}
          >
            {showLivePreview ? 'Hide Preview' : 'Show Preview'}
          </AdminButton>

          <AdminButton
            onClick={copyMarkdown}
            variant="secondary"
            icon={Copy}
          >
            Copy Markdown
          </AdminButton>

          <AdminButton
            onClick={downloadMarkdown}
            variant="secondary"
            icon={Download}
          >
            Download MD
          </AdminButton>

          <AdminButton
            onClick={() => setShowModal(true)}
            icon={Settings}
          >
            Generate All Docs
          </AdminButton>
        </div>
      </div>

      {selectedDoc && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Documentation */}
          <div className="space-y-6">
            {/* Component Info */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedDoc.name}
                </h2>
                <AdminStatusBadge variant="info">
                  {selectedDoc.category}
                </AdminStatusBadge>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {selectedDoc.description}
              </p>
            </div>

            {/* Props Documentation */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Props
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left p-2 font-medium text-gray-900 dark:text-white">Prop</th>
                      <th className="text-left p-2 font-medium text-gray-900 dark:text-white">Type</th>
                      <th className="text-left p-2 font-medium text-gray-900 dark:text-white">Required</th>
                      <th className="text-left p-2 font-medium text-gray-900 dark:text-white">Default</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDoc.props.map(prop => (
                      <tr key={prop.name} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="p-2">
                          <code className="text-blue-600 dark:text-blue-400">{prop.name}</code>
                        </td>
                        <td className="p-2">
                          <code className="text-xs text-gray-600 dark:text-gray-400">{prop.type}</code>
                        </td>
                        <td className="p-2">
                          {prop.required ? (
                            <AdminStatusBadge variant="error" size="sm">Required</AdminStatusBadge>
                          ) : (
                            <AdminStatusBadge variant="neutral" size="sm">Optional</AdminStatusBadge>
                          )}
                        </td>
                        <td className="p-2">
                          <code className="text-xs text-gray-500">{prop.defaultValue || 'undefined'}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Examples */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Examples
              </h3>
              <div className="space-y-4">
                {selectedDoc.examples.map((example, index) => (
                  <div key={index}>
                    <button
                      onClick={() => setSelectedExample(index)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedExample === index
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">
                        {example.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {example.description}
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview and Code */}
          <div className="space-y-6">
            {/* Live Preview */}
            {showLivePreview && currentExample && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Live Preview: {currentExample.title}
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  {renderLiveExample()}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {currentExample.description}
                </p>
              </div>
            )}

            {/* Code Example */}
            {currentExample && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Code Example
                  </h3>
                  <AdminButton
                    onClick={() => navigator.clipboard.writeText(currentExample.code)}
                    variant="secondary"
                    size="sm"
                    icon={Copy}
                  >
                    Copy
                  </AdminButton>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{currentExample.code}</code>
                </pre>
              </div>
            )}

            {/* Usage Notes */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Usage Notes
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p><strong>Import path:</strong> <code>../common/{selectedDoc.name}</code></p>
                <p><strong>Category:</strong> {selectedDoc.category}</p>
                <p><strong>Related components:</strong> {
                  componentDocs
                    .filter(doc => doc.category === selectedDoc.category && doc.name !== selectedDoc.name)
                    .map(doc => doc.name)
                    .join(', ') || 'None'
                }</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate All Docs Modal */}
      <AdminModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Generate Complete Documentation"
        size="lg"
      >
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Generate complete markdown documentation for all admin components.
          </p>
          
          <div className="space-y-4 mb-6">
            {componentDocs.map(doc => (
              <div key={doc.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{doc.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{doc.category}</div>
                </div>
                <AdminStatusBadge variant="success" size="sm">
                  {doc.examples.length} examples
                </AdminStatusBadge>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <AdminButton
              onClick={() => {
                // Generate all documentation
                const allDocs = componentDocs.map(doc => generateMarkdownDoc(doc)).join('\n\n---\n\n');
                const blob = new Blob([allDocs], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'admin-components-documentation.md';
                a.click();
                URL.revokeObjectURL(url);
                setShowModal(false);
              }}
              variant="primary"
              icon={Download}
            >
              Download All Docs
            </AdminButton>
            <AdminButton
              onClick={() => setShowModal(false)}
              variant="secondary"
            >
              Cancel
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default ComponentDocGenerator;