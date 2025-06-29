import { 
  Heart, 
  Users, 
  Award, 
  Calendar,
  Target,
  Leaf,
  Shield,
  BookOpen,
  Star
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { H1, H2, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../components/ui'

export function AboutPage() {
  console.log('ℹ️ AboutPage rendered')
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-sanctuary-600/90 to-earth-600/90 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2087&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-8 animate-float">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white fill-current" />
              </div>
              <div className="w-12 h-12 bg-sanctuary-400/80 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏡</span>
              </div>
            </div>
            
            <H1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Our Story</H1>
            <BodyLarge className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              From a simple dream to rescue abandoned farm animals to becoming Central Oregon's premier sanctuary, 
              our journey has been guided by compassion, dedication, and an unwavering belief that every life matters.
            </BodyLarge>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="text-sanctuary-800 mb-6">Mission & Vision</H2>
              <BodyLarge className="text-sanctuary-600 max-w-3xl mx-auto">
                Our core beliefs and values that drive everything we do at Harmony Farm Sanctuary.
              </BodyLarge>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="p-8 bg-gradient-to-br from-sanctuary-50 to-sanctuary-100 border-sanctuary-200">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-sanctuary-600 rounded-full flex items-center justify-center">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-sanctuary-800">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <BodyText className="text-sanctuary-700 mb-6 leading-relaxed">
                    To rescue, rehabilitate, and provide lifelong sanctuary to farm animals in need while educating 
                    our community about compassionate living, sustainable agriculture, and the inherent worth of all sentient beings.
                  </BodyText>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sanctuary-600">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Rescue animals from neglect, abuse, and slaughter</span>
                    </div>
                    <div className="flex items-center gap-3 text-sanctuary-600">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Provide lifelong care and medical treatment</span>
                    </div>
                    <div className="flex items-center gap-3 text-sanctuary-600">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Educate through tours and outreach programs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="p-8 bg-gradient-to-br from-earth-50 to-earth-100 border-earth-200">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-earth-800">Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <BodyText className="text-earth-700 mb-6 leading-relaxed">
                    A world where farm animals are valued as individuals deserving of respect, compassion, and freedom from exploitation. 
                    Where humanity recognizes our interconnectedness with all living beings.
                  </BodyText>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-earth-600">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">End farm animal suffering through education</span>
                    </div>
                    <div className="flex items-center gap-3 text-earth-600">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Promote plant-based, sustainable living</span>
                    </div>
                    <div className="flex items-center gap-3 text-earth-600">
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Create a more compassionate society</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-20 bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="text-sanctuary-800 mb-6">Our Journey</H2>
              <BodyLarge className="text-sanctuary-600">
                From humble beginnings to a thriving sanctuary - here's how our story unfolded.
              </BodyLarge>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-sanctuary-300" />
              
              <div className="space-y-12">
                <div className="relative flex items-start gap-8">
                  <div className="relative z-10 w-16 h-16 bg-sanctuary-600 rounded-full flex items-center justify-center text-white font-bold">
                    2018
                  </div>
                  <Card className="flex-1 p-6 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sanctuary-800">The Beginning</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BodyText className="text-sanctuary-600">
                        Sarah and Mike Thompson purchase 45 acres in Central Oregon with a dream to create a safe haven 
                        for farm animals. The first residents arrive: three rescued dairy cows from a bankrupt farm.
                      </BodyText>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="relative flex items-start gap-8">
                  <div className="relative z-10 w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center text-white font-bold">
                    2019
                  </div>
                  <Card className="flex-1 p-6 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-earth-800">Growing Family</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BodyText className="text-earth-600">
                        Harmony Farm officially opens as a sanctuary. Word spreads, and we rescue our first pigs, goats, 
                        and chickens. Our volunteer program begins with 12 dedicated helpers.
                      </BodyText>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="relative flex items-start gap-8">
                  <div className="relative z-10 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    2020
                  </div>
                  <Card className="flex-1 p-6 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-green-800">Official Recognition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BodyText className="text-green-600">
                        Harmony Farm receives 501(c)(3) nonprofit status and GFAS accreditation. Despite pandemic challenges, 
                        we continue rescues and launch virtual tours to maintain community connection.
                      </BodyText>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="relative flex items-start gap-8">
                  <div className="relative z-10 w-16 h-16 bg-sanctuary-600 rounded-full flex items-center justify-center text-white font-bold">
                    2023
                  </div>
                  <Card className="flex-1 p-6 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sanctuary-800">Thriving Community</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BodyText className="text-sanctuary-600">
                        Today, we're home to 150+ rescued animals and supported by 500+ volunteers. Our educational programs 
                        reach thousands annually, creating lasting change in how people view farm animals.
                      </BodyText>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="text-sanctuary-800 mb-6">Our Approach</H2>
              <BodyLarge className="text-sanctuary-600 max-w-3xl mx-auto">
                How we ensure the highest quality of care while building a more compassionate world.
              </BodyLarge>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-0">
                  <div className="w-16 h-16 bg-sanctuary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-sanctuary-800 mb-4">Animal-Centered Care</CardTitle>
                  <BodyText className="text-sanctuary-600 leading-relaxed">
                    Every decision we make prioritizes the physical and emotional well-being of our resident animals. 
                    From spacious pastures to specialized veterinary care, comfort comes first.
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-0">
                  <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-earth-800 mb-4">Education First</CardTitle>
                  <BodyText className="text-earth-600 leading-relaxed">
                    We believe lasting change happens through education. Our tours, workshops, and school programs 
                    help people understand the intelligence and emotions of farm animals.
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-0">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-green-800 mb-4">Community Focused</CardTitle>
                  <BodyText className="text-green-600 leading-relaxed">
                    Our volunteer program creates meaningful connections between people and animals. 
                    Together, we're building a community that values compassion over consumption.
                  </BodyText>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Leadership */}
      <section className="py-20 bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="text-sanctuary-800 mb-6">Meet Our Leadership</H2>
              <BodyLarge className="text-sanctuary-600">
                The dedicated team behind Harmony Farm Sanctuary's mission.
              </BodyLarge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="p-8 bg-white/60 backdrop-blur-sm">
                <CardContent className="pt-0">
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-sanctuary-200 to-sanctuary-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">👩‍🌾</span>
                    </div>
                    <H2 className="text-xl text-sanctuary-800 mb-2">Sarah Thompson</H2>
                    <Badge variant="success">Co-Founder & Director</Badge>
                  </div>
                  <BodyText className="text-sanctuary-600 leading-relaxed">
                    A lifelong animal advocate with 15 years of experience in farm animal rescue. Sarah oversees daily operations, 
                    animal care protocols, and educational programming. Her passion for creating a more compassionate world drives 
                    everything we do at Harmony Farm.
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-8 bg-white/60 backdrop-blur-sm">
                <CardContent className="pt-0">
                  <div className="text-center mb-6">
                    <div className="w-32 h-32 bg-gradient-to-br from-earth-200 to-earth-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl">👨‍🌾</span>
                    </div>
                    <H2 className="text-xl text-earth-800 mb-2">Mike Thompson</H2>
                    <Badge variant="info">Co-Founder & Operations</Badge>
                  </div>
                  <BodyText className="text-earth-600 leading-relaxed">
                    With a background in sustainable agriculture and construction, Mike manages facility maintenance, 
                    infrastructure development, and volunteer coordination. His expertise ensures our animals have safe, 
                    comfortable homes designed with their specific needs in mind.
                  </BodyText>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation & Recognition */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="text-sanctuary-800 mb-6">Accreditation & Recognition</H2>
              <BodyLarge className="text-sanctuary-600">
                Our commitment to excellence in animal care and sanctuary management is recognized by leading organizations.
              </BodyLarge>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-sanctuary-50 to-earth-50 border-sanctuary-200">
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-sanctuary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="w-10 h-10 text-white" />
                    </div>
                    <Badge variant="success" size="lg" className="mb-2">GFAS Accredited</Badge>
                    <BodyText className="text-sanctuary-600 text-sm">
                      Global Federation of Animal Sanctuaries certification ensures the highest standards of animal care.
                    </BodyText>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-earth-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <Badge variant="info" size="lg" className="mb-2">501(c)(3) Nonprofit</Badge>
                    <BodyText className="text-earth-600 text-sm">
                      IRS-recognized nonprofit organization with full tax-exempt status for donor contributions.
                    </BodyText>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-10 h-10 text-white" />
                    </div>
                    <Badge variant="sponsored" size="lg" className="mb-2">GuideStar Seal</Badge>
                    <BodyText className="text-green-600 text-sm">
                      Platinum transparency seal demonstrating our commitment to accountability and impact.
                    </BodyText>
                  </div>
                </div>
                
                <div className="text-center">
                  <BodyText className="text-sanctuary-600 leading-relaxed max-w-2xl mx-auto">
                    These certifications reflect our unwavering commitment to maintaining the highest standards in animal welfare, 
                    financial transparency, and sanctuary operations. We undergo regular inspections and audits to ensure we 
                    continue meeting these rigorous standards.
                  </BodyText>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-sanctuary-600 to-earth-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="text-white mb-6">Join Our Mission</H2>
            <BodyLarge className="text-white/90 mb-8 leading-relaxed">
              Every visit, donation, and volunteer hour helps us continue providing sanctuary to animals in need 
              while building a more compassionate community.
            </BodyLarge>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-white text-sanctuary-800 hover:bg-white/90">
                <Users className="w-5 h-5 mr-2" />
                Become a Volunteer
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Calendar className="w-5 h-5 mr-2" />
                Schedule a Tour
              </Button>
              <Link to="/mission">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Target className="w-5 h-5 mr-2" />
                  Our Mission
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}