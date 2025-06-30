import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DesignSystem } from '../components/DesignSystem'
import { HomepageBlogSection } from '../components/HomepageBlogSection'
import { Button, H1, H2, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent } from '../components/ui'
import { getFeaturedAnimals } from '../data/animals'
import { 
  Palette, 
  Eye, 
  Heart, 
  Shield, 
  Users, 
  MapPin, 
  ArrowRight, 
  DollarSign,
  UserPlus,
  Star,
  Mail,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react'

export function HomePage() {
  const [showDesignSystem, setShowDesignSystem] = useState(false)
  const featuredAnimals = getFeaturedAnimals()
  
  console.log('🏠 HomePage rendered:', { showDesignSystem, featuredAnimalsCount: featuredAnimals.length })
  
  if (showDesignSystem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-sanctuary-200 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="text-xl font-semibold text-sanctuary-800">Design System</h1>
            <Button 
              variant="outline" 
              onClick={() => setShowDesignSystem(false)}
              className="flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Back to Home
            </Button>
          </div>
        </div>
        <DesignSystem />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-sanctuary-600/80 via-sanctuary-500/70 to-earth-600/80 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center" />
        
        {/* Hero Content */}
        <div className="relative z-20 text-center text-white max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-8 animate-float">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-4xl">🏡</span>
            </div>
            <div className="w-12 h-12 bg-red-500/90 rounded-full flex items-center justify-center animate-pulse">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
          </div>
          
          <H1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg">
            Harmony Farm Sanctuary
          </H1>
          
          <BodyLarge className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Where rescued farm animals find peace, love, and their forever home in the beautiful landscapes of Central Oregon
          </BodyLarge>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/donate">
              <Button 
                variant="donate" 
                size="lg"
                className="text-lg px-8 py-4 flex items-center gap-3 shadow-xl"
              >
                <Heart className="w-5 h-5" />
                Sponsor an Animal
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            
            <Link to="/volunteer">
              <Button 
                variant="secondary" 
                size="lg"
                className="text-lg px-8 py-4 flex items-center gap-3 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
              >
                <Users className="w-5 h-5" />
                Become a Volunteer
              </Button>
            </Link>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/60 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Impact Section */}
      <section className="py-20 bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <H2 className="text-sanctuary-800 mb-6">Our Impact in Numbers</H2>
            <BodyLarge className="text-sanctuary-600 max-w-2xl mx-auto">
              Every rescue tells a story. Every life saved creates ripples of compassion that extend far beyond our farm.
            </BodyLarge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center p-8 bg-white/60 backdrop-blur-sm border-sanctuary-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-sanctuary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-sanctuary-800 mb-2">150+</div>
                <div className="text-sanctuary-600 font-medium mb-2">Animals Rescued</div>
                <BodyText className="text-sanctuary-500">
                  Farm animals saved from neglect, abuse, or slaughter since 2018
                </BodyText>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 bg-white/60 backdrop-blur-sm border-earth-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-earth-800 mb-2">500+</div>
                <div className="text-earth-600 font-medium mb-2">Volunteers Engaged</div>
                <BodyText className="text-earth-500">
                  Dedicated individuals who help care for our animals daily
                </BodyText>
              </CardContent>
            </Card>
            
            <Card className="text-center p-8 bg-white/60 backdrop-blur-sm border-green-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="pt-0">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-white fill-current" />
                </div>
                <div className="text-4xl font-bold text-green-800 mb-2">45</div>
                <div className="text-green-600 font-medium mb-2">Acres of Peace</div>
                <BodyText className="text-green-500">
                  Open pastures and shelter where animals roam freely and safely
                </BodyText>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Animals Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <H2 className="text-sanctuary-800 mb-6">Meet Some of Our Residents</H2>
            <BodyLarge className="text-sanctuary-600 max-w-2xl mx-auto">
              Each animal at Harmony Farm has a unique story of resilience. Here are just a few of the incredible souls you'll meet.
            </BodyLarge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {featuredAnimals.map((animal, index) => {
              const getSpeciesEmoji = (species: string) => {
                switch (species) {
                  case 'cow': return '🐄'
                  case 'pig': return '🐷'
                  case 'goat': return '🐐'
                  case 'sheep': return '🐑'
                  case 'chicken': return '🐓'
                  default: return '🐾'
                }
              }
              
              const getColorScheme = (index: number) => {
                const schemes = [
                  'sanctuary', 'earth', 'green'
                ]
                return schemes[index % schemes.length]
              }
              
              const colorScheme = getColorScheme(index)
              
              return (
                <Card key={animal.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={animal.featuredImage}
                      alt={animal.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="text-4xl drop-shadow-lg">{getSpeciesEmoji(animal.species)}</span>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className={`text-${colorScheme}-800`}>{animal.name}</CardTitle>
                    <BodyText className={`text-${colorScheme}-600 text-sm capitalize`}>
                      {animal.breed ? `${animal.breed} ${animal.species}` : animal.species}
                    </BodyText>
                  </CardHeader>
                  <CardContent>
                    <BodyText className={`text-${colorScheme}-600 mb-4`}>
                      {animal.story.length > 120 ? `${animal.story.substring(0, 120)}...` : animal.story}
                    </BodyText>
                    <Link to={`/animals/${animal.id}`}>
                      <Button variant="outline" size="sm" className="w-full group">
                        Read {animal.name}'s Story
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          <div className="text-center">
            <Link to="/animals">
              <Button variant="primary" size="lg" className="flex items-center gap-2 mx-auto">
                Meet All Our Animals
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Stories */}
      <HomepageBlogSection />

      {/* Call-to-Action Sections */}
      <section className="py-20 bg-gradient-to-br from-sanctuary-600 to-earth-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Donation CTA */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
              <CardHeader>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-2xl mb-4">Support Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText className="text-white/90 mb-6 leading-relaxed">
                  Your donation directly supports animal care, medical treatment, feed, and facility maintenance. 
                  Every dollar makes a difference in an animal's life.
                </BodyText>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-white/80">
                    <span>$25/month</span>
                    <span>Feeds one animal</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>$50/month</span>
                    <span>Medical care fund</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>$100/month</span>
                    <span>Full animal sponsorship</span>
                  </div>
                </div>
                <Link to="/donate">
                  <Button variant="donate" size="lg" className="w-full bg-white text-sanctuary-800 hover:bg-white/90">
                    <Heart className="w-5 h-5 mr-2" />
                    Make a Donation
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Volunteer CTA */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
              <CardHeader>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6">
                  <UserPlus className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white text-2xl mb-4">Join Our Community</CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText className="text-white/90 mb-6 leading-relaxed">
                  Become part of our volunteer family and experience the joy of working directly with rescued animals. 
                  No experience necessary—just a love for animals!
                </BodyText>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-white/80">
                    <Star className="w-4 h-4" />
                    <span>Animal care and feeding</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Star className="w-4 h-4" />
                    <span>Facility maintenance</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Star className="w-4 h-4" />
                    <span>Educational programs</span>
                  </div>
                </div>
                <Link to="/volunteer">
                  <Button variant="secondary" size="lg" className="w-full bg-white text-earth-800 hover:bg-white/90">
                    <Users className="w-5 h-5 mr-2" />
                    Become a Volunteer
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter & Social */}
      <section className="py-20 bg-sanctuary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <H2 className="text-sanctuary-800 mb-6">Stay Connected</H2>
              <BodyLarge className="text-sanctuary-600">
                Get updates on our animals, upcoming events, and ways to help. Join our community of animal lovers!
              </BodyLarge>
            </div>
            
            <Card className="bg-white/60 backdrop-blur-sm border-sanctuary-200 p-8">
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-1">
                    <H2 className="text-xl text-sanctuary-800 mb-2">Newsletter Signup</H2>
                    <BodyText className="text-sanctuary-600 mb-4">
                      Monthly updates and heartwarming animal stories delivered to your inbox.
                    </BodyText>
                    <div className="flex gap-3">
                      <input 
                        type="email" 
                        placeholder="Enter your email"
                        className="flex-1 px-4 py-3 border border-sanctuary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sanctuary-500"
                      />
                      <Button variant="primary" className="px-6">
                        <Mail className="w-4 h-4 mr-2" />
                        Subscribe
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4">
                    <BodyText className="text-sanctuary-600 font-medium">Follow Us</BodyText>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="p-3">
                        <Facebook className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="sm" className="p-3">
                        <Instagram className="w-5 h-5" />
                      </Button>
                      <Button variant="outline" size="sm" className="p-3">
                        <Twitter className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visit Information */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="text-sanctuary-800 mb-6">Visit Harmony Farm</H2>
            <BodyLarge className="text-sanctuary-600 mb-8">
              Experience the magic of our sanctuary in person. Tours available by appointment.
            </BodyLarge>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card className="p-6">
                <CardContent className="pt-0">
                  <div className="w-12 h-12 bg-sanctuary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <H2 className="text-lg text-sanctuary-800 mb-2">Location</H2>
                  <BodyText className="text-sanctuary-600">
                    123 Sanctuary Road<br />
                    Central Oregon, OR 97XXX
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6">
                <CardContent className="pt-0">
                  <div className="w-12 h-12 bg-earth-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <H2 className="text-lg text-earth-800 mb-2">Group Tours</H2>
                  <BodyText className="text-earth-600">
                    Educational visits for schools,<br />
                    families, and organizations
                  </BodyText>
                </CardContent>
              </Card>
            </div>
            
            <Link to="/contact">
              <Button variant="primary" size="lg" className="flex items-center gap-2 mx-auto">
                Schedule a Visit
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Design System Access */}
      <section className="py-8 bg-sanctuary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <BodyText className="text-sanctuary-200 mb-4">
            Development Tools
          </BodyText>
          <Button 
            variant="outline" 
            onClick={() => setShowDesignSystem(true)}
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Palette className="w-4 h-4 mr-2" />
            View Design System
          </Button>
        </div>
      </section>
    </div>
  )
}