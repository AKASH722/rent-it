import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ currentStep = 'cart' }) => {
  const steps = [
    { id: 'cart', label: 'Review Order', href: '/cart' },
    { id: 'delivery', label: 'Delivery', href: '/cart/delivery' },
    { id: 'payment', label: 'Payment', href: '/cart/payment' }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {index === currentStepIndex ? (
              <span className="text-destructive font-semibold">{step.label}</span>
            ) : index < currentStepIndex ? (
              <Link 
                href={step.href} 
                className="hover:text-primary transition-colors text-primary"
              >
                {step.label}
              </Link>
            ) : (
              <span className="text-muted-foreground">{step.label}</span>
            )}
            
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4" />
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default Breadcrumb;
