// Core types for Harmony Farm Sanctuary website

export interface Animal {
  id: string
  name: string
  species: 'cow' | 'pig' | 'goat' | 'sheep' | 'chicken' | 'turkey' | 'horse' | 'other'
  story: string
  images: string[]
  arrivalDate: string
  isSponsored: boolean
  sponsorshipLevel?: 'basic' | 'premium' | 'full'
  age?: number
  personality?: string[]
  medicalNeeds?: string[]
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