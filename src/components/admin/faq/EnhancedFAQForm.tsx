import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  Eye, 
  AlertCircle,
  Info,
  Tag,
  Link,
  FileText,
  BarChart3,
  Target
} from 'lucide-react';
import { FAQ, FAQCategory, FAQTag } from '../../../types/faq';
import { AdminFormField, AdminButton } from '../common';

interface EnhancedFAQFormProps {
  faq?: FAQ;
  categories: FAQCategory[];
  tags: FAQTag[];
  onSubmit: (faq: Omit<FAQ, 'id'>) => void;
  onCancel: () => void;
}

const difficultyOptions = [
  { value: 'beginner', label: 'Beginner', color: 'green' },
  { value: 'intermediate', label: 'Intermediate', color: 'yellow' },
  { value: 'advanced', label: 'Advanced', color: 'red' }
];

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'pending_review', label: 'Pending Review', color: 'yellow' },
  { value: 'approved', label: 'Approved', color: 'blue' },
  { value: 'published', label: 'Published', color: 'green' },
  { value: 'archived', label: 'Archived', color: 'red' }
];

export const EnhancedFAQForm: React.FC<EnhancedFAQFormProps> = ({
  faq,
  categories,
  tags,
  onSubmit,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('content');
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    shortAnswer: '',
    categoryId: '',
    selectedTags: [] as string[],
    difficulty: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    priority: 0,
    keywords: [] as string[],
    relatedFAQs: [] as string[],
    relatedResources: [] as string[],
    isFeatured: false,
    status: 'draft' as 'draft' | 'pending_review' | 'approved' | 'published' | 'archived',
    author: 'Current User'
  });
  
  const [previewMode, setPreviewMode] = useState(false);
  const [seoAnalysis, setSeoAnalysis] = useState({
    score: 0,
    issues: [] as string[],
    suggestions: [] as string[]
  });
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [newKeyword, setNewKeyword] = useState('');
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);

  // Initialize form with existing FAQ data
  useEffect(() => {
    if (faq) {
      setFormData({
        question: faq.question,
        answer: faq.answer,
        shortAnswer: faq.shortAnswer || '',
        categoryId: faq.category.id,
        selectedTags: faq.tags.map(tag => tag.id),
        difficulty: faq.difficulty,
        priority: faq.priority,
        keywords: faq.keywords,
        relatedFAQs: faq.relatedFAQs || [],
        relatedResources: faq.relatedResources || [],
        isFeatured: faq.isFeatured,
        status: faq.status,
        author: faq.author
      });
    }
  }, [faq]);

  // Real-time SEO analysis
  useEffect(() => {
    analyzeSEO();
  }, [formData.question, formData.answer, formData.keywords]);

  // Real-time readability analysis
  useEffect(() => {
    analyzeReadability();
  }, [formData.answer]);

  // Generate keyword suggestions
  useEffect(() => {
    generateKeywordSuggestions();
  }, [formData.question, formData.answer]);

  const analyzeSEO = () => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Question analysis
    if (formData.question.length < 10) {
      issues.push('Question is too short');
      score -= 20;
    }
    if (formData.question.length > 100) {
      issues.push('Question is too long');
      score -= 10;
    }
    if (!formData.question.includes('?')) {
      suggestions.push('Questions should end with a question mark');
      score -= 5;
    }

    // Answer analysis
    if (formData.answer.length < 50) {
      issues.push('Answer is too short');
      score -= 25;
    }
    if (formData.answer.length > 1000) {
      suggestions.push('Consider breaking long answers into sections');
      score -= 5;
    }

    // Keyword analysis
    if (formData.keywords.length === 0) {
      issues.push('No keywords defined');
      score -= 15;
    }
    if (formData.keywords.length > 5) {
      suggestions.push('Too many keywords may dilute focus');
      score -= 5;
    }

    // Content quality
    const questionKeywords = formData.keywords.filter(keyword =>
      formData.question.toLowerCase().includes(keyword.toLowerCase())
    );
    if (questionKeywords.length === 0 && formData.keywords.length > 0) {
      suggestions.push('Include keywords in the question');
      score -= 10;
    }

    setSeoAnalysis({
      score: Math.max(0, score),
      issues,
      suggestions
    });
  };

  const analyzeReadability = () => {
    const text = formData.answer;
    const words = text.split(/\s+/).length;
    const sentences = text.split(/[.!?]+/).length;
    const syllables = text.split(/[aeiouAEIOU]/).length;

    // Simplified Flesch Reading Ease Score
    const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    setReadabilityScore(Math.max(0, Math.min(100, score)));
  };

  const generateKeywordSuggestions = () => {
    const text = `${formData.question} ${formData.answer}`.toLowerCase();
    const words = text.match(/\b\w{4,}\b/g) || [];
    const frequency: Record<string, number> = {};
    
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    const suggestions = Object.entries(frequency)
      .filter(([word, count]) => count > 1 && !formData.keywords.includes(word))
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    setKeywordSuggestions(suggestions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCategory = categories.find(cat => cat.id === formData.categoryId);
    const selectedTags = tags.filter(tag => formData.selectedTags.includes(tag.id));
    
    if (!selectedCategory) return;

    const faqData: Omit<FAQ, 'id'> = {
      question: formData.question,
      answer: formData.answer,
      shortAnswer: formData.shortAnswer,
      category: selectedCategory,
      tags: selectedTags,
      difficulty: formData.difficulty,
      priority: formData.priority,
      keywords: formData.keywords,
      relatedFAQs: formData.relatedFAQs,
      relatedResources: formData.relatedResources,
      isFeatured: formData.isFeatured,
      isPopular: false,
      status: formData.status,
      author: formData.author,
      version: faq ? faq.version + 1 : 1,
      seoScore: seoAnalysis.score,
      readabilityScore,
      views: faq?.views || 0,
      helpful: faq?.helpful || 0,
      notHelpful: faq?.notHelpful || 0,
      helpfulnessRatio: faq?.helpfulnessRatio || 0,
      lastUpdated: new Date().toISOString(),
      createdAt: faq?.createdAt || new Date().toISOString(),
      publishedAt: formData.status === 'published' ? new Date().toISOString() : faq?.publishedAt,
      archivedAt: formData.status === 'archived' ? new Date().toISOString() : faq?.archivedAt
    };

    onSubmit(faqData);
  };

  const addKeyword = () => {
    if (newKeyword && !formData.keywords.includes(newKeyword)) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, newKeyword]
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const addSuggestedKeyword = (keyword: string) => {
    if (!formData.keywords.includes(keyword)) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keyword]
      });
    }
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'seo', label: 'SEO & Keywords', icon: Target },
    { id: 'relations', label: 'Relations', icon: Link },
    { id: 'settings', label: 'Settings', icon: BarChart3 }
  ];

  const getSeoScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReadabilityLabel = (score: number) => {
    if (score >= 80) return 'Very Easy';
    if (score >= 60) return 'Easy';
    if (score >= 40) return 'Moderate';
    if (score >= 20) return 'Difficult';
    return 'Very Difficult';
  };

  return (
    <div className="space-y-6">
      {/* Header with Preview Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {faq ? 'Edit FAQ' : 'Create FAQ'}
        </h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Quality Scores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">SEO Score</span>
            <span className={`text-2xl font-bold ${getSeoScoreColor(seoAnalysis.score)}`}>
              {seoAnalysis.score}%
            </span>
          </div>
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                seoAnalysis.score >= 80 ? 'bg-green-500' :
                seoAnalysis.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${seoAnalysis.score}%` }}
            />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Readability</span>
            <span className="text-2xl font-bold text-blue-600">
              {Math.round(readabilityScore)}
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-600">
            {getReadabilityLabel(readabilityScore)}
          </div>
        </div>
      </div>

      {previewMode ? (
        /* Preview Mode */
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h4 className="text-xl font-semibold text-gray-900">
                {formData.question}
              </h4>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  formData.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  formData.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {formData.difficulty}
                </span>
                {formData.isFeatured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Featured
                  </span>
                )}
              </div>
            </div>
            
            {formData.shortAnswer && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <p className="text-blue-800 font-medium">Quick Answer:</p>
                <p className="text-blue-700">{formData.shortAnswer}</p>
              </div>
            )}
            
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{formData.answer}</div>
            </div>
            
            {formData.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                {formData.keywords.map(keyword => (
                  <span 
                    key={keyword}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Edit Mode */
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
          <div className="space-y-6">
            {activeTab === 'content' && (
              <div className="space-y-4">
                <AdminFormField
                  label="Question"
                  value={formData.question}
                  onChange={(value) => setFormData({ ...formData, question: value })}
                  placeholder="Enter the FAQ question..."
                  required
                  helpText="Make it clear and specific. Questions should typically end with '?'"
                />

                <AdminFormField
                  label="Short Answer (Optional)"
                  value={formData.shortAnswer}
                  onChange={(value) => setFormData({ ...formData, shortAnswer: value })}
                  placeholder="Brief answer for quick reference..."
                  helpText="A concise answer that appears in search results and previews"
                />

                <AdminFormField
                  label="Detailed Answer"
                  type="textarea"
                  value={formData.answer}
                  onChange={(value) => setFormData({ ...formData, answer: value })}
                  placeholder="Provide a comprehensive answer..."
                  rows={10}
                  required
                  helpText="Use clear, simple language. Break up long text with paragraphs."
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.path}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Difficulty Level
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {difficultyOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags Selection */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                      {tags.map(tag => (
                        <label key={tag.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.selectedTags.includes(tag.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  selectedTags: [...formData.selectedTags, tag.id]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  selectedTags: formData.selectedTags.filter(id => id !== tag.id)
                                });
                              }
                            }}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                          />
                          <span className="text-sm text-gray-700">{tag.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                {/* SEO Analysis */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">SEO Analysis</h4>
                  
                  {seoAnalysis.issues.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm font-medium text-red-700">Issues to Fix</span>
                      </div>
                      <ul className="space-y-1">
                        {seoAnalysis.issues.map((issue, index) => (
                          <li key={index} className="text-sm text-red-600">• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {seoAnalysis.suggestions.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-700">Suggestions</span>
                      </div>
                      <ul className="space-y-1">
                        {seoAnalysis.suggestions.map((suggestion, index) => (
                          <li key={index} className="text-sm text-blue-600">• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Keywords */}
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
                      <div className="flex flex-wrap gap-2">
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
                  </div>

                  {/* Keyword Suggestions */}
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
            )}

            {activeTab === 'relations' && (
              <div className="space-y-4">
                <AdminFormField
                  label="Related FAQ IDs"
                  value={formData.relatedFAQs.join(', ')}
                  onChange={(value) => setFormData({ 
                    ...formData, 
                    relatedFAQs: value.split(',').map(id => id.trim()).filter(Boolean)
                  })}
                  placeholder="faq-1, faq-2, faq-3"
                  helpText="Comma-separated list of related FAQ IDs"
                />

                <AdminFormField
                  label="Related Resource IDs"
                  value={formData.relatedResources.join(', ')}
                  onChange={(value) => setFormData({ 
                    ...formData, 
                    relatedResources: value.split(',').map(id => id.trim()).filter(Boolean)
                  })}
                  placeholder="resource-1, resource-2, resource-3"
                  helpText="Comma-separated list of related resource IDs"
                />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <AdminFormField
                    label="Priority"
                    type="number"
                    value={formData.priority.toString()}
                    onChange={(value) => setFormData({ ...formData, priority: parseInt(value) || 0 })}
                    placeholder="0"
                    min="0"
                    helpText="Higher numbers appear first"
                  />

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isFeatured" className="text-sm text-gray-700">
                      Featured FAQ (appears prominently)
                    </label>
                  </div>
                </div>

                <AdminFormField
                  label="Author"
                  value={formData.author}
                  onChange={(value) => setFormData({ ...formData, author: value })}
                  placeholder="Content author name"
                  required
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
              {faq ? 'Update FAQ' : 'Create FAQ'}
            </AdminButton>
          </div>
        </form>
      )}
    </div>
  );
};