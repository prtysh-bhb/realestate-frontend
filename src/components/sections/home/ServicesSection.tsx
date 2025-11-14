/**
 * ServicesSection Component
 * Professional services showcase with animated counters
 * Inspired by Zillow, Redfin, and modern real estate platforms
 */

import { useEffect, useState, useRef } from "react";
import { Home, Key, House, ArrowRight, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    id: 1,
    title: "Buy A New Home",
    desc: "Discover your dream home effortlessly. Explore diverse properties and expert guidance for a seamless buying experience.",
    icon: Home,
    gradient: "from-primary-500 to-primary-600",
    bgGradient: "from-primary-50 to-primary-100",
  },
  {
    id: 2,
    title: "Rent A Home",
    desc: "Discover your perfect rental effortlessly. Explore a diverse variety of listings tailored precisely to suit your unique lifestyle needs.",
    icon: Key,
    gradient: "from-success-500 to-success-600",
    bgGradient: "from-success-50 to-success-100",
  },
  {
    id: 3,
    title: "Sell A Home",
    desc: "Sell confidently with expert guidance and effective strategies, showcasing your property's best features for a successful sale.",
    icon: House,
    gradient: "from-accent-500 to-accent-600",
    bgGradient: "from-accent-50 to-accent-100",
  },
];

const counters = [
  { id: 1, value: 10000, label: "Properties Listed", suffix: "+" },
  { id: 2, value: 500, label: "Expert Agents", suffix: "+" },
  { id: 3, value: 5000, label: "Happy Clients", suffix: "+" },
  { id: 4, value: 150, label: "Awards Won", suffix: "+" },
];

const ServicesSection = () => {
  const [counts, setCounts] = useState(counters.map(() => 0));
  const [started, setStarted] = useState(false);
  const counterRef = useRef(null);

  // Intersection Observer to start animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) observer.observe(counterRef.current);

    return () => {
      if (counterRef.current) observer.unobserve(counterRef.current);
    };
  }, [started]);

  // Counter animation
  useEffect(() => {
    if (!started) return;

    counters.forEach((counter, index) => {
      let start = 0;
      const end = counter.value;
      const duration = 2000;
      const incrementTime = 20;
      const increment = end / (duration / incrementTime);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          start = end;
          clearInterval(timer);
        }
        setCounts((prev) => {
          const newCounts = [...prev];
          newCounts[index] = Math.floor(start);
          return newCounts;
        });
      }, incrementTime);
    });
  }, [started]);

  return (
    <section className="relative px-6 md:px-20 py-24 bg-gradient-to-br from-secondary-50 via-white to-secondary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-success-400 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
            <TrendingUp className="w-4 h-4" />
            Our Services
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mt-4 mb-4">
            What We Do?
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Professional real estate services tailored to your needs
          </p>
        </motion.div>

        {/* Services Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                className="group relative bg-white dark:bg-secondary-900 rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 border border-secondary-100 dark:border-secondary-800 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className={`p-5 rounded-2xl bg-gradient-to-br ${service.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4 text-center">
                    {service.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 text-center mb-6 leading-relaxed">
                    {service.desc}
                  </p>

                  {/* Learn More Link */}
                  <div className="flex justify-center">
                    <a
                      href="#"
                      className={`inline-flex items-center gap-2 font-semibold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent group-hover:gap-3 transition-all`}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 text-current group-hover:translate-x-1 transition-transform" style={{ color: 'inherit' }} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Achievement Counters */}
        <motion.div
          ref={counterRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {counters.map((counter, i) => (
            <div
              key={counter.id}
              className="text-center p-6 rounded-2xl bg-white dark:bg-secondary-900 shadow-card border border-secondary-100 dark:border-secondary-800"
            >
              <div className="flex items-center justify-center gap-1 mb-2">
                <h3 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  {counts[i].toLocaleString()}
                </h3>
                <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {counter.suffix}
                </span>
              </div>
              <p className="text-secondary-700 dark:text-secondary-300 font-semibold uppercase tracking-wide text-sm">
                {counter.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
