// Core types for Harmony Farm Sanctuary website

export interface Animal {
  id: string
  name: string
  species: 'cow' | 'pig' | 'goat' | 'sheep' | 'chicken' | 'turkey' | 'horse' | 'other'
  breed?: string
  gender: 'male' | 'female' | 'unknown'
  age?: number
  weight?: string
  color?: string
  
  // Stories and Background
  story: string
  rescueStory: string
  personalityDescription: string
  favoriteTreats?: string[]
  quirks?: string[]
  
  // Images and Media
  images: string[]
  featuredImage: string
  
  // Dates and Status
  arrivalDate: string
  birthDate?: string
  status: 'healthy' | 'recovering' | 'special-needs' | 'hospice'
  
  // Medical Information
  medicalNeeds?: string[]
  medicalHistory?: string[]
  specialDiet?: string
  medications?: string[]
  vetNotes?: string
  
  // Personality and Behavior
  personality: string[]
  socialLevel: 'very-social' | 'social' | 'selective' | 'shy' | 'independent'
  energyLevel: 'low' | 'moderate' | 'high'
  goodWithKids: boolean
  goodWithOtherAnimals: boolean
  
  // Care Requirements
  careLevel: 'easy' | 'moderate' | 'intensive'
  specialNeeds?: string[]
  housingType: 'pasture' | 'barn' | 'special-enclosure' | 'medical-facility'
  companionAnimals?: string[] // IDs of other animals they live with
  
  // Sponsorship Information
  isSponsored: boolean
  sponsorshipLevel?: 'basic' | 'premium' | 'full'
  sponsorshipCost: {
    monthly: number
    annually: number
  }
  sponsorCount: number
  maxSponsors: number
  sponsorshipBenefits: string[]
  
  // Additional Info
  funFacts?: string[]
  favoritePlaces?: string[]
  dailyRoutine?: string
  lifestylePreferences?: string[]
  adoptionEligible: boolean
  featuredAnimal: boolean
}

export interface Volunteer {
  id: string
  name: string
  email: string
  phone: string
  availability: string[]
  interests: string[]
  experience: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

export interface Donation {
  id: string
  amount: number
  type: 'one-time' | 'monthly' | 'sponsorship'
  animalId?: string
  donorName?: string
  donorEmail?: string
  isAnonymous: boolean
  date: string
  paymentMethod: string
}

export interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  type: 'tour' | 'fundraiser' | 'volunteer' | 'educational'
  maxAttendees?: number
  currentAttendees: number
  isRecurring: boolean
  recurringSchedule?: string
  registrationRequired: boolean
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  publishDate: string
  category: 'rescue-story' | 'educational' | 'events' | 'volunteer-spotlight' | 'general'
  featuredImage?: string
  tags: string[]
  isPublished: boolean
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'visiting' | 'volunteering' | 'donations' | 'animals' | 'general'
  order: number
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: 'apparel' | 'accessories' | 'home' | 'books'
  variants?: ProductVariant[]
  printfulId?: string
}

export interface ProductVariant {
  id: string
  name: string
  price: number
  sku: string
  options: {
    size?: string
    color?: string
  }
}

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

export interface ContactInfo {
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  phone: string
  email: string
  coordinates: {
    lat: number
    lng: number
  }
  hours: {
    [key: string]: string
  }
}