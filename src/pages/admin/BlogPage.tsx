import React, { useState, useMemo } from 'react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminForm, AdminStatusBadge, StandardActions } from '../../components/admin/common';
import { useAdminData } from '../../hooks/useAdminData';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { AdminSearchEngine, createBlogSearchConfig } from '../../utils/adminSearch';
import { exportBlogPosts } from '../../utils/adminExport';
import type { AdminTableColumn, AdminFormField, BreadcrumbItem } from '../../components/admin/common';
import type { BlogPost } from '../../types/admin';

export function BlogPage() {
  const { data: adminData, loading, refetch } = useAdminData();
  const { success, error } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  console.log('[BlogPage] Rendering with blog posts:', adminData.blogPosts?.length || 0);

  // Search engine
  const searchEngine = useMemo(() => {
    return new AdminSearchEngine(adminData.blogPosts || [], createBlogSearchConfig());
  }, [adminData.blogPosts]);

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return searchEngine.search(searchTerm).data;
  }, [searchEngine, searchTerm]);

  // Table columns
  const columns: AdminTableColumn<BlogPost>[] = [
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
      render: (title: string, post: BlogPost) => (
        <div>
          <span className="font-medium text-gray-900">{title}</span>
          {post.featuredImage && (
            <div className="mt-1">
              <img 
                src={post.featuredImage} 
                alt={title}
                className="h-8 w-12 object-cover rounded"
              />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'author',
      title: 'Author',
      dataIndex: 'author'
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <AdminStatusBadge 
          variant={status === 'published' ? 'success' : status === 'draft' ? 'neutral' : 'warning'}
        >
          {status}
        </AdminStatusBadge>
      )
    },
    {
      key: 'publishedAt',
      title: 'Published',
      dataIndex: 'publishedAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : 'Not published'
    },
    {
      key: 'tags',
      title: 'Tags',
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <div className="flex flex-wrap gap-1">
          {tags?.slice(0, 2).map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
          {tags && tags.length > 2 && (
            <span className="text-xs text-gray-500">+{tags.length - 2} more</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      sortable: false,
      render: (id: string, post: BlogPost) => (
        <StandardActions
          onEdit={() => handleEdit(post)}
          onDelete={() => handleDelete(post)}
          size="sm"
        />
      )
    }
  ];

  // Form fields
  const formFields: AdminFormField[] = [
    {
      name: 'title',
      label: 'Post Title',
      type: 'text',
      required: true,
      placeholder: 'Enter blog post title'
    },
    {
      name: 'excerpt',
      label: 'Excerpt',
      type: 'textarea',
      rows: 2,
      placeholder: 'Brief description of the post...',
      description: 'Short summary that appears in post previews'
    },
    {
      name: 'content',
      label: 'Content',
      type: 'textarea',
      rows: 8,
      required: true,
      placeholder: 'Write your blog post content here...'
    },
    {
      name: 'author',
      label: 'Author',
      type: 'text',
      required: true,
      placeholder: 'Author name'
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      options: [
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'scheduled', label: 'Scheduled' }
      ]
    },
    {
      name: 'featuredImage',
      label: 'Featured Image URL',
      type: 'text',
      placeholder: 'https://example.com/image.jpg',
      description: 'URL to the main image for this post'
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'text',
      placeholder: 'animals, rescue, care (comma-separated)',
      description: 'Separate tags with commas'
    },
    {
      name: 'publishedAt',
      label: 'Publish Date',
      type: 'date',
      description: 'Leave empty for immediate publication'
    }
  ];

  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Blog Management', isActive: true }
  ];

  // Handlers
  const handleAdd = () => {
    setSelectedPost(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (post: BlogPost) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        // TODO: Implement delete in data manager
        success(`Blog post "${post.title}" has been deleted`);
        refetch();
      } catch (err) {
        error('Failed to delete blog post');
      }
    }
  };

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      // Process tags
      if (values.tags && typeof values.tags === 'string') {
        values.tags = values.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      }

      if (selectedPost) {
        // TODO: Implement update in data manager
        success(`Blog post "${values.title}" has been updated`);
      } else {
        // TODO: Implement create in data manager
        success(`Blog post "${values.title}" has been created`);
      }
      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      error('Failed to save blog post');
    }
  };

  const handleExport = () => {
    exportBlogPosts(filteredPosts, { format: 'csv' });
    success('Blog posts data exported successfully');
  };

  const handleRefresh = async () => {
    await refetch();
    success('Blog posts data refreshed');
  };

  // Prepare initial values for edit form
  const getInitialValues = (post: BlogPost | null) => {
    if (!post) return {};
    
    const values = { ...post };
    // Convert tags array to comma-separated string for the form
    if (values.tags && Array.isArray(values.tags)) {
      values.tags = values.tags.join(', ');
    }
    return values;
  };

  return (
    <>
      <AdminListPage
        title="Blog Management"
        description="Manage blog posts, articles, and sanctuary news"
        breadcrumbs={breadcrumbs}
        data={filteredPosts}
        columns={columns}
        loading={loading}
        searchPlaceholder="Search posts by title, content, author..."
        onSearch={setSearchTerm}
        onAdd={handleAdd}
        onRefresh={handleRefresh}
        onExport={handleExport}
        addButtonText="New Post"
      />

      {/* Add Post Modal */}
      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Blog Post"
        size="xl"
      >
        <AdminForm
          fields={formFields}
          onSubmit={handleSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          submitText="Create Post"
        />
      </AdminModal>

      {/* Edit Post Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit "${selectedPost?.title || 'Blog Post'}"`}
        size="xl"
      >
        <AdminForm
          fields={formFields}
          initialValues={getInitialValues(selectedPost)}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          submitText="Save Changes"
        />
      </AdminModal>
    </>
  );
}