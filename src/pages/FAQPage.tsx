import React from 'react';
import { SEOHead } from '../components/SEOHead';
import { FAQItem } from '../components/faq/FAQItem';
import { FAQSearch } from '../components/faq/FAQSearch';
import { FAQFilters } from '../components/faq/FAQFilters';
import { FAQCategory } from '../components/faq/FAQCategory';
import { FAQStats } from '../components/faq/FAQStats';
import { PopularFAQs } from '../components/faq/PopularFAQs';
// import { FAQFeedback } from '../components/faq/FAQFeedback';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  HelpCircle, 
  Search, 
  Filter, 
  MessageCircle, 
  ChevronRight,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { faqs } from '../data/faqs';
import { faqCategories } from '../data/faqCategories';
import type { FAQ, Feedback } from '../types/faq';
import type { FAQFilterOptions } from '../components/faq/FAQFilters';

export const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [filters, setFilters] = React.useState<FAQFilterOptions>({
    categories: [],
    difficulties: [],
    tags: [],
    sortBy: 'popularity',
    showFeatured: false,
    showRecentlyUpdated: false
  });
  const [selectedFAQ, setSelectedFAQ] = React.useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());

  // Filter and search FAQs
  const filteredFAQs = React.useMemo(() => {
    let filtered = faqs;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
        faq.tags.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(faq => faq.category.id === selectedCategory);
    }

    // Apply advanced filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(faq => filters.categories.includes(faq.category.name));
    }

    if (filters.difficulties.length > 0) {
      filtered = filtered.filter(faq => filters.difficulties.includes(faq.difficulty));
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(faq => 
        filters.tags.some(tag => faq.tags.some(faqTag => faqTag.name === tag))
      );
    }

    if (filters.showFeatured) {
      filtered = filtered.filter(faq => faq.isFeatured);
    }

    if (filters.showRecentlyUpdated) {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(faq => new Date(faq.lastUpdated) >= weekAgo);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.question.localeCompare(b.question));
        break;
      case 'difficulty':
        const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
        filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
        break;
    }

    return filtered;
  }, [faqs, searchQuery, selectedCategory, filters]);

  // Group FAQs by category for display
  const faqsByCategory = React.useMemo(() => {
    const grouped = new Map<string, FAQ[]>();
    
    filteredFAQs.forEach(faq => {
      const categoryId = faq.category.id;
      if (!grouped.has(categoryId)) {
        grouped.set(categoryId, []);
      }
      grouped.get(categoryId)!.push(faq);
    });

    return grouped;
  }, [filteredFAQs]);

  const handleFeedbackSubmit = (feedback: Feedback) => {
    console.log('FAQ Feedback submitted:', feedback);
    // In a real app, this would send feedback to the backend
  };

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleFAQClick = (faqId: string) => {
    setSelectedFAQ(selectedFAQ === faqId ? null : faqId);
  };

  const availableCategories = faqCategories.map(cat => cat.name);
  const availableTags = Array.from(new Set(faqs.flatMap(faq => faq.tags.map(tag => tag.name))));

  return (
    <>
      <SEOHead 
        title="Frequently Asked Questions | Harmony Farm Sanctuary"
        description="Find answers to common questions about visiting Harmony Farm Sanctuary, our animals, volunteering opportunities, and animal welfare practices."
        keywords="FAQ, questions, animal sanctuary, visiting, volunteering, animal care"
        canonical="https://harmonyfarm.org/faq"
      />

      <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-sanctuary-600 to-earth-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <HelpCircle className="w-16 h-16 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Frequently Asked Questions
              </h1>
              
              <p className="text-xl md:text-2xl text-sanctuary-100 mb-8">
                Find answers to common questions about our sanctuary, animals, and how you can help
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <div className="text-2xl font-bold">{faqs.length}+</div>
                  <div className="text-sanctuary-100">Questions Answered</div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-8 h-8" />
                  </div>
                  <div className="text-2xl font-bold">{faqCategories.length}</div>
                  <div className="text-sanctuary-100">Topic Categories</div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-8 h-8" />
                  </div>
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sanctuary-100">Always Available</div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <FAQSearch
                  onSearch={(params) => setSearchQuery(params.query || '')}
                  placeholder="Search our FAQ database..."
                  showFilters={false}
                  initialParams={{ query: searchQuery }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* FAQ Stats */}
                <FAQStats
                  faqs={faqs}
                  variant="compact"
                />

                {/* Popular FAQs */}
                <PopularFAQs
                  faqs={faqs}
                  onFaqClick={handleFAQClick}
                  variant="compact"
                  maxItems={5}
                />

                {/* Filters */}
                <FAQFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  availableCategories={availableCategories}
                  availableTags={availableTags}
                  variant="sidebar"
                />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                    <div className="flex-1 w-full md:w-auto">
                      <FAQSearch
                        onSearch={(params) => setSearchQuery(params.query || '')}
                        placeholder="Search FAQs..."
                        showFilters={false}
                        initialParams={{ query: searchQuery }}
                      />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory(null);
                          setFilters({
                            categories: [],
                            difficulties: [],
                            tags: [],
                            sortBy: 'popularity',
                            showFeatured: false,
                            showRecentlyUpdated: false
                          });
                        }}
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Clear All
                      </Button>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(searchQuery || selectedCategory || filters.categories.length > 0) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {searchQuery && (
                        <Badge variant="info">
                          Search: "{searchQuery}"
                        </Badge>
                      )}
                      {selectedCategory && (
                        <Badge variant="default">
                          Category: {faqCategories.find(cat => cat.id === selectedCategory)?.name}
                        </Badge>
                      )}
                      {filters.categories.map(category => (
                        <Badge key={category} variant="default">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* FAQ Categories and Content */}
                {faqsByCategory.size > 0 ? (
                  <div className="space-y-6">
                    {Array.from(faqsByCategory.entries()).map(([categoryId, categoryFAQs]) => {
                      const category = faqCategories.find(cat => cat.id === categoryId);
                      if (!category) return null;

                      return (
                        <div key={categoryId} className="bg-white rounded-lg shadow-sm border border-gray-200">
                          <FAQCategory
                            category={category}
                            faqs={categoryFAQs}
                            expanded={expandedCategories.has(categoryId)}
                            onToggle={() => handleCategoryToggle(categoryId)}
                          />
                          
                          {expandedCategories.has(categoryId) && (
                            <div className="p-6 pt-0">
                              <div className="space-y-4">
                                {categoryFAQs.map((faq) => (
                                  <FAQItem
                                    key={faq.id}
                                    faq={faq}
                                    expanded={selectedFAQ === faq.id}
                                    onToggle={() => handleFAQClick(faq.id)}
                                    onFeedback={(faqId, helpful) => handleFeedbackSubmit({ 
                                      id: `feedback-${Date.now()}`,
                                      type: 'faq',
                                      targetId: faqId, 
                                      helpful, 
                                      feedback: helpful ? 'Helpful' : 'Not helpful',
                                      createdAt: new Date().toISOString(),
                                      status: 'pending'
                                    })}
                                    variant="default"
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No FAQs Found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSearchQuery('');
                        setFilters(prev => ({ ...prev, categories: [], difficulties: [], tags: [] }));
                      }}
                    >
                      Show All FAQs
                    </Button>
                  </div>
                )}

                {/* Help Section */}
                <div className="mt-12 bg-gradient-to-r from-sanctuary-50 to-earth-50 rounded-lg p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-sanctuary-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Can't find what you're looking for?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our team is here to help! Contact us directly for personalized assistance.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Contact Support
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      Visit Information
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Resources CTA */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <Star className="w-12 h-12 text-sanctuary-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Explore Our Educational Resources
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Dive deeper with our comprehensive guides, videos, and learning materials about animal welfare and sanctuary life.
              </p>
              <Button variant="primary" size="lg" className="mr-4">
                Browse Resources
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                Download Guides
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};