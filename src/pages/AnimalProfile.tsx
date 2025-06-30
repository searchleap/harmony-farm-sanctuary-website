import { useParams, Link, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { 
  Heart, 
  ArrowLeft, 
  MapPin, 
  Shield, 
  Stethoscope,
  Star,
  Clock,
  Award,
  Camera,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { H1, H2, BodyLarge, BodyText, Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../components/ui'
import { getAnimalById } from '../data/animals'

export function AnimalProfilePage() {
  const { id } = useParams<{ id: string }>()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  console.log('🐾 AnimalProfilePage rendered:', { id })
  
  if (!id) {
    return <Navigate to="/animals" replace />
  }
  
  const animal = getAnimalById(id)
  
  if (!animal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50 flex items-center justify-center">
        <div className="text-center">
          <H1 className="text-sanctuary-800 mb-4">Animal Not Found</H1>
          <BodyText className="text-sanctuary-600 mb-6">
            We couldn't find the animal you're looking for.
          </BodyText>
          <Link to="/animals">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Animals
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % animal.images.length)
  }
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + animal.images.length) % animal.images.length)
  }
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const calculateAge = () => {
    if (!animal.birthDate) return animal.age ? `${animal.age} years old` : 'Age unknown'
    
    const birth = new Date(animal.birthDate)
    const now = new Date()
    const ageInYears = Math.floor((now.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    const ageInMonths = Math.floor((now.getTime() - birth.getTime()) / (30.44 * 24 * 60 * 60 * 1000))
    
    if (ageInYears >= 1) {
      return `${ageInYears} year${ageInYears > 1 ? 's' : ''} old`
    } else {
      return `${ageInMonths} month${ageInMonths > 1 ? 's' : ''} old`
    }
  }
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'healthy': return 'success'
      case 'recovering': return 'warning'
      case 'special-needs': return 'info'
      case 'hospice': return 'default'
      default: return 'default'
    }
  }
  
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
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sanctuary-50 to-earth-50">
      {/* Breadcrumb Navigation */}
      <section className="bg-white border-b border-sanctuary-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-sanctuary-600">
            <Link to="/" className="hover:text-sanctuary-800 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/animals" className="hover:text-sanctuary-800 transition-colors">Meet the Animals</Link>
            <span>/</span>
            <span className="text-sanctuary-800">{animal.name}</span>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={animal.images[currentImageIndex]}
                    alt={`${animal.name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover rounded-2xl shadow-lg"
                  />
                  
                  {animal.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <ChevronLeft className="w-6 h-6 text-sanctuary-800" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <ChevronRight className="w-6 h-6 text-sanctuary-800" />
                      </button>
                    </>
                  )}
                  
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {animal.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentImageIndex 
                            ? 'bg-white' 
                            : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Thumbnail Strip */}
                {animal.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {animal.images.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-sanctuary-600' 
                            : 'border-transparent hover:border-sanctuary-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${animal.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Animal Info */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{getSpeciesEmoji(animal.species)}</span>
                    <div>
                      <H1 className="text-sanctuary-800">{animal.name}</H1>
                      {animal.breed && (
                        <BodyText className="text-sanctuary-600 capitalize">
                          {animal.breed} {animal.species}
                        </BodyText>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant={getStatusBadgeVariant(animal.status)} size="lg">
                      {animal.status.replace('-', ' ')}
                    </Badge>
                    {animal.featuredAnimal && (
                      <Badge variant="sponsored" size="lg">
                        <Star className="w-4 h-4 mr-1" />
                        Featured Animal
                      </Badge>
                    )}
                    {animal.isSponsored && (
                      <Badge variant="success" size="lg">
                        <Heart className="w-4 h-4 mr-1 fill-current" />
                        Sponsored
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Quick Facts */}
                <Card className="p-6 bg-white/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-sanctuary-800 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Quick Facts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-sanctuary-600 font-medium">Age</div>
                        <div className="text-sanctuary-800">{calculateAge()}</div>
                      </div>
                      <div>
                        <div className="text-sanctuary-600 font-medium">Gender</div>
                        <div className="text-sanctuary-800 capitalize">{animal.gender}</div>
                      </div>
                      {animal.weight && (
                        <div>
                          <div className="text-sanctuary-600 font-medium">Weight</div>
                          <div className="text-sanctuary-800">{animal.weight}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-sanctuary-600 font-medium">Arrived</div>
                        <div className="text-sanctuary-800">{formatDate(animal.arrivalDate)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Sponsorship CTA */}
                {!animal.isSponsored && animal.sponsorCount < animal.maxSponsors && (
                  <Card className="p-6 bg-gradient-to-br from-sanctuary-600 to-earth-600 text-white">
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-3 mb-4">
                        <Heart className="w-6 h-6 fill-current" />
                        <H2 className="text-xl text-white">Sponsor {animal.name}</H2>
                      </div>
                      <BodyText className="text-white/90 mb-4">
                        Provide monthly support for {animal.name}'s care, food, and medical needs.
                      </BodyText>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold text-white">
                            ${animal.sponsorshipCost.monthly}/month
                          </div>
                          <div className="text-white/80 text-sm">
                            or ${animal.sponsorshipCost.annually}/year
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white/80 text-sm">Sponsors</div>
                          <div className="text-white font-medium">
                            {animal.sponsorCount} of {animal.maxSponsors}
                          </div>
                        </div>
                      </div>
                      <Button variant="secondary" size="lg" className="w-full bg-white text-sanctuary-800 hover:bg-white/90">
                        <Heart className="w-5 h-5 mr-2" />
                        Sponsor {animal.name}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <H2 className="text-sanctuary-800 mb-8 text-center">{animal.name}'s Story</H2>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-sanctuary-800 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Rescue Story
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyText className="text-sanctuary-600 leading-relaxed">
                    {animal.rescueStory}
                  </BodyText>
                </CardContent>
              </Card>
              
              <Card className="p-6 bg-white/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-earth-800 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Life at the Sanctuary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyText className="text-earth-600 leading-relaxed">
                    {animal.story}
                  </BodyText>
                </CardContent>
              </Card>
            </div>
            
            <Card className="p-8 bg-white/60 backdrop-blur-sm">
              <CardContent className="pt-0">
                <H2 className="text-2xl text-sanctuary-800 mb-6">Personality & Traits</H2>
                <BodyText className="text-sanctuary-600 leading-relaxed mb-6">
                  {animal.personalityDescription}
                </BodyText>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <H2 className="text-lg text-sanctuary-800 mb-3">Personality Traits</H2>
                    <div className="flex flex-wrap gap-2">
                      {animal.personality.map((trait, index) => (
                        <Badge key={index} variant="info" size="sm">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <H2 className="text-lg text-earth-800 mb-3">Favorite Treats</H2>
                    <div className="space-y-1">
                      {animal.favoriteTreats?.map((treat, index) => (
                        <div key={index} className="flex items-center gap-2 text-earth-600">
                          <Star className="w-4 h-4" />
                          <span>{treat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Fun Facts & Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <H2 className="text-sanctuary-800 mb-12 text-center">More About {animal.name}</H2>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Fun Facts */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-sanctuary-800 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Fun Facts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {animal.funFacts?.map((fact, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-sanctuary-600 rounded-full mt-2 flex-shrink-0" />
                        <BodyText className="text-sanctuary-600 text-sm">
                          {fact}
                        </BodyText>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Quirks */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-earth-800 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Quirks & Habits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {animal.quirks?.map((quirk, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-earth-600 rounded-full mt-2 flex-shrink-0" />
                        <BodyText className="text-earth-600 text-sm">
                          {quirk}
                        </BodyText>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Daily Life */}
              <Card className="p-6">
                <CardHeader>
                  <CardTitle className="text-green-800 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Daily Routine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BodyText className="text-green-600 text-sm leading-relaxed">
                    {animal.dailyRoutine}
                  </BodyText>
                  
                  {animal.favoritePlaces && animal.favoritePlaces.length > 0 && (
                    <div className="mt-4">
                      <div className="text-green-800 font-medium mb-2 text-sm">Favorite Places:</div>
                      <div className="space-y-1">
                        {animal.favoritePlaces.map((place, index) => (
                          <div key={index} className="flex items-center gap-2 text-green-600 text-sm">
                            <MapPin className="w-3 h-3" />
                            <span>{place}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Medical & Care Info */}
      {(animal.medicalNeeds?.length || animal.specialDiet || animal.medicalHistory?.length) && (
        <section className="py-16 bg-gradient-to-br from-sanctuary-50 to-earth-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <H2 className="text-sanctuary-800 mb-8 text-center">Care & Medical Information</H2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {animal.medicalNeeds && animal.medicalNeeds.length > 0 && (
                  <Card className="p-6 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sanctuary-800 flex items-center gap-2">
                        <Stethoscope className="w-5 h-5" />
                        Medical Needs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {animal.medicalNeeds.map((need, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-sanctuary-600 rounded-full" />
                            <BodyText className="text-sanctuary-600 text-sm">{need}</BodyText>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {animal.specialDiet && (
                  <Card className="p-6 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-earth-800 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Diet & Nutrition
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BodyText className="text-earth-600 text-sm leading-relaxed">
                        {animal.specialDiet}
                      </BodyText>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Sponsorship Benefits */}
      {animal.sponsorshipBenefits.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <H2 className="text-sanctuary-800 mb-8">Sponsorship Benefits</H2>
              <BodyLarge className="text-sanctuary-600 mb-8">
                When you sponsor {animal.name}, you'll receive these special benefits:
              </BodyLarge>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {animal.sponsorshipBenefits.map((benefit, index) => (
                  <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardContent className="pt-0">
                      <div className="w-12 h-12 bg-sanctuary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <BodyText className="text-sanctuary-600">{benefit}</BodyText>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Button variant="donate" size="lg" className="mx-auto">
                <Heart className="w-5 h-5 mr-2 fill-current" />
                Sponsor {animal.name} Today
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Back to Animals */}
      <section className="py-12 bg-gradient-to-br from-sanctuary-50 to-earth-50">
        <div className="container mx-auto px-4 text-center">
          <Link to="/animals">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to All Animals
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}