import React, { useState, useEffect } from 'react';
import { Save, AlertCircle, Calendar, Tag, Image, Eye, Settings, FileText, Users } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { MediaLibrary } from './MediaLibrary';
import type { BlogPost, BlogCategory, BlogTag, Author, BlogMedia } from '../../../types/blog';

interface EnhancedBlogFormProps {
  post?: BlogPost;
  authors: Author[];
  categories: BlogCategory[];
  tags: BlogTag[];
  media: BlogMedia[];
  onSubmit: (postData: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  readOnly?: boolean;
}

interface BlogFormData {
  basic: {
    title: string;
    slug: string;
    excerpt: string;
    authorId: string;
    categoryId: string;
    status: 'draft' | 'published' | 'scheduled' | 'archived';
  };
  content: {
    content: string;
    featuredImage: string;
    featuredImageAlt: string;
    gallery: BlogMedia[];
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
    ogImage: string;
  };
  settings: {
    publishedAt: string;
    featured: boolean;
    allowComments: boolean;
    includeInNewsletter: boolean;
    relatedAnimals: string[];
    tagIds: string[];
  };
}

export function EnhancedBlogForm({
  post,
  authors,
  categories,
  tags,
  media,
  onSubmit,
  onCancel,
  loading = false,
  readOnly = false
}: EnhancedBlogFormProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'seo' | 'settings'>('basic');
  const [formData, setFormData] = useState<BlogFormData>({
    basic: {
      title: post?.title || '',
      slug: post?.slug || '',
      excerpt: post?.excerpt || '',
      authorId: post?.author?.id || authors[0]?.id || '',
      categoryId: post?.category?.id || categories[0]?.id || '',
      status: post?.status || 'draft'
    },
    content: {
      content: post?.content || '',
      featuredImage: post?.featuredImage || '',
      featuredImageAlt: post?.featuredImageAlt || '',
      gallery: post?.gallery || []
    },
    seo: {
      metaTitle: post?.seo?.metaTitle || '',
      metaDescription: post?.seo?.metaDescription || '',
      keywords: post?.seo?.keywords || [],
      ogImage: post?.seo?.ogImage || ''
    },
    settings: {
      publishedAt: post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 16) : '',
      featured: post?.featured || false,
      allowComments: post?.allowComments ?? true,
      includeInNewsletter: post?.includeInNewsletter || false,
      relatedAnimals: post?.relatedAnimals || [],
      tagIds: post?.tags?.map(t => t.id) || []
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaSelectionMode, setMediaSelectionMode] = useState<'featured' | 'gallery' | 'content'>('featured');

  console.log('[EnhancedBlogForm] Rendering for post:', post?.title || 'new post');

  useEffect(() => {
    setIsDirty(true);
  }, [formData]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.basic.title && !post) {
      const slug = formData.basic.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({
        ...prev,
        basic: { ...prev.basic, slug }
      }));
    }
  }, [formData.basic.title, post]);

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText, description: 'Title, author, category' },
    { id: 'content', label: 'Content', icon: FileText, description: 'Article content and media' },
    { id: 'seo', label: 'SEO', icon: Eye, description: 'Search engine optimization' },
    { id: 'settings', label: 'Settings', icon: Settings, description: 'Publishing and advanced options' }
  ] as const;

  const updateFormData = (section: keyof BlogFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.basic.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.basic.slug.trim()) {
      newErrors.slug = 'URL slug is required';
    }

    if (!formData.basic.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }

    if (!formData.content.content.trim()) {
      newErrors.content = 'Content is required';
    }

    // SEO validation
    if (formData.seo.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description should be under 160 characters';
    }

    // Publishing validation
    if (formData.basic.status === 'scheduled' && !formData.settings.publishedAt) {
      newErrors.publishedAt = 'Publish date is required for scheduled posts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const selectedAuthor = authors.find(a => a.id === formData.basic.authorId);
      const selectedCategory = categories.find(c => c.id === formData.basic.categoryId);
      const selectedTags = tags.filter(t => formData.settings.tagIds.includes(t.id));

      const postData: Partial<BlogPost> = {
        title: formData.basic.title,
        slug: formData.basic.slug,
        excerpt: formData.basic.excerpt,
        content: formData.content.content,
        author: selectedAuthor!,
        category: selectedCategory!,
        tags: selectedTags,
        featuredImage: formData.content.featuredImage,
        featuredImageAlt: formData.content.featuredImageAlt,
        gallery: formData.content.gallery,
        status: formData.basic.status,
        featured: formData.settings.featured,
        allowComments: formData.settings.allowComments,
        includeInNewsletter: formData.settings.includeInNewsletter,
        publishedAt: formData.settings.publishedAt || new Date().toISOString(),
        seo: {
          metaTitle: formData.seo.metaTitle || formData.basic.title,
          metaDescription: formData.seo.metaDescription || formData.basic.excerpt,
          keywords: formData.seo.keywords,
          ogImage: formData.seo.ogImage || formData.content.featuredImage
        },
        relatedAnimals: formData.settings.relatedAnimals,
        readTime: Math.ceil(formData.content.content.split(' ').length / 200)
      };

      await onSubmit(postData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleMediaSelect = (selectedMedia: BlogMedia) => {
    switch (mediaSelectionMode) {
      case 'featured':
        updateFormData('content', 'featuredImage', selectedMedia.url);
        updateFormData('content', 'featuredImageAlt', selectedMedia.alt || '');
        break;
      case 'gallery':
        const currentGallery = formData.content.gallery;
        if (!currentGallery.some(m => m.url === selectedMedia.url)) {
          updateFormData('content', 'gallery', [...currentGallery, selectedMedia]);
        }
        break;
      case 'content':
        // Insert into content editor - would need to pass this to RichTextEditor
        break;
    }
    setShowMediaLibrary(false);
  };

  const removeFromGallery = (mediaUrl: string) => {
    const updatedGallery = formData.content.gallery.filter(m => m.url !== mediaUrl);
    updateFormData('content', 'gallery', updatedGallery);
  };

  const getCurrentTabError = () => {
    const tabErrors = {
      basic: ['title', 'slug', 'excerpt'],
      content: ['content'],
      seo: ['metaDescription'],
      settings: ['publishedAt']
    };

    return tabErrors[activeTab].some(field => errors[field]);
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {post ? `Edit "${post.title}"` : 'Create New Blog Post'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {readOnly ? 'Viewing blog post details' : 'Fill out all sections to publish your post'}
            </p>
          </div>
          
          {isDirty && !readOnly && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <AlertCircle className="w-4 h-4" />
              Unsaved changes
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const hasError = getCurrentTabError();
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${isActive 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  ${hasError ? 'border-red-500 text-red-600' : ''}
                `}
              >
                <Icon className={`
                  w-4 h-4 mr-2
                  ${isActive ? 'text-emerald-500' : 'text-gray-400 group-hover:text-gray-500'}
                  ${hasError ? 'text-red-500' : ''}
                `} />
                {tab.label}
                {hasError && (
                  <AlertCircle className="w-3 h-3 ml-1 text-red-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.basic.title}
                  onChange={(e) => updateFormData('basic', 'title', e.target.value)}
                  readOnly={readOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter blog post title"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug *
                </label>
                <input
                  type="text"
                  value={formData.basic.slug}
                  onChange={(e) => updateFormData('basic', 'slug', e.target.value)}
                  readOnly={readOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.slug ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="url-friendly-slug"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  URL: /blog/{formData.basic.slug}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt *
                </label>
                <textarea
                  value={formData.basic.excerpt}
                  onChange={(e) => updateFormData('basic', 'excerpt', e.target.value)}
                  readOnly={readOnly}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.excerpt ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Brief description that appears in previews..."
                />
                {errors.excerpt && (
                  <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <select
                    value={formData.basic.authorId}
                    onChange={(e) => updateFormData('basic', 'authorId', e.target.value)}
                    disabled={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {authors.map(author => (
                      <option key={author.id} value={author.id}>
                        {author.name} - {author.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.basic.categoryId}
                    onChange={(e) => updateFormData('basic', 'categoryId', e.target.value)}
                    disabled={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.basic.status}
                    onChange={(e) => updateFormData('basic', 'status', e.target.value as BlogFormData['basic']['status'])}
                    disabled={readOnly}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Content Tab */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {/* Featured Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image
                </label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input
                      type="url"
                      value={formData.content.featuredImage}
                      onChange={(e) => updateFormData('content', 'featuredImage', e.target.value)}
                      readOnly={readOnly}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Featured image URL"
                    />
                  </div>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setMediaSelectionMode('featured');
                        setShowMediaLibrary(true);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      <Image className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {formData.content.featuredImage && (
                  <div className="mt-2">
                    <img
                      src={formData.content.featuredImage}
                      alt="Featured image preview"
                      className="h-32 w-auto object-cover rounded border"
                    />
                  </div>
                )}
                
                <input
                  type="text"
                  value={formData.content.featuredImageAlt}
                  onChange={(e) => updateFormData('content', 'featuredImageAlt', e.target.value)}
                  readOnly={readOnly}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Alt text for featured image"
                />
              </div>

              {/* Content Editor */}
              <RichTextEditor
                value={formData.content.content}
                onChange={(value) => updateFormData('content', 'content', value)}
                label="Content *"
                placeholder="Write your blog post content here..."
                readOnly={readOnly}
                allowMedia={true}
                allowSections={true}
              />
              {errors.content && (
                <p className="text-sm text-red-600">{errors.content}</p>
              )}

              {/* Gallery */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Image Gallery ({formData.content.gallery.length})
                  </label>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        setMediaSelectionMode('gallery');
                        setShowMediaLibrary(true);
                      }}
                      className="text-sm text-emerald-600 hover:text-emerald-500 font-medium"
                    >
                      Add Images
                    </button>
                  )}
                </div>
                
                {formData.content.gallery.length > 0 ? (
                  <div className="grid grid-cols-4 gap-2">
                    {formData.content.gallery.map((media, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={media.thumbnail || media.url}
                          alt={media.alt || 'Gallery image'}
                          className="w-full h-20 object-cover rounded border"
                        />
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => removeFromGallery(media.url)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No images in gallery</p>
                )}
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  value={formData.seo.metaTitle}
                  onChange={(e) => updateFormData('seo', 'metaTitle', e.target.value)}
                  readOnly={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Leave empty to use post title"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {(formData.seo.metaTitle || formData.basic.title).length}/60 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={formData.seo.metaDescription}
                  onChange={(e) => updateFormData('seo', 'metaDescription', e.target.value)}
                  readOnly={readOnly}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.metaDescription ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Description that appears in search results"
                />
                {errors.metaDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.metaDescription}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.seo.metaDescription.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={formData.seo.keywords.join(', ')}
                  onChange={(e) => updateFormData('seo', 'keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
                  readOnly={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate keywords with commas
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Open Graph Image
                </label>
                <input
                  type="url"
                  value={formData.seo.ogImage}
                  onChange={(e) => updateFormData('seo', 'ogImage', e.target.value)}
                  readOnly={readOnly}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Leave empty to use featured image"
                />
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={formData.settings.publishedAt}
                  onChange={(e) => updateFormData('settings', 'publishedAt', e.target.value)}
                  readOnly={readOnly}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                    errors.publishedAt ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.publishedAt && (
                  <p className="mt-1 text-sm text-red-600">{errors.publishedAt}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
                  {tags.map(tag => (
                    <label key={tag.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings.tagIds.includes(tag.id)}
                        onChange={(e) => {
                          const currentTags = formData.settings.tagIds;
                          const newTags = e.target.checked
                            ? [...currentTags, tag.id]
                            : currentTags.filter(id => id !== tag.id);
                          updateFormData('settings', 'tagIds', newTags);
                        }}
                        disabled={readOnly}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.settings.featured}
                    onChange={(e) => updateFormData('settings', 'featured', e.target.checked)}
                    disabled={readOnly}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured post</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.settings.allowComments}
                    onChange={(e) => updateFormData('settings', 'allowComments', e.target.checked)}
                    disabled={readOnly}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow comments</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.settings.includeInNewsletter}
                    onChange={(e) => updateFormData('settings', 'includeInNewsletter', e.target.checked)}
                    disabled={readOnly}
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include in newsletter</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!readOnly && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {Object.keys(errors).length > 0 && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  Please fix {Object.keys(errors).length} error{Object.keys(errors).length !== 1 ? 's' : ''} before saving
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {post ? 'Save Changes' : 'Create Post'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Select Media for {mediaSelectionMode === 'featured' ? 'Featured Image' : mediaSelectionMode === 'gallery' ? 'Gallery' : 'Content'}
                </h3>
                <button
                  onClick={() => setShowMediaLibrary(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-4 max-h-[80vh] overflow-y-auto">
              <MediaLibrary
                media={media}
                onMediaSelect={handleMediaSelect}
                selectionMode={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}