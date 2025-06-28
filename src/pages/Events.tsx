import { Calendar, Users, Clock } from 'lucide-react'
import { H1, BodyLarge, BodyText, Card, CardTitle, CardContent, Badge, Button } from '../components/ui'

const upcomingEvents = [
  {
    id: '1',
    title: 'Monthly Sanctuary Tour',
    date: 'February 10, 2025',
    time: '10:00 AM - 2:00 PM',
    type: 'Tour',
    description: 'Join us for a guided tour of the sanctuary and meet our rescued animals.',
    capacity: '20 people',
    status: 'open'
  },
  {
    id: '2',
    title: 'Spring Fundraising Gala',
    date: 'March 15, 2025',
    time: '6:00 PM - 10:00 PM',
    type: 'Fundraiser',
    description: 'An elegant evening to support our mission with dinner, auction, and entertainment.',
    capacity: '100 people',
    status: 'early-bird'
  }
]

export function EventsPage() {
  console.log('📅 EventsPage rendered')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <H1 variant="sanctuary" className="mb-6">Events & Tours</H1>
            <BodyLarge variant="sanctuary">
              Connect with our community through tours, fundraisers, and educational events.
            </BodyLarge>
          </div>
          
          <div className="space-y-6">
            {upcomingEvents.map(event => (
              <Card key={event.id} variant="elevated">
                <CardContent>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <CardTitle>{event.title}</CardTitle>
                        <Badge variant={event.type === 'Tour' ? 'info' : 'success'}>
                          {event.type}
                        </Badge>
                        {event.status === 'early-bird' && (
                          <Badge variant="warning">Early Bird</Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-sanctuary-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {event.capacity}
                        </div>
                      </div>
                      
                      <BodyText>{event.description}</BodyText>
                    </div>
                    
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <Button variant="primary">Register</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card variant="outlined" className="mt-12 text-center">
            <CardContent>
              <Calendar className="w-16 h-16 text-sanctuary-600 mx-auto mb-6" />
              <BodyLarge className="mb-4">Want to stay updated on upcoming events?</BodyLarge>
              <Button variant="secondary" size="lg">Subscribe to Newsletter</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}