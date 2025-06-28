import { Heart, Users, Award, MapPin } from 'lucide-react'
import { H1, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent, Badge } from '../components/ui'

export function AboutPage() {
  console.log('ℹ️ AboutPage rendered')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <H1 variant="sanctuary" className="mb-6">About Harmony Farm Sanctuary</H1>
            <BodyLarge variant="sanctuary">
              Dedicated to providing a safe haven for rescued farm animals while educating the community about compassionate living.
            </BodyLarge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-8 h-8 text-sanctuary-600" />
                  <CardTitle>Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <BodyText>
                  To rescue, rehabilitate, and provide lifelong care for farm animals while promoting education about animal welfare and sustainable living practices.
                </BodyText>
              </CardContent>
            </Card>
            
            <Card variant="elevated">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-8 h-8 text-earth-600" />
                  <CardTitle>Our Location</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <BodyText>
                  Located in the beautiful Central Oregon region near Sisters and Bend, our sanctuary provides a peaceful environment for our rescued animals.
                </BodyText>
              </CardContent>
            </Card>
          </div>
          
          <Card variant="elevated" className="mb-12">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-8 h-8 text-sanctuary-600" />
                <CardTitle>Our Story</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <BodyText className="mb-4">
                Harmony Farm Sanctuary was founded with a simple belief: every animal deserves a life free from suffering. What started as a small rescue operation has grown into a comprehensive sanctuary that provides not only refuge for animals but also education for our community.
              </BodyText>
              <BodyText className="mb-4">
                Our team of dedicated caregivers works around the clock to ensure each animal receives the medical care, nutrition, and love they need to thrive. From cows and pigs to goats and chickens, every resident has their own story of rescue and recovery.
              </BodyText>
              <BodyText>
                We believe in the power of education to create lasting change. Through our tours, educational programs, and community outreach, we hope to inspire others to make compassionate choices that benefit animals, the environment, and our health.
              </BodyText>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-sanctuary-600" />
                <CardTitle>Accreditation & Recognition</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                <Badge variant="success" size="lg">GFAS Accredited</Badge>
                <Badge variant="info" size="lg">501(c)(3) Nonprofit</Badge>
                <Badge variant="sponsored" size="lg">GuideStar Seal</Badge>
              </div>
              <BodyText>
                We are proud to be accredited by the Global Federation of Animal Sanctuaries (GFAS), ensuring we meet the highest standards of animal care and sanctuary management.
              </BodyText>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}