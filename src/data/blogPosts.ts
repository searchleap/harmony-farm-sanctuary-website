// Blog Posts Database for Harmony Farm Sanctuary
// Comprehensive collection of blog content with rich media and metadata

import { BlogPost, BlogTag } from '../types/blog';

// Re-export types for convenience
export type { BlogPost, BlogTag };
import { getAuthorById } from './authors';
import { getCategoryById } from './blogCategories';

// Blog tags for content organization
export const blogTags: BlogTag[] = [
  { id: 'rescue', name: 'Rescue', slug: 'rescue', count: 0 },
  { id: 'medical-care', name: 'Medical Care', slug: 'medical-care', count: 0 },
  { id: 'pig-intelligence', name: 'Pig Intelligence', slug: 'pig-intelligence', count: 0 },
  { id: 'fundraising', name: 'Fundraising', slug: 'fundraising', count: 0 },
  { id: 'volunteer-spotlight', name: 'Volunteer Spotlight', slug: 'volunteer-spotlight', count: 0 },
  { id: 'winter-care', name: 'Winter Care', slug: 'winter-care', count: 0 },
  { id: 'animal-behavior', name: 'Animal Behavior', slug: 'animal-behavior', count: 0 },
  { id: 'environmental-impact', name: 'Environmental Impact', slug: 'environmental-impact', count: 0 },
  { id: 'goat-rescue', name: 'Goat Rescue', slug: 'goat-rescue', count: 0 },
  { id: 'daily-life', name: 'Daily Life', slug: 'daily-life', count: 0 },
  { id: 'holiday-events', name: 'Holiday Events', slug: 'holiday-events', count: 0 },
  { id: 'therapeutic-benefits', name: 'Therapeutic Benefits', slug: 'therapeutic-benefits', count: 0 }
];

// Sample blog posts with comprehensive content
export const blogPosts: BlogPost[] = [
  {
    id: 'bella-journey-rescue-recovery',
    title: 'Bella\'s Journey: From Rescue to Recovery',
    slug: 'bella-journey-rescue-recovery',
    excerpt: 'Follow Bella\'s incredible transformation from a malnourished rescue pig to a thriving sanctuary resident who has become an ambassador for pig intelligence and emotional complexity.',
    content: `
      <p>When Bella first arrived at Harmony Farm Sanctuary six months ago, she was barely recognizable as the vibrant, intelligent pig she is today. Rescued from a neglect situation where she had been confined to a small, muddy pen with little food or veterinary care, Bella weighed just 180 pounds—significantly underweight for a pig of her breed and age.</p>

      <h2>The Rescue</h2>
      <p>Our rescue team, led by Sarah and Mike Thompson, received a call from local animal control about a pig in distress. When they arrived at the property, they found Bella lying in several inches of mud, struggling to stand. Her hooves were severely overgrown, making walking painful and difficult. She had multiple wounds that had become infected, and her body condition score indicated severe malnutrition.</p>

      <p>"I'll never forget the look in Bella's eyes that day," recalls Sarah Thompson, Sanctuary Founder. "Despite everything she had endured, there was still a spark there—a will to live that just needed the right care and environment to flourish."</p>

      <h2>Medical Intervention</h2>
      <p>Dr. Emily Chen, our Veterinary Director, immediately began an intensive care protocol for Bella. The first priority was addressing her infected wounds and beginning a carefully monitored nutrition plan. Bella's hooves required surgical trimming under anesthesia, and she needed antibiotics for her infections.</p>

      <blockquote>
        <p>"Bella's case was particularly challenging because we had to balance aggressive treatment for her medical issues with the stress that handling and medical procedures place on an already traumatized animal. Pigs are incredibly intelligent and remember both positive and negative experiences vividly."</p>
        <cite>— Dr. Emily Chen, Veterinary Director</cite>
      </blockquote>

      <h2>Recovery and Socialization</h2>
      <p>As Bella's physical health improved, our Animal Care team, led by Jessica Martinez, began working on her emotional and social rehabilitation. Pigs are highly social animals who thrive on interaction and mental stimulation. Bella had been isolated for so long that she had forgotten how to interact with other pigs.</p>

      <p>The socialization process began slowly, with Bella having visual contact with other pigs through safe barriers. Our pig residents Wilbur and Hamlet were particularly patient and welcoming, often lying near the fence to keep Bella company during her recovery.</p>

      <h2>Remarkable Progress</h2>
      <p>Today, Bella weighs a healthy 320 pounds and has become one of our most charismatic sanctuary residents. She's developed a particular fondness for puzzle feeders and has learned to paint with brushes—a enrichment activity that showcases her intelligence and dexterity.</p>

      <p>Bella has also become an important part of our educational programs. Visitors are amazed to learn about pig intelligence and emotional complexity through observing Bella's behavior and interactions. She enjoys attention from visitors and has learned several commands, demonstrating that pigs are as intelligent as dogs and in many ways more cognitively complex.</p>

      <h2>Looking Forward</h2>
      <p>Bella's story is a testament to the resilience of animals and the power of compassionate care. She serves as an ambassador for the millions of pigs who remain in industrial systems, reminding us that each animal is an individual with their own personality, preferences, and capacity for joy.</p>

      <p>We're currently working on expanding our pig habitat to include a larger mud wallow and more natural foraging areas. Bella has shown us how much pigs enjoy rooting and exploring, behaviors that are impossible in conventional farming systems but essential for their psychological well-being.</p>

      <p>If you'd like to support Bella's continued care and help us rescue more animals like her, consider becoming a monthly supporter or sponsoring her care directly. Every contribution makes a difference in the lives of animals who have nowhere else to turn.</p>
    `,
    author: getAuthorById('sarah-thompson')!,
    category: getCategoryById('animal-updates')!,
    tags: [
      blogTags.find(t => t.id === 'rescue')!,
      blogTags.find(t => t.id === 'medical-care')!,
      blogTags.find(t => t.id === 'pig-intelligence')!
    ],
    featuredImage: '/images/blog/bella-journey-hero.jpg',
    featuredImageAlt: 'Bella the pig enjoying a mud bath in her sanctuary habitat',
    gallery: [
      {
        type: 'image',
        url: '/images/blog/bella-before-rescue.jpg',
        alt: 'Bella before rescue in poor conditions',
        caption: 'Bella when she first arrived at the sanctuary, showing signs of neglect and malnutrition'
      },
      {
        type: 'image', 
        url: '/images/blog/bella-medical-care.jpg',
        alt: 'Dr. Chen providing medical care to Bella',
        caption: 'Dr. Emily Chen treating Bella\'s infected wounds during her initial recovery'
      },
      {
        type: 'image',
        url: '/images/blog/bella-painting.jpg',
        alt: 'Bella creating art with a paintbrush',
        caption: 'Bella demonstrating her intelligence through painting enrichment activities'
      },
      {
        type: 'video',
        url: '/videos/blog/bella-socialization.mp4',
        thumbnail: '/images/blog/bella-video-thumb.jpg',
        alt: 'Video of Bella socializing with other pigs',
        caption: 'Watch Bella\'s first successful interactions with Wilbur and Hamlet',
        duration: 120
      }
    ],
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
    status: 'published',
    featured: true,
    readTime: 8,
    views: 2847,
    likes: 156,
    shares: 89,
    seo: {
      metaTitle: 'Bella\'s Incredible Recovery Journey | Harmony Farm Sanctuary',
      metaDescription: 'Follow rescued pig Bella\'s amazing transformation from neglect to thriving sanctuary life, showcasing pig intelligence and the power of compassionate care.',
      keywords: ['pig rescue', 'animal recovery', 'pig intelligence', 'farm sanctuary', 'animal welfare'],
      ogImage: '/images/blog/bella-journey-og.jpg',
      twitterImage: '/images/blog/bella-journey-twitter.jpg'
    },
    relatedAnimals: ['bella'],
    allowComments: true,
    commentCount: 23,
    includeInNewsletter: true,
    newsletterSubject: 'Bella\'s Amazing Recovery Story'
  },

  {
    id: 'winter-shelter-upgrades-complete',
    title: 'Winter Shelter Upgrades Complete: Keeping Our Animals Warm and Safe',
    slug: 'winter-shelter-upgrades-complete',
    excerpt: 'Our $15,000 winter shelter improvement project is complete! See how new insulation, heating systems, and weatherproofing are keeping our 150+ animals comfortable through Central Oregon\'s harsh winters.',
    content: `
      <p>We're thrilled to announce that our winter shelter upgrade project is now complete! Thanks to the incredible generosity of our supporters, we've successfully raised $15,000 to implement critical improvements that will keep our animals safe and comfortable throughout Central Oregon's challenging winter months.</p>

      <h2>Why These Upgrades Were Necessary</h2>
      <p>Central Oregon winters can be brutal, with temperatures regularly dropping below freezing and heavy snowfall that can last for months. While many of our animals have natural adaptations for cold weather, providing proper shelter is essential for their health and well-being, especially for our older animals and those with health conditions.</p>

      <p>Our previous shelter systems, while functional, had several areas that needed improvement:</p>
      <ul>
        <li>Insufficient insulation in the pig and goat barns</li>
        <li>Drafty areas that let in cold air and moisture</li>
        <li>Inadequate backup heating systems for extreme weather events</li>
        <li>Poor ventilation that led to humidity buildup</li>
      </ul>

      <h2>Comprehensive Upgrade Plan</h2>
      <p>Working with local contractors who specialize in agricultural buildings, we developed a comprehensive plan to address all identified issues while maintaining the open, natural environment our animals love.</p>

      <h3>Insulation Improvements</h3>
      <p>We added high-quality, animal-safe insulation to all barn walls and ceilings. This eco-friendly insulation will reduce heat loss by an estimated 40% while remaining completely safe if animals come into contact with it.</p>

      <h3>Advanced Ventilation Systems</h3>
      <p>Proper ventilation is crucial for preventing respiratory issues while maintaining comfortable temperatures. We installed automatic ventilation systems that adjust based on temperature and humidity levels, ensuring optimal air quality year-round.</p>

      <h3>Radiant Floor Heating</h3>
      <p>In the medical barn and senior animal areas, we installed radiant floor heating systems. These energy-efficient systems provide gentle, consistent warmth from below, which is particularly beneficial for animals with arthritis or other joint issues.</p>

      <h3>Emergency Backup Systems</h3>
      <p>We installed a backup generator system that automatically kicks in during power outages, ensuring that heating and water systems remain operational even during severe weather events.</p>

      <h2>Immediate Impact</h2>
      <p>The results have been immediate and remarkable. Our animals are noticeably more comfortable, and we've already seen a reduction in winter-related health issues. Bella, our rescued pig, was particularly excited about the heated floors in the pig barn—she's claimed the warmest spot as her personal sleeping area!</p>

      <blockquote>
        <p>"The difference is night and day. Our animals are more active, eating better, and showing clear signs of comfort even on the coldest days. This upgrade will literally be a lifesaver during extreme weather events."</p>
        <cite>— Mike Thompson, Operations Manager</cite>
      </blockquote>

      <h2>Environmental Benefits</h2>
      <p>Beyond animal comfort, these upgrades have significant environmental benefits. The improved insulation and efficient heating systems have reduced our energy consumption by 35%, lowering both our carbon footprint and operating costs.</p>

      <p>The money saved on heating costs will be redirected to animal care, medical expenses, and future facility improvements, creating a positive cycle of sustainability and animal welfare.</p>

      <h2>Thanking Our Amazing Community</h2>
      <p>This project wouldn't have been possible without the incredible support of our community. Special thanks to:</p>
      <ul>
        <li>The Harmony Circle monthly donors who provided steady funding</li>
        <li>Central Oregon Construction Co. for donating labor and expertise</li>
        <li>Green Valley Feed Store for providing materials at cost</li>
        <li>Our volunteer construction crew who worked weekends to complete the project</li>
        <li>Every individual donor who contributed to our winter shelter fund</li>
      </ul>

      <h2>Looking Ahead</h2>
      <p>With our winter shelter needs now addressed, we're turning our attention to our spring projects. Next up is expanding the outdoor exercise areas for our larger animals and creating new enrichment spaces that will be ready for the warmer months ahead.</p>

      <p>If you're interested in supporting our upcoming projects or learning more about how your donations make a direct impact on animal lives, please visit our donation page or contact our development team.</p>

      <p>From all of us—both human and animal—at Harmony Farm Sanctuary, thank you for making these life-changing improvements possible!</p>
    `,
    author: getAuthorById('mike-thompson')!,
    category: getCategoryById('sanctuary-news')!,
    tags: [
      blogTags.find(t => t.id === 'winter-care')!,
      blogTags.find(t => t.id === 'fundraising')!
    ],
    featuredImage: '/images/blog/winter-shelter-complete.jpg',
    featuredImageAlt: 'Newly completed insulated barn with animals staying warm inside',
    gallery: [
      {
        type: 'image',
        url: '/images/blog/insulation-installation.jpg',
        alt: 'Workers installing insulation in barn walls',
        caption: 'Installing eco-friendly insulation throughout the pig and goat barns'
      },
      {
        type: 'image',
        url: '/images/blog/radiant-floor-heating.jpg', 
        alt: 'Radiant heating system being installed under barn floor',
        caption: 'Radiant floor heating installation in the medical barn'
      },
      {
        type: 'image',
        url: '/images/blog/animals-enjoying-warmth.jpg',
        alt: 'Bella and other animals comfortable in the heated barn',
        caption: 'Bella and friends enjoying the warmth of their upgraded shelter'
      }
    ],
    publishedAt: '2024-01-08T15:30:00Z',
    status: 'published',
    featured: true,
    readTime: 6,
    views: 1923,
    likes: 94,
    shares: 67,
    seo: {
      metaTitle: 'Winter Shelter Upgrades Complete at Harmony Farm Sanctuary',
      metaDescription: '$15,000 in winter shelter improvements keep 150+ rescued animals warm and safe through Central Oregon winters with new insulation and heating systems.',
      keywords: ['animal shelter', 'winter care', 'farm sanctuary improvements', 'animal welfare'],
      ogImage: '/images/blog/winter-shelter-og.jpg'
    },
    allowComments: true,
    commentCount: 18,
    includeInNewsletter: true,
    newsletterSubject: 'Winter Shelter Project Complete!'
  },

  {
    id: 'understanding-pig-intelligence-emotional-needs',
    title: 'Understanding Pig Intelligence and Emotional Needs',
    slug: 'understanding-pig-intelligence-emotional-needs',
    excerpt: 'Pigs are among the most intelligent animals on Earth, ranking higher than dogs in cognitive tests. Learn about the complex emotional lives of pigs and why proper care goes far beyond basic physical needs.',
    content: `
      <p>When most people think of pigs, they might picture simple farm animals rolling in mud. But the truth is far more complex and fascinating. Pigs are among the most intelligent animals on Earth, possessing cognitive abilities that rival and often exceed those of dogs, and emotional complexity that demands our respect and understanding.</p>

      <h2>Cognitive Abilities That Amaze</h2>
      <p>Scientific research has consistently shown that pigs possess remarkable cognitive abilities. They excel at problem-solving, have excellent long-term memories, and can learn complex tasks quickly. Here at Harmony Farm Sanctuary, we see evidence of this intelligence every day.</p>

      <h3>Problem-Solving Skills</h3>
      <p>Our resident pig Bella has mastered several puzzle feeders that challenge even the smartest dogs. She can navigate mazes, operate simple mechanisms, and has learned to associate specific sounds with feeding times. Recently, she figured out how to open a gate latch that we thought was pig-proof!</p>

      <h3>Tool Use and Planning</h3>
      <p>Pigs have been observed using tools in both wild and domestic settings. They use sticks to scratch hard-to-reach places and can plan ahead for future needs. In research settings, pigs have learned to play video games using joysticks and can recognize themselves in mirrors—a test of self-awareness that many animals fail.</p>

      <h3>Social Learning</h3>
      <p>Pigs learn from watching other pigs, demonstrating sophisticated social learning abilities. When we introduce a new pig to our herd, the established residents often "teach" newcomers the routines and rules of sanctuary life.</p>

      <h2>Complex Emotional Lives</h2>
      <p>Perhaps even more remarkable than their intelligence is the emotional depth of pigs. They experience a wide range of emotions including joy, grief, anxiety, and compassion.</p>

      <h3>Joy and Playfulness</h3>
      <p>Anyone who has watched pigs at play knows they experience genuine joy. They run, jump, and engage in social games with obvious delight. Our pigs have favorite toys and activities, and they clearly show excitement when presented with new enrichment opportunities.</p>

      <h3>Grief and Mourning</h3>
      <p>When we lost our beloved pig Rosie last year, her companion Hamlet displayed clear signs of grief. He refused to eat for several days, became withdrawn, and spent time at Rosie's favorite sleeping spot. This mourning behavior lasted for weeks and reminded us that pigs form deep emotional bonds.</p>

      <h3>Empathy and Compassion</h3>
      <p>Pigs show remarkable empathy for both other pigs and different species. When Bella was recovering from her rescue, Wilbur would lie near her enclosure for hours, providing what appeared to be emotional support. This kind of interspecies compassion is a hallmark of emotional intelligence.</p>

      <h2>Meeting Their Psychological Needs</h2>
      <p>Understanding pig intelligence and emotions is crucial for providing proper care. Physical needs like food, water, and shelter are just the beginning—pigs require mental stimulation and social interaction to thrive.</p>

      <h3>Environmental Enrichment</h3>
      <p>We provide our pigs with a variety of enrichment activities:</p>
      <ul>
        <li>Puzzle feeders that challenge their problem-solving abilities</li>
        <li>Rooting areas where they can express natural foraging behaviors</li>
        <li>Social spaces for interaction with other pigs</li>
        <li>Quiet areas where they can retreat when feeling overwhelmed</li>
        <li>Objects to manipulate and explore</li>
      </ul>

      <h3>Social Structure</h3>
      <p>Pigs naturally live in complex social groups with established hierarchies and relationships. At the sanctuary, we carefully manage our pig groups to ensure compatible personalities and provide space for natural social behaviors.</p>

      <h3>Individual Recognition</h3>
      <p>Each pig has a unique personality with individual preferences and quirks. Bella loves painting activities, Wilbur prefers puzzle feeders, and Hamlet is most interested in social interactions with visitors. Recognizing and catering to these individual differences is essential for their well-being.</p>

      <h2>The Ethics of Pig Farming</h2>
      <p>Understanding pig intelligence and emotions raises serious ethical questions about conventional pig farming. In industrial settings, pigs are typically confined in spaces so small they cannot turn around, denied the ability to express natural behaviors, and separated from their social groups.</p>

      <p>The cognitive and emotional capacities we observe daily at the sanctuary make it clear that pigs deserve far better treatment than they receive in industrial agriculture. They are individuals with complex inner lives, not commodities to be exploited.</p>

      <h2>What You Can Do</h2>
      <p>There are many ways to support pig welfare and acknowledge their intelligence:</p>

      <ul>
        <li>Consider reducing or eliminating pork consumption</li>
        <li>Support legislation that improves farm animal welfare standards</li>
        <li>Visit farm sanctuaries to see pig intelligence firsthand</li>
        <li>Share educational content about pig cognition and emotions</li>
        <li>Support organizations working to improve farm animal welfare</li>
      </ul>

      <h2>A Call for Recognition</h2>
      <p>The more we learn about pig intelligence and emotions, the more apparent it becomes that these remarkable animals deserve our respect, protection, and compassion. At Harmony Farm Sanctuary, every day brings new examples of pig wisdom, creativity, and emotional depth.</p>

      <p>By sharing their stories and educating others about pig intelligence, we hope to change perceptions and create a more compassionate world for all animals. These incredibly smart, emotional beings deserve nothing less than our full recognition of their worth and dignity.</p>

      <p>Come visit us to meet our pig residents and see their intelligence in action. We guarantee you'll never think about pigs the same way again.</p>
    `,
    author: getAuthorById('dr-emily-chen')!,
    category: getCategoryById('education')!,
    tags: [
      blogTags.find(t => t.id === 'pig-intelligence')!,
      blogTags.find(t => t.id === 'animal-behavior')!
    ],
    featuredImage: '/images/blog/pig-intelligence-hero.jpg',
    featuredImageAlt: 'Bella the pig working on a complex puzzle feeder',
    publishedAt: '2024-01-03T12:00:00Z',
    status: 'published',
    featured: false,
    readTime: 10,
    views: 3421,
    likes: 187,
    shares: 134,
    seo: {
      metaTitle: 'Pig Intelligence and Emotional Needs | Educational Content',
      metaDescription: 'Discover the remarkable intelligence and complex emotions of pigs. Learn why these cognitive abilities demand better treatment and care standards.',
      keywords: ['pig intelligence', 'animal cognition', 'pig emotions', 'animal welfare', 'farm animal intelligence'],
      ogImage: '/images/blog/pig-intelligence-og.jpg'
    },
    relatedAnimals: ['bella', 'wilbur'],
    allowComments: true,
    commentCount: 31,
    includeInNewsletter: true
  }

  // Additional blog posts would continue here...
];

// Helper functions for blog post management
export const getBlogPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};

export const getFeaturedBlogPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.featured && post.status === 'published');
};

export const getPublishedBlogPosts = (): BlogPost[] => {
  return blogPosts.filter(post => post.status === 'published');
};

export const getBlogPostsByCategory = (categoryId: string): BlogPost[] => {
  return blogPosts.filter(post => 
    post.category.id === categoryId && post.status === 'published'
  );
};

export const getBlogPostsByTag = (tagId: string): BlogPost[] => {
  return blogPosts.filter(post => 
    post.tags.some(tag => tag.id === tagId) && post.status === 'published'
  );
};

export const getBlogPostsByAuthor = (authorId: string): BlogPost[] => {
  return blogPosts.filter(post => 
    post.author.id === authorId && post.status === 'published'
  );
};

export const getRecentBlogPosts = (limit: number = 5): BlogPost[] => {
  return blogPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
};

export const getRelatedBlogPosts = (postId: string, limit: number = 3): BlogPost[] => {
  const post = getBlogPostById(postId);
  if (!post) return [];

  return blogPosts
    .filter(p => 
      p.id !== postId && 
      p.status === 'published' &&
      (p.category.id === post.category.id || 
       p.tags.some(tag => post.tags.some(postTag => postTag.id === tag.id)))
    )
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};

export const getMostPopularBlogPosts = (limit: number = 5): BlogPost[] => {
  return blogPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};



// Update tag counts based on published posts
export const updateTagCounts = (): void => {
  blogTags.forEach(tag => {
    tag.count = blogPosts.filter(post => 
      post.status === 'published' && 
      post.tags.some(postTag => postTag.id === tag.id)
    ).length;
  });
};