import { useState } from 'react'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Users,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Shield,
  Navigation,
  Car,
  Bus,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { H1, H2, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea } from '../components/ui'

const faqData = [
  {
    category: 'Visiting',
    questions: [
      {
        question: 'Do I need to book a tour in advance?',
        answer: 'Weekend public tours are available on a first-come, first-served basis. However, we recommend booking in advance during peak seasons (spring and summer) to guarantee your spot. Private tours must be scheduled at least 48 hours in advance.'
      },
      {
        question: 'What should I wear for a sanctuary visit?',
        answer: 'We recommend closed-toe shoes, comfortable clothing you don\'t mind getting dirty, and layers for weather changes. During wet seasons, waterproof boots are ideal. We provide hand sanitizer, but you may want to bring your own.'
      },
      {
        question: 'Can I bring my children?',
        answer: 'Children are welcome! We ask that children under 12 be supervised at all times. Our animals are gentle, but for safety, please follow our staff\'s guidance during interactions.'
      },
      {
        question: 'Are pets allowed at the sanctuary?',
        answer: 'For the safety and comfort of our resident animals, we do not allow pets on the sanctuary grounds. Service animals are welcome with proper documentation.'
      }
    ]
  },
  {
    category: 'Volunteering',
    questions: [
      {
        question: 'What volunteer opportunities are available?',
        answer: 'We offer various volunteer roles including animal care, facility maintenance, educational programs, administrative support, and special events. No prior experience is required - we provide comprehensive training.'
      },
      {
        question: 'How often do I need to volunteer?',
        answer: 'We appreciate any time you can give! Some volunteers come weekly, others monthly. We ask for a minimum 6-month commitment to build relationships with our animals and team.'
      },
      {
        question: 'Is there an age requirement for volunteers?',
        answer: 'Volunteers must be at least 16 years old for most activities. We have family volunteer days for younger children accompanied by adults. Student volunteers can fulfill community service requirements.'
      }
    ]
  },
  {
    category: 'Animals',
    questions: [
      {
        question: 'Can I adopt an animal from the sanctuary?',
        answer: 'Our animals are permanent residents who have found their forever home with us. However, you can sponsor an animal to support their ongoing care, which includes regular updates and visit opportunities.'
      },
      {
        question: 'How do you rescue animals?',
        answer: 'Animals come to us through various channels: owner surrenders, emergency rescues, law enforcement confiscations, and transfers from other facilities. Each animal receives medical care, rehabilitation, and socialization as needed.'
      },
      {
        question: 'Can I interact with the animals during my visit?',
        answer: 'Supervised interactions are available during tours based on each animal\'s personality and comfort level. Some animals love attention, while others prefer to be observed from a distance. Our staff will guide all interactions.'
      }
    ]
  }
]

export function ContactPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'visit' | 'volunteer'>('contact')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [tourForm, setTourForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    groupSize: '',
    type: 'public',
    message: ''
  })
  const [volunteerForm, setVolunteerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interests: [] as string[],
    availability: '',
    experience: '',
    motivation: ''
  })
  
  console.log('📞 ContactPage rendered:', { activeTab, expandedFAQ })
  
  const handleTourFormChange = (field: string, value: string) => {
    setTourForm(prev => ({ ...prev, [field]: value }))
  }
  
  const handleVolunteerFormChange = (field: string, value: string | string[]) => {
    setVolunteerForm(prev => ({ ...prev, [field]: value }))
  }
  
  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id)
  }
  
  const volunteerInterests = [
    'Animal Care', 'Facility Maintenance', 'Educational Programs', 
    'Administrative Support', 'Special Events', 'Photography', 
    'Social Media', 'Fundraising'
  ]
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-sanctuary-600/90 to-earth-600/90 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2087&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Contact & Visit</H1>
            <BodyLarge className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Connect with us to plan your visit, volunteer, or get involved with our sanctuary community. 
              We're here to help you become part of our mission.
            </BodyLarge>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="py-8 bg-white border-b border-sanctuary-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={activeTab === 'contact' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('contact')}
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                General Contact
              </Button>
              <Button
                variant={activeTab === 'visit' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('visit')}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Plan Your Visit
              </Button>
              <Button
                variant={activeTab === 'volunteer' ? 'primary' : 'outline'}
                onClick={() => setActiveTab('volunteer')}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Volunteer Application
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Location & Hours */}
              <Card className="p-6 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-sanctuary-800">
                    <MapPin className="w-6 h-6" />
                    Location & Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <BodyText className="font-medium text-sanctuary-700">Address:</BodyText>
                      <BodyText className="text-sanctuary-600">
                        123 Sanctuary Road<br />
                        Sisters, OR 97759<br />
                        Central Oregon
                      </BodyText>
                    </div>
                    <div>
                      <BodyText className="font-medium text-sanctuary-700">Public Tours:</BodyText>
                      <BodyText className="text-sanctuary-600">
                        Saturdays & Sundays<br />
                        10:00 AM - 4:00 PM<br />
                        (Last tour at 3:00 PM)
                      </BodyText>
                    </div>
                    <div>
                      <BodyText className="font-medium text-sanctuary-700">Office Hours:</BodyText>
                      <BodyText className="text-sanctuary-600">
                        Monday - Friday<br />
                        9:00 AM - 5:00 PM
                      </BodyText>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Contact Methods */}
              <Card className="p-6 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-earth-800">
                    <Phone className="w-6 h-6" />
                    Get in Touch
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-earth-600" />
                      <div>
                        <BodyText className="font-medium text-earth-700">Main Line:</BodyText>
                        <BodyText className="text-earth-600">(541) 555-FARM</BodyText>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-earth-600" />
                      <div>
                        <BodyText className="font-medium text-earth-700">Email:</BodyText>
                        <BodyText className="text-earth-600">info@harmonyfarmsanctuary.org</BodyText>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <BodyText className="font-medium text-red-700">Emergency:</BodyText>
                        <BodyText className="text-red-600">(541) 555-HELP</BodyText>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <BodyText className="font-medium text-green-700">Volunteer Coordinator:</BodyText>
                        <BodyText className="text-green-600">volunteer@harmonyfarmsanctuary.org</BodyText>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Emergency Information */}
              <Card className="p-6 bg-white/60 backdrop-blur-sm border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-amber-800">
                    <Shield className="w-6 h-6" />
                    Important Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <BodyText className="font-medium text-amber-700">Visitor Guidelines:</BodyText>
                      <BodyText className="text-amber-600 text-sm">
                        • Closed-toe shoes required<br />
                        • No outside food for animals<br />
                        • Supervised children only<br />
                        • Follow staff instructions
                      </BodyText>
                    </div>
                    <div>
                      <BodyText className="font-medium text-amber-700">Weather Policy:</BodyText>
                      <BodyText className="text-amber-600 text-sm">
                        Tours operate rain or shine. Extreme weather may cause cancellations with 24-hour notice.
                      </BodyText>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tab Content */}
            {activeTab === 'contact' && (
              <Card className="p-8 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-sanctuary-800">Send us a Message</CardTitle>
                  <BodyText className="text-sanctuary-600">
                    We'd love to hear from you! Whether you have questions about our animals, want to plan a visit, 
                    or are interested in supporting our mission, we're here to help.
                  </BodyText>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input label="First Name" placeholder="Your first name" required />
                      <Input label="Last Name" placeholder="Your last name" required />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input label="Email" type="email" placeholder="your@email.com" required />
                      <Input label="Phone" type="tel" placeholder="(541) 555-0123" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-sanctuary-700 mb-2">
                        Subject
                      </label>
                      <select className="w-full px-3 py-2 border border-sanctuary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sanctuary-500">
                        <option>General Inquiry</option>
                        <option>Tour Booking</option>
                        <option>Volunteer Interest</option>
                        <option>Animal Sponsorship</option>
                        <option>Media Request</option>
                        <option>Educational Programs</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <Textarea 
                      label="Message" 
                      placeholder="Tell us how we can help..."
                      rows={5}
                      required
                    />
                    <Button variant="primary" size="lg" className="w-full">
                      <Mail className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'visit' && (
              <div className="space-y-8">
                <Card className="p-8 bg-white/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-earth-800">Schedule Your Visit</CardTitle>
                    <BodyText className="text-earth-600">
                      Plan your sanctuary tour and experience the joy of meeting our rescued animals.
                    </BodyText>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input 
                          label="Full Name" 
                          placeholder="Your full name"
                          value={tourForm.name}
                          onChange={(e) => handleTourFormChange('name', e.target.value)}
                          required 
                        />
                        <Input 
                          label="Email" 
                          type="email" 
                          placeholder="your@email.com"
                          value={tourForm.email}
                          onChange={(e) => handleTourFormChange('email', e.target.value)}
                          required 
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input 
                          label="Phone" 
                          type="tel" 
                          placeholder="(541) 555-0123"
                          value={tourForm.phone}
                          onChange={(e) => handleTourFormChange('phone', e.target.value)}
                        />
                        <Input 
                          label="Group Size" 
                          type="number" 
                          placeholder="Number of visitors"
                          value={tourForm.groupSize}
                          onChange={(e) => handleTourFormChange('groupSize', e.target.value)}
                          required 
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-earth-700 mb-2">
                            Preferred Date
                          </label>
                          <Input 
                            type="date" 
                            value={tourForm.date}
                            onChange={(e) => handleTourFormChange('date', e.target.value)}
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-earth-700 mb-2">
                            Tour Type
                          </label>
                          <select 
                            className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-earth-500"
                            value={tourForm.type}
                            onChange={(e) => handleTourFormChange('type', e.target.value)}
                          >
                            <option value="public">Public Tour (Weekends)</option>
                            <option value="private">Private Tour (Any day)</option>
                            <option value="educational">Educational Group</option>
                            <option value="special">Special Needs Group</option>
                          </select>
                        </div>
                      </div>
                      <Textarea 
                        label="Special Requests or Questions" 
                        placeholder="Any special accommodations needed, ages of children, accessibility requirements, etc."
                        rows={4}
                        value={tourForm.message}
                        onChange={(e) => handleTourFormChange('message', e.target.value)}
                      />
                      <Button variant="primary" size="lg" className="w-full">
                        <Calendar className="w-5 h-5 mr-2" />
                        Request Tour Booking
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Tour Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-earth-800">Tour Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border-l-4 border-earth-600 pl-4">
                          <BodyText className="font-medium text-earth-700">Public Tours</BodyText>
                          <BodyText className="text-earth-600 text-sm">
                            Weekends • $10/adult, $5/child • 90 minutes • Walk-ins welcome
                          </BodyText>
                        </div>
                        <div className="border-l-4 border-sanctuary-600 pl-4">
                          <BodyText className="font-medium text-sanctuary-700">Private Tours</BodyText>
                          <BodyText className="text-sanctuary-600 text-sm">
                            Any day • $15/person • 2 hours • Advance booking required
                          </BodyText>
                        </div>
                        <div className="border-l-4 border-green-600 pl-4">
                          <BodyText className="font-medium text-green-700">Educational Groups</BodyText>
                          <BodyText className="text-green-600 text-sm">
                            Schools/Organizations • Special rates • Custom programs
                          </BodyText>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="p-6 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sanctuary-800">What to Expect</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <BodyText className="text-sanctuary-600 text-sm">Meet our rescued animals up close</BodyText>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <BodyText className="text-sanctuary-600 text-sm">Learn about animal care and rescue stories</BodyText>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <BodyText className="text-sanctuary-600 text-sm">Guided by knowledgeable staff</BodyText>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <BodyText className="text-sanctuary-600 text-sm">Photo opportunities with animals</BodyText>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <BodyText className="text-sanctuary-600 text-sm">Visit our gift shop</BodyText>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'volunteer' && (
              <Card className="p-8 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-green-800">Volunteer Application</CardTitle>
                  <BodyText className="text-green-600">
                    Join our volunteer family and make a direct impact on the lives of rescued animals. 
                    No experience necessary - we provide comprehensive training!
                  </BodyText>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input 
                        label="First Name" 
                        placeholder="Your first name"
                        value={volunteerForm.firstName}
                        onChange={(e) => handleVolunteerFormChange('firstName', e.target.value)}
                        required 
                      />
                      <Input 
                        label="Last Name" 
                        placeholder="Your last name"
                        value={volunteerForm.lastName}
                        onChange={(e) => handleVolunteerFormChange('lastName', e.target.value)}
                        required 
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <Input 
                        label="Email" 
                        type="email" 
                        placeholder="your@email.com"
                        value={volunteerForm.email}
                        onChange={(e) => handleVolunteerFormChange('email', e.target.value)}
                        required 
                      />
                      <Input 
                        label="Phone" 
                        type="tel" 
                        placeholder="(541) 555-0123"
                        value={volunteerForm.phone}
                        onChange={(e) => handleVolunteerFormChange('phone', e.target.value)}
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-3">
                        Areas of Interest (Select all that apply)
                      </label>
                      <div className="grid md:grid-cols-2 gap-2">
                        {volunteerInterests.map(interest => (
                          <label key={interest} className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                              checked={volunteerForm.interests.includes(interest)}
                              onChange={(e) => {
                                const newInterests = e.target.checked 
                                  ? [...volunteerForm.interests, interest]
                                  : volunteerForm.interests.filter(i => i !== interest)
                                handleVolunteerFormChange('interests', newInterests)
                              }}
                            />
                            <BodyText className="text-green-600 text-sm">{interest}</BodyText>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-green-700 mb-2">
                        Availability
                      </label>
                      <select 
                        className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={volunteerForm.availability}
                        onChange={(e) => handleVolunteerFormChange('availability', e.target.value)}
                        required
                      >
                        <option value="">Select your availability</option>
                        <option value="weekday-mornings">Weekday Mornings</option>
                        <option value="weekday-afternoons">Weekday Afternoons</option>
                        <option value="weekends">Weekends</option>
                        <option value="evenings">Evenings</option>
                        <option value="flexible">Flexible Schedule</option>
                      </select>
                    </div>
                    
                    <Textarea 
                      label="Previous Animal Experience" 
                      placeholder="Tell us about any experience you have with animals, farms, or volunteering..."
                      rows={3}
                      value={volunteerForm.experience}
                      onChange={(e) => handleVolunteerFormChange('experience', e.target.value)}
                    />
                    
                    <Textarea 
                      label="Why do you want to volunteer with us?" 
                      placeholder="Share what motivates you to volunteer at an animal sanctuary..."
                      rows={4}
                      value={volunteerForm.motivation}
                      onChange={(e) => handleVolunteerFormChange('motivation', e.target.value)}
                      required
                    />
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <BodyText className="text-green-700 text-sm">
                        <strong>Next Steps:</strong> After submitting your application, our Volunteer Coordinator will contact you 
                        within 5 business days to schedule an orientation session and background check.
                      </BodyText>
                    </div>
                    
                    <Button variant="primary" size="lg" className="w-full bg-green-600 hover:bg-green-700">
                      <Users className="w-5 h-5 mr-2" />
                      Submit Volunteer Application
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <H2 className="text-sanctuary-800 mb-6">Frequently Asked Questions</H2>
              <BodyLarge className="text-sanctuary-600">
                Find answers to common questions about visiting, volunteering, and supporting our sanctuary.
              </BodyLarge>
            </div>
            
            {faqData.map((category, categoryIndex) => (
              <div key={category.category} className="mb-8">
                <H2 className="text-lg text-sanctuary-800 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  {category.category}
                </H2>
                <div className="space-y-3">
                  {category.questions.map((faq, index) => {
                    const faqId = `${categoryIndex}-${index}`
                    return (
                      <Card key={faqId} className="overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(faqId)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-sanctuary-50 transition-colors"
                        >
                          <BodyText className="font-medium text-sanctuary-800">{faq.question}</BodyText>
                          {expandedFAQ === faqId ? (
                            <ChevronUp className="w-5 h-5 text-sanctuary-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-sanctuary-600" />
                          )}
                        </button>
                        {expandedFAQ === faqId && (
                          <div className="px-4 pb-4">
                            <BodyText className="text-sanctuary-600 leading-relaxed">{faq.answer}</BodyText>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Directions & Map */}
      <section className="py-16 bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <H2 className="text-sanctuary-800 mb-6">Find Us</H2>
              <BodyLarge className="text-sanctuary-600">
                Located in the heart of Central Oregon, we're easily accessible from Bend, Redmond, and surrounding areas.
              </BodyLarge>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="p-6 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sanctuary-800 flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    Directions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Car className="w-4 h-4 text-sanctuary-600" />
                        <BodyText className="font-medium text-sanctuary-700">From Bend (45 minutes):</BodyText>
                      </div>
                      <BodyText className="text-sanctuary-600 text-sm ml-6">
                        Take US-20 West toward Sisters. Turn left on Sanctuary Road (mile marker 15). 
                        Sanctuary entrance is 2 miles on the right.
                      </BodyText>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Car className="w-4 h-4 text-earth-600" />
                        <BodyText className="font-medium text-earth-700">From Portland (3 hours):</BodyText>
                      </div>
                      <BodyText className="text-earth-600 text-sm ml-6">
                        Take US-26 East through Mount Hood. Continue on US-20 East to Sisters. 
                        Turn right on Sanctuary Road.
                      </BodyText>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Bus className="w-4 h-4 text-green-600" />
                        <BodyText className="font-medium text-green-700">Public Transportation:</BodyText>
                      </div>
                      <BodyText className="text-green-600 text-sm ml-6">
                        Cascades East Transit provides service to Sisters. 
                        We offer pickup from the Sisters transit station by arrangement.
                      </BodyText>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-sanctuary-200">
                    <Button variant="outline" className="w-full flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Open in Google Maps
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Map Placeholder */}
              <Card className="p-6 bg-white/60 backdrop-blur-sm">
                <CardContent className="pt-0">
                  <div className="bg-gradient-to-br from-sanctuary-200 to-earth-200 rounded-lg h-80 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-60" />
                    <div className="relative z-10 text-center">
                      <MapPin className="w-16 h-16 text-sanctuary-700 mx-auto mb-4 drop-shadow-lg" />
                      <BodyText className="text-sanctuary-800 font-medium drop-shadow">
                        Interactive Map
                      </BodyText>
                      <BodyText className="text-sanctuary-600 text-sm drop-shadow">
                        123 Sanctuary Road, Sisters, OR
                      </BodyText>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-sanctuary-600 to-earth-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="text-white mb-6">Ready to Connect?</H2>
            <BodyLarge className="text-white/90 mb-8">
              Whether you want to visit, volunteer, or simply learn more about our mission, 
              we're here to welcome you into our sanctuary family.
            </BodyLarge>
            
            <div className="grid md:grid-cols-3 gap-6">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-sanctuary-800 hover:bg-white/90"
                onClick={() => setActiveTab('visit')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Visit
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-earth-800 hover:bg-white/90"
                onClick={() => setActiveTab('volunteer')}
              >
                <Users className="w-5 h-5 mr-2" />
                Volunteer Today
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-green-800 hover:bg-white/90"
                onClick={() => setActiveTab('contact')}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}