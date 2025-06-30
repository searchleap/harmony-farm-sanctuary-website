// Author Profiles for Harmony Farm Sanctuary Blog
// Real sanctuary staff and volunteer contributor profiles

import { Author } from '../types/blog';

export const authors: Author[] = [
  {
    id: 'sarah-thompson',
    name: 'Sarah Thompson',
    role: 'Founder & Executive Director',
    bio: 'Sarah founded Harmony Farm Sanctuary in 2018 with a vision of creating a safe haven for farm animals while educating the community about animal welfare and compassionate living. With over 15 years of experience in animal rescue and a background in veterinary science, she leads the sanctuary\'s mission with passion and expertise.',
    image: '/images/team/sarah-thompson.jpg',
    email: 'sarah@harmonyfarm.org',
    social: {
      twitter: '@SarahHarmonyFarm',
      linkedin: 'sarah-thompson-sanctuary',
      instagram: '@sarahharmonyfarm'
    },
    yearsAtSanctuary: 6,
    specialties: [
      'Animal Rescue',
      'Sanctuary Operations',
      'Veterinary Care',
      'Community Outreach',
      'Fundraising',
      'Animal Welfare Policy'
    ]
  },
  {
    id: 'mike-thompson',
    name: 'Mike Thompson',
    role: 'Co-Founder & Operations Manager',
    bio: 'Mike co-founded Harmony Farm Sanctuary alongside Sarah, bringing his background in sustainable agriculture and construction to create the perfect environment for rescued animals. He oversees daily operations, facility maintenance, and the sanctuary\'s educational programs.',
    image: '/images/team/mike-thompson.jpg',
    email: 'mike@harmonyfarm.org',
    social: {
      instagram: '@mikeharmonyfarm',
      linkedin: 'mike-thompson-sanctuary'
    },
    yearsAtSanctuary: 6,
    specialties: [
      'Facility Management',
      'Sustainable Agriculture',
      'Educational Programs',
      'Construction & Maintenance',
      'Animal Behavior',
      'Volunteer Coordination'
    ]
  },
  {
    id: 'dr-emily-chen',
    name: 'Dr. Emily Chen',
    role: 'Veterinary Director',
    bio: 'Dr. Chen joined Harmony Farm Sanctuary in 2020, bringing specialized expertise in farm animal medicine and surgery. She oversees all medical care for the sanctuary\'s animals and works closely with local veterinary colleges to advance farm animal welfare research.',
    image: '/images/team/dr-emily-chen.jpg',
    email: 'emily@harmonyfarm.org',
    social: {
      linkedin: 'dr-emily-chen-dvm',
      twitter: '@DrChenVet'
    },
    yearsAtSanctuary: 4,
    specialties: [
      'Veterinary Medicine',
      'Farm Animal Surgery',
      'Animal Nutrition',
      'Medical Research',
      'Veterinary Education',
      'Emergency Care'
    ]
  },
  {
    id: 'jessica-martinez',
    name: 'Jessica Martinez',
    role: 'Animal Care Coordinator',
    bio: 'Jessica has been with Harmony Farm Sanctuary since 2019, working her way up from volunteer to Animal Care Coordinator. She has a deep understanding of each animal\'s individual needs and personalities, and specializes in animal enrichment and behavioral assessment.',
    image: '/images/team/jessica-martinez.jpg',
    email: 'jessica@harmonyfarm.org',
    social: {
      instagram: '@jessicaanimalcare',
      twitter: '@JessHarmonyFarm'
    },
    yearsAtSanctuary: 5,
    specialties: [
      'Animal Behavior',
      'Enrichment Programs',
      'Daily Animal Care',
      'New Animal Integration',
      'Volunteer Training',
      'Animal Socialization'
    ]
  },
  {
    id: 'david-kim',
    name: 'David Kim',
    role: 'Education & Outreach Manager',
    bio: 'David joined the sanctuary in 2021 to develop and lead educational programs. With a background in environmental education and a passion for animal welfare, he creates engaging content and experiences that help visitors understand the importance of compassionate living.',
    image: '/images/team/david-kim.jpg',
    email: 'david@harmonyfarm.org',
    social: {
      twitter: '@DavidHarmonyEd',
      linkedin: 'david-kim-education',
      instagram: '@davidharmonyeducation'
    },
    yearsAtSanctuary: 3,
    specialties: [
      'Educational Programming',
      'Public Speaking',
      'Content Creation',
      'School Partnerships',
      'Community Workshops',
      'Digital Media'
    ]
  },
  {
    id: 'maria-rodriguez',
    name: 'Maria Rodriguez',
    role: 'Development Director',
    bio: 'Maria brings over 12 years of nonprofit fundraising experience to Harmony Farm Sanctuary. She joined in 2022 to lead development efforts and has been instrumental in securing major grants and building lasting relationships with donors and corporate partners.',
    image: '/images/team/maria-rodriguez.jpg',
    email: 'maria@harmonyfarm.org',
    social: {
      linkedin: 'maria-rodriguez-development',
      twitter: '@MariaHarmonyDev'
    },
    yearsAtSanctuary: 2,
    specialties: [
      'Fundraising Strategy',
      'Grant Writing',
      'Donor Relations',
      'Corporate Partnerships',
      'Event Planning',
      'Foundation Relations'
    ]
  },
  {
    id: 'alex-foster',
    name: 'Alex Foster',
    role: 'Volunteer Coordinator',
    bio: 'Alex started as a weekend volunteer in 2020 and quickly became an integral part of the team. Now serving as Volunteer Coordinator, Alex manages our incredible community of over 500 volunteers and ensures everyone has meaningful opportunities to contribute to the sanctuary\'s mission.',
    image: '/images/team/alex-foster.jpg',
    email: 'alex@harmonyfarm.org',
    social: {
      instagram: '@alexharmonyvol',
      facebook: 'AlexHarmonyVolunteers'
    },
    yearsAtSanctuary: 4,
    specialties: [
      'Volunteer Management',
      'Training Development',
      'Event Coordination',
      'Community Building',
      'Social Media',
      'Youth Programs'
    ]
  },
  {
    id: 'robert-williams',
    name: 'Robert Williams',
    role: 'Senior Volunteer & Blog Contributor',
    bio: 'Robert has been volunteering at Harmony Farm Sanctuary for over 4 years and has become one of our most dedicated team members. As a retired teacher, he brings valuable perspective to our educational content and regularly contributes thoughtful articles about animal welfare and sanctuary life.',
    image: '/images/team/robert-williams.jpg',
    email: 'robert.volunteer@harmonyfarm.org',
    social: {
      facebook: 'RobertHarmonyFarm'
    },
    yearsAtSanctuary: 4,
    specialties: [
      'Educational Content',
      'Animal Stories',
      'Volunteer Mentoring',
      'Photography',
      'Writing',
      'Historical Documentation'
    ]
  }
];

// Helper functions for author management
export const getAuthorById = (id: string): Author | undefined => {
  return authors.find(author => author.id === id);
};

export const getAuthorByRole = (role: string): Author[] => {
  return authors.filter(author => 
    author.role.toLowerCase().includes(role.toLowerCase())
  );
};

export const getStaffAuthors = (): Author[] => {
  return authors.filter(author => 
    !author.role.toLowerCase().includes('volunteer')
  );
};

export const getVolunteerAuthors = (): Author[] => {
  return authors.filter(author => 
    author.role.toLowerCase().includes('volunteer')
  );
};

export const getAuthorsBySpecialty = (specialty: string): Author[] => {
  return authors.filter(author =>
    author.specialties.some(s => 
      s.toLowerCase().includes(specialty.toLowerCase())
    )
  );
};

export const getAuthorsSortedByTenure = (): Author[] => {
  return [...authors].sort((a, b) => b.yearsAtSanctuary - a.yearsAtSanctuary);
};

// Default author for system-generated content
export const getDefaultAuthor = (): Author => {
  return getAuthorById('sarah-thompson') || authors[0];
};