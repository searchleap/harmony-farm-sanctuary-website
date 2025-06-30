import { useState, useMemo } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { 
  Heart, 
  DollarSign, 
  Users, 
  Calendar,
  Award,
  Utensils,
  Home,
  GraduationCap,
  HeartPulse,
  Shield,
  CreditCard,
  Building,
  Smartphone,
  CheckCircle,
  Star,
  TrendingUp,
  Clock,
  Target,
  Gift
} from 'lucide-react';
import { 
  donationAmounts,
  donationTypes,
  activeCampaigns,
  donorTestimonials,
  donationStats,
  paymentProviders,
  calculateDonationImpact,
  formatCurrency
} from '../data/donationData';
import { DonationAmount, DonationType } from '../types/donation';

const DonatePage = () => {
  const [selectedAmount, setSelectedAmount] = useState<DonationAmount | null>(donationAmounts[1]); // Default to $50
  const [selectedDonationType, setSelectedDonationType] = useState<DonationType>(donationTypes[0]); // Default to one-time
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  console.log('Donation page state:', { 
    selectedAmount: selectedAmount?.amount, 
    donationType: selectedDonationType.id, 
    customAmount, 
    showPaymentForm 
  });
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState(paymentProviders[0]);

  // Calculate impact for current selection
  const currentAmount = customAmount ? parseFloat(customAmount) : (selectedAmount?.amount || 0);
  const impactData = useMemo(() => calculateDonationImpact(currentAmount), [currentAmount]);

  // Get payment icon
  const getPaymentIcon = (providerId: string) => {
    switch (providerId) {
      case 'stripe': return CreditCard;
      case 'paypal': return Smartphone;
      case 'bank-transfer': return Building;
      case 'square': return Smartphone;
      default: return CreditCard;
    }
  };

  // Get campaign urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format progress percentage
  const formatProgress = (current: number, goal: number) => {
    return Math.round((current / goal) * 100);
  };

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
                Support Our Mission
              </h1>
            </div>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Your donation directly impacts the lives of rescued animals at Harmony Farm Sanctuary. 
              Every contribution helps provide food, medical care, shelter, and love to animals in need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
                onClick={() => setShowPaymentForm(true)}
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate Now
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Monthly Giving
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Impact Stats */}
      <div className="py-16 bg-white">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Impact in Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how every donation makes a real difference in the lives of rescued animals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{formatCurrency(donationStats.totalRaised)}</div>
              <div className="text-gray-600">Total Raised This Year</div>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{donationStats.totalDonors.toLocaleString()}</div>
              <div className="text-gray-600">Generous Donors</div>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{donationStats.animalsCared}</div>
              <div className="text-gray-600">Animals Cared For</div>
            </div>
            <div className="text-center">
              <div className="bg-green-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">{formatCurrency(donationStats.averageDonation)}</div>
              <div className="text-gray-600">Average Donation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Donation Form Section */}
      <div className="py-16 bg-gray-50">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Donation
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select an amount and see the immediate impact your generosity will have
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Donation Selection */}
              <div>
                {/* Donation Type Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Type</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {donationTypes.slice(0, 2).map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setSelectedDonationType(type)}
                        className={`p-4 rounded-lg border-2 text-left transition-colors ${
                          selectedDonationType.id === type.id
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                        {type.id === 'monthly' && (
                          <Badge className="mt-2 bg-green-100 text-green-800 text-xs">
                            Most Impact
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Amount</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {donationAmounts.map((amount) => (
                      <button
                        key={amount.id}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`p-4 rounded-lg border-2 text-center transition-colors ${
                          selectedAmount?.id === amount.id && !customAmount
                            ? 'border-green-600 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-bold text-gray-900">{amount.label}</div>
                        <div className="text-sm text-gray-600 mt-1">{amount.description}</div>
                        {amount.isPopular && (
                          <Badge className="mt-2 bg-yellow-100 text-yellow-800 text-xs">
                            Popular
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Amount */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Amount
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setSelectedAmount(null);
                        }}
                        className="pl-10"
                        min="1"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {paymentProviders.filter(p => p.supported).map((provider) => {
                      const IconComponent = getPaymentIcon(provider.id);
                      return (
                        <button
                          key={provider.id}
                          onClick={() => setSelectedPaymentProvider(provider)}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                            selectedPaymentProvider.id === provider.id
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <IconComponent className="w-6 h-6 text-gray-600 mr-3" />
                              <div>
                                <div className="font-medium text-gray-900">{provider.name}</div>
                                <div className="text-sm text-gray-600">{provider.description}</div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {provider.fees.percentage}% + ${provider.fees.fixed}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Donate Button */}
                <Button 
                  size="lg" 
                  className="w-full"
                  disabled={currentAmount <= 0}
                  onClick={() => setShowPaymentForm(true)}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  {selectedDonationType.id === 'monthly' 
                    ? `Donate ${formatCurrency(currentAmount)} Monthly` 
                    : `Donate ${formatCurrency(currentAmount)} Now`
                  }
                </Button>
              </div>

              {/* Impact Calculator */}
              <div>
                <Card className="p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact</h3>
                  
                  {currentAmount > 0 ? (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {formatCurrency(currentAmount)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {selectedDonationType.id === 'monthly' ? 'per month' : 'one-time donation'}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {impactData.impacts.map((impact, index) => {
                          const getIcon = (iconName: string) => {
                            switch (iconName) {
                              case 'utensils': return Utensils;
                              case 'heart-pulse': return HeartPulse;
                              case 'home': return Home;
                              case 'graduation-cap': return GraduationCap;
                              default: return Heart;
                            }
                          };
                          const IconComponent = getIcon(impact.icon);
                          
                          return (
                            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                              <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                                <IconComponent className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                  {impact.quantity} {impact.unit}
                                </div>
                                <div className="text-sm text-gray-600">{impact.description}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600 text-center">
                          <Shield className="w-4 h-4 inline mr-1" />
                          {impactData.operationalSupport.percentage}% goes directly to animal care
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>Select an amount to see your impact</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Campaigns */}
      <div className="py-16 bg-white">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Active Fundraising Campaigns
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Support specific initiatives that directly improve animal welfare and sanctuary operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={`text-xs ${getUrgencyColor(campaign.urgency)}`}>
                    {campaign.urgency === 'high' ? 'Urgent' : 
                     campaign.urgency === 'medium' ? 'Important' : 'Ongoing'}
                  </Badge>
                  <div className="text-sm text-gray-500">
                    {campaign.daysLeft} days left
                  </div>
                </div>
                
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {campaign.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm">
                  {campaign.description}
                </p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{formatProgress(campaign.raised, campaign.goal)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(formatProgress(campaign.raised, campaign.goal), 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-600">{formatCurrency(campaign.raised)} raised</span>
                    <span className="text-gray-600">{formatCurrency(campaign.goal)} goal</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-gray-600">
                    <Users className="w-4 h-4 inline mr-1" />
                    {campaign.donors} donors
                  </div>
                  <div className="text-sm text-gray-600">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {campaign.daysLeft} days left
                  </div>
                </div>
                
                <Button className="w-full">
                  <Target className="w-4 h-4 mr-2" />
                  Support This Campaign
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Donor Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stories from Our Supporters
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from donors who are making a difference in the lives of rescued animals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {donorTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6 text-center">
                {testimonial.imageUrl && (
                  <img
                    src={testimonial.imageUrl}
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                )}
                <h4 className="font-semibold text-gray-900 mb-1">{testimonial.name}</h4>
                <p className="text-sm text-green-600 mb-3">{testimonial.donationType}</p>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="space-y-1">
                  <Badge className="text-xs bg-green-100 text-green-800">
                    {testimonial.yearsSupporting} years supporting
                  </Badge>
                  {testimonial.isRecurring && (
                    <Badge className="text-xs bg-blue-100 text-blue-800 block">
                      Monthly Donor
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Giving Spotlight */}
      <div className="py-16 bg-green-600 text-white">
        <div className="container-custom section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <TrendingUp className="w-12 h-12 mr-4 text-white/90" />
              <h2 className="text-3xl font-bold">Join Our Monthly Giving Circle</h2>
            </div>
            <p className="text-xl mb-8 opacity-90">
              Monthly donors provide the predictable income that allows us to plan for long-term animal care, 
              make facility improvements, and respond quickly to rescue emergencies.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{donationStats.recurringDonors}</div>
                <div className="text-white/80">Monthly Donors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{donationStats.recurringPercentage}%</div>
                <div className="text-white/80">Recurring Support</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{formatCurrency(donationStats.monthlyProgress)}</div>
                <div className="text-white/80">This Month's Goal Progress</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="bg-white text-green-600 hover:bg-gray-100"
              >
                <Heart className="w-5 h-5 mr-2" />
                Become a Monthly Donor
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                <Gift className="w-5 h-5 mr-2" />
                Learn About Benefits
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Other Ways to Give */}
      <div className="py-16 bg-white">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Other Ways to Support Us
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore additional meaningful ways to support our mission and honor your loved ones
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {donationTypes.slice(2).map((type) => (
              <Card key={type.id} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{type.label}</h3>
                <p className="text-gray-600 mb-4">{type.description}</p>
                <ul className="text-sm text-gray-600 mb-6 space-y-1">
                  {type.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full">
                  Learn More
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Security and Trust */}
      <div className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="container-custom section-padding">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Secure and Trusted Donations</h3>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                SSL Encrypted
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-green-600" />
                501(c)(3) Nonprofit
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                GuideStar Platinum Seal
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-green-600" />
                85% to Animal Care
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;