import { TrendingUp, ThumbsUp, Eye, MessageCircle } from 'lucide-react'
import { FAQ } from '../../types/faq'
import { Card, CardContent } from '../ui'

interface FAQStatsProps {
  faqs: FAQ[]
  className?: string
  variant?: 'compact' | 'detailed'
}

export function FAQStats({ faqs, className = '', variant = 'compact' }: FAQStatsProps) {
  console.log('📊 FAQStats rendered:', { faqCount: faqs.length, variant })
  
  const calculateStats = () => {
    const totalViews = faqs.reduce((sum, faq) => sum + faq.views, 0)
    const totalVotes = faqs.reduce((sum, faq) => sum + faq.helpful + faq.notHelpful, 0)
    const totalHelpful = faqs.reduce((sum, faq) => sum + faq.helpful, 0)
    const averageHelpfulness = totalVotes > 0 ? (totalHelpful / totalVotes) * 100 : 0
    
    const popularFAQs = faqs
      .filter(faq => faq.isPopular)
      .length
    
    const recentlyUpdated = faqs
      .filter(faq => {
        const daysSinceUpdate = (Date.now() - new Date(faq.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceUpdate <= 30
      })
      .length
    
    return {
      totalFAQs: faqs.length,
      totalViews,
      totalVotes,
      averageHelpfulness,
      popularFAQs,
      recentlyUpdated
    }
  }
  
  const stats = calculateStats()
  
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }
  
  if (variant === 'compact') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        <div className="text-center">
          <div className="text-2xl font-bold text-sanctuary-600">{stats.totalFAQs}</div>
          <div className="text-sm text-gray-600">Questions</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-earth-600">{formatNumber(stats.totalViews)}</div>
          <div className="text-sm text-gray-600">Views</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.averageHelpfulness.toFixed(0)}%</div>
          <div className="text-sm text-gray-600">Helpful</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-sanctuary-600">{stats.popularFAQs}</div>
          <div className="text-sm text-gray-600">Popular</div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      <Card className="p-4">
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-sanctuary-600">{stats.totalFAQs}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <MessageCircle className="w-8 h-8 text-sanctuary-400" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {stats.recentlyUpdated} updated recently
          </div>
        </CardContent>
      </Card>
      
      <Card className="p-4">
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-earth-600">{formatNumber(stats.totalViews)}</div>
              <div className="text-sm text-gray-600">Total Views</div>
            </div>
            <Eye className="w-8 h-8 text-earth-400" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Avg. {Math.round(stats.totalViews / stats.totalFAQs)} per question
          </div>
        </CardContent>
      </Card>
      
      <Card className="p-4">
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.averageHelpfulness.toFixed(0)}%</div>
              <div className="text-sm text-gray-600">Helpful Rating</div>
            </div>
            <ThumbsUp className="w-8 h-8 text-green-400" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {formatNumber(stats.totalVotes)} total votes
          </div>
        </CardContent>
      </Card>
      
      <Card className="p-4">
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-sanctuary-600">{stats.popularFAQs}</div>
              <div className="text-sm text-gray-600">Popular FAQs</div>
            </div>
            <TrendingUp className="w-8 h-8 text-sanctuary-400" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Trending content
          </div>
        </CardContent>
      </Card>
    </div>
  )
}