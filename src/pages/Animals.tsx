import { useState } from 'react'
import { Heart } from 'lucide-react'
import { H1, H2, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '../components/ui'

const animalCategories = ['All', 'Cows', 'Pigs', 'Goats', 'Sheep', 'Chickens', 'Horses']

const sampleAnimals = [
  {
    id: '1',
    name: 'Bessie',
    species: 'Cow',
    age: '5 years',
    story: 'Rescued from a dairy farm, Bessie is now living her best life in our pastures.',
    image: '🐄',
    isSponsored: false,
    personality: ['Gentle', 'Curious', 'Friendly']
  },
  {
    id: '2', 
    name: 'Wilbur',
    species: 'Pig',
    age: '3 years',
    story: 'This sweet boy was saved from becoming bacon and now loves mud baths and belly rubs.',
    image: '🐷',
    isSponsored: true,
    personality: ['Playful', 'Smart', 'Social']
  },
  {
    id: '3',
    name: 'Charlotte',
    species: 'Goat', 
    age: '2 years',
    story: 'Charlotte came to us as a baby and has grown into a confident, adventurous goat.',
    image: '🐐',
    isSponsored: false,
    personality: ['Adventurous', 'Climber', 'Independent']
  },
  {
    id: '4',
    name: 'Henrietta',
    species: 'Chicken',
    age: '4 years',
    story: 'A former battery hen who now enjoys dust baths and foraging freely.',
    image: '🐔',
    isSponsored: true,
    personality: ['Busy', 'Curious', 'Social']
  }
]

export function AnimalsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  
  console.log('🐾 AnimalsPage rendered:', { selectedCategory, searchTerm })
  
  const filteredAnimals = sampleAnimals.filter(animal => {
    const matchesCategory = selectedCategory === 'All' || animal.species === selectedCategory.slice(0, -1)
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.species.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <H1 variant="sanctuary" className="mb-6">Meet Our Rescued Animals</H1>
            <BodyLarge variant="sanctuary">
              Each animal at our sanctuary has a unique story of rescue, recovery, and hope. Get to know our residents and consider sponsoring their care.
            </BodyLarge>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search animals by name or species..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {animalCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Animals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map(animal => (
              <Card key={animal.id} variant="elevated" className="group hover:scale-105 transition-transform">
                <CardHeader>
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-4">{animal.image}</div>
                    <div className="flex items-center justify-between">
                      <CardTitle>{animal.name}</CardTitle>
                      {animal.isSponsored ? (
                        <Badge variant="sponsored" size="sm">
                          <Heart className="w-3 h-3 mr-1" />
                          Sponsored
                        </Badge>
                      ) : (
                        <Badge variant="success" size="sm">Available</Badge>
                      )}
                    </div>
                    <BodyText variant="muted">{animal.species} • {animal.age}</BodyText>
                  </div>
                </CardHeader>
                <CardContent>
                  <BodyText className="mb-4">{animal.story}</BodyText>
                  
                  <div className="mb-4">
                    <H2 className="text-sm font-semibold text-sanctuary-700 mb-2">Personality</H2>
                    <div className="flex flex-wrap gap-1">
                      {animal.personality.map(trait => (
                        <Badge key={trait} variant="default" size="sm">{trait}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" className="flex-1">
                      Learn More
                    </Button>
                    {!animal.isSponsored && (
                      <Button variant="donate" size="sm">
                        <Heart className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredAnimals.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <H2 variant="muted">No animals found</H2>
              <BodyText variant="muted">
                Try adjusting your search terms or selected category.
              </BodyText>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Card variant="outlined" padding="lg">
              <BodyLarge variant="sanctuary" className="mb-4">
                Want to help care for our animals?
              </BodyLarge>
              <BodyText className="mb-6">
                Animal sponsorship helps cover food, medical care, and shelter maintenance costs.
              </BodyText>
              <Button variant="donate" size="lg">
                <Heart className="w-5 h-5 mr-2" />
                Become a Sponsor
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}