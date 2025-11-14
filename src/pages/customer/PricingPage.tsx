import Loader from '@/components/ui/Loader';
import { useEffect, useState } from 'react';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  buttonText: string;
  buttonVariant: 'primary' | 'secondary';
}

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState(true);

  const pricingPlans: PricingPlan[] = [
    {
      name: "Starter",
      monthlyPrice: 29,
      annualPrice: 23,
      description: "Perfect for individual agents starting their journey",
      popular: true,
      features: [
        { text: "Up to 10 property listings", included: true },
        { text: "Basic analytics dashboard", included: true },
        { text: "Email support", included: true },
        { text: "Mobile app access", included: true },
        { text: "Advanced CRM features", included: false },
        { text: "Custom domain", included: false },
        { text: "Priority support", included: false },
      ],
      buttonText: "Get Started",
      buttonVariant: "secondary",
    },
    {
      name: "Professional",
      monthlyPrice: 79,
      annualPrice: 63,
      description: "Ideal for growing real estate teams and agencies",
      popular: true,
      features: [
        { text: "Up to 50 property listings", included: true },
        { text: "Advanced analytics & reports", included: true },
        { text: "Priority email & chat support", included: true },
        { text: "CRM integration", included: true },
        { text: "Custom branding", included: true },
        { text: "Team collaboration tools", included: true },
        { text: "Dedicated account manager", included: false },
      ],
      buttonText: "Get Started",
      buttonVariant: "primary",
    },
    {
      name: "Enterprise",
      monthlyPrice: 199,
      annualPrice: 159,
      description: "For large agencies and real estate corporations",
      features: [
        { text: "Unlimited property listings", included: true },
        { text: "Custom analytics dashboard", included: true },
        { text: "24/7 phone & chat support", included: true },
        { text: "Advanced CRM with automation", included: true },
        { text: "White-label solution", included: true },
        { text: "API access", included: true },
        { text: "Dedicated account manager", included: true },
      ],
      buttonText: "Contact Sales",
      buttonVariant: "secondary",
    },
  ];

  const featureComparison = [
    {
      feature: "Property Listings",
      starter: "10",
      professional: "50",
      enterprise: "Unlimited",
    },
    {
      feature: "Storage Space",
      starter: "5 GB",
      professional: "50 GB",
      enterprise: "500 GB",
    },
    {
      feature: "Support",
      starter: "Email",
      professional: "Priority",
      enterprise: "24/7",
    },
    {
      feature: "CRM Features",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      feature: "Custom Domain",
      starter: false,
      professional: true,
      enterprise: true,
    },
    {
      feature: "API Access",
      starter: false,
      professional: false,
      enterprise: true,
    },
  ];

  const faqs = [
    {
      question: "Can I change plans later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
    },
    {
      question: "Is there a free trial?",
      answer: "We offer a 14-day free trial on all paid plans. No credit card required to start.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
    },
    {
      question: "Do you offer discounts for teams?",
      answer: "Yes, we offer volume discounts for teams of 10 or more users. Contact sales for details.",
    },
  ];

  const getCurrentPrice = (plan: PricingPlan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: PricingPlan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const annualCost = plan.annualPrice * 12;
    return monthlyCost - annualCost;
  };
  
  useEffect(() => {
    setTimeout(() => {
        setLoading(false);
    }, 1500);
  }, [])

  if(loading){
    return (<Loader />);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 ">

        {/* Hero Section */}
        <div className="text-center mb-12 mt-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your real estate business. All plans include our core features with no hidden fees.
          </p>
          
          {/* Billing Toggle - Fixed */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isAnnual ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center space-x-2">
              <span className={`font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
                Annual
              </span>
              {isAnnual && (
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                  Save 20%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-lg border-2 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                plan.popular
                  ? 'border-blue-500 transform scale-105 relative'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              {/* Popular Badge for Starter */}
              {plan.name === "Starter" && !plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-sm px-3 py-1 font-medium rounded-bl-lg">
                  POPULAR
                </div>
              )}
              
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${getCurrentPrice(plan)}
                  </span>
                  <span className="text-gray-600">/month</span>
                  {isAnnual && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      Save ${getSavings(plan)}/year
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      {feature.included ? (
                        <i className="fas fa-check text-green-500 mr-3"></i>
                      ) : (
                        <i className="fas fa-times text-gray-300 mr-3"></i>
                      )}
                      <span className={feature.included ? "text-gray-700" : "text-gray-400 line-through"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
                    plan.buttonVariant === 'primary'
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="max-w-6xl mx-auto mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compare Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how our plans stack up against each other to find the perfect fit for your needs
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-6 font-semibold text-gray-900">Features</th>
                    <th className="p-6 font-semibold text-gray-900 text-center">Starter</th>
                    <th className="p-6 font-semibold text-gray-900 text-center">Professional</th>
                    <th className="p-6 font-semibold text-gray-900 text-center">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {featureComparison.map((row, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-6 font-medium text-gray-900">{row.feature}</td>
                      <td className="p-6 text-center">
                        {typeof row.starter === 'boolean' ? (
                          row.starter ? (
                            <i className="fas fa-check text-green-500 text-lg"></i>
                          ) : (
                            <i className="fas fa-times text-red-400 text-lg"></i>
                          )
                        ) : (
                          row.starter
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.professional === 'boolean' ? (
                          row.professional ? (
                            <i className="fas fa-check text-green-500 text-lg"></i>
                          ) : (
                            <i className="fas fa-times text-red-400 text-lg"></i>
                          )
                        ) : (
                          row.professional
                        )}
                      </td>
                      <td className="p-6 text-center">
                        {typeof row.enterprise === 'boolean' ? (
                          row.enterprise ? (
                            <i className="fas fa-check text-green-500 text-lg"></i>
                          ) : (
                            <i className="fas fa-times text-red-400 text-lg"></i>
                          )
                        ) : (
                          row.enterprise
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">Everything you need to know about our pricing and plans</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white mt-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to grow your real estate business?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of successful real estate professionals who trust EstatePro to manage their properties and grow their business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-500 transition duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;