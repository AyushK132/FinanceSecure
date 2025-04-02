"use client"
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote: "This finance app has completely transformed how I manage my money. The insights and budgeting tools are incredibly powerful yet simple to use.",
    author: "Sarah Johnson",
    role: "Small Business Owner",
    rating: 5,
  },
  {
    quote: "I've tried many finance apps, but this one stands out with its intuitive design and powerful analytics. It's helped me save an extra $450 per month!",
    author: "Michael Chen",
    role: "Software Engineer",
    rating: 5,
  },
  {
    quote: "The investment tracking feature has been a game-changer for my portfolio management. I can finally see all my investments in one beautiful dashboard.",
    author: "David Rodriguez",
    role: "Investment Analyst",
    rating: 5,
  },
  {
    quote: "I love how the app automatically categorizes my expenses and gives me insights I never would have noticed on my own. It's like having a financial advisor in my pocket.",
    author: "Emma Thompson",
    role: "Marketing Director",
    rating: 5,
  },
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const testimonialRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isPaused, activeIndex]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (testimonialRef.current) {
      observer.observe(testimonialRef.current);
    }

    return () => {
      if (testimonialRef.current) {
        observer.unobserve(testimonialRef.current);
      }
    };
  }, []);

  return (
    <section
      id="testimonials"
      className="section-padding bg-gradient-to-b from-finance-50 to-white"
      ref={testimonialRef}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="bg-finance-100 text-finance-800 px-4 py-1.5 rounded-full text-sm font-medium">
            Testimonials
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
            Loved by thousands of users
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. See what our users have to say about how our
            app has changed their financial lives.
          </p>
        </div>

        <div
          className={`relative max-w-4xl mx-auto transition-opacity duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="glass-card rounded-3xl p-8 md:p-12 shadow-xl border border-finance-100">
            <div className="flex mb-6">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 text-yellow-400 fill-yellow-400"
                />
              ))}
            </div>

            <blockquote className="text-xl md:text-2xl leading-relaxed text-gray-800 mb-8 transition-all duration-500 ease-in-out">
              "{testimonials[activeIndex].quote}"
            </blockquote>

            <div className="flex items-center">
              <div className="mr-4 h-12 w-12 rounded-full bg-finance-200 flex items-center justify-center text-finance-700 text-xl font-semibold">
                {testimonials[activeIndex].author[0]}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {testimonials[activeIndex].author}
                </div>
                <div className="text-gray-600">
                  {testimonials[activeIndex].role}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-8 bg-finance-600"
                    : "w-2 bg-finance-300"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              ></button>
            ))}
          </div>

          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 md:-translate-x-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm border border-finance-100 shadow-lg hover:bg-finance-50"
              onClick={goToPrev}
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="h-5 w-5 text-finance-700" />
            </Button>
          </div>

          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 md:translate-x-6">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 bg-white/80 backdrop-blur-sm border border-finance-100 shadow-lg hover:bg-finance-50"
              onClick={goToNext}
              aria-label="Next testimonial"
            >
              <ArrowRight className="h-5 w-5 text-finance-700" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
