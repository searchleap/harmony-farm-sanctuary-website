import { Link } from 'react-router-dom'
import { Button, H2, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent } from './ui'
import { CategoryBadge } from './blog/CategoryBadge'
import { getRecentBlogPosts } from '../data/blogPosts'
import { BlogPost } from '../types/blog'
import { ArrowRight, Calendar, Clock, User, MessageCircle } from 'lucide-react'

interface HomepageBlogSectionProps {
  className?: string
}

export function HomepageBlogSection({ className = '' }: HomepageBlogSectionProps) {
  // Get the latest 3 published posts
  const latestPosts = getRecentBlogPosts(3)
  
  console.log('🏠📰 HomepageBlogSection rendered:', { 
    latestPostsCount: latestPosts.length 
  })
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  

  
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const wordCount = content.split(' ').length
    const readingTime = Math.ceil(wordCount / wordsPerMinute)
    return `${readingTime} min read`
  }
  
  return (
    <section className={`py-20 bg-gradient-to-br from-earth-50 to-sanctuary-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <H2 className="text-sanctuary-800 mb-6">Latest Stories from the Farm</H2>
          <BodyLarge className="text-sanctuary-600 max-w-2xl mx-auto">
            Stay updated with heartwarming stories, important news, and educational content from our sanctuary community.
          </BodyLarge>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {latestPosts.map((post: BlogPost, index: number) => {
            const getColorScheme = (index: number) => {
              const schemes = ['sanctuary', 'earth', 'green']
              return schemes[index % schemes.length]
            }
            const colorScheme = getColorScheme(index)
            
            return (
              <Card 
                key={post.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.featuredImage}
                    alt={post.featuredImageAlt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <CategoryBadge category={post.category} variant="default" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 text-white text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.publishedAt)}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{getReadingTime(post.content)}</span>
                    </div>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className={`text-${colorScheme}-800 leading-tight`}>
                    {post.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <BodyText className={`text-${colorScheme}-600 mb-4 leading-relaxed`}>
                    {post.excerpt.length > 120 ? `${post.excerpt.substring(0, 120)}...` : post.excerpt}
                  </BodyText>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.commentCount}</span>
                    </div>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="outline" size="sm" className="w-full group">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        <div className="text-center">
          <Link to="/blog">
            <Button variant="primary" size="lg" className="flex items-center gap-2 mx-auto">
              View All Stories
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}