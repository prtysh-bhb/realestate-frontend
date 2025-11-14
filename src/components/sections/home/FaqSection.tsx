/**
 * TestimonialsSection Component (FaqSection)
 * Professional testimonials carousel with smooth scrolling
 * Inspired by Zillow, Redfin, and modern real estate platforms
 */

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star, MessageSquare, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Liam Anderson",
    role: "CEO Digital",
    text: `I truly appreciate the professionalism and in-depth knowledge of the brokerage team. They not only helped me find the perfect home but also assisted with legal and financial aspects, making me feel confident and secure in my decision.`,
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    id: 2,
    name: "Adam Will",
    role: "CEO Agency",
    text: `My experience with property management services has exceeded expectations. They efficiently manage properties with a professional and attentive approach in every situation.`,
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: 3,
    name: "Sophia Turner",
    role: "Investor",
    text: `The team made my buying experience smooth and transparent. Their attention to detail and quick communication impressed me.`,
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 4,
    name: "Noah Davis",
    role: "Entrepreneur",
    text: `Excellent service! From finding my dream property to handling documentation — everything was handled efficiently.`,
    image: "https://randomuser.me/api/portraits/men/56.jpg",
  },
  {
    id: 5,
    name: "Ella Johnson",
    role: "Home Owner",
    text: `The agency helped me sell my home quickly and at a great price. Their team is reliable and trustworthy.`,
    image: "https://randomuser.me/api/portraits/women/50.jpg",
  },
  {
    id: 6,
    name: "James Carter",
    role: "Investor",
    text: `I love how professional and transparent the process was. Highly recommended for anyone in real estate.`,
    image: "https://randomuser.me/api/portraits/men/80.jpg",
  },
];

const FaqSection = () => {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [autoPlay, setAutoPlay] = useState(false);

  // Scroll the slider by width of 1 card set
  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const scrollAmount = slider.offsetWidth / 3; // show 3 per view
    slider.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative px-6 md:px-20 py-24 bg-gradient-to-br from-secondary-50 via-white to-secondary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-40 left-20 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-accent-400 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start gap-12">
          {/* Left section */}
          <motion.div
            className="md:w-1/3 flex-shrink-0"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
              <MessageSquare className="w-4 h-4" />
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mt-4 mb-4">
              What People Say
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed mb-8">
              Our seasoned team excels in real estate with years of successful
              market navigation, offering informed decisions and optimal results.
            </p>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => scroll("left")}
                className="p-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-4 bg-white dark:bg-secondary-900 border-2 border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800 shadow-md hover:shadow-lg transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Testimonials Slider */}
          <div className="flex-1 overflow-hidden">
            <div
              ref={sliderRef}
              onMouseEnter={() => setAutoPlay(false)}
              onMouseLeave={() => setAutoPlay(true)}
              className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar py-4"
            >
              {testimonials.map((t, index) => (
                <motion.div
                  key={t.id}
                  className="group relative bg-white dark:bg-secondary-900 rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 border border-secondary-100 dark:border-secondary-800 flex-shrink-0 w-[350px] md:w-[400px] overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Quote icon */}
                  <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-20 h-20 text-primary-600" />
                  </div>

                  <div className="relative z-10">
                    {/* Stars */}
                    <div className="flex mb-4 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-warning-500 fill-warning-500"
                        />
                      ))}
                    </div>

                    {/* Text */}
                    <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed mb-6 line-clamp-6">
                      "{t.text}"
                    </p>

                    {/* Divider */}
                    <div className="w-12 h-1 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full mb-6" />

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800 shadow-md"
                      />
                      <div>
                        <h4 className="font-bold text-secondary-900 dark:text-white text-lg">
                          {t.name}
                        </h4>
                        <p className="text-sm text-secondary-500 dark:text-secondary-400">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
