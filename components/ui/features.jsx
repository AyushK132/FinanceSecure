"use client"
import React, { useEffect, useRef } from 'react';
import { ChartBar, CreditCard, PiggyBank, Wallet, ArrowUpRight, TrendingUp, BadgeDollarSign } from 'lucide-react';

const FeatureCard = ({ title, description, icon, className = '', bgClass = 'bg-white', delay = 0 }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className={`rounded-2xl p-6 shadow-subtle transition-all duration-500 opacity-0 translate-y-4 hover:shadow-elevated group ${bgClass} ${className}`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-subtitle mb-2 group-hover:text-finance-blue transition-colors duration-300">{title}</h3>
      <p className="text-finance-dark-gray">{description}</p>
    </div>
  );
};

const FeatureGrid = () => {
  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="px-3 py-1 text-xs font-medium bg-finance-light-blue text-finance-blue rounded-full">
            Key Features
          </span>
          <h2 className="text-display mt-4 mb-6">Revolutionary Features</h2>
          <p className="text-body-lg text-finance-dark-gray max-w-2xl mx-auto">
            Powerful tools to help you take control of your financial life with elegance and simplicity.
          </p>
        </div>
        
        <div className="bento-grid">

     <FeatureCard 
            title="Effortlessly Interpret Data"
            description="
            Effortlessly Interpret Data
            We’ve optimized our graphs to be intuitive, so you don’t need a financial background to understand them. Whether it’s a color-coded spending breakdown or a trend line, every graph is designed to communicate key insights at a glance."
            icon={<ChartBar className="w-10 h-10 text-finance-blue" />}
            className="bento-item bento-item-1"
            delay={0}
          />

          
          <FeatureCard 
            title="Budget Planning"
            description="Create and manage budgets that adapt to your spending habits."
            icon={<Wallet className="w-10 h-10 text-finance-blue" />}
            className="bento-item bento-item-2"
            delay={100}
          />
          
          <FeatureCard 
            title="Savings Goals"
            description="Set and visualize your savings goals with progress tracking."
            icon={<PiggyBank className="w-10 h-10 text-finance-blue" />}
            className="bento-item bento-item-3"
            delay={200}
          />
          
          <FeatureCard 
            title="Smart Expense Tracking"
            description="Automatically categorize and track your expenses with AI-powered insights."
            icon={<TrendingUp className="w-10 h-10 text-finance-blue" />}
            className="bento-item bento-item-4"
            bgClass="bg-finance-navy text-white"
            delay={300}
          />
          
          <FeatureCard 
            title="Bill Reminders"
            description="Never miss a payment with smart bill reminders and alerts."
            icon={<CreditCard className="w-10 h-10 text-finance-blue" />}
            className="bento-item bento-item-5"
            delay={400}
          />
          
          <FeatureCard 
            title="Financial Reports"
            description="Get detailed reports and insights about your financial health."
            icon={<BadgeDollarSign className="w-10 h-10 text-finance-blue" />}
            className="bento-item bento-item-6"
            delay={500}
          />
        </div>
        
        
      </div>
    </section>
  );
};

export default FeatureGrid;
