import { useMemo } from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { 
  Heart, 
  Utensils, 
  HeartPulse, 
  Home, 
  GraduationCap,
  TrendingUp,
  Users,
  Shield
} from 'lucide-react';
import { calculateDonationImpact, formatCurrency } from '../../data/donationData';

interface ImpactCalculatorProps {
  amount: number;
  frequency?: 'one-time' | 'monthly' | 'annually';
  showDetailed?: boolean;
}

export const ImpactCalculator = ({ 
  amount, 
  frequency = 'one-time',
  showDetailed = true
}: ImpactCalculatorProps) => {
  const impactData = useMemo(() => calculateDonationImpact(amount), [amount]);
  
  // Calculate annual impact for recurring donations
  const annualAmount = useMemo(() => {
    switch (frequency) {
      case 'monthly': return amount * 12;
      case 'annually': return amount;
      default: return amount;
    }
  }, [amount, frequency]);
  
  const annualImpact = useMemo(() => calculateDonationImpact(annualAmount), [annualAmount]);

  const getImpactIcon = (iconName: string) => {
    switch (iconName) {
      case 'utensils': return Utensils;
      case 'heart-pulse': return HeartPulse;
      case 'home': return Home;
      case 'graduation-cap': return GraduationCap;
      default: return Heart;
    }
  };

  if (amount <= 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8 text-gray-500">
          <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">See Your Impact</h3>
          <p>Enter a donation amount to see how you'll help our rescued animals</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Impact</h3>
        <div className="text-3xl font-bold text-green-600 mb-1">
          {formatCurrency(amount)}
        </div>
        <div className="text-sm text-gray-600">
          {frequency === 'monthly' ? 'per month' : 
           frequency === 'annually' ? 'per year' : 
           'one-time donation'}
        </div>
        {frequency !== 'one-time' && (
          <Badge className="mt-2 bg-blue-100 text-blue-800 text-xs">
            {formatCurrency(annualAmount)} annual impact
          </Badge>
        )}
      </div>

      {/* Immediate Impact */}
      <div className="space-y-4 mb-6">
        <h4 className="font-medium text-gray-900">
          {frequency === 'one-time' ? 'Your donation provides:' : 'Each donation provides:'}
        </h4>
        {impactData.impacts.map((impact, index) => {
          const IconComponent = getImpactIcon(impact.icon);
          return (
            <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center mr-3 shadow-sm">
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

      {/* Annual Impact for Recurring Donations */}
      {frequency !== 'one-time' && showDetailed && (
        <div className="border-t border-gray-200 pt-6 mb-6">
          <h4 className="font-medium text-gray-900 mb-4">
            Annual Impact ({formatCurrency(annualAmount)})
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {annualImpact.impacts.map((impact, index) => {
              const IconComponent = getImpactIcon(impact.icon);
              return (
                <div key={index} className="text-center p-3 bg-green-50 rounded-lg">
                  <IconComponent className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="font-bold text-green-700 text-lg">
                    {impact.quantity}
                  </div>
                  <div className="text-xs text-gray-600">{impact.unit}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Fund Allocation */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Fund Allocation</h4>
          <div className="flex items-center text-sm text-green-600">
            <Shield className="w-4 h-4 mr-1" />
            {impactData.operationalSupport.percentage}% to animal care
          </div>
        </div>
        
        <div className="space-y-2">
          {/* Visual progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full"
              style={{ width: `${impactData.operationalSupport.percentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Direct Animal Care</span>
            <span>{impactData.operationalSupport.percentage}%</span>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Administrative Costs</span>
            <span>{100 - impactData.operationalSupport.percentage}%</span>
          </div>
        </div>
        
        <div className="mt-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Your donation supports:</h5>
          <div className="flex flex-wrap gap-2">
            {impactData.operationalSupport.categories.map((category, index) => (
              <Badge key={index} className="text-xs bg-gray-100 text-gray-700">
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Recurring Donation Benefits */}
      {frequency === 'monthly' && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-medium text-blue-900">Monthly Donor Benefits</h4>
          </div>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Exclusive monthly impact updates</li>
            <li>• Priority access to sanctuary events</li>
            <li>• Monthly donor appreciation program</li>
            <li>• Special facility tour opportunities</li>
          </ul>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {frequency === 'monthly' 
            ? 'Join our monthly giving circle and provide consistent support for rescued animals.'
            : 'Your generous donation makes an immediate difference in animal welfare.'
          }
        </p>
      </div>
    </Card>
  );
};