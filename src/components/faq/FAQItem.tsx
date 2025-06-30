import { useState } from 'react'
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Clock, Eye } from 'lucide-react'
import { FAQ } from '../../types/faq'
// import { CategoryBadge } from '../blog/CategoryBadge'
import { Button } from '../ui/Button'
import { recordFAQFeedback } from '../../utils/faqHelpers'

interface FAQItemProps {
  faq: FAQ
  expanded?: boolean
  onToggle?: (faqId: string) => void
  onFeedback?: (faqId: string, helpful: boolean) => void
  showMetrics?: boolean
  variant?: 'default' | 'compact' | 'featured'
}

export function FAQItem({ 
  faq, 
  expanded = false, 
  onToggle, 
  onFeedback,
  showMetrics = false,
  variant = 'default'
}: FAQItemProps) {
  const [userFeedback, setUserFeedback] = useState<boolean | null>(null)
  const [isExpanded, setIsExpanded] = useState(expanded)
  
  console.log('❓ FAQItem rendered:', { 
    question: faq.question.substring(0, 50), 
    expanded: isExpanded, 
    variant 
  })
  
  const handleToggle = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    onToggle?.(faq.id)
    
    // Track view if expanding
    if (newExpanded) {
      // In real implementation, this would update the database
      console.log('👀 FAQ viewed:', faq.id)
    }
  }
  
  const handleFeedback = (helpful: boolean) => {
    setUserFeedback(helpful)
    recordFAQFeedback(faq.id, helpful)
    onFeedback?.(faq.id, helpful)
    
    console.log('👍👎 FAQ feedback:', { faqId: faq.id, helpful })
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return 'p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm'
      case 'featured':
        return 'p-6 bg-gradient-to-br from-sanctuary-50 to-earth-50 border-2 border-sanctuary-200 rounded-xl shadow-sm hover:shadow-lg'
      default:
        return 'p-5 bg-white border border-gray-200 rounded-lg hover:shadow-md'
    }
  }
  
  const getPriorityIndicator = () => {
    if (faq.priority >= 9) return '🔥' // High priority
    if (faq.priority >= 7) return '⭐' // Medium priority
    return '' // Normal priority
  }
  
  return (
    <div className={`transition-all duration-200 ${getVariantStyles()}`}>
      {/* Question Header */}
      <div 
        className="flex items-start justify-between cursor-pointer group"
        onClick={handleToggle}
      >
        <div className="flex-1 mr-4">
          <div className="flex items-center gap-2 mb-2">
            {variant === 'featured' && (
              <span className="px-2 py-1 bg-sanctuary-100 text-sanctuary-800 text-xs rounded-full">
                {faq.category.name}
              </span>
            )}
            {faq.priority >= 7 && (
              <span className="text-lg" title={`Priority ${faq.priority}`}>
                {getPriorityIndicator()}
              </span>
            )}
            {faq.difficulty !== 'beginner' && (
              <span className={`
                px-2 py-1 text-xs rounded-full
                ${faq.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}
              `}>
                {faq.difficulty}
              </span>
            )}
          </div>
          
          <h3 className={`
            font-semibold text-gray-900 group-hover:text-sanctuary-700 transition-colors
            ${variant === 'compact' ? 'text-base' : 'text-lg'}
            ${variant === 'featured' ? 'text-xl' : ''}
          `}>
            {faq.question}
          </h3>
          
          {/* Short answer preview when collapsed */}
          {!isExpanded && faq.shortAnswer && variant !== 'compact' && (
            <p className="text-gray-600 mt-2 text-sm line-clamp-2">
              {faq.shortAnswer}
            </p>
          )}
        </div>
        
        {/* Toggle Icon */}
        <div className={`
          flex-shrink-0 p-2 rounded-full transition-colors
          ${isExpanded ? 'bg-sanctuary-100 text-sanctuary-700' : 'bg-gray-100 text-gray-500'}
          group-hover:bg-sanctuary-50
        `}>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </div>
      
      {/* Expanded Answer */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {/* Answer Content */}
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {faq.answer.split('\n').map((paragraph, index) => {
              if (paragraph.trim() === '') return null
              
              // Handle markdown-style formatting
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h4 key={index} className="font-semibold text-gray-900 mt-4 mb-2">
                    {paragraph.slice(2, -2)}
                  </h4>
                )
              }
              
              // Handle list items
              if (paragraph.trim().startsWith('- ')) {
                return (
                  <li key={index} className="ml-4 list-disc">
                    {paragraph.trim().substring(2)}
                  </li>
                )
              }
              
              return (
                <p key={index} className="mb-3">
                  {paragraph}
                </p>
              )
            })}
          </div>
          
          {/* Metadata */}
          {(showMetrics || variant === 'featured') && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{faq.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatDate(faq.lastUpdated)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>By {faq.author}</span>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                {(faq.helpfulnessRatio * 100).toFixed(0)}% helpful 
                <span className="text-gray-400">
                  ({faq.helpful + faq.notHelpful} votes)
                </span>
              </div>
            </div>
          )}
          
          {/* Feedback Section */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              Was this answer helpful?
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={userFeedback === true ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleFeedback(true)}
                className="flex items-center gap-2"
                disabled={userFeedback !== null}
              >
                <ThumbsUp className="w-4 h-4" />
                Yes ({faq.helpful})
              </Button>
              
              <Button
                variant={userFeedback === false ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => handleFeedback(false)}
                className="flex items-center gap-2"
                disabled={userFeedback !== null}
              >
                <ThumbsDown className="w-4 h-4" />
                No ({faq.notHelpful})
              </Button>
            </div>
          </div>
          
          {/* User Feedback Confirmation */}
          {userFeedback !== null && (
            <div className={`
              mt-3 p-3 rounded-lg text-sm
              ${userFeedback ? 'bg-green-50 text-green-800' : 'bg-orange-50 text-orange-800'}
            `}>
              {userFeedback 
                ? '✓ Thank you for your feedback!' 
                : 'Thanks for letting us know. We\'ll work to improve this answer.'
              }
            </div>
          )}
          
          {/* Tags */}
          {faq.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {faq.tags.map(tag => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 cursor-pointer"
                  title={`View all FAQs tagged with ${tag.name}`}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}