import React, { useState } from 'react';
import { 
  Book, 
  FileText, 
  Code, 
  Users, 
  Settings, 
  HelpCircle,
  ChevronRight,
  Search,
  Download,
  ExternalLink,
  Lightbulb,
  Shield,
  Zap
} from 'lucide-react';
import { AdminButton } from '../common/AdminButton';
import { AdminStatusBadge } from '../common/AdminStatusBadge';
import { AdminFormField } from '../common/AdminFormField';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'overview' | 'guides' | 'api' | 'components' | 'troubleshooting';
  content: DocContent[];
  lastUpdated: string;
}

interface DocContent {
  id: string;
  title: string;
  type: 'markdown' | 'component' | 'api' | 'tutorial';
  content: string;
  codeExample?: string;
  tags: string[];
}

const AdminDocumentation: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const documentationSections: DocSection[] = [
    {
      id: 'overview',
      title: 'Admin System Overview',
      description: 'Comprehensive overview of the admin system architecture and features',
      icon: <Book className="h-5 w-5" />,
      category: 'overview',
      lastUpdated: '2024-12-28',
      content: [
        {
          id: 'intro',
          title: 'Introduction to Admin System',
          type: 'markdown',
          tags: ['getting-started', 'overview'],
          content: `# Harmony Farm Sanctuary Admin System

The admin system is a comprehensive management interface designed for sanctuary staff to efficiently manage all aspects of the website and sanctuary operations.

## Key Features

### 🐾 Animal Management
- Complete animal profile system with photos, stories, and medical records
- Sponsorship tracking and donor management
- Care level categorization and special needs tracking

### 📝 Content Management
- Blog post creation and publishing with rich text editor
- FAQ management with categorization and search
- Educational resource library with file management

### 📊 Analytics & Reporting
- Visitor analytics and engagement metrics
- Donation tracking and financial reporting
- Content performance analysis

### ⚙️ System Configuration
- User role and permission management
- Site settings and appearance customization
- Integration with third-party services

### 🔧 Testing & Maintenance
- Comprehensive testing framework
- Data backup and export capabilities
- Performance monitoring and optimization

## System Architecture

The admin system follows a modular component-based architecture:

- **Authentication Layer**: Role-based access control
- **Data Layer**: Local storage with export/import capabilities
- **UI Components**: Reusable admin interface components
- **Testing Framework**: Automated testing and validation
- **Documentation**: Self-documenting system with guides`
        },
        {
          id: 'navigation',
          title: 'Navigation and Layout',
          type: 'markdown',
          tags: ['navigation', 'ui'],
          content: `# Admin Navigation

## Sidebar Navigation
The main navigation is located in the left sidebar and includes:

- **Dashboard**: Overview and quick statistics
- **Animals**: Animal profile management
- **Blog**: Content creation and management
- **FAQ**: Knowledge base management
- **Analytics**: Performance insights
- **Settings**: System configuration
- **Testing**: Quality assurance tools

## Responsive Design
- Desktop: Full sidebar visible
- Tablet: Collapsible sidebar
- Mobile: Hamburger menu with slide-out navigation

## Breadcrumbs
All admin pages include breadcrumb navigation showing:
- Current location in the admin hierarchy
- Quick navigation to parent sections
- Clear page context`
        }
      ]
    },
    {
      id: 'user-guides',
      title: 'User Guides',
      description: 'Step-by-step guides for common admin tasks',
      icon: <Users className="h-5 w-5" />,
      category: 'guides',
      lastUpdated: '2024-12-28',
      content: [
        {
          id: 'getting-started',
          title: 'Getting Started Guide',
          type: 'tutorial',
          tags: ['tutorial', 'beginner'],
          content: `# Getting Started with Admin System

## Step 1: Logging In
1. Navigate to the admin login page: \`/admin/login\`
2. Enter your credentials:
   - **Username**: Your assigned admin username
   - **Password**: Your secure password
3. Click "Login" to access the admin dashboard

## Step 2: Understanding the Dashboard
The dashboard provides:
- **Quick Stats**: Overview of animals, blog posts, and recent activity
- **Recent Activity**: Latest changes and updates
- **Quick Actions**: Common tasks and shortcuts

## Step 3: First Tasks
### Adding Your First Animal
1. Click "Animals" in the sidebar
2. Click "Add New Animal"
3. Fill in the required information:
   - Name
   - Species
   - Age
   - Story/Description
4. Upload a photo
5. Click "Save"

### Creating Your First Blog Post
1. Navigate to "Blog" section
2. Click "New Post"
3. Enter title and content
4. Select category and tags
5. Click "Publish"

## Best Practices
- Always save your work frequently
- Use descriptive titles and content
- Keep animal profiles up to date
- Regular backups are recommended`,
          codeExample: `// Example: Creating a new animal profile
const newAnimal = {
  name: "Bella",
  species: "pig",
  age: 5,
  story: "Bella is a gentle rescue pig...",
  photo: "bella.jpg",
  careLevel: "standard"
};`
        },
        {
          id: 'animal-management',
          title: 'Managing Animal Profiles',
          type: 'tutorial',
          tags: ['animals', 'tutorial'],
          content: `# Animal Profile Management

## Creating Animal Profiles
1. Navigate to Animals section
2. Click "Add New Animal"
3. Complete the profile form:
   - **Basic Info**: Name, species, age, gender
   - **Story**: Background and personality
   - **Photos**: High-quality images
   - **Medical**: Health status and care notes
   - **Sponsorship**: Sponsorship options and pricing

## Profile Photo Guidelines
- **Size**: Minimum 800x600 pixels
- **Format**: JPG or PNG
- **Quality**: High resolution, good lighting
- **Content**: Show the animal's personality

## Managing Sponsorships
- Set monthly sponsorship amounts
- Track sponsor information
- Update sponsorship status
- Generate sponsor reports

## Best Practices
- Update profiles regularly
- Include recent photos
- Keep medical information current
- Engage sponsors with updates`
        }
      ]
    },
    {
      id: 'components',
      title: 'Component Library',
      description: 'Documentation for reusable admin UI components',
      icon: <Code className="h-5 w-5" />,
      category: 'components',
      lastUpdated: '2024-12-28',
      content: [
        {
          id: 'admin-button',
          title: 'AdminButton Component',
          type: 'component',
          tags: ['component', 'ui', 'button'],
          content: `# AdminButton Component

A versatile button component used throughout the admin interface.

## Props
- \`variant\`: 'primary' | 'secondary' | 'danger' | 'success'
- \`size\`: 'sm' | 'md' | 'lg'
- \`icon\`: Lucide React icon component
- \`loading\`: boolean - shows loading spinner
- \`disabled\`: boolean - disables interaction
- \`onClick\`: click handler function

## Usage Examples
Basic button, primary variant, with icon, loading state, and disabled state examples.`,
          codeExample: `import { AdminButton } from '../common/AdminButton';
import { Save, Plus } from 'lucide-react';

// Basic button
<AdminButton onClick={handleClick}>
  Save Changes
</AdminButton>

// Primary variant with icon
<AdminButton variant="primary" icon={Plus}>
  Add New Animal
</AdminButton>

// Loading state
<AdminButton loading={isLoading}>
  Saving...
</AdminButton>

// Disabled state
<AdminButton disabled={!canSave}>
  Save
</AdminButton>`
        },
        {
          id: 'admin-form-field',
          title: 'AdminFormField Component',
          type: 'component',
          tags: ['component', 'form', 'input'],
          content: `# AdminFormField Component

A standardized form input component with validation and error handling.

## Props
- \`label\`: string - field label
- \`value\`: string - field value
- \`onChange\`: (value: string) => void
- \`type\`: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'date'
- \`placeholder\`: string - placeholder text
- \`required\`: boolean - required field indicator
- \`error\`: string - error message
- \`helpText\`: string - help text below field
- \`disabled\`: boolean - disabled state

## Validation
- Automatic validation based on type
- Custom error message display
- Required field indicators`,
          codeExample: `import { AdminFormField } from '../common/AdminFormField';

const [name, setName] = useState('');
const [email, setEmail] = useState('');

<AdminFormField
  label="Animal Name"
  value={name}
  onChange={setName}
  placeholder="Enter animal name"
  required
/>

<AdminFormField
  label="Contact Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  helpText="We'll use this to send updates"
/>`
        }
      ]
    },
    {
      id: 'api-docs',
      title: 'API Documentation',
      description: 'Admin system API and data management documentation',
      icon: <Settings className="h-5 w-5" />,
      category: 'api',
      lastUpdated: '2024-12-28',
      content: [
        {
          id: 'data-layer',
          title: 'Data Management API',
          type: 'api',
          tags: ['api', 'data', 'crud'],
          content: `# Data Management API

The admin system uses a local storage-based data layer with import/export capabilities.

## AdminDataManager Class

### Core Methods

#### createItem<T>(resource: AdminResource, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T
Creates a new item in the specified resource.

#### getAll<T>(resource: AdminResource): T[]
Retrieves all items for a resource.

#### getById<T>(resource: AdminResource, id: string): T | undefined
Gets a specific item by ID.

#### updateItem<T>(resource: AdminResource, id: string, updates: Partial<T>): T | null
Updates an existing item.

#### deleteItem(resource: AdminResource, id: string): boolean
Deletes an item by ID.

## Supported Resources
- animals
- blog
- faq
- resources
- volunteers
- users

## Data Validation
All CRUD operations include validation for:
- Required fields
- Data type checking
- Relationship integrity
- Business rule compliance`,
          codeExample: `import { AdminDataManager } from '../utils/adminData';

// Create a new animal
const newAnimal = AdminDataManager.createItem('animals', {
  name: 'Bella',
  species: 'pig',
  age: 5,
  story: 'Bella is a gentle rescue pig...'
});

// Get all animals
const animals = AdminDataManager.getAll('animals');

// Update an animal
const updatedAnimal = AdminDataManager.updateItem('animals', id, {
  story: 'Updated story...'
});

// Delete an animal
const deleted = AdminDataManager.deleteItem('animals', id);`
        },
        {
          id: 'export-import',
          title: 'Data Export/Import API',
          type: 'api',
          tags: ['api', 'backup', 'export'],
          content: `# Data Export/Import API

## Export Functions

### exportData(): string
Exports all admin data as JSON string.

### exportToCSV<T>(data: T[], filename: string): void
Exports data array to CSV file.

### exportToPDF(data: any[], title: string): void
Generates PDF report from data.

## Import Functions

### importData(jsonData: string): boolean
Imports data from JSON string.

### validateImportData(data: any): ValidationResult
Validates import data structure.

## Backup Management

### createBackup(): BackupFile
Creates a complete backup of all admin data.

### restoreBackup(backup: BackupFile): boolean
Restores data from backup file.`,
          codeExample: `import { AdminDataExporter } from '../utils/adminExport';

// Export all data
const exportData = AdminDataExporter.exportData();

// Export animals to CSV
const animals = AdminDataManager.getAll('animals');
AdminDataExporter.exportToCSV(animals, 'animals-export.csv');

// Create backup
const backup = AdminDataExporter.createBackup();

// Import data
const success = AdminDataExporter.importData(jsonString);`
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting Guide',
      description: 'Common issues and solutions for admin system problems',
      icon: <HelpCircle className="h-5 w-5" />,
      category: 'troubleshooting',
      lastUpdated: '2024-12-28',
      content: [
        {
          id: 'common-issues',
          title: 'Common Issues and Solutions',
          type: 'markdown',
          tags: ['troubleshooting', 'issues'],
          content: `# Common Issues and Solutions

## Login Issues

### Cannot Login / Invalid Credentials
**Symptoms**: Error message when trying to log in
**Solutions**:
1. Verify username and password are correct
2. Check caps lock is off
3. Clear browser cache and cookies
4. Try incognito/private browsing mode

### Redirect Loop After Login
**Symptoms**: Page keeps redirecting after successful login
**Solutions**:
1. Clear local storage: \`localStorage.clear()\`
2. Check browser console for JavaScript errors
3. Disable browser extensions temporarily

## Data Issues

### Data Not Saving
**Symptoms**: Changes don't persist after page reload
**Solutions**:
1. Check browser console for errors
2. Verify local storage isn't full
3. Ensure required fields are completed
4. Try refreshing the page

### Missing Data After Import
**Symptoms**: Some data missing after importing backup
**Solutions**:
1. Verify backup file format is correct
2. Check import validation errors
3. Ensure backup file isn't corrupted
4. Try importing in smaller chunks

## Performance Issues

### Slow Loading Pages
**Symptoms**: Admin pages take long time to load
**Solutions**:
1. Clear browser cache
2. Check network connection
3. Reduce number of items displayed per page
4. Update browser to latest version

### Memory Issues
**Symptoms**: Browser becomes unresponsive
**Solutions**:
1. Close unused browser tabs
2. Restart browser
3. Check for memory leaks in console
4. Reduce concurrent operations

## UI Issues

### Responsive Layout Problems
**Symptoms**: Layout broken on mobile/tablet
**Solutions**:
1. Check viewport meta tag
2. Clear CSS cache
3. Test in different browsers
4. Verify media queries are working

### Missing Icons or Images
**Symptoms**: Broken icons or missing images
**Solutions**:
1. Check network connectivity
2. Verify image URLs are correct
3. Clear browser cache
4. Check for CDN issues

## Getting Help

If issues persist:
1. Check browser console for error messages
2. Document steps to reproduce the issue
3. Note browser version and operating system
4. Contact system administrator with details`
        },
        {
          id: 'performance-tips',
          title: 'Performance Optimization Tips',
          type: 'markdown',
          tags: ['performance', 'optimization'],
          content: `# Performance Optimization Tips

## Browser Optimization

### Cache Management
- Clear browser cache regularly
- Use hard refresh (Ctrl+F5) when needed
- Monitor local storage usage

### Memory Management
- Close unused admin tabs
- Restart browser periodically
- Monitor memory usage in dev tools

## Data Management

### Efficient Loading
- Use pagination for large datasets
- Implement lazy loading for images
- Optimize search queries

### Storage Optimization
- Regular data cleanup
- Archive old records
- Compress backup files

## Network Optimization

### Reduce Requests
- Batch operations when possible
- Use local caching effectively
- Minimize external dependencies

### Image Optimization
- Use appropriate image formats
- Implement responsive images
- Compress images before upload

## Code Optimization

### Component Performance
- Use React.memo for expensive components
- Implement proper key props for lists
- Avoid unnecessary re-renders

### State Management
- Keep state as local as possible
- Use appropriate data structures
- Implement proper cleanup`
        }
      ]
    }
  ];

  const filteredSections = documentationSections.filter(section => {
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.some(content => 
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    return matchesCategory && matchesSearch;
  });

  const currentSection = documentationSections.find(s => s.id === selectedSection);
  const currentContent = currentSection?.content.find(c => c.id === selectedContent);

  const generateDocumentationPDF = () => {
    // Simulate PDF generation
    console.log('Generating documentation PDF...');
    // In a real implementation, this would generate a PDF of all documentation
    alert('PDF generation would be implemented here');
  };

  const copyCodeExample = (code: string) => {
    navigator.clipboard.writeText(code);
    // Could add a toast notification here
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Admin Documentation
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Complete system guide
              </p>
            </div>
          </div>

          {/* Search */}
          <AdminFormField
            label=""
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search documentation..."
          />

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-3 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value="all">All Categories</option>
            <option value="overview">Overview</option>
            <option value="guides">User Guides</option>
            <option value="components">Components</option>
            <option value="api">API Docs</option>
            <option value="troubleshooting">Troubleshooting</option>
          </select>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredSections.map(section => (
              <div key={section.id}>
                <button
                  onClick={() => {
                    setSelectedSection(section.id);
                    setSelectedContent(null);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    selectedSection === section.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {section.icon}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{section.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {section.content.length} articles
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Content items */}
                {selectedSection === section.id && (
                  <div className="ml-6 mt-2 space-y-1">
                    {section.content.map(content => (
                      <button
                        key={content.id}
                        onClick={() => setSelectedContent(content.id)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          selectedContent === content.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {content.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <AdminButton
            onClick={generateDocumentationPDF}
            variant="secondary"
            icon={Download}
            className="w-full"
          >
            Export PDF
          </AdminButton>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentContent ? (
          // Content Detail View
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span>{currentSection?.title}</span>
                  <ChevronRight className="h-4 w-4" />
                  <span>{currentContent.title}</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentContent.title}
                  </h1>
                  <AdminStatusBadge variant="info">
                    {currentContent.type}
                  </AdminStatusBadge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentContent.tags.map(tag => (
                    <AdminStatusBadge key={tag} variant="neutral" size="sm">
                      {tag}
                    </AdminStatusBadge>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {currentContent.content}
                </div>
              </div>

              {/* Code Example */}
              {currentContent.codeExample && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Code Example
                    </h3>
                    <AdminButton
                      onClick={() => copyCodeExample(currentContent.codeExample!)}
                      variant="secondary"
                      size="sm"
                    >
                      Copy Code
                    </AdminButton>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <code>{currentContent.codeExample}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : currentSection ? (
          // Section Overview
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  {currentSection.icon}
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentSection.title}
                  </h1>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  {currentSection.description}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Last updated: {currentSection.lastUpdated}
                </p>
              </div>

              {/* Content List */}
              <div className="grid gap-4">
                {currentSection.content.map(content => (
                  <div
                    key={content.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedContent(content.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {content.title}
                      </h3>
                      <AdminStatusBadge variant="info">
                        {content.type}
                      </AdminStatusBadge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {content.content.substring(0, 150)}...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {content.tags.map(tag => (
                        <AdminStatusBadge key={tag} variant="neutral" size="sm">
                          {tag}
                        </AdminStatusBadge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Welcome/Home View
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto p-8">
              <Book className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to Admin Documentation
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Comprehensive documentation for the Harmony Farm Sanctuary admin system. 
                Select a section from the sidebar to get started.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4">
                  <Lightbulb className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Quick Start</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get up and running quickly with our getting started guide
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Best Practices</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learn recommended workflows and security practices
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <Zap className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Advanced Features</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Explore advanced functionality and customization options
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <AdminButton 
                  onClick={() => setSelectedSection('user-guides')}
                  variant="primary"
                >
                  View User Guides
                </AdminButton>
                <AdminButton 
                  onClick={() => setSelectedSection('components')}
                  variant="secondary"
                >
                  Browse Components
                </AdminButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDocumentation;