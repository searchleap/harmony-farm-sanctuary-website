// FAQ Database for Harmony Farm Sanctuary
// Comprehensive collection of frequently asked questions with detailed answers

import { FAQ, FAQTag } from '../types/faq';
import { getCategoryById } from './faqCategories';

// FAQ tags for content organization
export const faqTags: FAQTag[] = [
  { id: 'tours', name: 'Tours', slug: 'tours', count: 0 },
  { id: 'hours', name: 'Hours', slug: 'hours', count: 0 },
  { id: 'parking', name: 'Parking', slug: 'parking', count: 0 },
  { id: 'children', name: 'Children', slug: 'children', count: 0 },
  { id: 'pets', name: 'Pets', slug: 'pets', count: 0 },
  { id: 'accessibility', name: 'Accessibility', slug: 'accessibility', count: 0 },
  { id: 'feeding', name: 'Feeding Animals', slug: 'feeding', count: 0 },
  { id: 'rescue', name: 'Rescue', slug: 'rescue', count: 0 },
  { id: 'medical', name: 'Medical Care', slug: 'medical', count: 0 },
  { id: 'volunteer-requirements', name: 'Requirements', slug: 'volunteer-requirements', count: 0 },
  { id: 'volunteer-training', name: 'Training', slug: 'volunteer-training', count: 0 },
  { id: 'volunteer-schedule', name: 'Schedule', slug: 'volunteer-schedule', count: 0 },
  { id: 'tax-deductible', name: 'Tax Deductible', slug: 'tax-deductible', count: 0 },
  { id: 'monthly-giving', name: 'Monthly Giving', slug: 'monthly-giving', count: 0 },
  { id: 'corporate', name: 'Corporate', slug: 'corporate', count: 0 },
  { id: 'memorial', name: 'Memorial', slug: 'memorial', count: 0 },
  { id: 'sponsorship-benefits', name: 'Benefits', slug: 'sponsorship-benefits', count: 0 },
  { id: 'adoption-process', name: 'Process', slug: 'adoption-process', count: 0 },
  { id: 'veterinary', name: 'Veterinary', slug: 'veterinary', count: 0 },
  { id: 'nutrition', name: 'Nutrition', slug: 'nutrition', count: 0 },
  { id: 'enrichment', name: 'Enrichment', slug: 'enrichment', count: 0 },
  { id: 'school-programs', name: 'School Programs', slug: 'school-programs', count: 0 },
  { id: 'workshops', name: 'Workshops', slug: 'workshops', count: 0 },
  { id: 'location', name: 'Location', slug: 'location', count: 0 },
  { id: 'mission', name: 'Mission', slug: 'mission', count: 0 }
];

export const faqs: FAQ[] = [
  // VISITING THE SANCTUARY
  {
    id: 'visiting-hours',
    question: 'What are your visiting hours?',
    answer: `We offer guided tours by appointment throughout the week. Our standard tour times are:
    
    **Weekdays:** 10:00 AM, 2:00 PM, and 4:00 PM
    **Weekends:** 9:00 AM, 11:00 AM, 1:00 PM, 3:00 PM, and 5:00 PM
    
    Tours typically last 1.5-2 hours and include visits to all animal areas, educational information about each species, and time for questions. We recommend booking at least 1 week in advance, especially for weekend tours.
    
    Private tours and group visits can be arranged for different times with advance notice.`,
    shortAnswer: 'Tours available by appointment: weekdays at 10 AM, 2 PM, 4 PM; weekends at 9 AM, 11 AM, 1 PM, 3 PM, 5 PM.',
    category: getCategoryById('visiting')!,
    tags: [faqTags[0], faqTags[1]], // tours, hours
    priority: 10,
    difficulty: 'beginner',
    lastUpdated: '2024-01-15',
    views: 1250,
    helpful: 89,
    notHelpful: 3,
    helpfulnessRatio: 0.97,
    author: 'Sarah Thompson',
    keywords: ['hours', 'tours', 'schedule', 'appointment', 'visiting'],
    isPopular: true,
    isFeatured: true,
    relatedFAQs: ['tour-cost', 'group-tours', 'tour-booking']
  },
  {
    id: 'tour-cost',
    question: 'How much do tours cost?',
    answer: `Our tours are offered on a suggested donation basis to keep them accessible to everyone:
    
    **Suggested Donations:**
    - Adults: $15
    - Children (12 and under): $8
    - Seniors (65+): $12
    - Students with ID: $10
    
    **Free Tours Available:**
    We offer free tours for families experiencing financial hardship, local school groups, and first responders. Please contact us to arrange.
    
    **Private Tours:**
    Private tours for groups of 8 or fewer are available for a minimum donation of $200.
    
    All donations go directly to animal care, including food, medical expenses, and facility maintenance.`,
    shortAnswer: 'Suggested donation: Adults $15, Children $8. Free tours available for those in need.',
    category: getCategoryById('visiting')!,
    tags: [faqTags[0]], // tours
    priority: 9,
    difficulty: 'beginner',
    lastUpdated: '2024-01-10',
    views: 980,
    helpful: 76,
    notHelpful: 2,
    helpfulnessRatio: 0.97,
    author: 'Sarah Thompson',
    keywords: ['cost', 'donation', 'price', 'tours', 'free'],
    isPopular: true,
    isFeatured: false,
    relatedFAQs: ['visiting-hours', 'group-tours']
  },
  {
    id: 'group-tours',
    question: 'Do you offer group tours?',
    answer: `Yes! We welcome groups of all sizes and offer specialized tours for different types of groups:
    
    **School Groups (K-12):**
    - Free educational tours with age-appropriate content
    - Curriculum-aligned learning materials provided
    - Hands-on activities and Q&A sessions
    - Teacher resources and follow-up materials
    
    **Corporate Groups:**
    - Team-building experiences with animal interaction
    - Educational presentations about our mission
    - Optional volunteer activity add-ons
    - Customized to your group's interests and timeline
    
    **Youth Organizations & Camps:**
    - Engaging, interactive tours for youth groups
    - Character-building discussions about compassion
    - Badge programs for scouts and similar organizations
    
    **Adult Groups & Seniors:**
    - Detailed tours with in-depth animal stories
    - Comfortable pacing with seating areas
    - Transportation assistance available
    
    Please book group tours at least 2 weeks in advance. Group size limits may apply depending on the season and weather conditions.`,
    shortAnswer: 'Yes! We offer specialized tours for schools, corporate groups, youth organizations, and adult groups. Book 2 weeks in advance.',
    category: getCategoryById('visiting')!,
    tags: [faqTags[0], faqTags[3]], // tours, children
    priority: 8,
    difficulty: 'beginner',
    lastUpdated: '2024-01-12',
    views: 567,
    helpful: 45,
    notHelpful: 1,
    helpfulnessRatio: 0.98,
    author: 'Mike Thompson',
    keywords: ['group', 'school', 'corporate', 'youth', 'organization'],
    isPopular: false,
    isFeatured: false,
    relatedFAQs: ['visiting-hours', 'tour-cost', 'school-programs']
  },
  {
    id: 'parking-directions',
    question: 'Where should I park and how do I find you?',
    answer: `**Address:**
    Harmony Farm Sanctuary
    123 Sanctuary Road
    Central Oregon, OR 97XXX
    
    **Parking:**
    We have a large gravel parking lot that can accommodate cars, SUVs, and small buses. Parking is free and accessible spots are available near the entrance.
    
    **Directions:**
    From Highway 97: Take Exit 126 toward Sanctuary Road. Turn left onto Sanctuary Road and follow for 2 miles. Look for our large wooden sign and red barn on the right side.
    
    **GPS Note:** Some GPS systems may show our location incorrectly. If you have trouble finding us, call (541) 555-FARM and we'll provide turn-by-turn directions.
    
    **Public Transportation:**
    The nearest bus stop is 1.5 miles away on Highway 97. We can arrange pickup for visitors without cars - please call in advance.`,
    shortAnswer: '123 Sanctuary Road, Central Oregon. Free parking available. Call (541) 555-FARM if GPS has trouble.',
    category: getCategoryById('visiting')!,
    tags: [faqTags[2], faqTags[23]], // parking, location
    priority: 7,
    difficulty: 'beginner',
    lastUpdated: '2024-01-08',
    views: 445,
    helpful: 38,
    notHelpful: 1,
    helpfulnessRatio: 0.97,
    author: 'Sarah Thompson',
    keywords: ['parking', 'directions', 'location', 'address', 'GPS'],
    isPopular: false,
    isFeatured: false,
    relatedFAQs: ['visiting-hours', 'accessibility']
  },
  {
    id: 'what-to-bring',
    question: 'What should I bring for my visit?',
    answer: `**Essential Items:**
    - Comfortable walking shoes (we'll be walking on grass, gravel, and dirt paths)
    - Weather-appropriate clothing (tours happen rain or shine)
    - Sun protection (hat, sunscreen) - much of the tour is outdoors
    - Water bottle (especially important in summer months)
    
    **Recommended Items:**
    - Camera or phone for photos (animals love being photographed!)
    - Small backpack for personal items
    - Hand sanitizer (provided at each animal area, but nice to have your own)
    - Light snack for after the tour
    
    **What NOT to Bring:**
    - Food for animals (we provide appropriate treats during the tour)
    - Glass containers or bottles
    - Strong perfumes or scented products (can stress animals)
    - Balloons or noisy toys
    - Pets (for the safety of both your pets and our animals)
    
    **For Children:**
    - Extra clothing in case of muddy conditions
    - Favorite water bottle
    - Any needed medications
    
    We provide hand-washing stations and some basic first aid supplies on-site.`,
    shortAnswer: 'Bring comfortable shoes, weather-appropriate clothes, water, and sun protection. No outside food for animals.',
    category: getCategoryById('visiting')!,
    tags: [faqTags[0], faqTags[3]], // tours, children
    priority: 6,
    difficulty: 'beginner',
    lastUpdated: '2024-01-14',
    views: 334,
    helpful: 29,
    notHelpful: 0,
    helpfulnessRatio: 1.0,
    author: 'Mike Thompson',
    keywords: ['bring', 'prepare', 'clothing', 'shoes', 'weather'],
    isPopular: false,
    isFeatured: false,
    relatedFAQs: ['visiting-hours', 'children-tours']
  },

  // OUR ANIMALS
  {
    id: 'animal-species',
    question: 'What types of animals live at the sanctuary?',
    answer: `Our sanctuary is home to a diverse family of rescued farm animals, each with their own unique story:
    
    **Large Animals:**
    - **Cows (8):** Including dairy cows rescued from industrial farms and beef cattle saved from slaughter
    - **Pigs (12):** Potbellied pigs, farm pigs, and several who were rescued as babies
    - **Goats (15):** Dairy goats, meat goats, and several Nigerian Dwarf goats
    - **Sheep (10):** Wool sheep and meat sheep, including some rare heritage breeds
    - **Horses (3):** Rescued from neglect situations and auction houses
    
    **Small Animals:**
    - **Chickens (45):** Egg-laying hens, roosters, and meat chickens of various breeds
    - **Ducks (12):** Domestic ducks rescued from various situations
    - **Geese (6):** Including some who were raised for meat production
    - **Turkeys (8):** Broad-breasted and heritage breed turkeys
    - **Rabbits (6):** Domestic rabbits from surrender situations
    
    Each animal receives individualized care based on their species' needs, personality, and any special medical requirements. Many of our animals are elderly or have disabilities, making their care extra special.`,
    shortAnswer: 'We care for 150+ animals: cows, pigs, goats, sheep, horses, chickens, ducks, geese, turkeys, and rabbits.',
    category: getCategoryById('animals')!,
    tags: [faqTags[7]], // rescue
    priority: 10,
    difficulty: 'beginner',
    lastUpdated: '2024-01-13',
    views: 1100,
    helpful: 87,
    notHelpful: 2,
    helpfulnessRatio: 0.98,
    author: 'Dr. Emily Chen',
    keywords: ['species', 'animals', 'types', 'cows', 'pigs', 'goats', 'chickens'],
    isPopular: true,
    isFeatured: true,
    relatedFAQs: ['animal-stories', 'animal-care-approach']
  },
  {
    id: 'animal-stories',
    question: 'Can you tell me about some of the animals\' rescue stories?',
    answer: `Every animal at our sanctuary has a unique rescue story. Here are a few that showcase the range of situations we encounter:
    
    **Bella the Cow:**
    Bella came to us as a severely malnourished dairy cow who had been abandoned when she could no longer produce milk profitably. She was pregnant and gave birth to her calf, Benny, shortly after arriving. Today, both mother and son thrive in our pastures.
    
    **Wilbur the Pig:**
    Wilbur was purchased as a "teacup pig" by a family who didn't realize he would grow to 200+ pounds. When they could no longer care for him, they brought him to us. He's now one of our most social animals and loves belly rubs.
    
    **Luna the Goat:**
    Luna was rescued from a hoarding situation where over 100 animals were living in deplorable conditions. She arrived fearful and underweight but has blossomed into a confident, playful goat who serves as a mother figure to younger animals.
    
    **The Magnificent Seven Chickens:**
    These seven hens were rescued from a battery cage facility. They had never seen sunlight or felt grass under their feet. Watching them experience freedom for the first time was incredibly moving.
    
    Each rescue teaches us about resilience, the capacity for healing, and the importance of our mission.`,
    shortAnswer: 'Each animal has a unique rescue story - from abandoned dairy cows to chickens experiencing freedom for the first time.',
    category: getCategoryById('animals')!,
    tags: [faqTags[7]], // rescue
    priority: 9,
    difficulty: 'beginner',
    lastUpdated: '2024-01-11',
    views: 789,
    helpful: 68,
    notHelpful: 1,
    helpfulnessRatio: 0.99,
    author: 'Sarah Thompson',
    keywords: ['stories', 'rescue', 'Bella', 'Wilbur', 'Luna', 'chickens'],
    isPopular: true,
    isFeatured: false,
    relatedFAQs: ['animal-species', 'sponsorship-program']
  },

  // VOLUNTEERING
  {
    id: 'volunteer-requirements',
    question: 'What are the requirements to volunteer?',
    answer: `We welcome volunteers of all backgrounds and experience levels! Here are our basic requirements:
    
    **Age Requirements:**
    - 16+ years old for most volunteer activities
    - 14-15 year olds can volunteer with parent/guardian supervision
    - Special programs available for younger children with families
    
    **Physical Requirements:**
    - Ability to walk on uneven terrain (grass, gravel, dirt)
    - Comfortable lifting up to 25 pounds occasionally
    - Standing for periods of 1-2 hours
    - We accommodate volunteers with disabilities - please discuss with us
    
    **Time Commitment:**
    - Minimum 4-hour shifts
    - At least one shift per month to maintain active status
    - Consistent volunteers preferred but one-time visits welcome
    
    **Training Requirements:**
    - Mandatory 2-hour orientation session
    - Animal safety training
    - Ongoing training opportunities available
    
    **Background & Health:**
    - Background check for regular volunteers
    - Current tetanus vaccination recommended
    - No prior animal experience required - we'll teach you everything!
    
    **What We Provide:**
    - All necessary training and safety equipment
    - Work gloves and aprons
    - Mentorship from experienced volunteers
    - Flexible scheduling to fit your life`,
    shortAnswer: 'Ages 16+, basic physical ability, 4-hour minimum shifts, orientation required. No prior experience needed!',
    category: getCategoryById('volunteering')!,
    tags: [faqTags[9]], // volunteer-requirements
    priority: 10,
    difficulty: 'beginner',
    lastUpdated: '2024-01-16',
    views: 567,
    helpful: 52,
    notHelpful: 1,
    helpfulnessRatio: 0.98,
    author: 'Mike Thompson',
    keywords: ['requirements', 'age', 'training', 'experience', 'volunteer'],
    isPopular: true,
    isFeatured: true,
    relatedFAQs: ['volunteer-activities', 'volunteer-schedule']
  },

  // DONATIONS & SUPPORT
  {
    id: 'tax-deductible',
    question: 'Are donations tax-deductible?',
    answer: `Yes! Harmony Farm Sanctuary is a registered 501(c)(3) nonprofit organization, which means all donations are tax-deductible to the fullest extent allowed by law.
    
    **Tax Information:**
    - EIN: 12-3456789
    - Oregon nonprofit registration: CH.123456
    - Donations of any amount are deductible
    - We provide receipts for all donations
    
    **What We Send You:**
    - Email receipt immediately after donation
    - Annual tax summary in January for total yearly giving
    - Printed receipts available upon request
    
    **Types of Deductible Donations:**
    - One-time monetary donations
    - Monthly recurring donations
    - Memorial and tribute gifts
    - Stock and cryptocurrency donations
    - In-kind donations (with proper valuation)
    
    **Corporate Donations:**
    Corporate donations and sponsorships may have different tax implications. Please consult with your tax advisor for specifics.
    
    **International Donors:**
    While we can accept international donations, tax deductibility varies by country. Please consult local tax authorities.
    
    Always consult with your tax professional for specific advice regarding your tax situation.`,
    shortAnswer: 'Yes! We\'re a 501(c)(3) nonprofit. All donations are tax-deductible. EIN: 12-3456789.',
    category: getCategoryById('donations')!,
    tags: [faqTags[12]], // tax-deductible
    priority: 9,
    difficulty: 'beginner',
    lastUpdated: '2024-01-09',
    views: 445,
    helpful: 41,
    notHelpful: 1,
    helpfulnessRatio: 0.98,
    author: 'Financial Manager',
    keywords: ['tax', 'deductible', '501c3', 'nonprofit', 'receipt'],
    isPopular: true,
    isFeatured: false,
    relatedFAQs: ['monthly-giving', 'corporate-donations']
  },

  // Add more FAQs following the same pattern...
  // This is a sample showing the structure - in a real implementation,
  // you would include all 25+ FAQs covering all categories
];

export const getFAQById = (id: string): FAQ | undefined => {
  return faqs.find(faq => faq.id === id);
};

export const getFAQsByCategory = (categoryId: string): FAQ[] => {
  return faqs.filter(faq => faq.category.id === categoryId)
    .sort((a, b) => b.priority - a.priority);
};

export const getFeaturedFAQs = (): FAQ[] => {
  return faqs.filter(faq => faq.isFeatured)
    .sort((a, b) => b.priority - a.priority);
};

export const getPopularFAQs = (limit: number = 10): FAQ[] => {
  return faqs.filter(faq => faq.isPopular)
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

export const searchFAQs = (query: string): FAQ[] => {
  const lowercaseQuery = query.toLowerCase();
  return faqs.filter(faq => 
    faq.question.toLowerCase().includes(lowercaseQuery) ||
    faq.answer.toLowerCase().includes(lowercaseQuery) ||
    faq.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery)) ||
    faq.tags.some(tag => tag.name.toLowerCase().includes(lowercaseQuery))
  ).sort((a, b) => b.priority - a.priority);
};

// Update tag counts based on actual FAQ usage
export const updateTagCounts = (): void => {
  const tagCounts: Record<string, number> = {};
  
  faqs.forEach(faq => {
    faq.tags.forEach(tag => {
      tagCounts[tag.id] = (tagCounts[tag.id] || 0) + 1;
    });
  });
  
  faqTags.forEach(tag => {
    tag.count = tagCounts[tag.id] || 0;
  });
};