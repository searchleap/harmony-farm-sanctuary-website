import { Animal } from '../types'

export const animals: Animal[] = [
  {
    id: 'bella-the-cow',
    name: 'Bella',
    species: 'cow',
    breed: 'Holstein',
    gender: 'female',
    age: 6,
    weight: '1,200 lbs',
    color: 'Black and white',
    
    story: 'Bella came to us from a dairy farm that was closing down. She had spent her entire life confined to a small stall, never experiencing the simple joy of grazing in open pastures. When she first arrived, she was hesitant to leave the barn - the outdoors seemed too vast and overwhelming. With patience and gentle encouragement, Bella discovered grass, sunshine, and the freedom to roam. Now she\'s our gentle giant who loves belly rubs and greeting visitors with her soft, curious eyes.',
    
    rescueStory: 'In March 2021, we received a call about 12 dairy cows needing immediate rescue from a bankrupt farm. The cows had been living in cramped conditions with minimal care. Bella was one of the most timid, showing signs of stress and depression. Our rescue team worked carefully to transport her safely to our sanctuary, where she began her journey to recovery and freedom.',
    
    personalityDescription: 'Bella is incredibly gentle and has a calm, nurturing presence. She\'s become the unofficial "mother figure" to newer arrivals, often standing protectively near scared animals to help them feel safe. Despite her size, she\'s remarkably careful around humans and seems to understand her own strength. She has a curious nature and loves investigating new things in her environment.',
    
    favoriteTreats: ['Apples', 'Carrots', 'Sweet hay', 'Molasses treats'],
    quirks: ['Always checks the fence line during her morning walk', 'Prefers to eat with her head facing east', 'Hums softly when content'],
    
    images: [
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582146932581-cf5e8b067a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    
    arrivalDate: '2021-03-15',
    birthDate: '2018-04-20',
    status: 'healthy',
    
    medicalNeeds: ['Regular hoof trimming', 'Annual vaccinations'],
    medicalHistory: ['Treated for malnutrition upon arrival', 'Successful treatment for mastitis (2021)'],
    specialDiet: 'High-quality hay and pasture grass, supplemented with minerals',
    vetNotes: 'Excellent health, fully recovered from arrival stress',
    
    personality: ['Gentle', 'Maternal', 'Curious', 'Calm', 'Protective'],
    socialLevel: 'social',
    energyLevel: 'moderate',
    goodWithKids: true,
    goodWithOtherAnimals: true,
    
    careLevel: 'easy',
    housingType: 'pasture',
    companionAnimals: ['daisy-the-cow', 'charlie-the-goat'],
    
    isSponsored: true,
    sponsorshipLevel: 'premium',
    sponsorshipCost: {
      monthly: 75,
      annually: 800
    },
    sponsorCount: 3,
    maxSponsors: 5,
    sponsorshipBenefits: [
      'Monthly photo updates',
      'Quarterly sponsor newsletter',
      'Annual meet-and-greet visit',
      'Sponsor certificate',
      'Tax-deductible donation receipt'
    ],
    
    funFacts: [
      'Bella can recognize over 30 different human voices',
      'She has a best friend relationship with Charlie the goat',
      'She prefers classical music over country music',
      'Her favorite season is spring when the new grass grows'
    ],
    favoritePlaces: ['The oak tree in the north pasture', 'The sunny spot by the pond', 'Near the visitor fence'],
    dailyRoutine: 'Morning pasture walk, midday rest under the oak tree, afternoon grazing, evening barn time',
    lifestylePreferences: ['Routine and predictability', 'Gentle human interaction', 'Peaceful environment'],
    adoptionEligible: false,
    featuredAnimal: true
  },
  
  {
    id: 'wilbur-the-pig',
    name: 'Wilbur',
    species: 'pig',
    breed: 'Yorkshire',
    gender: 'male',
    age: 4,
    weight: '450 lbs',
    color: 'Pink with black spots',
    
    story: 'Wilbur arrived at our sanctuary as a "teacup pig" that grew much larger than his family expected. Like many pet pigs, he was surrendered when his owners realized that "teacup" pigs don\'t actually stay small. Initially shy and confused, Wilbur has blossomed into our most charismatic resident. He\'s incredibly intelligent, knows his name, responds to commands, and has even learned to paint with a brush held in his mouth for enrichment activities.',
    
    rescueStory: 'Wilbur came to us in 2020 when his family could no longer care for him. He had been living in a small backyard in suburban Portland, where zoning laws prohibited farm animals. His family loved him dearly but realized he needed more space and appropriate companions. The transition was emotional for everyone, but Wilbur quickly adapted to sanctuary life.',
    
    personalityDescription: 'Wilbur is the comedian of our sanctuary. He\'s incredibly social, loves attention, and has a mischievous streak that keeps everyone entertained. He\'s also remarkably intelligent and problem-solving oriented - he\'s figured out how to open gates, turn on water spigots, and even paint abstract art. Despite his playful nature, he\'s very gentle and seems to understand when someone needs comfort.',
    
    favoriteTreats: ['Watermelon', 'Pumpkins', 'Sweet potatoes', 'Apples', 'Belly rubs'],
    quirks: ['Paints with a brush', 'Opens gates with his snout', 'Talks back when spoken to', 'Loves mud baths on hot days'],
    
    images: [
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Using cow image as placeholder
      'https://images.unsplash.com/photo-1582146932581-cf5e8b067a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    
    arrivalDate: '2020-08-10',
    birthDate: '2020-02-14',
    status: 'healthy',
    
    medicalNeeds: ['Hoof trimming every 6 weeks', 'Regular weight monitoring'],
    medicalHistory: ['Neutered upon arrival', 'Treated for minor skin condition (2022)'],
    specialDiet: 'Controlled portions to maintain healthy weight, fresh vegetables daily',
    vetNotes: 'Excellent health, intelligence makes medical care easier',
    
    personality: ['Intelligent', 'Playful', 'Social', 'Mischievous', 'Gentle'],
    socialLevel: 'very-social',
    energyLevel: 'high',
    goodWithKids: true,
    goodWithOtherAnimals: true,
    
    careLevel: 'moderate',
    housingType: 'special-enclosure',
    companionAnimals: ['petunia-the-pig', 'babe-the-pig'],
    
    isSponsored: false,
    sponsorshipCost: {
      monthly: 50,
      annually: 550
    },
    sponsorCount: 0,
    maxSponsors: 3,
    sponsorshipBenefits: [
      'Monthly video updates',
      'Wilbur\'s artwork (when available)',
      'Priority tour booking',
      'Sponsor certificate',
      'Tax-deductible donation receipt'
    ],
    
    funFacts: [
      'Wilbur has created over 20 abstract paintings',
      'He can identify different people by their footsteps',
      'He knows how to sit, stay, and shake hands',
      'His favorite color appears to be blue (based on his painting choices)'
    ],
    favoritePlaces: ['His mud wallow', 'The art station', 'Under the apple tree'],
    dailyRoutine: 'Morning food and greeting time, midday activities and enrichment, afternoon nap, evening social time',
    lifestylePreferences: ['Interactive activities', 'Problem-solving games', 'Social interaction'],
    adoptionEligible: false,
    featuredAnimal: true
  },
  
  {
    id: 'luna-the-goat',
    name: 'Luna',
    species: 'goat',
    breed: 'Nigerian Dwarf',
    gender: 'female',
    age: 3,
    weight: '60 lbs',
    color: 'Brown and white',
    
    story: 'Luna came to us as a scared, malnourished kid who had been found wandering alone on a rural road. She was so shy that she would hide behind anything available and refused to eat for the first few days. Through patient care and gentle socialization, Luna has transformed into our official greeter. She now runs to the fence whenever visitors arrive, eager to say hello and show off her climbing skills on the playground we built for our goats.',
    
    rescueStory: 'A Good Samaritan found Luna wandering alone on a back road in Eastern Oregon in late 2021. She was severely underweight and showed signs of being separated from her mother too early. Local animal control brought her to us because they knew we had experience with young goats. She was estimated to be only 8 weeks old and required round-the-clock bottle feeding.',
    
    personalityDescription: 'Luna is pure sunshine in goat form. She\'s incredibly affectionate, loves human attention, and has an adventurous spirit. She\'s also quite the acrobat - our goat playground is her favorite place to show off her jumping and climbing abilities. Despite her small size, she\'s fearless and often leads the other goats on adventures around the property.',
    
    favoriteTreats: ['Blackberry leaves', 'Apple slices', 'Grain treats', 'Fresh browse'],
    quirks: ['Jumps on everything', 'Follows visitors around like a dog', 'Talks constantly', 'Steals hats and gloves'],
    
    images: [
      'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1594736797933-d0f7a2b1bf6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1551969014-7d2c4cddf0b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    
    arrivalDate: '2021-11-22',
    birthDate: '2021-09-15',
    status: 'healthy',
    
    medicalNeeds: ['Hoof trimming every 8 weeks', 'Annual vaccinations', 'Deworming schedule'],
    medicalHistory: ['Treated for malnutrition as a kid', 'Successfully integrated with herd'],
    specialDiet: 'High-quality hay, fresh browse, limited grain',
    vetNotes: 'Excellent health, fully recovered from early malnutrition',
    
    personality: ['Adventurous', 'Affectionate', 'Energetic', 'Social', 'Playful'],
    socialLevel: 'very-social',
    energyLevel: 'high',
    goodWithKids: true,
    goodWithOtherAnimals: true,
    
    careLevel: 'easy',
    housingType: 'pasture',
    companionAnimals: ['star-the-goat', 'pepper-the-goat'],
    
    isSponsored: false,
    sponsorshipCost: {
      monthly: 35,
      annually: 380
    },
    sponsorCount: 0,
    maxSponsors: 2,
    sponsorshipBenefits: [
      'Monthly photo updates',
      'Luna\'s monthly newsletter',
      'Priority tour booking',
      'Sponsor certificate',
      'Tax-deductible donation receipt'
    ],
    
    funFacts: [
      'Luna can jump 4 feet high from a standing position',
      'She has learned to open simple latches',
      'She recognizes her name and comes when called',
      'She has a special friendship with Wilbur the pig'
    ],
    favoritePlaces: ['The goat playground', 'The highest rock in the pasture', 'The visitor viewing area'],
    dailyRoutine: 'Early morning browse, midday playground time, afternoon grazing, evening barn socializing',
    lifestylePreferences: ['Climbing and jumping', 'Human interaction', 'Exploring new areas'],
    adoptionEligible: false,
    featuredAnimal: true
  }
]

// Helper functions for working with animal data
export const getAnimalById = (id: string): Animal | undefined => {
  return animals.find(animal => animal.id === id)
}

export const getFeaturedAnimals = (): Animal[] => {
  return animals.filter(animal => animal.featuredAnimal)
}

export const getAnimalsBySpecies = (species: string): Animal[] => {
  return animals.filter(animal => animal.species === species)
}

export const getSponsorableAnimals = (): Animal[] => {
  return animals.filter(animal => animal.sponsorCount < animal.maxSponsors)
}

export const getAnimalsByStatus = (status: string): Animal[] => {
  return animals.filter(animal => animal.status === status)
}