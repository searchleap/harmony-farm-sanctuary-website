import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  ChevronRight, 
  Folder, 
  Users, 
  Clock, 
  TrendingUp,
  Star,
  ArrowRight,
  Grid3X3,
  List,
  Search
} from 'lucide-react';
import { ResourceCategory } from '../../types/faq';

interface ResourceCategoriesProps {
  categories: ResourceCategory[];
  selectedCategory?: string;
  onCategorySelect: (categoryId: string | null) => void;
  onCategoryClick?: (categoryId: string) => void;
  variant?: 'default' | 'compact' | 'grid' | 'sidebar' | 'breadcrumb';
  showResourceCount?: boolean;
  showTargetAudience?: boolean;
  showStats?: boolean;
  maxCategories?: number;
  className?: string;
}

const getCategoryIcon = (): React.ReactNode => {
  // This would normally map icon names to actual icons
  // For now, using default folder icon
  return <Folder className="w-5 h-5" />;
};

const formatAudience = (audience: string[]): string => {
  if (audience.length <= 2) {
    return audience.join(', ');
  }
  return `${audience.slice(0, 2).join(', ')} +${audience.length - 2} more`;
};

export const ResourceCategories: React.FC<ResourceCategoriesProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  onCategoryClick,
  variant = 'default',
  showResourceCount = true,
  showTargetAudience = false,
  showStats = false,
  maxCategories,
  className = ''
}) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCategories = React.useMemo(() => {
    let filtered = categories;
    
    if (searchTerm) {
      filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (maxCategories) {
      filtered = filtered.slice(0, maxCategories);
    }
    
    return filtered;
  }, [categories, searchTerm, maxCategories]);

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      onCategorySelect(null); // Deselect if already selected
    } else {
      onCategorySelect(categoryId);
    }
    onCategoryClick?.(categoryId);
  };

  if (variant === 'breadcrumb') {
    const selectedCat = categories.find(cat => cat.id === selectedCategory);
    
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-600 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCategorySelect(null)}
          className="text-primary hover:text-primary-dark p-1"
        >
          All Resources
        </Button>
        
        {selectedCat && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-gray-900">{selectedCat.name}</span>
          </>
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <Button
          variant={!selectedCategory ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onCategorySelect(null)}
        >
          All
          {showResourceCount && (
            <Badge variant="default" className="ml-2 text-xs">
              {categories.reduce((sum, cat) => sum + cat.resourceCount, 0)}
            </Badge>
          )}
        </Button>
        
        {filteredCategories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleCategoryClick(category.id)}
            className="gap-2"
          >
            {getCategoryIcon()}
            {category.name}
            {showResourceCount && (
              <Badge variant="default" className="text-xs">
                {category.resourceCount}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Categories</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCategorySelect(null)}
            className="text-xs text-primary hover:text-primary-dark"
          >
            Clear
          </Button>
        </div>

        <div className="space-y-1">
          <Button
            variant={!selectedCategory ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onCategorySelect(null)}
            className="w-full justify-between text-left"
          >
            <span>All Resources</span>
            {showResourceCount && (
              <Badge variant="default" className="text-xs">
                {categories.reduce((sum, cat) => sum + cat.resourceCount, 0)}
              </Badge>
            )}
          </Button>
          
          {filteredCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => handleCategoryClick(category.id)}
              className="w-full justify-between text-left"
            >
              <div className="flex items-center gap-2">
                {getCategoryIcon()}
                <span className="line-clamp-1">{category.name}</span>
              </div>
              {showResourceCount && (
                <Badge variant="default" className="text-xs">
                  {category.resourceCount}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </Card>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={className}>
        {categories.length > 6 && (
          <div className="flex items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              />
            </div>
            
            <div className="flex items-center gap-2 ml-4">
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
        )}

        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }`}>
          {filteredCategories.map((category) => (
            <Card
              key={category.id}
              className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                selectedCategory === category.id ? 'ring-2 ring-primary ring-opacity-50' : ''
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                      {getCategoryIcon()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      {showResourceCount && (
                        <p className="text-sm text-gray-600">
                          {category.resourceCount} resource{category.resourceCount !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <p className="text-gray-700 mb-4 line-clamp-2">
                  {category.description}
                </p>

                {showTargetAudience && category.targetAudience.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {formatAudience(category.targetAudience)}
                    </span>
                  </div>
                )}

                {showStats && (
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Popular</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Recent</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>4.8</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {categories.length > filteredCategories.length && (
          <div className="text-center mt-8">
            <Button variant="outline">
              View All {categories.length} Categories
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Resource Categories</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCategorySelect(null)}
          disabled={!selectedCategory}
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedCategory === category.id ? 'ring-2 ring-primary ring-opacity-50' : ''
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center">
                  {getCategoryIcon()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                  {showResourceCount && (
                    <p className="text-sm text-gray-600">
                      {category.resourceCount} resources
                    </p>
                  )}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{category.description}</p>

              {showTargetAudience && category.targetAudience.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{formatAudience(category.targetAudience)}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};