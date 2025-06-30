import { FAQ, FAQCategory as CategoryType } from '../../types/faq'
import { FAQItem } from './FAQItem'
import * as Icons from 'lucide-react'

interface FAQCategoryProps {
  category: CategoryType
  faqs: FAQ[]
  expanded?: boolean
  onToggle?: (categoryId: string) => void
  onFAQToggle?: (faqId: string) => void
  onFeedback?: (faqId: string, helpful: boolean) => void
  showMetrics?: boolean
  maxItems?: number
}

export function FAQCategory({
  category,
  faqs,
  expanded = false,
  onToggle,
  onFAQToggle,
  onFeedback,
  showMetrics = false,
  maxItems
}: FAQCategoryProps) {
  console.log('📂 FAQCategory rendered:', { 
    categoryName: category.name, 
    faqCount: faqs.length, 
    expanded 
  })
  
  // Get the icon component from Lucide React
  const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>
  
  const handleCategoryToggle = () => {
    onToggle?.(category.id)
  }
  
  const displayedFAQs = maxItems ? faqs.slice(0, maxItems) : faqs
  const hasMoreFAQs = maxItems && faqs.length > maxItems
  
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'sanctuary':
        return {
          bg: 'bg-sanctuary-50',
          border: 'border-sanctuary-200',
          text: 'text-sanctuary-800',
          icon: 'text-sanctuary-600'
        }
      case 'earth':
        return {
          bg: 'bg-earth-50',
          border: 'border-earth-200',
          text: 'text-earth-800',
          icon: 'text-earth-600'
        }
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: 'text-green-600'
        }
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: 'text-gray-600'
        }
    }
  }
  
  const colors = getColorClasses(category.color)
  
  return (
    <div className="mb-6">
      {/* Category Header */}
      <div 
        className={`
          p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm
          ${colors.bg} ${colors.border} border
        `}
        onClick={handleCategoryToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {IconComponent && (
              <div className={`p-2 rounded-lg bg-white ${colors.icon}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            )}
            <div>
              <h3 className={`font-semibold text-lg ${colors.text}`}>
                {category.name}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {category.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className={`text-sm font-medium ${colors.text}`}>
                {faqs.length} question{faqs.length !== 1 ? 's' : ''}
              </div>
              {showMetrics && (
                <div className="text-xs text-gray-500">
                  Priority {category.priority}
                </div>
              )}
            </div>
            
            <div className={`
              p-1 rounded-full transition-transform duration-200
              ${expanded ? 'rotate-180' : 'rotate-0'}
            `}>
              <Icons.ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQs List */}
      {expanded && faqs.length > 0 && (
        <div className="mt-4 space-y-3">
          {displayedFAQs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              onToggle={onFAQToggle}
              onFeedback={onFeedback}
              showMetrics={showMetrics}
              variant="compact"
            />
          ))}
          
          {hasMoreFAQs && (
            <div className="text-center pt-4">
              <button className="text-sanctuary-600 hover:text-sanctuary-700 text-sm font-medium">
                View {faqs.length - maxItems!} more questions →
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Empty State */}
      {expanded && faqs.length === 0 && (
        <div className="mt-4 p-6 text-center text-gray-500">
          <Icons.HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No questions in this category yet.</p>
          <p className="text-xs mt-1">
            Have a question? <a href="/contact" className="text-sanctuary-600 hover:underline">Contact us</a>
          </p>
        </div>
      )}
    </div>
  )
}