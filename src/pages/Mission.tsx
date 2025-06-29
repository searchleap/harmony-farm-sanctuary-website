import { 
  Heart, 
  Target, 
  Leaf, 
  Shield, 
  Users, 
  Globe,
  Lightbulb,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { H1, H2, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui'

export function MissionPage() {
  console.log('🎯 MissionPage rendered')
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-sanctuary-600/90 to-earth-600/90 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-8 animate-float">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-6 text-white/70">
              <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              <span>/</span>
              <span className="text-white">Mission</span>
            </div>
            
            <H1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Our Mission</H1>
            <BodyLarge className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Dedicated to creating a world where farm animals are recognized as individuals deserving 
              of compassion, respect, and freedom from exploitation.
            </BodyLarge>
          </div>
        </div>
      </section>

      {/* Core Mission Statement */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="p-12 bg-gradient-to-br from-sanctuary-50 to-earth-50 border-sanctuary-200 shadow-xl">
              <CardContent className="pt-0 text-center">
                <div className="w-20 h-20 bg-sanctuary-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Heart className="w-10 h-10 text-white fill-current" />
                </div>
                <H2 className="text-3xl text-sanctuary-800 mb-8">Mission Statement</H2>
                <BodyLarge className="text-sanctuary-700 leading-relaxed text-xl mb-8">
                  "To rescue, rehabilitate, and provide lifelong sanctuary to farm animals in need while educating 
                  our community about compassionate living, sustainable agriculture, and the inherent worth of all sentient beings."
                </BodyLarge>
                <BodyText className="text-sanctuary-600 leading-relaxed max-w-2xl mx-auto">
                  Every decision we make, every program we develop, and every relationship we build is guided by this 
                  fundamental commitment to creating a more compassionate world for all living beings.
                </BodyText>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="text-sanctuary-800 mb-6">Our Core Values</H2>
              <BodyLarge className="text-sanctuary-600 max-w-3xl mx-auto">
                The fundamental principles that guide every aspect of our work at Harmony Farm Sanctuary.
              </BodyLarge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="p-6 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-sanctuary-600 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-white fill-current" />
                  </div>
                  <CardTitle className="text-sanctuary-800">Compassion</CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyText className="text-sanctuary-600 leading-relaxed">
                    We approach every animal with empathy, understanding their individual needs, 
                    fears, and personalities while providing unconditional love and care.
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-earth-800">Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyText className="text-earth-600 leading-relaxed">
                    We provide lifelong sanctuary, ensuring no animal under our care will ever 
                    face harm, exploitation, or abandonment again.
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-green-800">Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyText className="text-green-600 leading-relaxed">
                    We believe knowledge creates change. Through education, we help people understand 
                    the intelligence, emotions, and worth of farm animals.
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-sanctuary-600 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-sanctuary-800">Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyText className="text-sanctuary-600 leading-relaxed">
                    We build inclusive communities where people of all backgrounds can connect 
                    with animals and each other in meaningful ways.
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center mb-4">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-earth-800">Sustainability</CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyText className="text-earth-600 leading-relaxed">
                    We promote environmentally responsible practices that benefit animals, 
                    the planet, and future generations.
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-white/60 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-green-800">Global Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyText className="text-green-600 leading-relaxed">
                    While we care for animals locally, we work toward global change in how 
                    society views and treats farm animals everywhere.
                  </BodyText>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitments */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="text-sanctuary-800 mb-6">Our Commitments</H2>
              <BodyLarge className="text-sanctuary-600">
                Specific promises we make to the animals in our care and the community we serve.
              </BodyLarge>
            </div>
            
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-r from-sanctuary-50 to-white border-l-4 border-sanctuary-600">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-sanctuary-600 mt-1 flex-shrink-0" />
                    <div>
                      <H2 className="text-lg text-sanctuary-800 mb-2">Lifelong Care Promise</H2>
                      <BodyText className="text-sanctuary-600 leading-relaxed">
                        Every animal who comes to Harmony Farm receives a lifetime commitment. We never euthanize 
                        for space, convenience, or cost. Each resident is guaranteed care, comfort, and companionship 
                        for their entire natural life.
                      </BodyText>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-gradient-to-r from-earth-50 to-white border-l-4 border-earth-600">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-earth-600 mt-1 flex-shrink-0" />
                    <div>
                      <H2 className="text-lg text-earth-800 mb-2">Medical Excellence</H2>
                      <BodyText className="text-earth-600 leading-relaxed">
                        We provide comprehensive veterinary care including preventive medicine, emergency treatment, 
                        and end-of-life comfort care. No animal suffers due to lack of medical attention or resources.
                      </BodyText>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-gradient-to-r from-green-50 to-white border-l-4 border-green-600">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <H2 className="text-lg text-green-800 mb-2">Educational Impact</H2>
                      <BodyText className="text-green-600 leading-relaxed">
                        We educate thousands annually about farm animal intelligence, emotions, and needs. 
                        Our programs inspire lasting change in how people view and treat all animals.
                      </BodyText>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-gradient-to-r from-sanctuary-50 to-white border-l-4 border-sanctuary-600">
                <CardContent className="pt-0">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="w-6 h-6 text-sanctuary-600 mt-1 flex-shrink-0" />
                    <div>
                      <H2 className="text-lg text-sanctuary-800 mb-2">Transparency & Accountability</H2>
                      <BodyText className="text-sanctuary-600 leading-relaxed">
                        We maintain open books, regular reporting, and welcome oversight. Our donors and community 
                        deserve to know exactly how their support creates positive impact.
                      </BodyText>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Goals */}
      <section className="py-20 bg-gradient-to-br from-sanctuary-600 to-earth-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <H2 className="text-white mb-6">Looking Forward: 2024-2027 Goals</H2>
              <BodyLarge className="text-white/90 max-w-3xl mx-auto">
                Our mission guides these ambitious goals for expanding our impact and reaching more animals in need.
              </BodyLarge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="pt-0">
                  <div className="text-4xl font-bold text-white mb-2">250+</div>
                  <div className="text-white/80 font-medium mb-2">Animals Rescued</div>
                  <BodyText className="text-white/70 text-sm">
                    Expand capacity to rescue more animals from dire situations
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="pt-0">
                  <div className="text-4xl font-bold text-white mb-2">1000+</div>
                  <div className="text-white/80 font-medium mb-2">Volunteers</div>
                  <BodyText className="text-white/70 text-sm">
                    Double our volunteer base to increase our community impact
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="pt-0">
                  <div className="text-4xl font-bold text-white mb-2">15K+</div>
                  <div className="text-white/80 font-medium mb-2">Students Educated</div>
                  <BodyText className="text-white/70 text-sm">
                    Reach more schools with our compassion education programs
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="pt-0">
                  <div className="text-4xl font-bold text-white mb-2">60</div>
                  <div className="text-white/80 font-medium mb-2">Acres Expanded</div>
                  <BodyText className="text-white/70 text-sm">
                    Add more pasture space for additional animals
                  </BodyText>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="text-sanctuary-800 mb-6">Be Part of Our Mission</H2>
            <BodyLarge className="text-sanctuary-600 mb-8">
              Our mission becomes reality through the support of compassionate individuals like you. 
              Every action, no matter how small, contributes to creating a more humane world.
            </BodyLarge>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-0">
                  <div className="w-16 h-16 bg-sanctuary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white fill-current" />
                  </div>
                  <H2 className="text-lg text-sanctuary-800 mb-2">Donate</H2>
                  <BodyText className="text-sanctuary-600 text-sm mb-4">
                    Provide direct support for animal care, medical treatment, and facility maintenance.
                  </BodyText>
                  <Button variant="primary" size="sm" className="w-full">
                    Make a Donation
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-0">
                  <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <H2 className="text-lg text-earth-800 mb-2">Volunteer</H2>
                  <BodyText className="text-earth-600 text-sm mb-4">
                    Join our community of caregivers and experience the joy of helping animals directly.
                  </BodyText>
                  <Button variant="secondary" size="sm" className="w-full">
                    Get Involved
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="pt-0">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <H2 className="text-lg text-green-800 mb-2">Learn</H2>
                  <BodyText className="text-green-600 text-sm mb-4">
                    Explore our educational resources and share knowledge about compassionate living.
                  </BodyText>
                  <Button variant="outline" size="sm" className="w-full">
                    Explore Resources
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-sanctuary-50 to-earth-50 border-sanctuary-200">
              <CardContent className="pt-0">
                <H2 className="text-2xl text-sanctuary-800 mb-4">Stay Connected to Our Mission</H2>
                <BodyText className="text-sanctuary-600 mb-6">
                  Subscribe to our newsletter for mission updates, animal stories, and ways to make a difference.
                </BodyText>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border border-sanctuary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sanctuary-500"
                  />
                  <Button variant="primary" className="px-6">
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}