import { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Shield
} from 'lucide-react';
import { DonationFormData, PaymentProvider } from '../../types/donation';
import { formatCurrency } from '../../data/donationData';

interface DonationFormProps {
  amount: number;
  donationType: 'one-time' | 'monthly';
  paymentProvider: PaymentProvider;
  onClose: () => void;
  onSuccess: (donation: Partial<DonationFormData>) => void;
}

export const DonationForm = ({ 
  amount, 
  donationType, 
  paymentProvider, 
  onClose, 
  onSuccess 
}: DonationFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<Partial<DonationFormData>>({
    donationType,
    amount,
    currency: 'USD',
    frequency: donationType === 'monthly' ? 'monthly' : 'one-time',
    donor: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      },
      isAnonymous: false
    },
    payment: {
      method: paymentProvider.id as any
    },
    preferences: {
      receiveUpdates: true,
      receiveNewsletter: false,
      publicRecognition: true
    }
  });

  // Helper function for debugging
  console.log('Donation form state:', { currentStep, amount, donationType, formData });

  const updateDonorField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      donor: {
        ...prev.donor!,
        [field]: value
      }
    }));
  };

  const updateAddressField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      donor: {
        ...prev.donor!,
        address: {
          ...prev.donor!.address,
          [field]: value
        }
      }
    }));
  };

  // Payment field updates would be handled by payment processor
  // const updatePaymentField = (field: string, value: any) => { ... }

  const updatePreferenceField = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        [field]: value
      }
    }));
  };

  const calculateFees = () => {
    const fees = (amount * paymentProvider.fees.percentage / 100) + paymentProvider.fees.fixed;
    return fees;
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        ...formData,
        transactionId: `txn_${Date.now()}`,
        paymentStatus: 'completed',
        donationDate: new Date().toISOString(),
        taxReceiptSent: false,
        followupScheduled: true
      });
    }, 3000);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, title: 'Donor Information', description: 'Tell us about yourself' },
    { id: 2, title: 'Payment Details', description: 'Secure payment information' },
    { id: 3, title: 'Review & Submit', description: 'Confirm your donation' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Donation</h2>
              <p className="text-gray-600">
                {donationType === 'monthly' ? 'Monthly' : 'One-time'} donation of {formatCurrency(amount)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {step.id < steps.length && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h3 className="font-medium text-gray-900">{steps[currentStep - 1].title}</h3>
              <p className="text-sm text-gray-600">{steps[currentStep - 1].description}</p>
            </div>
          </div>

          {/* Form Content */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    First Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.donor?.firstName || ''}
                    onChange={(e) => updateDonorField('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.donor?.lastName || ''}
                    onChange={(e) => updateDonorField('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={formData.donor?.email || ''}
                  onChange={(e) => updateDonorField('email', e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number (Optional)
                </label>
                <Input
                  type="tel"
                  value={formData.donor?.phone || ''}
                  onChange={(e) => updateDonorField('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Address *
                </label>
                <div className="space-y-4">
                  <Input
                    type="text"
                    value={formData.donor?.address?.street || ''}
                    onChange={(e) => updateAddressField('street', e.target.value)}
                    placeholder="Street address"
                    required
                  />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Input
                      type="text"
                      value={formData.donor?.address?.city || ''}
                      onChange={(e) => updateAddressField('city', e.target.value)}
                      placeholder="City"
                      required
                    />
                    <Input
                      type="text"
                      value={formData.donor?.address?.state || ''}
                      onChange={(e) => updateAddressField('state', e.target.value)}
                      placeholder="State"
                      required
                    />
                    <Input
                      type="text"
                      value={formData.donor?.address?.zipCode || ''}
                      onChange={(e) => updateAddressField('zipCode', e.target.value)}
                      placeholder="ZIP Code"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.donor?.isAnonymous || false}
                    onChange={(e) => updateDonorField('isAnonymous', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Make this donation anonymous</span>
                </label>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Payment Method Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
                  <span className="font-medium">{paymentProvider.name}</span>
                  <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                    Secure
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{paymentProvider.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Processing fee: {paymentProvider.fees.percentage}% + ${paymentProvider.fees.fixed}
                </p>
              </div>

              {/* Card Details (for Stripe) */}
              {paymentProvider.id === 'stripe' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input type="text" placeholder="MM" maxLength={2} />
                        <Input type="text" placeholder="YY" maxLength={2} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <Input type="text" placeholder="123" maxLength={4} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <Input
                      type="text"
                      placeholder="Name as it appears on card"
                    />
                  </div>
                </div>
              )}

              {/* PayPal Notice */}
              {paymentProvider.id === 'paypal' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                </div>
              )}

              {/* Security Features */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 mr-2 text-green-600" />
                  <span className="font-medium text-green-800">Your payment is secure</span>
                </div>
                <ul className="text-sm text-green-700 space-y-1">
                  {paymentProvider.securityFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Donation Summary */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Donation Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Donation Amount:</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span>{formatCurrency(calculateFees())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frequency:</span>
                    <span className="capitalize">{donationType}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Charge:</span>
                      <span>{formatCurrency(amount + calculateFees())}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donor Information */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Donor Information</h3>
                <div className="space-y-1 text-sm">
                  <p>{formData.donor?.firstName} {formData.donor?.lastName}</p>
                  <p>{formData.donor?.email}</p>
                  {formData.donor?.phone && <p>{formData.donor.phone}</p>}
                  <p>
                    {formData.donor?.address?.street}, {formData.donor?.address?.city}, {formData.donor?.address?.state} {formData.donor?.address?.zipCode}
                  </p>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences?.receiveUpdates || false}
                    onChange={(e) => updatePreferenceField('receiveUpdates', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Receive updates about how my donation is used</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences?.receiveNewsletter || false}
                    onChange={(e) => updatePreferenceField('receiveNewsletter', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Subscribe to monthly newsletter</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.preferences?.publicRecognition || false}
                    onChange={(e) => updatePreferenceField('publicRecognition', e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Include my name in public donor recognition</span>
                </label>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={isProcessing}
              className="min-w-[120px]"
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : currentStep === 3 ? (
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Complete Donation
                </div>
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};