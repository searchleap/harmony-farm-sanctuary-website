import React, { useState, useEffect } from 'react';
import { Save, X, Tag, Users, Target, FileText, BarChart3 } from 'lucide-react';
import { EducationalResource, ResourceCategory, ResourceTag } from '../../../types/faq';
import { AdminButton, AdminFormField } from '../common';

interface ResourceMetadataEditorProps {
  resource: EducationalResource;
  categories: ResourceCategory[];
  onSave: (updates: Partial<EducationalResource>) => void;
  onCancel: () => void;
}

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner', description: 'No prior knowledge required' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some experience helpful' },
  { value: 'advanced', label: 'Advanced', description: 'Extensive background needed' }
];

const audienceOptions = [
  { value: 'visitors', label: 'Visitors', description: 'General public visiting the sanctuary' },
  { value: 'volunteers', label: 'Volunteers', description: 'Active sanctuary volunteers' },
  { value: 'educators', label: 'Educators', description: 'Teachers and educational professionals' },
  { value: 'families', label: 'Families', description: 'Parents and children' },
  { value: 'researchers', label: 'Researchers', description: 'Academic and scientific community' },
  { value: 'donors', label: 'Donors', description: 'Financial supporters and sponsors' }
];

const typeOptions = [
  { value: 'pdf', label: 'PDF Document', icon: FileText },
  { value: 'video', label: 'Video Content', icon: FileText },
  { value: 'article', label: 'Article/Blog Post', icon: FileText },
  { value: 'infographic', label: 'Infographic', icon: FileText },
  { value: 'quiz', label: 'Interactive Quiz', icon: FileText },
  { value: 'guide', label: 'Step-by-step Guide', icon: FileText },
  { value: 'checklist', label: 'Checklist', icon: FileText }
];

const availableTags: ResourceTag[] = [
  { id: 'animal-care', name: 'Animal Care', slug: 'animal-care', count: 45 },
  { id: 'veterinary', name: 'Veterinary', slug: 'veterinary', count: 32 },
  { id: 'nutrition', name: 'Nutrition', slug: 'nutrition', count: 28 },
  { id: 'behavior', name: 'Animal Behavior', slug: 'behavior', count: 24 },
  { id: 'rescue', name: 'Rescue Operations', slug: 'rescue', count: 22 },
  { id: 'volunteer', name: 'Volunteering', slug: 'volunteer', count: 38 },
  { id: 'education', name: 'Education', slug: 'education', count: 41 },
  { id: 'children', name: 'Children Programs', slug: 'children', count: 19 },
  { id: 'safety', name: 'Safety Protocols', slug: 'safety', count: 26 },
  { id: 'legal', name: 'Legal & Compliance', slug: 'legal', count: 15 },
  { id: 'fundraising', name: 'Fundraising', slug: 'fundraising', count: 17 },
  { id: 'marketing', name: 'Marketing & Outreach', slug: 'marketing', count: 13 }
];

export const ResourceMetadataEditor: React.FC<ResourceMetadataEditorProps> = ({
  resource,
  categories,
  onSave,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: resource.title,
    description: resource.description,
    summary: resource.summary,
    categoryId: resource.category.id,
    type: resource.type,
    difficulty: resource.difficulty,
    targetAudience: resource.targetAudience,
    language: resource.language,
    tags: resource.tags.map(tag => tag.id),
    keywords: resource.keywords,
    featured: resource.featured,
    hasQuiz: resource.hasQuiz || false,
    certificateAvailable: resource.certificateAvailable || false,
    duration: resource.duration || 0,
    pageCount: resource.pageCount || 0,
    relatedResources: resource.relatedResources || [],
    relatedFAQs: resource.relatedFAQs || []
  });
  
  const [newKeyword, setNewKeyword] = useState('');
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);

  // Generate keyword suggestions based on content
  useEffect(() => {
    const text = `${formData.title} ${formData.description} ${formData.summary}`.toLowerCase();
    const words = text.match(/\b\w{4,}\b/g) || [];
    const frequency: Record<string, number> = {};
    
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    const suggestions = Object.entries(frequency)
      .filter(([word, count]) => count > 1 && !formData.keywords.includes(word))
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([word]) => word);

    setKeywordSuggestions(suggestions);
  }, [formData.title, formData.description, formData.summary, formData.keywords]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
    const selectedTags = availableTags.filter(tag => formData.tags.includes(tag.id));
    
    if (!selectedCategory) return;

    const updates: Partial<EducationalResource> = {
      title: formData.title,
      description: formData.description,
      summary: formData.summary,
      category: selectedCategory,
      type: formData.type,
      difficulty: formData.difficulty,
      targetAudience: formData.targetAudience,
      language: formData.language,
      tags: selectedTags,
      keywords: formData.keywords,
      featured: formData.featured,
      hasQuiz: formData.hasQuiz,
      certificateAvailable: formData.certificateAvailable,
      duration: formData.duration,
      pageCount: formData.pageCount,
      relatedResources: formData.relatedResources,
      relatedFAQs: formData.relatedFAQs,
      lastUpdated: new Date().toISOString()
    };

    onSave(updates);
  };

  const addKeyword = () => {
    if (newKeyword && !formData.keywords.includes(newKeyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword]
      }));
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const addSuggestedKeyword = (keyword: string) => {
    if (!formData.keywords.includes(keyword)) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keyword]
      }));
    }
  };

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  const handleAudienceToggle = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.includes(audience)
        ? prev.targetAudience.filter(aud => aud !== audience)
        : [...prev.targetAudience, audience]
    }));
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'categorization', label: 'Categories & Tags', icon: Tag },
    { id: 'audience', label: 'Target Audience', icon: Users },
    { id: 'seo', label: 'SEO & Keywords', icon: Target },
    { id: 'advanced', label: 'Advanced', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Edit Resource Metadata</h3>
          <p className="text-sm text-gray-600">Update resource information and organization</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6 py-6">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <AdminFormField
                label="Title"
                value={formData.title}
                onChange={(value) => setFormData(prev => ({ ...prev, title: value }))}
                placeholder="Resource title..."
                required
              />

              <AdminFormField
                label="Description"
                type="textarea"
                value={formData.description}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                placeholder="Detailed description of the resource..."
                rows={4}
                required
              />

              <AdminFormField
                label="Summary"
                type="textarea"
                value={formData.summary}
                onChange={(value) => setFormData(prev => ({ ...prev, summary: value }))}
                placeholder="Brief summary for previews and cards..."
                rows={2}
                helpText="Short description used in search results and resource cards"
              />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Resource Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AdminFormField
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration.toString()}
                  onChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) || 0 }))}
                  placeholder="0"
                  min="0"
                  helpText="For videos and interactive content"
                />

                <AdminFormField
                  label="Page Count"
                  type="number"
                  value={formData.pageCount.toString()}
                  onChange={(value) => setFormData(prev => ({ ...prev, pageCount: parseInt(value) || 0 }))}
                  placeholder="0"
                  min="0"
                  helpText="For PDF documents"
                />
              </div>
            </div>
          )}

          {activeTab === 'categorization' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Difficulty Level
                </label>
                <div className="space-y-3">
                  {difficultyOptions.map(option => (
                    <label key={option.value} className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="difficulty"
                        value={option.value}
                        checked={formData.difficulty === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  {availableTags.map(tag => (
                    <label key={tag.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.tags.includes(tag.id)}
                        onChange={() => handleTagToggle(tag.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{tag.name}</span>
                      <span className="text-xs text-gray-500">({tag.count})</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Selected {formData.tags.length} tag{formData.tags.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'audience' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Target Audience
                </label>
                <div className="space-y-3">
                  {audienceOptions.map(option => (
                    <label key={option.value} className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={formData.targetAudience.includes(option.value)}
                        onChange={() => handleAudienceToggle(option.value)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Selected {formData.targetAudience.length} audience{formData.targetAudience.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add a keyword..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <AdminButton
                      type="button"
                      variant="outline"
                      onClick={addKeyword}
                      icon={Tag}
                    >
                      Add
                    </AdminButton>
                  </div>
                  
                  {formData.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.keywords.map(keyword => (
                        <span 
                          key={keyword}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {keywordSuggestions.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Suggested Keywords
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {keywordSuggestions.map(keyword => (
                          <button
                            key={keyword}
                            type="button"
                            onClick={() => addSuggestedKeyword(keyword)}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {keyword}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm text-gray-700">
                    Featured Resource (appears prominently)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasQuiz"
                    checked={formData.hasQuiz}
                    onChange={(e) => setFormData(prev => ({ ...prev, hasQuiz: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="hasQuiz" className="text-sm text-gray-700">
                    Has interactive quiz or assessment
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="certificate"
                    checked={formData.certificateAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, certificateAvailable: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="certificate" className="text-sm text-gray-700">
                    Certificate available upon completion
                  </label>
                </div>
              </div>

              <AdminFormField
                label="Related Resource IDs"
                value={formData.relatedResources.join(', ')}
                onChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  relatedResources: value.split(',').map(id => id.trim()).filter(Boolean)
                }))}
                placeholder="resource-1, resource-2, resource-3"
                helpText="Comma-separated list of related resource IDs"
              />

              <AdminFormField
                label="Related FAQ IDs"
                value={formData.relatedFAQs.join(', ')}
                onChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  relatedFAQs: value.split(',').map(id => id.trim()).filter(Boolean)
                }))}
                placeholder="faq-1, faq-2, faq-3"
                helpText="Comma-separated list of related FAQ IDs"
              />
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <AdminButton 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            icon={X}
          >
            Cancel
          </AdminButton>
          <AdminButton 
            type="submit" 
            variant="primary"
            icon={Save}
          >
            Save Changes
          </AdminButton>
        </div>
      </form>
    </div>
  );
};