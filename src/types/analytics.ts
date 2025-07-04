// Analytics Type Definitions for Harmony Farm Sanctuary Admin
export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'number' | 'currency' | 'percentage';
  icon: string;
  color: string;
}

export interface AnalyticsTimeRange {
  start: Date;
  end: Date;
  preset: 'today' | '7days' | '30days' | '90days' | '1year' | 'custom';
}

export interface AnalyticsFilter {
  category: string[];
  dateRange: AnalyticsTimeRange;
  metrics: string[];
  groupBy: 'day' | 'week' | 'month' | 'quarter';
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

export interface AnalyticsChart {
  id: string;
  title: string;
  type: 'line' | 'bar' | 'pie' | 'area' | 'donut';
  data: ChartDataPoint[];
  metrics: string[];
  timeRange: AnalyticsTimeRange;
}

export interface SanctuaryMetrics {
  animals: {
    total: number;
    newRescues: number;
    adoptions: number;
    medical: number;
    species: Record<string, number>;
  };
  volunteers: {
    active: number;
    newSignups: number;
    hours: number;
    retention: number;
  };
  donations: {
    total: number;
    recurring: number;
    oneTime: number;
    averageAmount: number;
    donorCount: number;
  };
  content: {
    pageViews: number;
    blogPosts: number;
    faqViews: number;
    resourceDownloads: number;
  };
  engagement: {
    newsletter: number;
    socialMedia: number;
    eventAttendance: number;
    volunteerApplications: number;
  };
}

export interface ContentAnalytics {
  id: string;
  title: string;
  type: 'blog' | 'faq' | 'resource' | 'page';
  views: number;
  uniqueViews: number;
  timeOnPage: number;
  bounceRate: number;
  shares: number;
  downloads?: number;
  rating?: number;
  publishDate: string;
  lastUpdated: string;
}

export interface DonationAnalytics {
  period: string;
  totalAmount: number;
  donorCount: number;
  averageDonation: number;
  recurringDonations: number;
  oneTimeDonations: number;
  paymentMethods: Record<string, number>;
  campaigns: Array<{
    name: string;
    raised: number;
    goal: number;
    donors: number;
  }>;
}

export interface AnalyticsExport {
  format: 'csv' | 'pdf' | 'excel' | 'json';
  data: any[];
  filename: string;
  columns: string[];
  filters: AnalyticsFilter;
  generatedAt: Date;
}

export interface AnalyticsDashboardData {
  sanctuary: SanctuaryMetrics;
  charts: AnalyticsChart[];
  topContent: ContentAnalytics[];
  recentDonations: DonationAnalytics[];
  lastUpdated: Date;
}