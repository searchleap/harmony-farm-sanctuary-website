import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Filter, X, ChevronDown, Star, Clock, User } from 'lucide-react';

export interface FAQFilterOptions {
  categories: string[];
  difficulties: string[];
  tags: string[];
  sortBy: 'popularity' | 'recent' | 'alphabetical' | 'difficulty';
  showFeatured: boolean;
  showRecentlyUpdated: boolean;
}

interface FAQFiltersProps {
  filters: FAQFilterOptions;
  onFiltersChange: (filters: FAQFilterOptions) => void;
  availableCategories: string[];
  availableTags: string[];
  variant?: 'default' | 'compact' | 'sidebar';
  className?: string;
}

const difficulties = [
  { id: 'beginner', label: 'Beginner', icon: '🟢' },
  { id: 'intermediate', label: 'Intermediate', icon: '🟡' },
  { id: 'advanced', label: 'Advanced', icon: '🔴' }
];

const sortOptions = [
  { id: 'popularity', label: 'Most Popular', icon: Star },
  { id: 'recent', label: 'Recently Updated', icon: Clock },
  { id: 'alphabetical', label: 'A-Z', icon: Filter },
  { id: 'difficulty', label: 'By Difficulty', icon: User }
];

export const FAQFilters: React.FC<FAQFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableTags,
  variant = 'default',
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const handleDifficultyToggle = (difficulty: string) => {
    const newDifficulties = filters.difficulties.includes(difficulty)
      ? filters.difficulties.filter(d => d !== difficulty)
      : [...filters.difficulties, difficulty];
    
    onFiltersChange({ ...filters, difficulties: newDifficulties });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    onFiltersChange({ ...filters, tags: newTags });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      difficulties: [],
      tags: [],
      sortBy: 'popularity',
      showFeatured: false,
      showRecentlyUpdated: false
    });
  };

  const activeFilterCount = filters.categories.length + filters.difficulties.length + filters.tags.length + 
    (filters.showFeatured ? 1 : 0) + (filters.showRecentlyUpdated ? 1 : 0);

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
            <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </Button>
        
        {isExpanded && (
          <Card className="absolute top-full left-0 mt-2 p-4 z-10 min-w-80 bg-white border shadow-lg">
            <FilterContent
              filters={filters}
              onFiltersChange={onFiltersChange}
              availableCategories={availableCategories}
              availableTags={availableTags}
              onCategoryToggle={handleCategoryToggle}
              onDifficultyToggle={handleDifficultyToggle}
              onTagToggle={handleTagToggle}
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
          Filter FAQs
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
        onCategoryToggle={handleCategoryToggle}
        onDifficultyToggle={handleDifficultyToggle}
        onTagToggle={handleTagToggle}
        clearAllFilters={clearAllFilters}
        activeFilterCount={activeFilterCount}
      />
    </Card>
  );
};

interface FilterContentProps {
  filters: FAQFilterOptions;
  onFiltersChange: (filters: FAQFilterOptions) => void;
  availableCategories: string[];
  availableTags: string[];
  onCategoryToggle: (category: string) => void;
  onDifficultyToggle: (difficulty: string) => void;
  onTagToggle: (tag: string) => void;
  clearAllFilters: () => void;
  activeFilterCount: number;
}

const FilterContent: React.FC<FilterContentProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableTags,
  onCategoryToggle,
  onDifficultyToggle,
  onTagToggle
}) => {
  return (
    <div className="space-y-6">
      {/* Sort Options */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
        <div className="grid grid-cols-2 gap-2">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.id}
                variant={filters.sortBy === option.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => onFiltersChange({ ...filters, sortBy: option.id as any })}
                className="justify-start text-sm"
              >
                <Icon className="w-4 h-4 mr-2" />
                {option.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {availableCategories.map((category) => (
            <label key={category} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => onCategoryToggle(category)}
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
                onChange={() => onDifficultyToggle(difficulty.id)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700 flex items-center gap-2">
                <span>{difficulty.icon}</span>
                {difficulty.label}
              </span>
            </label>
          ))}
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
              onClick={() => onTagToggle(tag)}
              className="text-xs px-3 py-1"
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Special Filters */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Special Filters</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showFeatured}
              onChange={(e) => onFiltersChange({ ...filters, showFeatured: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Featured FAQs
            </span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showRecentlyUpdated}
              onChange={(e) => onFiltersChange({ ...filters, showRecentlyUpdated: e.target.checked })}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-gray-700 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Recently Updated
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};