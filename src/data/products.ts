// Sample Product Database for Harmony Farm Sanctuary Store
// Task 13: Phase 1 - Sample Data

import { Product, ProductCategory } from '../types/store'

export const productCategories = [
  {
    id: 'apparel',
    name: 'Apparel',
    slug: 'apparel',
    description: 'Comfortable clothing featuring our rescue animals and sanctuary mission',
    image: '/images/store/categories/apparel.jpg'
  },
  {
    id: 'accessories',
    name: 'Accessories',
    slug: 'accessories', 
    description: 'Practical accessories for everyday use while supporting our cause',
    image: '/images/store/categories/accessories.jpg'
  },
  {
    id: 'books',
    name: 'Books & Educational',
    slug: 'books',
    description: 'Educational materials about animal welfare and sanctuary life',
    image: '/images/store/categories/books.jpg'
  },
  {
    id: 'gifts',
    name: 'Gifts & Collectibles',
    slug: 'gifts',
    description: 'Perfect gifts for animal lovers and sanctuary supporters',
    image: '/images/store/categories/gifts.jpg'
  },
  {
    id: 'seasonal',
    name: 'Seasonal Items',
    slug: 'seasonal',
    description: 'Special seasonal and holiday-themed merchandise',
    image: '/images/store/categories/seasonal.jpg'
  }
]

export const sampleProducts: Product[] = [
  // Apparel
  {
    id: 'harmony-classic-tee',
    name: 'Harmony Farm Sanctuary Classic T-Shirt',
    description: 'Our signature organic cotton t-shirt featuring the Harmony Farm Sanctuary logo. Comfortable, durable, and perfect for showing your support for animal rescue. Made from 100% organic cotton with eco-friendly printing.',
    shortDescription: 'Classic organic cotton tee with sanctuary logo',
    category: 'apparel' as ProductCategory,
    price: 24.99,
    images: [
      {
        id: 'harmony-tee-main',
        url: '/images/store/products/harmony-classic-tee-main.jpg',
        alt: 'Harmony Farm Sanctuary Classic T-Shirt - Forest Green',
        isMain: true,
        order: 1
      },
      {
        id: 'harmony-tee-back',
        url: '/images/store/products/harmony-classic-tee-back.jpg',
        alt: 'Back view of Harmony Farm Sanctuary Classic T-Shirt',
        isMain: false,
        order: 2
      }
    ],
    variants: [
      { id: 'size-s', name: 'Small', type: 'size', isAvailable: true, stockCount: 25 },
      { id: 'size-m', name: 'Medium', type: 'size', isAvailable: true, stockCount: 30 },
      { id: 'size-l', name: 'Large', type: 'size', isAvailable: true, stockCount: 28 },
      { id: 'size-xl', name: 'X-Large', type: 'size', isAvailable: true, stockCount: 22 },
      { id: 'size-xxl', name: 'XX-Large', type: 'size', isAvailable: true, stockCount: 15 },
      { id: 'color-forest', name: 'Forest Green', type: 'color', isAvailable: true },
      { id: 'color-navy', name: 'Navy Blue', type: 'color', isAvailable: true },
      { id: 'color-charcoal', name: 'Charcoal Gray', type: 'color', isAvailable: true }
    ],
    inStock: true,
    stockCount: 120,
    featured: true,
    tags: ['organic', 'cotton', 'logo', 'unisex', 'bestseller'],
    materials: ['100% Organic Cotton'],
    careInstructions: 'Machine wash cold, tumble dry low, do not bleach',
    sizing: 'Unisex sizing, true to size. See size chart for measurements.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-01')
  },
  
  {
    id: 'bella-pig-hoodie',
    name: '"Team Bella" Rescue Pig Hoodie',
    description: 'Celebrate Bella, our beloved rescue pig, with this cozy hooded sweatshirt. Features an adorable illustration of Bella with the message "Rescued & Loved". 50% of proceeds go directly to pig rescue and care.',
    shortDescription: 'Cozy hoodie featuring Bella, our rescue pig mascot',
    category: 'apparel' as ProductCategory,
    price: 44.99,
    salePrice: 39.99,
    images: [
      {
        id: 'bella-hoodie-main',
        url: '/images/store/products/bella-pig-hoodie-main.jpg',
        alt: 'Team Bella Rescue Pig Hoodie - Soft Pink',
        isMain: true,
        order: 1
      }
    ],
    variants: [
      { id: 'size-s', name: 'Small', type: 'size', isAvailable: true, stockCount: 15 },
      { id: 'size-m', name: 'Medium', type: 'size', isAvailable: true, stockCount: 20 },
      { id: 'size-l', name: 'Large', type: 'size', isAvailable: true, stockCount: 18 },
      { id: 'size-xl', name: 'X-Large', type: 'size', isAvailable: true, stockCount: 12 },
      { id: 'color-pink', name: 'Soft Pink', type: 'color', isAvailable: true },
      { id: 'color-sage', name: 'Sage Green', type: 'color', isAvailable: true }
    ],
    inStock: true,
    stockCount: 65,
    featured: true,
    tags: ['bella', 'pig', 'rescue', 'hoodie', 'sale', 'animal-specific'],
    materials: ['60% Cotton', '40% Polyester'],
    careInstructions: 'Machine wash warm, tumble dry medium',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-12-01')
  },

  // Accessories
  {
    id: 'sanctuary-tote-bag',
    name: 'Harmony Sanctuary Canvas Tote Bag',
    description: 'Sturdy canvas tote bag perfect for grocery shopping, market trips, or daily errands. Features our "Compassion in Action" design with animal silhouettes. Made from durable 100% cotton canvas.',
    shortDescription: 'Durable canvas tote with animal silhouette design',
    category: 'accessories' as ProductCategory,
    price: 16.99,
    images: [
      {
        id: 'tote-main',
        url: '/images/store/products/sanctuary-tote-main.jpg',
        alt: 'Harmony Sanctuary Canvas Tote Bag - Natural',
        isMain: true,
        order: 1
      }
    ],
    variants: [
      { id: 'color-natural', name: 'Natural Canvas', type: 'color', isAvailable: true },
      { id: 'color-navy', name: 'Navy Blue', type: 'color', isAvailable: true }
    ],
    inStock: true,
    stockCount: 85,
    featured: false,
    tags: ['tote', 'canvas', 'reusable', 'eco-friendly', 'practical'],
    materials: ['100% Cotton Canvas'],
    careInstructions: 'Machine wash cold, air dry recommended',
    dimensions: { length: 15, width: 4, height: 16 },
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-11-15')
  },

  {
    id: 'animal-rescue-mug',
    name: 'Animal Rescue Heroes Coffee Mug',
    description: 'Start your day with purpose using our 11oz ceramic mug featuring inspiring quotes about animal rescue. Dishwasher and microwave safe with a comfortable handle design.',
    shortDescription: '11oz ceramic mug with inspiring animal rescue quotes',
    category: 'accessories' as ProductCategory,
    price: 12.99,
    images: [
      {
        id: 'mug-main',
        url: '/images/store/products/animal-rescue-mug-main.jpg',
        alt: 'Animal Rescue Heroes Coffee Mug - White',
        isMain: true,
        order: 1
      }
    ],
    variants: [
      { id: 'color-white', name: 'Classic White', type: 'color', isAvailable: true },
      { id: 'color-green', name: 'Sanctuary Green', type: 'color', isAvailable: true }
    ],
    inStock: true,
    stockCount: 45,
    featured: false,
    tags: ['mug', 'coffee', 'ceramic', 'quotes', 'daily-use'],
    materials: ['Ceramic'],
    careInstructions: 'Dishwasher and microwave safe',
    weight: 0.8,
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-11-20')
  },

  // Books & Educational
  {
    id: 'sanctuary-life-guide',
    name: 'Life at the Sanctuary: A Guide to Farm Animal Care',
    description: 'Comprehensive 180-page guide covering the basics of farm animal care, rescue stories from Harmony Farm, and practical advice for starting your own animal sanctuary. Written by our founder and veterinary team.',
    shortDescription: 'Comprehensive guide to farm animal care and sanctuary life',
    category: 'books' as ProductCategory,
    price: 29.99,
    images: [
      {
        id: 'book-main',
        url: '/images/store/products/sanctuary-life-guide-main.jpg',
        alt: 'Life at the Sanctuary Book Cover',
        isMain: true,
        order: 1
      }
    ],
    variants: [
      { id: 'format-paperback', name: 'Paperback', type: 'style', isAvailable: true },
      { id: 'format-ebook', name: 'Digital PDF', type: 'style', isAvailable: true, price: 19.99 }
    ],
    inStock: true,
    stockCount: 35,
    featured: true,
    tags: ['book', 'educational', 'animal-care', 'sanctuary', 'guide'],
    materials: ['Paper (Paperback)', 'Digital (PDF)'],
    weight: 1.2,
    dimensions: { length: 8.5, width: 0.8, height: 11 },
    createdAt: new Date('2024-04-12'),
    updatedAt: new Date('2024-11-25')
  },

  // Gifts & Collectibles
  {
    id: 'wooden-animal-ornaments',
    name: 'Hand-Carved Wooden Animal Ornament Set',
    description: 'Beautiful set of 6 hand-carved wooden ornaments featuring our sanctuary animals: pig, cow, goat, chicken, sheep, and horse. Each ornament is unique and made by local artisans. Perfect for holiday decorating or year-round display.',
    shortDescription: 'Set of 6 hand-carved wooden animal ornaments',
    category: 'gifts' as ProductCategory,
    price: 34.99,
    images: [
      {
        id: 'ornaments-main',
        url: '/images/store/products/wooden-ornaments-main.jpg',
        alt: 'Hand-Carved Wooden Animal Ornament Set',
        isMain: true,
        order: 1
      }
    ],
    variants: [
      { id: 'finish-natural', name: 'Natural Wood', type: 'style', isAvailable: true },
      { id: 'finish-painted', name: 'Hand-Painted', type: 'style', isAvailable: true, price: 39.99 }
    ],
    inStock: true,
    stockCount: 22,
    featured: false,
    tags: ['ornaments', 'wood', 'handmade', 'artisan', 'gifts', 'collectible'],
    materials: ['Sustainable Wood', 'Non-toxic Paint (painted version)'],
    careInstructions: 'Dust gently with soft cloth, avoid moisture',
    weight: 0.6,
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-12-01')
  },

  // Featured/Popular Items
  {
    id: 'supporter-sticker-pack',
    name: 'Sanctuary Supporter Sticker Pack',
    description: 'Pack of 8 weather-resistant vinyl stickers featuring our animal residents and inspirational messages. Perfect for laptops, water bottles, cars, and more. Show your sanctuary pride everywhere you go!',
    shortDescription: 'Pack of 8 weather-resistant vinyl stickers',
    category: 'accessories' as ProductCategory,
    price: 8.99,
    images: [
      {
        id: 'stickers-main',
        url: '/images/store/products/sticker-pack-main.jpg',
        alt: 'Sanctuary Supporter Sticker Pack',
        isMain: true,
        order: 1
      }
    ],
    variants: [
      { id: 'pack-original', name: 'Original Pack', type: 'style', isAvailable: true },
      { id: 'pack-seasonal', name: 'Seasonal Pack', type: 'style', isAvailable: true }
    ],
    inStock: true,
    stockCount: 150,
    featured: true,
    tags: ['stickers', 'vinyl', 'weatherproof', 'laptop', 'affordable', 'popular'],
    materials: ['Vinyl', 'Weatherproof Coating'],
    weight: 0.1,
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-12-01')
  },

  {
    id: 'rescue-story-calendar',
    name: '2025 Rescue Stories Calendar',
    description: '12-month wall calendar featuring beautiful photography of our animal residents along with their rescue stories. Each month highlights different animals with inspirational quotes and important sanctuary dates.',
    shortDescription: '2025 wall calendar with rescue animal photography',
    category: 'gifts' as ProductCategory,
    price: 18.99,
    salePrice: 14.99,
    images: [
      {
        id: 'calendar-main',
        url: '/images/store/products/2025-calendar-main.jpg',
        alt: '2025 Rescue Stories Calendar Cover',
        isMain: true,
        order: 1
      }
    ],
    variants: [
      { id: 'size-standard', name: 'Standard (11x17)', type: 'size', isAvailable: true },
      { id: 'size-large', name: 'Large (12x24)', type: 'size', isAvailable: true, price: 24.99 }
    ],
    inStock: true,
    stockCount: 75,
    featured: true,
    tags: ['calendar', '2025', 'photography', 'rescue-stories', 'seasonal', 'sale'],
    materials: ['High-Quality Paper', 'Wire Binding'],
    weight: 0.9,
    dimensions: { length: 11, width: 0.3, height: 17 },
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-12-01')
  }
]

// Helper functions for working with products
export const getFeaturedProducts = (): Product[] => {
  return sampleProducts.filter(product => product.featured)
}

export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return sampleProducts.filter(product => product.category === category)
}

export const getProductById = (id: string): Product | undefined => {
  return sampleProducts.find(product => product.id === id)
}

export const getOnSaleProducts = (): Product[] => {
  return sampleProducts.filter(product => product.salePrice && product.salePrice < product.price)
}

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase()
  return sampleProducts.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

// Store configuration
export const storeConfig = {
  currency: 'USD',
  taxRate: 0.08, // 8% sales tax
  shippingRates: {
    standard: 5.99,
    expedited: 12.99,
    overnight: 24.99
  },
  freeShippingThreshold: 50.00,
  returnsPolicy: '30-day return policy on unworn/unused items',
  shippingPolicy: 'Ships within 2-3 business days. Free shipping on orders over $50.'
}