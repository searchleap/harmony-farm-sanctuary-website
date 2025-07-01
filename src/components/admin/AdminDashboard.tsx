import React from 'react';
import { 
  Heart, 
  FileText, 
  Users, 
  Mail, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { animals } from '../../data/animals';
import { blogPosts } from '../../data/blogPosts';
import { faqs } from '../../data/faqs';
import { educationalResources } from '../../data/educationalResources';
import { volunteerRoles } from '../../data/volunteerRoles';

const AdminDashboard: React.FC = () => {
  const { user } = useAdminAuth();

  // Calculate statistics from existing data
  const stats = {
    totalAnimals: animals.length,
    totalBlogPosts: blogPosts.length,
    totalFAQs: faqs.length,
    totalResources: educationalResources.length,
    totalVolunteers: volunteerRoles.reduce((sum, role) => sum + role.currentVolunteers, 0),
    pendingApplications: 5, // Mock data
    unreadInquiries: 8, // Mock data
    thisMonthDonations: 15420, // Mock data
  };

  const dashboardCards = [
    {
      title: 'Animals',
      value: stats.totalAnimals,
      change: '+2 this month',
      changeType: 'increase' as const,
      icon: <Heart className="h-6 w-6" />,
      color: 'bg-pink-500',
      description: 'Rescued animals in care'
    },
    {
      title: 'Blog Posts',
      value: stats.totalBlogPosts,
      change: '+1 this week',
      changeType: 'increase' as const,
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-blue-500',
      description: 'Published articles'
    },
    {
      title: 'Volunteers',
      value: stats.totalVolunteers,
      change: '+3 this month',
      changeType: 'increase' as const,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-green-500',
      description: 'Active volunteers'
    },
    {
      title: 'Inquiries',
      value: stats.unreadInquiries,
      change: 'Needs attention',
      changeType: 'alert' as const,
      icon: <Mail className="h-6 w-6" />,
      color: 'bg-orange-500',
      description: 'Unread messages'
    },
    {
      title: 'Donations',
      value: `$${stats.thisMonthDonations.toLocaleString()}`,
      change: '+12% this month',
      changeType: 'increase' as const,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-emerald-500',
      description: 'Monthly donations'
    },
    {
      title: 'Resources',
      value: stats.totalResources,
      change: 'All published',
      changeType: 'stable' as const,
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-purple-500',
      description: 'Educational resources'
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'animal',
      message: 'New animal profile created: "Ruby the Pig"',
      time: '2 hours ago',
      user: 'Sarah Thompson',
    },
    {
      id: 2,
      type: 'blog',
      message: 'Blog post "Winter Care Tips" published',
      time: '4 hours ago',
      user: 'Mike Thompson',
    },
    {
      id: 3,
      type: 'volunteer',
      message: 'New volunteer application received',
      time: '6 hours ago',
      user: 'System',
    },
    {
      id: 4,
      type: 'inquiry',
      message: 'Contact form submission from visitor',
      time: '8 hours ago',
      user: 'System',
    },
    {
      id: 5,
      type: 'donation',
      message: 'Monthly donation received: $150',
      time: '10 hours ago',
      user: 'System',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Animal',
      description: 'Create a new animal profile',
      href: '/admin/animals/new',
      icon: <Heart className="h-5 w-5" />,
      color: 'bg-pink-100 text-pink-700 hover:bg-pink-200',
    },
    {
      title: 'Write Blog Post',
      description: 'Create a new blog article',
      href: '/admin/blog/new',
      icon: <FileText className="h-5 w-5" />,
      color: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    },
    {
      title: 'Review Applications',
      description: 'Check volunteer applications',
      href: '/admin/volunteers',
      icon: <Users className="h-5 w-5" />,
      color: 'bg-green-100 text-green-700 hover:bg-green-200',
    },
    {
      title: 'View Analytics',
      description: 'Check site performance',
      href: '/admin/analytics',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    },
  ];

  const getChangeIcon = (type: string) => {
    switch (type) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decrease':
        return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'animal':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'blog':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'volunteer':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'inquiry':
        return <Mail className="h-4 w-4 text-orange-500" />;
      case 'donation':
        return <DollarSign className="h-4 w-4 text-emerald-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening at Harmony Farm Sanctuary today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${card.color}`}>
                <div className="text-white">
                  {card.icon}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {getChangeIcon(card.changeType)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
              </div>
              <h4 className="text-sm font-medium text-gray-700">{card.title}</h4>
              <p className="text-xs text-gray-500">{card.description}</p>
              <div className="flex items-center space-x-1">
                <span className={`text-xs font-medium ${
                  card.changeType === 'increase' ? 'text-green-600' :
                  card.changeType === 'decrease' ? 'text-red-600' :
                  card.changeType === 'alert' ? 'text-orange-600' :
                  'text-gray-600'
                }`}>
                  {card.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              View all
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 font-medium">
                    {activity.message}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.user}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            <Eye className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className={`p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all ${action.color}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {action.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium truncate">
                      {action.title}
                    </h3>
                    <p className="text-xs opacity-75 truncate">
                      {action.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* System Status */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">System Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Website Status</span>
                <span className="flex items-center text-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last Backup</span>
                <span className="text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Active Sessions</span>
                <span className="text-gray-500">3 admins</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;