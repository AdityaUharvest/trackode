// app/pricing/page.tsx
import React from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const PricingPage = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      duration: '',
      features: [
        'Create up to 10 quizzes',
        'Create up to 3 mock tests',
        'Basic quiz analytics',
        'Access to limited public quizzes',
        'No AI feedback',
        'No email notifications',
      ],
      limitations: [
        'No custom branding',
        'Limited student access',
        'No API access'
      ],
      featured: false,
      cta: 'Get Started'
    },
    {
      name: 'Starter',
      price: '₹299',
      duration: '6 months',
      features: [
        'Unlimited quiz creation',
        'Unlimited mock tests',
        'AI-based feedback',
        'Email notifications',
        'Basic analytics dashboard',
        'Up to 100 participants',
      ],
      limitations: [],
      featured: true,
      cta: 'Upgrade Now'
    },
    {
      name: 'Professional',
      price: '₹599',
      duration: '12 months',
      features: [
        'Everything in Starter',
        'Advanced AI feedback',
        'Priority support',
        'Custom branding',
        'Detailed analytics',
        'Up to 500 participants',
      ],
      limitations: [],
      featured: false,
      cta: 'Get Professional'
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-800 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose Your Plan
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            Start with Basic or unlock more features with our premium plans
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-6 rounded-xl shadow-sm flex flex-col h-full ${
                plan.featured 
                  ? 'border-2 border-indigo-500 bg-white transform scale-105 z-10'
                  : 'border border-gray-200 bg-white'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-40 rounded-full bg-indigo-500 px-3 py-1 text-sm font-medium text-white text-center">
                  Most Popular
                </div>
              )}
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                  {plan.duration && (
                    <span className="text-lg text-gray-600">/{plan.duration}</span>
                  )}
                </div>
                
                <div className="space-y-3 mb-6">
                  <h3 className="font-medium text-gray-700">Features:</h3>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500 mt-0.5" />
                        <span className="ml-2 text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {plan.limitations.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-gray-700">Limitations:</h3>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start">
                          <XMarkIcon className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                          <span className="ml-2 text-gray-600">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <a
                  href="#"
                  className={`block w-full py-3 px-6 rounded-lg text-center font-medium ${
                    plan.featured
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : plan.name === 'Basic'
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-800 rounded-xl p-8 text-gray-50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Need help choosing?</h2>
            <p className="mb-6">
              Our education specialists can help you select the right plan for your 
              teaching needs and student requirements.
            </p>
            <a
              href="#"
              className="inline-block px-6 py-3 bg-gray-50 text-gray-800 font-medium rounded-lg hover:bg-gray-100"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;