import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { H1, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea } from '../components/ui'

export function ContactPage() {
  console.log('📞 ContactPage rendered')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <H1 variant="sanctuary" className="mb-6">Contact & Visit</H1>
            <BodyLarge variant="sanctuary">
              Get in touch with us or plan your visit to the sanctuary.
            </BodyLarge>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-sanctuary-600" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyText>
                    Harmony Farm Sanctuary<br />
                    Sisters, Oregon<br />
                    Central Oregon Region
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-earth-600" />
                    Visiting Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyText>
                    Tours: Weekends 10 AM - 4 PM<br />
                    Private Tours: By Appointment<br />
                    Office Hours: Mon-Fri 9 AM - 5 PM
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Phone className="w-6 h-6 text-sanctuary-600" />
                    Contact Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <BodyText>(555) 123-FARM</BodyText>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <BodyText>info@harmonyfarmsanctuary.org</BodyText>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input label="First Name" placeholder="Your first name" />
                    <Input label="Last Name" placeholder="Your last name" />
                  </div>
                  <Input label="Email" type="email" placeholder="your@email.com" />
                  <Input label="Phone" type="tel" placeholder="(555) 123-4567" />
                  <Textarea 
                    label="Message" 
                    placeholder="Tell us how we can help..."
                    rows={5}
                  />
                  <Button variant="primary" size="lg" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Map Placeholder */}
          <Card variant="elevated" className="mt-8">
            <CardContent>
              <div className="bg-sanctuary-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-sanctuary-600 mx-auto mb-4" />
                  <BodyText variant="muted">Interactive map coming soon</BodyText>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}