import { VolunteerRole, VolunteerStats, VolunteerTestimonial, VolunteerEvent } from '../types/volunteer';

// Re-export types for convenience
export type { VolunteerRole, VolunteerStats, VolunteerTestimonial, VolunteerEvent };

export const volunteerRoles: VolunteerRole[] = [
  {
    id: 'animal-care-daily',
    title: 'Daily Animal Care Assistant',
    category: 'animal-care',
    description: 'Provide direct care to our rescued animals including feeding, cleaning, grooming, and basic health monitoring. Perfect for animal lovers who want hands-on experience.',
    responsibilities: [
      'Feed animals according to individual dietary requirements',
      'Clean and maintain animal living spaces',
      'Provide fresh water and bedding',
      'Monitor animal health and behavior',
      'Assist with basic grooming and health checks',
      'Document daily observations and care activities',
      'Help socialize animals and provide enrichment activities'
    ],
    timeCommitment: '4-6 hours per shift',
    schedule: 'Morning (7-11 AM) or Evening (4-8 PM) shifts available',
    requirements: [
      'Physical ability to lift 50+ pounds',
      'Comfortable working outdoors in all weather',
      'Reliable transportation',
      'Commitment to at least 6 months of regular volunteering'
    ],
    training: [
      'Animal handling and safety protocols',
      'Species-specific care requirements',
      'Health monitoring and reporting procedures',
      'Emergency response procedures',
      'Equipment use and maintenance'
    ],
    physicalRequirements: 'Moderate to high physical activity including lifting, walking, and outdoor work',
    minimumAge: 16,
    backgroundCheck: true,
    skillsNeeded: ['Animal handling', 'Physical fitness', 'Attention to detail', 'Reliability'],
    benefits: [
      'Direct impact on animal welfare',
      'Learn animal husbandry skills',
      'Build relationships with rescued animals',
      'Work alongside experienced sanctuary staff',
      'Flexible scheduling options'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1560743173-567a3b5658b1?w=600&h=400&fit=crop',
    isActive: true,
    contactPerson: 'Sarah Thompson, Animal Care Manager',
    urgency: 'high'
  },
  {
    id: 'education-outreach',
    title: 'Education & Outreach Coordinator',
    category: 'education',
    description: 'Help educate the public about animal welfare, sanctuary operations, and compassionate living through tours, presentations, and community events.',
    responsibilities: [
      'Lead public tours and share animal stories',
      'Assist with educational programs for schools and groups',
      'Help create educational materials and displays',
      'Support community outreach events and fundraisers',
      'Engage with visitors and answer questions about sanctuary life',
      'Maintain educational resource library',
      'Support social media content creation'
    ],
    timeCommitment: '3-4 hours per shift',
    schedule: 'Weekends and weekdays, tours typically 10 AM - 4 PM',
    requirements: [
      'Strong communication and public speaking skills',
      'Passion for animal welfare education',
      'Comfortable interacting with diverse groups',
      'Basic knowledge of farm animal care and welfare'
    ],
    training: [
      'Sanctuary history and mission',
      'Animal stories and welfare facts',
      'Tour route and safety protocols',
      'Public speaking and engagement techniques',
      'Emergency procedures for visitor groups'
    ],
    physicalRequirements: 'Light physical activity, primarily walking and standing',
    minimumAge: 18,
    backgroundCheck: true,
    skillsNeeded: ['Public speaking', 'Teaching/mentoring', 'Customer service', 'Animal knowledge'],
    benefits: [
      'Develop public speaking and education skills',
      'Make direct impact on animal welfare awareness',
      'Flexible weekend and weekday options',
      'Work with diverse community groups',
      'Build presentation and communication skills'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop',
    isActive: true,
    contactPerson: 'Mike Thompson, Education Director',
    urgency: 'medium'
  },
  {
    id: 'administrative-support',
    title: 'Administrative Support Volunteer',
    category: 'administration',
    description: 'Provide essential behind-the-scenes support with office tasks, data entry, communications, and general administrative duties that keep the sanctuary running smoothly.',
    responsibilities: [
      'Data entry and database management',
      'Answer phones and respond to emails',
      'Assist with volunteer coordination',
      'Help with social media content and scheduling',
      'Process donations and maintain donor records',
      'Support event planning and coordination',
      'File management and office organization'
    ],
    timeCommitment: '2-4 hours per shift',
    schedule: 'Flexible weekdays and some weekend hours available',
    requirements: [
      'Basic computer skills (Microsoft Office, email, internet)',
      'Strong attention to detail and organizational skills',
      'Reliable and consistent availability',
      'Professional phone manner and communication skills'
    ],
    training: [
      'Sanctuary database and software systems',
      'Phone and email protocols',
      'Donor communication guidelines',
      'Social media best practices',
      'Privacy and confidentiality procedures'
    ],
    physicalRequirements: 'Light physical activity, primarily sitting and computer work',
    minimumAge: 16,
    backgroundCheck: true,
    skillsNeeded: ['Computer skills', 'Communication', 'Organization', 'Multitasking'],
    benefits: [
      'Develop professional administrative skills',
      'Work in comfortable indoor environment',
      'Flexible scheduling and remote work options',
      'Support all aspects of sanctuary operations',
      'Build nonprofit and database management experience'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    isActive: true,
    contactPerson: 'Lisa Chen, Operations Manager',
    urgency: 'medium'
  },
  {
    id: 'maintenance-grounds',
    title: 'Grounds & Facility Maintenance',
    category: 'maintenance',
    description: 'Help maintain and improve sanctuary facilities, fencing, buildings, and grounds to ensure a safe and beautiful environment for animals and visitors.',
    responsibilities: [
      'General grounds maintenance and landscaping',
      'Fence repair and installation',
      'Building maintenance and minor repairs',
      'Equipment maintenance and cleaning',
      'Seasonal cleanup and preparation',
      'Construction projects for animal shelters and facilities',
      'Tool maintenance and organization'
    ],
    timeCommitment: '4-8 hours per shift',
    schedule: 'Primarily weekends and weekdays, weather permitting',
    requirements: [
      'Basic construction and maintenance skills',
      'Physical ability for outdoor manual labor',
      'Bring own tools when possible',
      'Reliable transportation for equipment transport'
    ],
    training: [
      'Sanctuary safety protocols',
      'Tool use and safety procedures',
      'Animal area safety considerations',
      'Project planning and coordination',
      'Emergency procedures'
    ],
    physicalRequirements: 'High physical activity including lifting, construction, and outdoor labor',
    minimumAge: 18,
    backgroundCheck: true,
    skillsNeeded: ['Construction', 'Manual labor', 'Problem-solving', 'Tool operation'],
    benefits: [
      'Develop construction and maintenance skills',
      'See immediate results of your work',
      'Work on meaningful infrastructure projects',
      'Flexible weekend project schedule',
      'Build friendships with like-minded volunteers'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop',
    isActive: true,
    contactPerson: 'Robert Martinez, Facilities Manager',
    urgency: 'high'
  },
  {
    id: 'event-fundraising',
    title: 'Event & Fundraising Support',
    category: 'events',
    description: 'Help organize and execute sanctuary events, fundraisers, and community gatherings that raise awareness and funds for animal care.',
    responsibilities: [
      'Event setup, coordination, and breakdown',
      'Volunteer coordination during events',
      'Fundraising booth management',
      'Registration and check-in assistance',
      'Photography and social media support',
      'Vendor and sponsor coordination',
      'Post-event cleanup and follow-up'
    ],
    timeCommitment: '4-8 hours per event',
    schedule: 'Primarily weekends and special event dates',
    requirements: [
      'Strong organizational and people skills',
      'Flexibility and ability to work under pressure',
      'Comfortable interacting with public and donors',
      'Available for weekend and evening events'
    ],
    training: [
      'Event planning and coordination',
      'Fundraising best practices',
      'Customer service and donor relations',
      'Emergency procedures for events',
      'Social media and photography guidelines'
    ],
    physicalRequirements: 'Moderate physical activity including setup, standing, and walking',
    minimumAge: 16,
    backgroundCheck: true,
    skillsNeeded: ['Event planning', 'Customer service', 'Organization', 'Teamwork'],
    benefits: [
      'Develop event planning and fundraising skills',
      'Network with community members and donors',
      'See direct impact on sanctuary fundraising',
      'Flexible event-based scheduling',
      'Gain experience in nonprofit event management'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=400&fit=crop',
    isActive: true,
    contactPerson: 'Jennifer Walsh, Development Coordinator',
    urgency: 'low'
  },
  {
    id: 'specialized-medical',
    title: 'Veterinary & Medical Support',
    category: 'animal-care',
    description: 'Assist veterinary staff with medical care, rehabilitation, and health monitoring of sanctuary animals. Requires veterinary experience or willingness to learn.',
    responsibilities: [
      'Assist with veterinary examinations and procedures',
      'Administer medications under supervision',
      'Monitor animals during recovery',
      'Maintain medical records and documentation',
      'Prepare medical supplies and equipment',
      'Support rehabilitation exercises',
      'Help with quarantine and isolation protocols'
    ],
    timeCommitment: '3-5 hours per shift',
    schedule: 'Flexible, including some weekend and emergency availability',
    requirements: [
      'Veterinary assistant or veterinary technology training preferred',
      'Animal handling experience required',
      'Detail-oriented with strong observation skills',
      'Comfort with medical procedures and animal health issues'
    ],
    training: [
      'Sanctuary medical protocols and procedures',
      'Species-specific medical considerations',
      'Medication administration and safety',
      'Medical equipment use and maintenance',
      'Emergency response procedures'
    ],
    physicalRequirements: 'Moderate physical activity with precise manual dexterity required',
    minimumAge: 18,
    backgroundCheck: true,
    skillsNeeded: ['Veterinary knowledge', 'Animal handling', 'Medical assistance', 'Record keeping'],
    benefits: [
      'Gain valuable veterinary experience',
      'Work directly with qualified veterinary staff',
      'Make critical impact on animal health',
      'Develop specialized animal medical skills',
      'Flexible scheduling around veterinary procedures'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=600&h=400&fit=crop',
    isActive: true,
    contactPerson: 'Dr. Amanda Foster, Staff Veterinarian',
    urgency: 'high'
  }
];

export const volunteerStats: VolunteerStats = {
  totalActiveVolunteers: 127,
  monthlyVolunteers: 89,
  totalVolunteerHours: 8450,
  averageHoursPerVolunteer: 12.5,
  retentionRate: 0.78,
  mostNeededRoles: ['animal-care-daily', 'maintenance-grounds', 'specialized-medical']
};

export const volunteerTestimonials: VolunteerTestimonial[] = [
  {
    id: 'testimonial-sarah-k',
    name: 'Sarah K.',
    role: 'Daily Animal Care Assistant',
    quote: "Volunteering at Harmony Farm has been life-changing. Every day I get to make a direct difference in the lives of these incredible animals. The training was excellent and the staff support makes every volunteer feel valued.",
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop',
    yearsVolunteering: 2,
    favoriteAspect: 'Building relationships with the rescued animals',
    backgroundStory: 'Started volunteering after retirement, now volunteers 3 days per week and has become a mentor for new volunteers.'
  },
  {
    id: 'testimonial-marcus-r',
    name: 'Marcus R.',
    role: 'Education & Outreach Coordinator',
    quote: "Leading tours and sharing these animals' stories with visitors is incredibly rewarding. I've improved my public speaking skills while helping people understand the importance of animal welfare.",
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
    yearsVolunteering: 1,
    favoriteAspect: 'Educating children about compassionate living',
    backgroundStory: 'College student studying environmental science, uses volunteer experience for class projects and career development.'
  },
  {
    id: 'testimonial-jennifer-l',
    name: 'Jennifer L.',
    role: 'Administrative Support Volunteer',
    quote: "Working behind the scenes gives me flexibility to help while developing professional skills. The team is welcoming and every task feels meaningful to the sanctuary's mission.",
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    yearsVolunteering: 3,
    favoriteAspect: 'Supporting the entire sanctuary operation',
    backgroundStory: 'Remote worker who volunteers during lunch breaks and evenings, helping with database management and communications.'
  },
  {
    id: 'testimonial-david-m',
    name: 'David M.',
    role: 'Grounds & Facility Maintenance',
    quote: "Using my construction skills to build better lives for these animals is incredibly fulfilling. Every fence we repair and shelter we build directly improves animal welfare.",
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    yearsVolunteering: 4,
    favoriteAspect: 'Building lasting infrastructure for animal care',
    backgroundStory: 'Retired contractor who leads weekend work parties and has helped build most of the current animal shelters.'
  }
];

export const upcomingVolunteerEvents: VolunteerEvent[] = [
  {
    id: 'orientation-january',
    title: 'New Volunteer Orientation',
    description: 'Comprehensive introduction to sanctuary operations, animal care protocols, and volunteer opportunities. Includes tour and meet-and-greet with staff.',
    date: '2024-01-15',
    time: '10:00 AM - 2:00 PM',
    location: 'Sanctuary Education Center',
    volunteersNeeded: 20,
    volunteersRegistered: 12,
    skills: ['No experience required'],
    contactPerson: 'Sarah Thompson',
    isRecurring: true,
    category: 'orientation'
  },
  {
    id: 'barn-workday',
    title: 'Barn Renovation Work Day',
    description: 'Community work day to renovate and improve animal housing facilities. Breakfast and lunch provided for all volunteers.',
    date: '2024-01-22',
    time: '8:00 AM - 4:00 PM',
    location: 'Main Barn Area',
    volunteersNeeded: 15,
    volunteersRegistered: 8,
    skills: ['Construction', 'Manual labor', 'Tool operation'],
    contactPerson: 'Robert Martinez',
    isRecurring: false,
    category: 'work-party'
  },
  {
    id: 'animal-care-training',
    title: 'Advanced Animal Care Training',
    description: 'Specialized training for experienced volunteers covering advanced animal handling, health monitoring, and emergency procedures.',
    date: '2024-01-29',
    time: '1:00 PM - 5:00 PM',
    location: 'Training Room & Animal Areas',
    volunteersNeeded: 12,
    volunteersRegistered: 10,
    skills: ['Previous animal care experience'],
    contactPerson: 'Dr. Amanda Foster',
    isRecurring: false,
    category: 'training'
  }
];

// Helper functions
export const getVolunteerRoleById = (id: string): VolunteerRole | undefined => {
  return volunteerRoles.find(role => role.id === id);
};

export const getVolunteerRolesByCategory = (category: VolunteerRole['category']): VolunteerRole[] => {
  return volunteerRoles.filter(role => role.category === category && role.isActive);
};

export const getActiveVolunteerRoles = (): VolunteerRole[] => {
  return volunteerRoles.filter(role => role.isActive);
};

export const getUrgentVolunteerRoles = (): VolunteerRole[] => {
  return volunteerRoles.filter(role => role.urgency === 'high' && role.isActive);
};

export const getVolunteerRolesBySkill = (skill: string): VolunteerRole[] => {
  return volunteerRoles.filter(role => 
    role.skillsNeeded.some(s => s.toLowerCase().includes(skill.toLowerCase())) && role.isActive
  );
};