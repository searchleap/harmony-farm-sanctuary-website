import React from 'react';
import { SEOHead } from '../components/SEOHead';
import { ResourceCard } from '../components/faq/ResourceCard';
import { ResourceSearch } from '../components/faq/ResourceSearch';
import { ResourceFilters } from '../components/faq/ResourceFilters';
import { ResourceCategories } from '../components/faq/ResourceCategories';
import { ResourcePreview } from '../components/faq/ResourcePreview';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  BookOpen, 
  Download, 
  Star, 
  TrendingUp, 
  Grid3X3, 
  List,
  Search,
  Award,
  ChevronRight
} from 'lucide-react';
import { educationalResources } from '../data/educationalResources';
import { resourceCategories } from '../data/resourceCategories';
import type { EducationalResource } from '../types/faq';
import type { ResourceFilterOptions } from '../components/faq/ResourceFilters';

export const ResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [previewResource, setPreviewResource] = React.useState<EducationalResource | null>(null);
  const [filters, setFilters] = React.useState<ResourceFilterOptions>({
    categories: [],
    types: [],
    difficulties: [],
    targetAudience: [],
    languages: [],
    tags: [],
    sortBy: 'popularity',
    sortOrder: 'desc',
    showFeatured: false,
    showWithQuiz: false,
    showWithCertificate: false,
    minRating: 0,
    dateRange: 'all'
  });

  // Filter and search resources
  const filteredResources = React.useMemo(() => {
    let filtered = educationalResources;

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.summary.toLowerCase().includes(query) ||
        resource.keywords.some(keyword => keyword.toLowerCase().includes(query)) ||
        resource.tags.some(tag => tag.name.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category.id === selectedCategory);
    }

    // Apply advanced filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(resource => filters.categories.includes(resource.category.name));
    }

    if (filters.types.length > 0) {
      filtered = filtered.filter(resource => filters.types.includes(resource.type));
    }

    if (filters.difficulties.length > 0) {
      filtered = filtered.filter(resource => filters.difficulties.includes(resource.difficulty));
    }

    if (filters.targetAudience.length > 0) {
      filtered = filtered.filter(resource => 
        filters.targetAudience.some(audience => resource.targetAudience.includes(audience))
      );
    }

    if (filters.languages.length > 0) {
      filtered = filtered.filter(resource => filters.languages.includes(resource.language));
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter(resource => 
        filters.tags.some(tag => resource.tags.some(resourceTag => resourceTag.name === tag))
      );
    }

    if (filters.showFeatured) {
      filtered = filtered.filter(resource => resource.featured);
    }

    if (filters.showWithQuiz) {
      filtered = filtered.filter(resource => resource.hasQuiz);
    }

    if (filters.showWithCertificate) {
      filtered = filtered.filter(resource => resource.certificateAvailable);
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(resource => resource.rating >= filters.minRating);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(resource => new Date(resource.lastUpdated) >= cutoffDate);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popularity':
        filtered.sort((a, b) => filters.sortOrder === 'desc' ? b.views - a.views : a.views - b.views);
        break;
      case 'recent':
        filtered.sort((a, b) => {
          const aDate = new Date(a.lastUpdated).getTime();
          const bDate = new Date(b.lastUpdated).getTime();
          return filters.sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => filters.sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating);
        break;
      case 'downloads':
        filtered.sort((a, b) => filters.sortOrder === 'desc' ? b.downloads - a.downloads : a.downloads - b.downloads);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => 
          filters.sortOrder === 'desc' 
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title)
        );
        break;
    }

    return filtered;
  }, [educationalResources, searchQuery, selectedCategory, filters]);

  const handleResourceClick = (resourceId: string) => {
    const resource = educationalResources.find(r => r.id === resourceId);
    if (resource) {
      setPreviewResource(resource);
    }
  };

  const handleDownload = (resourceId: string) => {
    console.log('Downloading resource:', resourceId);
    // In a real app, this would trigger the download
  };

  const handleResourceRating = (resourceId: string, rating: number) => {
    console.log('Rating resource:', resourceId, rating);
    // In a real app, this would submit the rating
  };

  const featuredResources = educationalResources.filter(resource => resource.featured);
  const popularResources = educationalResources
    .sort((a, b) => b.views - a.views)
    .slice(0, 6);

  const availableCategories = resourceCategories.map(cat => cat.name);
  const availableTags = Array.from(new Set(educationalResources.flatMap(resource => resource.tags.map(tag => tag.name))));
  const availableLanguages = Array.from(new Set(educationalResources.map(resource => resource.language)));

  // Calculate stats
  const totalDownloads = educationalResources.reduce((sum, resource) => sum + resource.downloads, 0);
  const averageRating = educationalResources.reduce((sum, resource) => sum + resource.rating, 0) / educationalResources.length;

  return (
    <>
      <SEOHead 
        title="Educational Resources | Harmony Farm Sanctuary"
        description="Access our comprehensive collection of educational resources about animal welfare, sanctuary life, and compassionate living. Download guides, watch videos, and learn with us."
        keywords="educational resources, animal welfare, sanctuary guides, learning materials, downloads"
        canonical="https://harmonyfarm.org/resources"
      />

      <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-sanctuary-600 to-earth-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-6">
                <BookOpen className="w-16 h-16 text-white" />
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Educational Resources
              </h1>
              
              <p className="text-xl md:text-2xl text-sanctuary-100 mb-8">
                Explore our comprehensive collection of guides, videos, and learning materials about animal welfare and sanctuary life
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold">{educationalResources.length}+</div>
                  <div className="text-sanctuary-100">Resources</div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold">{resourceCategories.length}</div>
                  <div className="text-sanctuary-100">Categories</div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold">{totalDownloads.toLocaleString()}+</div>
                  <div className="text-sanctuary-100">Downloads</div>
                </div>
                
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
                  <div className="text-sanctuary-100">Avg Rating</div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <ResourceSearch
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  variant="hero"
                  placeholder="Search educational resources..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <h2 className="text-2xl font-bold text-gray-900">Featured Resources</h2>
                </div>
                <Button variant="outline">
                  View All Featured
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredResources.slice(0, 3).map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onResourceClick={handleResourceClick}
                    onDownload={handleDownload}
                    onRating={handleResourceRating}
                    variant="featured"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
              <p className="text-gray-600">
                Explore our organized collection of educational materials
              </p>
            </div>
            
            <ResourceCategories
              categories={resourceCategories}
              selectedCategory={selectedCategory || undefined}
              onCategorySelect={setSelectedCategory}
              onCategoryClick={handleResourceClick}
              variant="grid"
              showResourceCount={true}
              showTargetAudience={true}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Popular Resources */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-gray-900">Popular Resources</h3>
                    </div>
                    <div className="space-y-3">
                      {popularResources.slice(0, 5).map((resource) => (
                        <div
                          key={resource.id}
                          className="cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => handleResourceClick(resource.id)}
                        >
                          <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                            {resource.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {resource.downloads.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {resource.rating.toFixed(1)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filters */}
                  <ResourceFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    availableCategories={availableCategories}
                    availableTags={availableTags}
                    availableLanguages={availableLanguages}
                    variant="sidebar"
                  />
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Search and Controls */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
                    <div className="flex-1 w-full md:w-auto">
                      <ResourceSearch
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        variant="compact"
                        placeholder="Search resources..."
                        showFilters={false}
                      />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant={viewMode === 'grid' ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(searchQuery || selectedCategory || filters.categories.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <Badge variant="info">
                          Search: "{searchQuery}"
                        </Badge>
                      )}
                      {selectedCategory && (
                        <Badge variant="default">
                          Category: {resourceCategories.find(cat => cat.id === selectedCategory)?.name}
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

                {/* Resources Grid/List */}
                {filteredResources.length > 0 ? (
                  <div className={
                    viewMode === 'grid' 
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }>
                    {filteredResources.map((resource) => (
                      <ResourceCard
                        key={resource.id}
                        resource={resource}
                        onResourceClick={handleResourceClick}
                        onDownload={handleDownload}
                        onRating={handleResourceRating}
                        variant={viewMode === 'list' ? 'list' : 'default'}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resources Found</h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search terms or filters to find what you're looking for.
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory(null);
                        setFilters({
                          categories: [],
                          types: [],
                          difficulties: [],
                          targetAudience: [],
                          languages: [],
                          tags: [],
                          sortBy: 'popularity',
                          sortOrder: 'desc',
                          showFeatured: false,
                          showWithQuiz: false,
                          showWithCertificate: false,
                          minRating: 0,
                          dateRange: 'all'
                        });
                      }}
                    >
                      Show All Resources
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <Award className="w-12 h-12 text-sanctuary-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Need More Information?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Can't find the resource you're looking for? Check our FAQ section or contact our team for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  Browse FAQ
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Resource Preview Modal */}
      {previewResource && (
        <ResourcePreview
          resource={previewResource}
          isOpen={!!previewResource}
          onClose={() => setPreviewResource(null)}
          onDownload={handleDownload}
          onRating={handleResourceRating}
          variant="modal"
        />
      )}
    </>
  );
};