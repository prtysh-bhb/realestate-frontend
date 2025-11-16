/**
 * Testimonials Section - Premium Design
 * Features customer reviews and success stories
 */

import { APP_NAME } from "@/constants";
import { motion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const FaqSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      rating: 5,
      text: `${APP_NAME} made finding my dream home incredibly easy. The search filters are intuitive, and the agent support was exceptional. Highly recommended!`,
    },
    {
      name: "Michael Chen",
      role: "Property Investor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      rating: 5,
      text: "As an investor, I need quick access to market data. This platform provides everything I need with real-time updates and detailed analytics.",
    },
    {
      name: "Emily Rodriguez",
      role: "First-time Buyer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      rating: 5,
      text: `Being a first-time buyer was daunting, but ${APP_NAME}'s team guided me through every step. The virtual tours saved me so much time!`,
    },
    {
      name: "David Thompson",
      role: "Real Estate Agent",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      rating: 5,
      text: "The best platform for real estate professionals. The tools and features help me close deals faster and keep my clients happy.",
    },
    {
      name: "Lisa Anderson",
      role: "Renter",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
      rating: 5,
      text: "Found my perfect apartment in just two days! The rental process was seamless, and all listings were verified and accurate.",
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full mb-4">
            <Star className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-600">
              Client Testimonials
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect property with us
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12"
          >
            {/* Quote Icon */}
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
              <Quote className="w-8 h-8 text-blue-600" />
            </div>

            {/* Rating Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              "{testimonials[currentIndex].text}"
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h4 className="text-lg font-bold text-slate-900">
                  {testimonials[currentIndex].name}
                </h4>
                <p className="text-gray-600">{testimonials[currentIndex].role}</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-blue-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { label: "Customer Rating", value: "4.9/5" },
            { label: "Happy Clients", value: "5,000+" },
            { label: "Properties Sold", value: "15,000+" },
            { label: "Expert Agents", value: "500+" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
