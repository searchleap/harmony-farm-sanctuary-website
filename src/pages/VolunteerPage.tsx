import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { 
  Heart, 
  Users, 
  Clock, 
  HandHeart, 
  Search,
  MapPin,
  Calendar,
  Award,
  Star,
  UserCheck,
  BookOpen,
  Settings,
  Megaphone
} from 'lucide-react';
import { 
  volunteerStats, 
  volunteerTestimonials,
  upcomingVolunteerEvents,
  getActiveVolunteerRoles
} from '../data/volunteerRoles';
import { VolunteerRole } from '../types/volunteer';

const VolunteerPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get category icon
  const getCategoryIcon = (category: VolunteerRole['category']) => {
    switch (category) {
      case 'animal-care': return Heart;
      case 'education': return BookOpen;
      case 'administration': return Settings;
      case 'maintenance': return HandHeart;
      case 'events': return Megaphone;
      case 'outreach': return Users;
      default: return Heart;
    }
  };

  // Get urgency color
  const getUrgencyColor = (urgency: VolunteerRole['urgency']) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter volunteer roles
  const filteredRoles = useMemo(() => {
    let roles = getActiveVolunteerRoles();
    
    // Filter by search term
    if (searchTerm) {
      roles = roles.filter(role =>
        role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.skillsNeeded.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        role.responsibilities.some(resp => resp.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      roles = roles.filter(role => role.category === selectedCategory);
    }
    
    return roles;
  }, [searchTerm, selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Opportunities', count: getActiveVolunteerRoles().length },
    { id: 'animal-care', label: 'Animal Care', count: getActiveVolunteerRoles().filter(r => r.category === 'animal-care').length },
    { id: 'education', label: 'Education', count: getActiveVolunteerRoles().filter(r => r.category === 'education').length },
    { id: 'administration', label: 'Administration', count: getActiveVolunteerRoles().filter(r => r.category === 'administration').length },
    { id: 'maintenance', label: 'Maintenance', count: getActiveVolunteerRoles().filter(r => r.category === 'maintenance').length },
    { id: 'events', label: 'Events', count: getActiveVolunteerRoles().filter(r => r.category === 'events').length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-green-600 to-green-700 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <Heart className="w-12 h-12 mr-4 text-white/90" />
              <h1 className="text-4xl md:text-5xl font-bold">
                Join Our Volunteer Family
              </h1>
            </div>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Make a direct impact on animal welfare and sanctuary operations. 
              Whether you have 2 hours or 20 hours to give, there's a meaningful way to help our rescued animals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <UserCheck className="w-5 h-5 mr-2" />
                Apply to Volunteer
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Upcoming Events
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer Impact Stats */}
      <div className="py-16 bg-white">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Volunteer Community Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join a community of dedicated volunteers making a real difference in animal welfare
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{volunteerStats.totalActiveVolunteers}</div>
              <div className="text-gray-600">Active Volunteers</div>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{volunteerStats.totalVolunteerHours.toLocaleString()}</div>
              <div className="text-gray-600">Hours Contributed</div>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{volunteerStats.monthlyVolunteers}</div>
              <div className="text-gray-600">Monthly Volunteers</div>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{Math.round(volunteerStats.retentionRate * 100)}%</div>
              <div className="text-gray-600">Return Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="container-custom section-padding">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search volunteer opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Volunteer Opportunities */}
      <div className="py-16 bg-gray-50">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Volunteer Opportunities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find the perfect way to contribute your skills and passion to animal welfare.
              {filteredRoles.length !== getActiveVolunteerRoles().length && (
                <span className="block mt-2 text-green-600 font-medium">
                  Showing {filteredRoles.length} of {getActiveVolunteerRoles().length} opportunities
                </span>
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredRoles.map((role) => {
              const IconComponent = getCategoryIcon(role.category);
              return (
                <Card key={role.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-green-50 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                        <IconComponent className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{role.title}</h3>
                        <p className="text-sm text-gray-500 capitalize">{role.category.replace('-', ' ')}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={`text-xs ${getUrgencyColor(role.urgency)}`}>
                        {role.urgency === 'high' ? 'Urgent Need' : 
                         role.urgency === 'medium' ? 'Needed' : 'Open'}
                      </Badge>
                      {role.minimumAge && (
                        <Badge className="text-xs bg-gray-100 text-gray-800">
                          {role.minimumAge}+ years
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {role.description}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      {role.timeCommitment}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-2" />
                      {role.schedule}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Key Responsibilities:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {role.responsibilities.slice(0, 3).map((responsibility, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-600 mr-2">•</span>
                          {responsibility}
                        </li>
                      ))}
                      {role.responsibilities.length > 3 && (
                        <li className="text-green-600 text-sm font-medium">
                          +{role.responsibilities.length - 3} more responsibilities
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Skills Needed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.skillsNeeded.slice(0, 4).map((skill, index) => (
                        <Badge key={index} className="text-xs bg-blue-100 text-blue-800">
                          {skill}
                        </Badge>
                      ))}
                      {role.skillsNeeded.length > 4 && (
                        <Badge className="text-xs bg-blue-100 text-blue-800">
                          +{role.skillsNeeded.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                    <Button className="flex-1">
                      <UserCheck className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
          
          {filteredRoles.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No opportunities found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria to find volunteer opportunities.
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Volunteer Testimonials */}
      <div className="py-16 bg-white">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Hear from Our Volunteers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real stories from volunteers who are making a difference at Harmony Farm Sanctuary
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {volunteerTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 text-center">
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <h4 className="font-semibold text-gray-900 mb-1">{testimonial.name}</h4>
                <p className="text-sm text-green-600 mb-3">{testimonial.role}</p>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <Badge className="text-xs bg-green-100 text-green-800">
                  {testimonial.yearsVolunteering} {testimonial.yearsVolunteering === 1 ? 'year' : 'years'} volunteering
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="py-16 bg-gray-50">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upcoming Volunteer Events
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join us for orientations, training sessions, and community work days
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingVolunteerEvents.map((event) => (
              <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`text-xs ${
                    event.category === 'orientation' ? 'bg-blue-100 text-blue-800' :
                    event.category === 'training' ? 'bg-purple-100 text-purple-800' :
                    event.category === 'work-party' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.category.replace('-', ' ')}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    {event.volunteersRegistered}/{event.volunteersNeeded} spots filled
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm">
                  {event.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {event.location}
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={event.volunteersRegistered >= event.volunteersNeeded}
                >
                  {event.volunteersRegistered >= event.volunteersNeeded ? 'Event Full' : 'Register'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-green-600 text-white">
        <div className="container-custom section-padding text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of dedicated volunteers and help us provide the best possible care 
            for our rescued animals. Every contribution makes a meaningful impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <UserCheck className="w-5 h-5 mr-2" />
              Start Your Application
            </Button>
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                <Users className="w-5 h-5 mr-2" />
                Contact Volunteer Coordinator
              </Button>
            </Link>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-white/80 mb-2">Questions about volunteering?</p>
            <p className="text-white font-medium">
              Contact Sarah Thompson at (555) 123-4567 or volunteers@harmonyfarm.org
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerPage;