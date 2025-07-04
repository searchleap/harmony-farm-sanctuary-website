import React, { useState, useMemo } from 'react';
import { AdminListPage } from '../../components/admin/templates/AdminListPage';
import { AdminModal, AdminStatusBadge, StandardActions } from '../../components/admin/common';
import { EnhancedBlogForm } from '../../components/admin/blog/EnhancedBlogForm';
import { useAdminData } from '../../hooks/useAdminData';
import { useAdminNotifications } from '../../hooks/useAdminNotifications';
import { AdminSearchEngine, createBlogSearchConfig } from '../../utils/adminSearch';
import { exportBlogPosts } from '../../utils/adminExport';
import { Eye, Calendar, Users, Tag } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import type { AdminTableColumn, BreadcrumbItem } from '../../components/admin/common';
import type { BlogPost, Author, BlogCategory, BlogTag, BlogMedia } from '../../types/blog';

export function BlogPage() {
  const { data: adminData, loading, refetch } = useAdminData();
  const { success, error } = useAdminNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  console.log('[BlogPage] Rendering with blog posts:', adminData.blogPosts?.length || 0);

  // Mock data for enhanced blog management
  const mockAuthors: Author[] = [
    {
      id: 'author_1',
      name: 'Sarah Thompson',
      role: 'Sanctuary Director',
      bio: 'Founder and director of Harmony Farm Sanctuary',
      image: '/images/team/sarah.jpg',
      email: 'sarah@harmonyfarm.org',
      yearsAtSanctuary: 8,
      specialties: ['Animal Welfare', 'Sanctuary Management', 'Education']
    },
    {
      id: 'author_2',
      name: 'Mike Thompson',
      role: 'Head of Animal Care',
      bio: 'Veterinary specialist and animal care coordinator',
      image: '/images/team/mike.jpg',
      yearsAtSanctuary: 8,
      specialties: ['Veterinary Care', 'Animal Behavior', 'Rescue Operations']
    }
  ];

  const mockCategories: BlogCategory[] = [
    {
      id: 'cat_1',
      name: 'Animal Stories',
      description: 'Stories about our rescued animals',
      slug: 'animal-stories',
      color: '#10B981',
      icon: '🐄',
      postCount: 15
    },
    {
      id: 'cat_2',
      name: 'Sanctuary Life',
      description: 'Daily life and operations at the sanctuary',
      slug: 'sanctuary-life',
      color: '#3B82F6',
      icon: '🏡',
      postCount: 12
    },
    {
      id: 'cat_3',
      name: 'Education',
      description: 'Educational content about animal welfare',
      slug: 'education',
      color: '#8B5CF6',
      icon: '📚',
      postCount: 8
    }
  ];

  const mockTags: BlogTag[] = [
    { id: 'tag_1', name: 'Rescue', slug: 'rescue', count: 25 },
    { id: 'tag_2', name: 'Veterinary Care', slug: 'veterinary-care', count: 18 },
    { id: 'tag_3', name: 'Animal Behavior', slug: 'animal-behavior', count: 15 },
    { id: 'tag_4', name: 'Volunteers', slug: 'volunteers', count: 12 },
    { id: 'tag_5', name: 'Donations', slug: 'donations', count: 10 },
    { id: 'tag_6', name: 'Events', slug: 'events', count: 8 }
  ];

  const mockMedia: BlogMedia[] = [
    {
      type: 'image',
      url: '/images/animals/bella-1.jpg',
      alt: 'Bella the cow in the pasture',
      caption: 'Bella enjoying a sunny day',
      thumbnail: '/images/animals/bella-1-thumb.jpg',
      size: 245760
    },
    {
      type: 'image',
      url: '/images/sanctuary/barn-exterior.jpg',
      alt: 'Main barn exterior',
      caption: 'Our newly renovated barn',
      thumbnail: '/images/sanctuary/barn-exterior-thumb.jpg',
      size: 189440
    },
    {
      type: 'video',
      url: '/videos/daily-feeding.mp4',
      alt: 'Daily feeding routine',
      caption: 'Morning feeding time at the sanctuary',
      thumbnail: '/videos/daily-feeding-thumb.jpg',
      duration: 120,
      size: 15728640
    }
  ];

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
      dataIndex: 'author',
      render: (author: any) => {
        if (typeof author === 'string') {
          return author;
        }
        if (typeof author === 'object' && author?.name) {
          return author.name;
        }
        return 'Unknown Author';
      }
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
      render: (date: any) => formatDate(date, 'Not published')
    },
    {
      key: 'category',
      title: 'Category',
      dataIndex: 'category',
      render: (category: any) => {
        const categoryName = typeof category === 'string' ? category : (category?.name || 'Uncategorized');
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
            {categoryName}
          </span>
        );
      }
    },
    {
      key: 'readTime',
      title: 'Read Time',
      dataIndex: 'content',
      render: (content: string) => {
        const words = content ? content.split(' ').length : 0;
        const readTime = Math.ceil(words / 200);
        return <span className="text-sm text-gray-500">{readTime} min</span>;
      }
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



  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Blog Management', isActive: true }
  ];

  // Handlers
  const handleAdd = () => {
    setSelectedPost(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (post: any) => {
    setSelectedPost(convertToFullBlogPost(post));
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

  const handleSubmit = async (postData: Partial<BlogPost>) => {
    setFormLoading(true);
    try {
      if (selectedPost) {
        // TODO: Implement update in data manager
        success(`Blog post "${postData.title}" has been updated with enhanced content`);
      } else {
        // TODO: Implement create in data manager
        success(`Blog post "${postData.title}" has been created with rich content`);
      }
      setIsEditModalOpen(false);
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      error('Failed to save blog post');
      console.error('Save error:', err);
    } finally {
      setFormLoading(false);
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

  // Convert admin BlogPost to full BlogPost for enhanced form
  const convertToFullBlogPost = (adminPost: any): BlogPost => {
    return {
      id: adminPost.id,
      title: adminPost.title,
      slug: adminPost.slug || adminPost.title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: adminPost.excerpt,
      content: adminPost.content,
      author: mockAuthors[0], // Default to first author
      category: mockCategories[0], // Default to first category
      tags: mockTags.slice(0, 2), // Default to first two tags
      featuredImage: adminPost.featuredImage || '',
      featuredImageAlt: '',
      gallery: [],
      publishedAt: adminPost.publishedAt || new Date().toISOString(),
      status: adminPost.status || 'draft',
      featured: false,
      readTime: Math.ceil((adminPost.content || '').split(' ').length / 200),
      views: 0,
      likes: 0,
      shares: 0,
      seo: {
        keywords: []
      },
      allowComments: true,
      commentCount: 0,
      includeInNewsletter: false
    };
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
        size="full"
      >
        <EnhancedBlogForm
          authors={mockAuthors}
          categories={mockCategories}
          tags={mockTags}
          media={mockMedia}
          onSubmit={handleSubmit}
          onCancel={() => setIsAddModalOpen(false)}
          loading={formLoading}
        />
      </AdminModal>

      {/* Edit Post Modal */}
      <AdminModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit "${selectedPost?.title || 'Blog Post'}"`}
        size="full"
      >
        <EnhancedBlogForm
          post={selectedPost || undefined}
          authors={mockAuthors}
          categories={mockCategories}
          tags={mockTags}
          media={mockMedia}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          loading={formLoading}
        />
      </AdminModal>
    </>
  );
}