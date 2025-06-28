import { Heart, DollarSign, Calendar, Star } from 'lucide-react'
import { H1, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/ui'

const donationAmounts = [25, 50, 100, 250, 500]

export function DonatePage() {
  console.log('❤️ DonatePage rendered')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <H1 variant="sanctuary" className="mb-6">Support Our Mission</H1>
            <BodyLarge variant="sanctuary">
              Your generous donation helps us provide food, medical care, and love to our rescued animals.
            </BodyLarge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-red-500" />
                  One-Time Donation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText className="mb-6">Make a single donation to support immediate needs at the sanctuary.</BodyText>
                <div className="grid grid-cols-3 gap-2 mb-6">
                  {donationAmounts.map(amount => (
                    <Button key={amount} variant="outline" size="sm">
                      ${amount}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm">Other</Button>
                </div>
                <Button variant="donate" size="lg" className="w-full">
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Now
                </Button>
              </CardContent>
            </Card>
            
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-sanctuary-600" />
                  Monthly Giving
                </CardTitle>
                <Badge variant="sponsored" className="ml-auto">Most Popular</Badge>
              </CardHeader>
              <CardContent>
                <BodyText className="mb-6">Join our monthly giving program for sustained support that helps us plan ahead.</BodyText>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between p-3 bg-sanctuary-50 rounded">
                    <span>$25/month</span>
                    <span className="text-sanctuary-600">Feeds one animal for a day</span>
                  </div>
                  <div className="flex justify-between p-3 bg-sanctuary-50 rounded">
                    <span>$50/month</span>
                    <span className="text-sanctuary-600">Covers basic medical care</span>
                  </div>
                  <div className="flex justify-between p-3 bg-sanctuary-50 rounded">
                    <span>$100/month</span>
                    <span className="text-sanctuary-600">Sponsors shelter maintenance</span>
                  </div>
                </div>
                <Button variant="primary" size="lg" className="w-full">
                  <Calendar className="w-5 h-5 mr-2" />
                  Become a Monthly Donor
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Star className="w-6 h-6 text-yellow-500" />
                Animal Sponsorship
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BodyText className="mb-6">
                Sponsor a specific animal and receive updates about their care and well-being. It's a special way to make a personal connection with one of our residents.
              </BodyText>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="secondary" size="lg" className="flex-1">
                  <Heart className="w-5 h-5 mr-2" />
                  View Animals Available for Sponsorship
                </Button>
                <Button variant="outline" size="lg">
                  Learn More About Sponsorship
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card variant="outlined" className="mt-8 text-center">
            <CardContent>
              <DollarSign className="w-16 h-16 text-sanctuary-600 mx-auto mb-4" />
              <BodyLarge className="mb-2">Tax Deductible</BodyLarge>
              <BodyText variant="muted">
                Harmony Farm Sanctuary is a 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law.
              </BodyText>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}