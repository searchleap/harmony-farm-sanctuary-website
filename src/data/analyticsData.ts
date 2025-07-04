// Analytics Sample Data for Harmony Farm Sanctuary Admin
import { AnalyticsMetric, SanctuaryMetrics, ContentAnalytics, DonationAnalytics, AnalyticsChart, AnalyticsDashboardData } from '../types/analytics';

export const sanctuaryMetrics: SanctuaryMetrics = {
  animals: {
    total: 247,
    newRescues: 23,
    adoptions: 8,
    medical: 12,
    species: {
      'Cattle': 89,
      'Pigs': 67,
      'Goats': 45,
      'Chickens': 32,
      'Sheep': 14
    }
  },
  volunteers: {
    active: 156,
    newSignups: 18,
    hours: 2847,
    retention: 87.3
  },
  donations: {
    total: 125670,
    recurring: 89250,
    oneTime: 36420,
    averageAmount: 127.50,
    donorCount: 892
  },
  content: {
    pageViews: 45230,
    blogPosts: 12,
    faqViews: 8920,
    resourceDownloads: 1240
  },
  engagement: {
    newsletter: 3420,
    socialMedia: 12450,
    eventAttendance: 234,
    volunteerApplications: 47
  }
};

export const kpiMetrics: AnalyticsMetric[] = [
  {
    id: 'total-animals',
    name: 'Total Animals',
    value: 247,
    previousValue: 241,
    change: 2.49,
    changeType: 'increase',
    format: 'number',
    icon: 'Heart',
    color: 'text-green-600'
  },
  {
    id: 'monthly-donations',
    name: 'Monthly Donations',
    value: 125670,
    previousValue: 118230,
    change: 6.29,
    changeType: 'increase',
    format: 'currency',
    icon: 'DollarSign',
    color: 'text-blue-600'
  },
  {
    id: 'active-volunteers',
    name: 'Active Volunteers',
    value: 156,
    previousValue: 149,
    change: 4.70,
    changeType: 'increase',
    format: 'number',
    icon: 'Users',
    color: 'text-purple-600'
  },
  {
    id: 'adoption-rate',
    name: 'Adoption Rate',
    value: 12.5,
    previousValue: 10.8,
    change: 15.74,
    changeType: 'increase',
    format: 'percentage',
    icon: 'TrendingUp',
    color: 'text-orange-600'
  },
  {
    id: 'website-traffic',
    name: 'Website Visitors',
    value: 45230,
    previousValue: 42180,
    change: 7.23,
    changeType: 'increase',
    format: 'number',
    icon: 'Globe',
    color: 'text-indigo-600'
  },
  {
    id: 'volunteer-hours',
    name: 'Volunteer Hours',
    value: 2847,
    previousValue: 2650,
    change: 7.43,
    changeType: 'increase',
    format: 'number',
    icon: 'Clock',
    color: 'text-teal-600'
  }
];

export const topContent: ContentAnalytics[] = [
  {
    id: 'bella-story',
    title: 'Bella\'s Rescue Story: From Dairy Farm to Sanctuary',
    type: 'blog',
    views: 8420,
    uniqueViews: 7230,
    timeOnPage: 245,
    bounceRate: 23.5,
    shares: 342,
    rating: 4.8,
    publishDate: '2024-01-15',
    lastUpdated: '2024-01-16'
  },
  {
    id: 'visiting-faq',
    title: 'Visiting the Sanctuary - Frequently Asked Questions',
    type: 'faq',
    views: 5680,
    uniqueViews: 4920,
    timeOnPage: 180,
    bounceRate: 18.2,
    shares: 89,
    rating: 4.6,
    publishDate: '2024-01-10',
    lastUpdated: '2024-01-20'
  },
  {
    id: 'animal-care-guide',
    title: 'Farm Animal Care Guidelines',
    type: 'resource',
    views: 3240,
    uniqueViews: 2890,
    timeOnPage: 320,
    bounceRate: 15.8,
    shares: 156,
    downloads: 420,
    rating: 4.9,
    publishDate: '2024-01-05',
    lastUpdated: '2024-01-12'
  },
  {
    id: 'volunteer-handbook',
    title: 'Volunteer Handbook and Safety Guidelines',
    type: 'resource',
    views: 2890,
    uniqueViews: 2450,
    timeOnPage: 410,
    bounceRate: 12.3,
    shares: 78,
    downloads: 380,
    rating: 4.7,
    publishDate: '2024-01-08',
    lastUpdated: '2024-01-18'
  },
  {
    id: 'sanctuary-mission',
    title: 'Our Mission and Values',
    type: 'page',
    views: 2340,
    uniqueViews: 2120,
    timeOnPage: 165,
    bounceRate: 28.4,
    shares: 45,
    rating: 4.5,
    publishDate: '2024-01-01',
    lastUpdated: '2024-01-15'
  }
];

export const donationAnalytics: DonationAnalytics[] = [
  {
    period: 'January 2024',
    totalAmount: 125670,
    donorCount: 892,
    averageDonation: 140.85,
    recurringDonations: 89250,
    oneTimeDonations: 36420,
    paymentMethods: {
      'Credit Card': 67,
      'PayPal': 23,
      'Bank Transfer': 8,
      'Crypto': 2
    },
    campaigns: [
      { name: 'Winter Feed Drive', raised: 23450, goal: 25000, donors: 234 },
      { name: 'Medical Care Fund', raised: 18920, goal: 20000, donors: 189 },
      { name: 'Sanctuary Expansion', raised: 45670, goal: 75000, donors: 156 }
    ]
  }
];

export const analyticsCharts: AnalyticsChart[] = [
  {
    id: 'donations-trend',
    title: 'Monthly Donations Trend',
    type: 'line',
    metrics: ['donations'],
    timeRange: {
      start: new Date('2023-07-01'),
      end: new Date('2024-01-31'),
      preset: 'custom'
    },
    data: [
      { date: '2023-08', value: 98450, label: 'August' },
      { date: '2023-09', value: 102340, label: 'September' },
      { date: '2023-10', value: 108920, label: 'October' },
      { date: '2023-11', value: 115670, label: 'November' },
      { date: '2023-12', value: 134590, label: 'December' },
      { date: '2024-01', value: 125670, label: 'January' }
    ]
  },
  {
    id: 'volunteer-hours',
    title: 'Volunteer Hours by Month',
    type: 'bar',
    metrics: ['volunteer-hours'],
    timeRange: {
      start: new Date('2023-07-01'),
      end: new Date('2024-01-31'),
      preset: 'custom'
    },
    data: [
      { date: '2023-08', value: 2340, label: 'August' },
      { date: '2023-09', value: 2580, label: 'September' },
      { date: '2023-10', value: 2720, label: 'October' },
      { date: '2023-11', value: 2650, label: 'November' },
      { date: '2023-12', value: 2890, label: 'December' },
      { date: '2024-01', value: 2847, label: 'January' }
    ]
  },
  {
    id: 'animal-breakdown',
    title: 'Animal Population by Species',
    type: 'pie',
    metrics: ['animals'],
    timeRange: {
      start: new Date('2024-01-01'),
      end: new Date('2024-01-31'),
      preset: 'today'
    },
    data: [
      { date: '2024-01', value: 89, label: 'Cattle', category: 'cattle' },
      { date: '2024-01', value: 67, label: 'Pigs', category: 'pigs' },
      { date: '2024-01', value: 45, label: 'Goats', category: 'goats' },
      { date: '2024-01', value: 32, label: 'Chickens', category: 'chickens' },
      { date: '2024-01', value: 14, label: 'Sheep', category: 'sheep' }
    ]
  }
];

export const dashboardData: AnalyticsDashboardData = {
  sanctuary: sanctuaryMetrics,
  charts: analyticsCharts,
  topContent: topContent,
  recentDonations: donationAnalytics,
  lastUpdated: new Date('2024-01-28T10:30:00Z')
};

// Helper functions for analytics data formatting
export const formatMetricValue = (value: number, format: string): string => {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(value);
  }
};

export const formatChangeValue = (change: number): string => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
};

export const getChangeIcon = (changeType: string): string => {
  switch (changeType) {
    case 'increase':
      return 'TrendingUp';
    case 'decrease':
      return 'TrendingDown';
    case 'neutral':
    default:
      return 'Minus';
  }
};

export const getChangeColor = (changeType: string): string => {
  switch (changeType) {
    case 'increase':
      return 'text-green-600';
    case 'decrease':
      return 'text-red-600';
    case 'neutral':
    default:
      return 'text-gray-600';
  }
};