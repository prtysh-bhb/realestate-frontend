/**
 * WhyChooseSection Component
 * Professional benefits showcase with animated cards
 * Inspired by Zillow, Redfin, and modern real estate platforms
 */

import { Star, Lightbulb, Shield, Award } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    id: 1,
    title: "Proven Expertise",
    desc: "Our seasoned team excels in real estate with years of successful market navigation, offering informed decisions and optimal results.",
    icon: Award,
    gradient: "from-primary-500 to-primary-600",
  },
  {
    id: 2,
    title: "Customized Solutions",
    desc: "We pride ourselves on crafting personalized strategies to match your unique goals, ensuring a seamless real estate journey.",
    icon: Lightbulb,
    gradient: "from-success-500 to-success-600",
  },
  {
    id: 3,
    title: "Transparent Partnerships",
    desc: "Transparency is key in our client relationships. We prioritize clear communication and ethical practices, fostering trust and reliability throughout.",
    icon: Shield,
    gradient: "from-accent-500 to-accent-600",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="relative px-6 md:px-20 py-24 bg-white dark:bg-secondary-950 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
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
            <Star className="w-4 h-4" />
            Our Benefits
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mt-4 mb-4">
            Why Choose Us
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Experience excellence in real estate with our dedicated team
          </p>
        </motion.div>

        {/* Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <motion.div
                key={benefit.id}
                className="group relative bg-secondary-50 dark:bg-secondary-900 rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-500 border border-secondary-100 dark:border-secondary-800 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className={`p-5 rounded-2xl bg-gradient-to-br ${benefit.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-4 text-center">
                    {benefit.title}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 text-center leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/50 to-transparent dark:from-white/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
