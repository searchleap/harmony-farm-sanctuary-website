import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Star, ArrowRight } from 'lucide-react'
import { H1, H2, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '../components/ui'
import { animals } from '../data/animals'

const animalCategories = ['All', 'Cows', 'Pigs', 'Goats', 'Sheep', 'Chickens', 'Horses']

export function AnimalsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  
  console.log('🐾 AnimalsPage rendered:', { selectedCategory, searchTerm })
  
  const getSpeciesEmoji = (species: string) => {
    switch (species) {
      case 'cow': return '🐄'
      case 'pig': return '🐷'
      case 'goat': return '🐐'
      case 'sheep': return '🐑'
      case 'chicken': return '🐓'
      case 'turkey': return '🦃'
      case 'horse': return '🐴'
      default: return '🐾'
    }
  }
  
  const calculateAge = (animal: any) => {
    if (animal.birthDate) {
      const birth = new Date(animal.birthDate)
      const now = new Date()
      const ageInYears = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
      return ageInYears >= 1 ? `${ageInYears} year${ageInYears > 1 ? 's' : ''} old` : 'Under 1 year'
    }
    return animal.age ? `${animal.age} years old` : 'Age unknown'
  }
  
  const filteredAnimals = animals.filter(animal => {
    const categoryMatch = selectedCategory === 'All' || 
      (selectedCategory === 'Cows' && animal.species === 'cow') ||
      (selectedCategory === 'Pigs' && animal.species === 'pig') ||
      (selectedCategory === 'Goats' && animal.species === 'goat') ||
      (selectedCategory === 'Sheep' && animal.species === 'sheep') ||
      (selectedCategory === 'Chickens' && animal.species === 'chicken') ||
      (selectedCategory === 'Horses' && animal.species === 'horse')
    
    const searchMatch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (animal.breed && animal.breed.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return categoryMatch && searchMatch
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
                <div className="relative">
                  <img
                    src={animal.featuredImage}
                    alt={animal.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {animal.featuredAnimal && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="sponsored" size="sm">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                </div>
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">{getSpeciesEmoji(animal.species)}</span>
                        {animal.name}
                      </CardTitle>
                      <BodyText variant="muted" className="capitalize">
                        {animal.breed ? `${animal.breed} ${animal.species}` : animal.species} • {calculateAge(animal)}
                      </BodyText>
                    </div>
                    {animal.isSponsored ? (
                      <Badge variant="sponsored" size="sm">
                        <Heart className="w-3 h-3 mr-1 fill-current" />
                        Sponsored
                      </Badge>
                    ) : (
                      <Badge variant="success" size="sm">Available</Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <BodyText className="mb-4">
                    {animal.story.length > 120 ? `${animal.story.substring(0, 120)}...` : animal.story}
                  </BodyText>
                  
                  <div className="mb-4">
                    <H2 className="text-sm font-semibold text-sanctuary-700 mb-2">Personality</H2>
                    <div className="flex flex-wrap gap-1">
                      {animal.personality.slice(0, 3).map(trait => (
                        <Badge key={trait} variant="default" size="sm">{trait}</Badge>
                      ))}
                      {animal.personality.length > 3 && (
                        <Badge variant="default" size="sm">+{animal.personality.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                  
                  {!animal.isSponsored && animal.sponsorCount < animal.maxSponsors && (
                    <div className="mb-4 p-3 bg-sanctuary-50 rounded-lg">
                      <div className="text-sm text-sanctuary-700 font-medium">
                        Sponsorship: ${animal.sponsorshipCost.monthly}/month
                      </div>
                      <div className="text-xs text-sanctuary-600">
                        {animal.sponsorCount} of {animal.maxSponsors} sponsors
                      </div>
                    </div>
                  )}
                  
                  <Link to={`/animals/${animal.id}`}>
                    <Button variant="primary" size="sm" className="w-full group">
                      {animal.isSponsored ? 'Learn More' : 'Sponsor Me'}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
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