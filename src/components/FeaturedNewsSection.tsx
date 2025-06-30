import { Link } from 'react-router-dom'
import { Button, H2, H3, BodyLarge, BodyText, Card, CardContent } from './ui'
import { getBlogPostsByCategory } from '../data/blogPosts'
import { BlogPost } from '../types/blog'
import { ArrowRight, Calendar, Star, Bell, Heart } from 'lucide-react'

interface FeaturedNewsSectionProps {
  className?: string
}

export function FeaturedNewsSection({ className = '' }: FeaturedNewsSectionProps) {
  // Get sanctuary news and announcements
  const sanctuaryNews = getBlogPostsByCategory('sanctuary-news').slice(0, 1)
  const animalUpdates = getBlogPostsByCategory('animal-updates').slice(0, 2)
  
  console.log('📢 FeaturedNewsSection rendered:', { 
    sanctuaryNewsCount: sanctuaryNews.length,
    animalUpdatesCount: animalUpdates.length
  })
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  if (sanctuaryNews.length === 0 && animalUpdates.length === 0) {
    return null
  }
  
  return (
    <section className={`py-16 bg-gradient-to-br from-green-50 to-sanctuary-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bell className="w-8 h-8 text-sanctuary-600" />
            <H2 className="text-sanctuary-800">Featured News & Updates</H2>
          </div>
          <BodyLarge className="text-sanctuary-600 max-w-2xl mx-auto">
            Important announcements and heartwarming animal updates from our sanctuary family.
          </BodyLarge>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Featured Sanctuary News */}
          {sanctuaryNews.length > 0 && (
            <div className="lg:col-span-2">
              {sanctuaryNews.map((post: BlogPost) => (
                <Card key={post.id} className="overflow-hidden bg-gradient-to-br from-sanctuary-600 to-sanctuary-700 text-white border-sanctuary-700">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={post.featuredImage}
                      alt={post.featuredImageAlt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sanctuary-800/90 via-sanctuary-600/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <div className="bg-yellow-500 text-sanctuary-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        Featured News
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center gap-2 text-white/90 text-sm mb-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <H3 className="text-white text-xl font-bold leading-tight">
                        {post.title}
                      </H3>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <BodyText className="text-white/90 mb-4 leading-relaxed">
                      {post.excerpt.length > 150 ? `${post.excerpt.substring(0, 150)}...` : post.excerpt}
                    </BodyText>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/80 text-sm">
                        <span>By {post.author.name}</span>
                        <span>•</span>
                        <span>{post.readTime} min read</span>
                      </div>
                      
                      <Link to={`/blog/${post.slug}`}>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="bg-white text-sanctuary-800 hover:bg-white/90"
                        >
                          Read Full Story
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Animal Updates Sidebar */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <H3 className="text-sanctuary-800 flex items-center gap-2 justify-center lg:justify-start">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                Recent Animal Updates
              </H3>
            </div>
            
            {animalUpdates.map((post: BlogPost) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="flex gap-4 p-4">
                  <div className="flex-shrink-0">
                    <img
                      src={post.featuredImage}
                      alt={post.featuredImageAlt}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <H3 className="text-sanctuary-800 text-sm font-semibold leading-tight mb-2">
                      {post.title.length > 60 ? `${post.title.substring(0, 60)}...` : post.title}
                    </H3>
                    <BodyText className="text-sanctuary-600 text-sm mb-2">
                      {post.excerpt.length > 80 ? `${post.excerpt.substring(0, 80)}...` : post.excerpt}
                    </BodyText>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-sanctuary-500">
                        {formatDate(post.publishedAt)}
                      </span>
                      <Link to={`/blog/${post.slug}`}>
                        <Button variant="outline" size="sm" className="text-xs px-2 py-1">
                          Read
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            <div className="text-center">
              <Link to="/blog/category/animal-updates">
                <Button variant="outline" size="sm" className="w-full">
                  View All Animal Updates
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Newsletter Integration */}
        <div className="mt-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-earth-600 to-sanctuary-600 text-white border-earth-700">
            <CardContent className="p-8 text-center">
              <H3 className="text-white mb-4">Never Miss an Update</H3>
              <BodyText className="text-white/90 mb-6 max-w-2xl mx-auto">
                Get the latest news, animal updates, and sanctuary stories delivered to your inbox every month.
              </BodyText>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button variant="secondary" className="bg-white text-sanctuary-800 hover:bg-white/90 px-6">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}