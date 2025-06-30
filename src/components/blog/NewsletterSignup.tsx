// NewsletterSignup Component for Harmony Farm Sanctuary
// Newsletter subscription form for blog and sanctuary updates

import React, { useState } from 'react';
import { Mail, Check, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface NewsletterSignupProps {
  variant?: 'default' | 'inline' | 'modal' | 'sidebar';
  title?: string;
  description?: string;
  showPrivacyNote?: boolean;
  className?: string;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  variant = 'default',
  title,
  description,
  showPrivacyNote = true,
  className = ''
}) => {
  console.log('NewsletterSignup rendering:', { variant, title });

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const defaultTitles = {
    default: 'Stay Connected with Our Sanctuary',
    inline: 'Get Updates',
    modal: 'Subscribe to Our Newsletter',
    sidebar: 'Newsletter'
  };

  const defaultDescriptions = {
    default: 'Receive heartwarming animal stories, sanctuary updates, and educational content delivered to your inbox.',
    inline: 'Subscribe for animal stories and sanctuary news.',
    modal: 'Join our community and stay updated with the latest from Harmony Farm Sanctuary.',
    sidebar: 'Latest stories and updates'
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      setStatus('error');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      // Simulate API call - replace with actual newsletter service
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would call your newsletter service API here
      // const response = await fetch('/api/newsletter/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      setStatus('success');
      setEmail('');
      
      // Reset to idle after showing success message
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sanctuary-primary focus:border-transparent disabled:opacity-50"
          disabled={status === 'loading' || status === 'success'}
        />
      </div>

      <Button
        type="submit"
        disabled={status === 'loading' || status === 'success'}
        className="w-full"
      >
        {status === 'loading' && 'Subscribing...'}
        {status === 'success' && 'Subscribed!'}
        {(status === 'idle' || status === 'error') && 'Subscribe'}
      </Button>

      {status === 'error' && errorMessage && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <Check className="w-4 h-4" />
          <span>Thank you for subscribing! Check your email for confirmation.</span>
        </div>
      )}

      {showPrivacyNote && (
        <p className="text-xs text-gray-600">
          We respect your privacy. Unsubscribe at any time. 
          <a href="/privacy" className="text-sanctuary-primary hover:underline ml-1">
            Privacy Policy
          </a>
        </p>
      )}
    </form>
  );

  if (variant === 'inline') {
    return (
      <div className={`bg-sanctuary-primary/5 border border-sanctuary-primary/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3 mb-3">
          <Mail className="w-5 h-5 text-sanctuary-primary" />
          <div>
            <h4 className="font-semibold text-gray-900">
              {title || defaultTitles[variant]}
            </h4>
            <p className="text-sm text-gray-600">
              {description || defaultDescriptions[variant]}
            </p>
          </div>
        </div>
        {renderForm()}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-5 h-5 text-sanctuary-primary" />
          <h4 className="font-semibold text-gray-900">
            {title || defaultTitles[variant]}
          </h4>
        </div>
        {description && (
          <p className="text-sm text-gray-600 mb-3">
            {description || defaultDescriptions[variant]}
          </p>
        )}
        {renderForm()}
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div className={`bg-white rounded-xl p-6 max-w-md mx-auto ${className}`}>
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-sanctuary-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-sanctuary-primary" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {title || defaultTitles[variant]}
          </h3>
          <p className="text-gray-600">
            {description || defaultDescriptions[variant]}
          </p>
        </div>
        {renderForm()}
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-gradient-to-br from-sanctuary-primary to-sanctuary-secondary rounded-xl p-8 text-white ${className}`}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-white" />
        </div>
        
        <h3 className="text-2xl font-bold mb-3">
          {title || defaultTitles[variant]}
        </h3>
        
        <p className="text-white/90 mb-6 text-lg">
          {description || defaultDescriptions[variant]}
        </p>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-transparent disabled:opacity-50"
                disabled={status === 'loading' || status === 'success'}
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              disabled={status === 'loading' || status === 'success'}
              className="w-full bg-white text-sanctuary-primary hover:bg-gray-100"
            >
              {status === 'loading' && 'Subscribing...'}
              {status === 'success' && 'Subscribed!'}
              {(status === 'idle' || status === 'error') && 'Subscribe Now'}
            </Button>

            {status === 'error' && errorMessage && (
              <div className="flex items-center gap-2 text-red-200 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMessage}</span>
              </div>
            )}

            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-200 text-sm">
                <Check className="w-4 h-4" />
                <span>Thank you for subscribing! Check your email for confirmation.</span>
              </div>
            )}
          </form>

          {showPrivacyNote && (
            <p className="text-white/70 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};