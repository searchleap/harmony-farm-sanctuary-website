import { BookOpen, Leaf, Heart, Users } from 'lucide-react'
import { H1, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent } from '../components/ui'

export function LearnPage() {
  console.log('📚 LearnPage rendered')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <H1 variant="sanctuary" className="mb-6">Learn & Resources</H1>
            <BodyLarge variant="sanctuary">
              Discover educational resources about animal welfare, sustainable living, and compassionate choices.
            </BodyLarge>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Heart className="w-6 h-6 text-sanctuary-600" />
                  Animal Welfare
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText>Learn about farm animal intelligence, emotions, and the importance of providing safe havens for rescued animals.</BodyText>
              </CardContent>
            </Card>
            
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Leaf className="w-6 h-6 text-earth-600" />
                  Sustainable Living
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText>Discover how compassionate choices can benefit animals, the environment, and your health.</BodyText>
              </CardContent>
            </Card>
            
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-sanctuary-600" />
                  For Educators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText>Educational materials and programs designed for schools and youth groups.</BodyText>
              </CardContent>
            </Card>
            
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-earth-600" />
                  Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BodyText>Books, articles, and research about animal sanctuary management and ethical treatment.</BodyText>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}