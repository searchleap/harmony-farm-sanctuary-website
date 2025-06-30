import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { 
  Filter, 
  X, 
  ChevronDown, 
  Star, 
  Clock, 
  Download,
  Eye,
  FileText,
  Play,
  Image,
  CheckSquare,
  BookOpen,
  Users,
  Calendar
} from 'lucide-react';

export interface ResourceFilterOptions {
  categories: string[];
  types: string[];
  difficulties: string[];
  targetAudience: string[];
  languages: string[];
  tags: string[];
  sortBy: 'popularity' | 'recent' | 'rating' | 'downloads' | 'alphabetical';
  sortOrder: 'asc' | 'desc';
  showFeatured: boolean;
  showWithQuiz: boolean;
  showWithCertificate: boolean;
  minRating: number;
  dateRange: 'all' | 'week' | 'month' | 'year';
}

interface ResourceFiltersProps {
  filters: ResourceFilterOptions;
  onFiltersChange: (filters: ResourceFilterOptions) => void;
  availableCategories: string[];
  availableTags: string[];
  availableLanguages: string[];
  variant?: 'default' | 'compact' | 'sidebar' | 'modal';
  className?: string;
}

const resourceTypes = [
  { id: 'pdf', label: 'PDF Documents', icon: FileText, color: 'text-red-600' },
  { id: 'video', label: 'Videos', icon: Play, color: 'text-blue-600' },
  { id: 'article', label: 'Articles', icon: BookOpen, color: 'text-green-600' },
  { id: 'infographic', label: 'Infographics', icon: Image, color: 'text-purple-600' },
  { id: 'quiz', label: 'Quizzes', icon: CheckSquare, color: 'text-orange-600' },
  { id: 'guide', label: 'Guides', icon: BookOpen, color: 'text-indigo-600' },
  { id: 'checklist', label: 'Checklists', icon: CheckSquare, color: 'text-teal-600' }
];

const difficulties = [
  { id: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
];

const targetAudiences = [
  { id: 'visitors', label: 'Visitors' },
  { id: 'volunteers', label: 'Volunteers' },
  { id: 'educators', label: 'Educators' },
  { id: 'families', label: 'Families' },
  { id: 'professionals', label: 'Professionals' },
  { id: 'students', label: 'Students' }
];

const sortOptions = [
  { id: 'popularity', label: 'Most Popular', icon: Star },
  { id: 'recent', label: 'Recently Added', icon: Clock },
  { id: 'rating', label: 'Highest Rated', icon: Star },
  { id: 'downloads', label: 'Most Downloaded', icon: Download },
  { id: 'alphabetical', label: 'A-Z', icon: Filter }
];

const dateRanges = [
  { id: 'all', label: 'All Time' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
  { id: 'year', label: 'This Year' }
];

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableTags,
  availableLanguages,
  variant = 'default',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleArrayFilterToggle = <T extends string>(
    filterKey: keyof ResourceFilterOptions,
    value: T
  ) => {
    const currentValues = filters[filterKey] as T[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({ ...filters, [filterKey]: newValues });
  };

  const clearAllFilters = () => {
    onFiltersChange({
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
  };

  const activeFilterCount = 
    filters.categories.length + 
    filters.types.length + 
    filters.difficulties.length + 
    filters.targetAudience.length + 
    filters.languages.length + 
    filters.tags.length + 
    (filters.showFeatured ? 1 : 0) +
    (filters.showWithQuiz ? 1 : 0) +
    (filters.showWithCertificate ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.dateRange !== 'all' ? 1 : 0);

  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="default" className="text-xs">
              {activeFilterCount}
            </Badge>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>
        
        {isExpanded && (
          <Card className="absolute top-full left-0 mt-2 p-4 z-10 min-w-96 bg-white border shadow-lg">
            <FilterContent
              filters={filters}
              onFiltersChange={onFiltersChange}
              availableCategories={availableCategories}
              availableTags={availableTags}
              availableLanguages={availableLanguages}
              onArrayToggle={handleArrayFilterToggle}
              clearAllFilters={clearAllFilters}
              activeFilterCount={activeFilterCount}
            />
          </Card>
        )}
      </div>
    );
  }

  return (
    <Card className={`p-6 ${variant === 'sidebar' ? 'sticky top-4' : ''} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary" />
          Filter Resources
        </h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear ({activeFilterCount})
          </Button>
        )}
      </div>

      <FilterContent
        filters={filters}
        onFiltersChange={onFiltersChange}
        availableCategories={availableCategories}
        availableTags={availableTags}
        availableLanguages={availableLanguages}
        onArrayToggle={handleArrayFilterToggle}
        clearAllFilters={clearAllFilters}
        activeFilterCount={activeFilterCount}
      />
    </Card>
  );
};

interface FilterContentProps {
  filters: ResourceFilterOptions;
  onFiltersChange: (filters: ResourceFilterOptions) => void;
  availableCategories: string[];
  availableTags: string[];
  availableLanguages: string[];
  onArrayToggle: <T extends string>(filterKey: keyof ResourceFilterOptions, value: T) => void;
  clearAllFilters: () => void;
  activeFilterCount: number;
}

const FilterContent: React.FC<FilterContentProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableTags,
  availableLanguages,
  onArrayToggle
}) => {
  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
        <div className="space-y-2">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  value={option.id}
                  checked={filters.sortBy === option.id}
                  onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as any })}
                  className="text-primary focus:ring-primary"
                />
                <Icon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            );
          })}
        </div>
        
        <div className="mt-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.sortOrder === 'asc'}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                sortOrder: e.target.checked ? 'asc' : 'desc' 
              })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700">Reverse order</span>
          </label>
        </div>
      </div>

      {/* Resource Types */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Resource Type</h4>
        <div className="space-y-2">
          {resourceTypes.map((type) => {
            const Icon = type.icon;
            return (
              <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.types.includes(type.id)}
                  onChange={() => onArrayToggle('types', type.id)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Icon className={`w-4 h-4 ${type.color}`} />
                <span className="text-sm text-gray-700">{type.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {availableCategories.map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => onArrayToggle('categories', category)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Difficulty Level</h4>
        <div className="space-y-2">
          {difficulties.map((difficulty) => (
            <label key={difficulty.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.difficulties.includes(difficulty.id)}
                onChange={() => onArrayToggle('difficulties', difficulty.id)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Badge variant="default" className={`text-xs ${difficulty.color}`}>
                {difficulty.label}
              </Badge>
            </label>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Target Audience</h4>
        <div className="space-y-2">
          {targetAudiences.map((audience) => (
            <label key={audience.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.targetAudience.includes(audience.id)}
                onChange={() => onArrayToggle('targetAudience', audience.id)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{audience.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Languages */}
      {availableLanguages.length > 1 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Language</h4>
          <div className="space-y-2">
            {availableLanguages.map((language) => (
              <label key={language} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.languages.includes(language)}
                  onChange={() => onArrayToggle('languages', language)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">{language}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Rating Filter */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
        <div className="space-y-2">
          {[0, 3, 4, 5].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="minRating"
                value={rating}
                checked={filters.minRating === rating}
                onChange={(e) => onFiltersChange({ ...filters, minRating: Number(e.target.value) })}
                className="text-primary focus:ring-primary"
              />
              <div className="flex items-center gap-1">
                {rating === 0 ? (
                  <span className="text-sm text-gray-700">Any rating</span>
                ) : (
                  <>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-700 ml-1">& up</span>
                  </>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Date Added</h4>
        <div className="space-y-2">
          {dateRanges.map((range) => (
            <label key={range.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="dateRange"
                value={range.id}
                checked={filters.dateRange === range.id}
                onChange={(e) => onFiltersChange({ ...filters, dateRange: e.target.value as any })}
                className="text-primary focus:ring-primary"
              />
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Special Features */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Special Features</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showFeatured}
              onChange={(e) => onFiltersChange({ ...filters, showFeatured: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-700">Featured Resources</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showWithQuiz}
              onChange={(e) => onFiltersChange({ ...filters, showWithQuiz: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <CheckSquare className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-700">With Quiz</span>
          </label>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showWithCertificate}
              onChange={(e) => onFiltersChange({ ...filters, showWithCertificate: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Eye className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-700">Certificate Available</span>
          </label>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Topics</h4>
        <div className="flex flex-wrap gap-2">
          {availableTags.slice(0, 12).map((tag) => (
            <Button
              key={tag}
              variant={filters.tags.includes(tag) ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onArrayToggle('tags', tag)}
              className="text-xs px-3 py-1"
            >
              {tag}
            </Button>
          ))}
        </div>
        {availableTags.length > 12 && (
          <p className="text-xs text-gray-500 mt-2">
            +{availableTags.length - 12} more tags available
          </p>
        )}
      </div>
    </div>
  );
};