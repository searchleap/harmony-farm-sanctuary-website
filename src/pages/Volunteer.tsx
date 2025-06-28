import { HandHeart, Users } from 'lucide-react'
import { H1, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent, Button } from '../components/ui'

export function VolunteerPage() {
  console.log('🤝 VolunteerPage rendered')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <H1 variant="sanctuary" className="mb-6">Volunteer With Us</H1>
            <BodyLarge variant="sanctuary">
              Join our community of dedicated volunteers and make a direct impact on the lives of rescued animals.
            </BodyLarge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <HandHeart className="w-6 h-6 text-sanctuary-600" />
                  Animal Care
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText>Help with daily feeding, grooming, and providing companionship to our rescued animals.</BodyText>
              </CardContent>
            </Card>
            
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-earth-600" />
                  Education & Tours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText>Lead sanctuary tours and help educate visitors about animal welfare and compassionate living.</BodyText>
              </CardContent>
            </Card>
          </div>
          
          <Card variant="elevated" className="text-center">
            <CardContent>
              <HandHeart className="w-16 h-16 text-sanctuary-600 mx-auto mb-6" />
              <BodyLarge className="mb-6">Ready to volunteer? We'd love to have you join our team!</BodyLarge>
              <Button variant="primary" size="lg">Apply to Volunteer</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}