import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Heart, 
  Star, 
  ArrowRight, 
  Search,
  Calendar,
  Users,
  TrendingUp,
  Grid3X3,
  List,
  SlidersHorizontal
} from 'lucide-react'
import { H1, H2, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent, Badge, Button, Input } from '../components/ui'
import { animals } from '../data/animals'

const animalCategories = ['All', 'Cows', 'Pigs', 'Goats', 'Sheep', 'Chickens', 'Horses']
const statusFilters = ['All', 'Available for Sponsorship', 'Sponsored', 'Featured Animals']
const careLevelFilters = ['All', 'Easy Care', 'Moderate Care', 'Intensive Care']

export function AnimalsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [careLevelFilter, setCareLevelFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  
  console.log('🐾 AnimalsPage rendered:', { 
    selectedCategory, 
    statusFilter, 
    careLevelFilter, 
    searchTerm, 
    viewMode,
    showFilters 
  })
  
  // Calculate sanctuary statistics
  const sanctuaryStats = useMemo(() => {
    const totalAnimals = animals.length
    const sponsoredAnimals = animals.filter(animal => animal.isSponsored).length
    const availableForSponsorship = animals.filter(animal => !animal.isSponsored && animal.sponsorCount < animal.maxSponsors).length
    const featuredAnimals = animals.filter(animal => animal.featuredAnimal).length
    const speciesCount = new Set(animals.map(animal => animal.species)).size
    
    const totalSponsors = animals.reduce((sum, animal) => sum + animal.sponsorCount, 0)
    const avgSponsorshipCost = Math.round(
      animals.reduce((sum, animal) => sum + animal.sponsorshipCost.monthly, 0) / animals.length
    )
    
    return {
      totalAnimals,
      sponsoredAnimals,
      availableForSponsorship,
      featuredAnimals,
      speciesCount,
      totalSponsors,
      avgSponsorshipCost
    }
  }, [])
  
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
  
  const filteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      // Category filter
      const categoryMatch = selectedCategory === 'All' || 
        (selectedCategory === 'Cows' && animal.species === 'cow') ||
        (selectedCategory === 'Pigs' && animal.species === 'pig') ||
        (selectedCategory === 'Goats' && animal.species === 'goat') ||
        (selectedCategory === 'Sheep' && animal.species === 'sheep') ||
        (selectedCategory === 'Chickens' && animal.species === 'chicken') ||
        (selectedCategory === 'Horses' && animal.species === 'horse')
      
      // Status filter
      const statusMatch = statusFilter === 'All' ||
        (statusFilter === 'Available for Sponsorship' && !animal.isSponsored && animal.sponsorCount < animal.maxSponsors) ||
        (statusFilter === 'Sponsored' && animal.isSponsored) ||
        (statusFilter === 'Featured Animals' && animal.featuredAnimal)
      
      // Care level filter
      const careLevelMatch = careLevelFilter === 'All' ||
        (careLevelFilter === 'Easy Care' && animal.careLevel === 'easy') ||
        (careLevelFilter === 'Moderate Care' && animal.careLevel === 'moderate') ||
        (careLevelFilter === 'Intensive Care' && animal.careLevel === 'intensive')
      
      // Search filter
      const searchMatch = searchTerm === '' ||
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (animal.breed && animal.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
        animal.personality.some(trait => trait.toLowerCase().includes(searchTerm.toLowerCase()))
      
      return categoryMatch && statusMatch && careLevelMatch && searchMatch
    })
  }, [selectedCategory, statusFilter, careLevelFilter, searchTerm])
  
  const getCategoryStats = (category: string) => {
    if (category === 'All') return animals.length
    const speciesName = category.toLowerCase().slice(0, -1) // Remove 's' from plural
    return animals.filter(animal => animal.species === speciesName).length
  }
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-sanctuary-600/90 to-earth-600/90 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')] bg-cover bg-center opacity-30" />
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Meet Our Rescued Animals</H1>
            <BodyLarge className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Each animal at our sanctuary has a unique story of rescue, recovery, and hope. 
              Get to know our residents and consider sponsoring their care.
            </BodyLarge>
          </div>
        </div>
      </section>

      {/* Sanctuary Statistics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <H2 className="text-sanctuary-800 mb-6">Our Animal Family</H2>
              <BodyLarge className="text-sanctuary-600">
                Current residents and impact statistics from our rescue operations.
              </BodyLarge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="text-center p-6 bg-gradient-to-br from-sanctuary-50 to-sanctuary-100 border-sanctuary-200">
                <CardContent className="pt-0">
                  <div className="w-16 h-16 bg-sanctuary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-sanctuary-800 mb-2">{sanctuaryStats.totalAnimals}</div>
                  <div className="text-sanctuary-600 font-medium mb-1">Total Animals</div>
                  <BodyText className="text-sanctuary-500 text-sm">
                    Across {sanctuaryStats.speciesCount} different species
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 bg-gradient-to-br from-earth-50 to-earth-100 border-earth-200">
                <CardContent className="pt-0">
                  <div className="w-16 h-16 bg-earth-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white fill-current" />
                  </div>
                  <div className="text-3xl font-bold text-earth-800 mb-2">{sanctuaryStats.sponsoredAnimals}</div>
                  <div className="text-earth-600 font-medium mb-1">Sponsored Animals</div>
                  <BodyText className="text-earth-500 text-sm">
                    Supported by {sanctuaryStats.totalSponsors} sponsors
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-0">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-green-800 mb-2">{sanctuaryStats.availableForSponsorship}</div>
                  <div className="text-green-600 font-medium mb-1">Available to Sponsor</div>
                  <BodyText className="text-green-500 text-sm">
                    Seeking loving sponsors
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="text-center p-6 bg-gradient-to-br from-sanctuary-50 to-green-100 border-sanctuary-200">
                <CardContent className="pt-0">
                  <div className="w-16 h-16 bg-sanctuary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-sanctuary-800 mb-2">${sanctuaryStats.avgSponsorshipCost}</div>
                  <div className="text-sanctuary-600 font-medium mb-1">Avg Monthly Cost</div>
                  <BodyText className="text-sanctuary-500 text-sm">
                    Per animal sponsorship
                  </BodyText>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-sanctuary-400" />
                <Input
                  type="text"
                  placeholder="Search animals by name, species, breed, or personality..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg"
                />
              </div>
            </div>
            
            {/* Filter Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters {showFilters ? '▼' : '▶'}
                </Button>
                
                <div className="flex flex-wrap gap-2">
                  {animalCategories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="flex items-center gap-1"
                    >
                      {category}
                      {category !== 'All' && (
                        <Badge variant="default" size="sm" className="ml-1 text-xs">
                          {getCategoryStats(category)}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-sanctuary-600">
                  {filteredAnimals.length} of {animals.length} animals
                </span>
                <div className="flex border border-sanctuary-200 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Advanced Filters */}
            {showFilters && (
              <Card className="p-6 mb-6 bg-white/60 backdrop-blur-sm">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <H2 className="text-lg text-sanctuary-800 mb-3">Sponsorship Status</H2>
                    <div className="flex flex-wrap gap-2">
                      {statusFilters.map(filter => (
                        <Button
                          key={filter}
                          variant={statusFilter === filter ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => setStatusFilter(filter)}
                        >
                          {filter}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <H2 className="text-lg text-earth-800 mb-3">Care Level</H2>
                    <div className="flex flex-wrap gap-2">
                      {careLevelFilters.map(filter => (
                        <Button
                          key={filter}
                          variant={careLevelFilter === filter ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => setCareLevelFilter(filter)}
                        >
                          {filter}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Animals Display Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Animals Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnimals.map(animal => (
                  <Card key={animal.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                      <div className="absolute bottom-3 left-3">
                        <Badge 
                          variant={animal.careLevel === 'easy' ? 'success' : animal.careLevel === 'moderate' ? 'warning' : 'info'} 
                          size="sm"
                        >
                          {animal.careLevel} care
                        </Badge>
                      </div>
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
            ) : (
              <div className="space-y-4">
                {filteredAnimals.map(animal => (
                  <Card key={animal.id} className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex gap-6">
                      <div className="relative w-32 h-32 flex-shrink-0">
                        <img
                          src={animal.featuredImage}
                          alt={animal.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {animal.featuredAnimal && (
                          <div className="absolute -top-2 -right-2">
                            <Badge variant="sponsored" size="sm">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <H2 className="text-xl text-sanctuary-800 flex items-center gap-2">
                              <span className="text-2xl">{getSpeciesEmoji(animal.species)}</span>
                              {animal.name}
                            </H2>
                            <BodyText variant="muted" className="capitalize">
                              {animal.breed ? `${animal.breed} ${animal.species}` : animal.species} • {calculateAge(animal)}
                            </BodyText>
                          </div>
                          <div className="flex gap-2">
                            {animal.isSponsored ? (
                              <Badge variant="sponsored" size="sm">
                                <Heart className="w-3 h-3 mr-1 fill-current" />
                                Sponsored
                              </Badge>
                            ) : (
                              <Badge variant="success" size="sm">Available</Badge>
                            )}
                            <Badge 
                              variant={animal.careLevel === 'easy' ? 'success' : animal.careLevel === 'moderate' ? 'warning' : 'info'} 
                              size="sm"
                            >
                              {animal.careLevel} care
                            </Badge>
                          </div>
                        </div>
                        
                        <BodyText className="mb-3">
                          {animal.story.length > 200 ? `${animal.story.substring(0, 200)}...` : animal.story}
                        </BodyText>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {animal.personality.slice(0, 4).map(trait => (
                              <Badge key={trait} variant="default" size="sm">{trait}</Badge>
                            ))}
                          </div>
                          
                          <Link to={`/animals/${animal.id}`}>
                            <Button variant="primary" size="sm" className="group">
                              {animal.isSponsored ? 'Learn More' : 'Sponsor Me'}
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {filteredAnimals.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <H2 className="text-sanctuary-800 mb-4">No animals found</H2>
                <BodyText className="text-sanctuary-600 mb-6">
                  Try adjusting your search terms, category, or filter settings.
                </BodyText>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                    setStatusFilter('All')
                    setCareLevelFilter('All')
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-br from-sanctuary-600 to-earth-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <H2 className="text-white mb-6">Ready to Make a Difference?</H2>
            <BodyLarge className="text-white/90 mb-8">
              Animal sponsorship helps cover food, medical care, and shelter maintenance costs. 
              Every sponsorship makes a direct impact on an animal's quality of life.
            </BodyLarge>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="pt-0">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">${sanctuaryStats.avgSponsorshipCost}/month</div>
                  <BodyText className="text-white/80 text-sm">Average sponsorship cost</BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="pt-0">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{sanctuaryStats.availableForSponsorship}</div>
                  <BodyText className="text-white/80 text-sm">Animals need sponsors</BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20 text-center">
                <CardContent className="pt-0">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">365</div>
                  <BodyText className="text-white/80 text-sm">Days of care per year</BodyText>
                </CardContent>
              </Card>
            </div>
            
            <Button variant="secondary" size="lg" className="bg-white text-sanctuary-800 hover:bg-white/90">
              <Heart className="w-5 h-5 mr-2" />
              Start Sponsoring Today
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}