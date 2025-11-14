/**
 * RecommendedProperties Component
 * Professional property showcase with category filters
 * Inspired by Zillow, Redfin, and modern real estate platforms
 */

import { useState, useEffect } from "react";
import { getProperties } from "@/api/public/recomandedproperty";
import PropertyCard from "./PropertyCard";
import { Property } from "@/types/property";
import { motion } from "framer-motion";
import { Sparkles, AlertCircle, Loader2 } from "lucide-react";

const RecommendedProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("View All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    "View All",
    "Apartment",
    "Villa",
    "Studio",
    "House",
    "Office",
  ];

  // Fetch property data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getProperties();

      const propertyArray: Property[] =
        res?.data?.properties && Array.isArray(res.data.properties)
          ? res.data.properties
          : [];

      setProperties(propertyArray);
    } catch (err: unknown) {
      console.error("Error fetching properties:", err);
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to load properties. Please try again later.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredProperties =
    selectedCategory === "View All"
      ? properties
      : properties.filter(
          (p) =>
            (typeof p.property_type === "string" &&
              p.property_type.toLowerCase() ===
                selectedCategory.toLowerCase()) ||
            (typeof p.type === "string" &&
              p.type.toLowerCase() === selectedCategory.toLowerCase())
        );

  // Loading UI
  if (loading)
    return (
      <section className="relative py-24 bg-white dark:bg-secondary-950">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          <p className="text-secondary-600 dark:text-secondary-400 font-medium">
            Loading properties...
          </p>
        </div>
      </section>
    );

  // Error UI
  if (error)
    return (
      <section className="relative py-24 bg-white dark:bg-secondary-950">
        <div className="flex flex-col items-center justify-center gap-4 max-w-md mx-auto text-center px-6">
          <div className="p-4 bg-accent-100 dark:bg-accent-900/20 rounded-full">
            <AlertCircle className="w-8 h-8 text-accent-600 dark:text-accent-400" />
          </div>
          <p className="text-accent-600 dark:text-accent-400 font-medium">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
          >
            Try Again
          </button>
        </div>
      </section>
    );

  return (
    <section className="relative py-24 px-6 md:px-20 bg-white dark:bg-secondary-950 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary-400 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Featured Properties
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mt-4 mb-4">
            Recommended For You
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto">
            Handpicked properties matching your preferences
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30 scale-105"
                    : "bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-700 border border-secondary-200 dark:border-secondary-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Property Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {Array.isArray(filteredProperties) && filteredProperties.length > 0 ? (
            filteredProperties.map((p, index) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PropertyCard
                  property={p}
                  isFavorite={p?.is_favorite ?? false}
                  fetchProperties={fetchData}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="inline-flex flex-col items-center gap-4">
                <div className="p-4 bg-secondary-100 dark:bg-secondary-800 rounded-full">
                  <Sparkles className="w-8 h-8 text-secondary-400" />
                </div>
                <p className="text-secondary-600 dark:text-secondary-400 text-lg font-medium">
                  No properties found in this category
                </p>
                <button
                  onClick={() => setSelectedCategory("View All")}
                  className="text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                >
                  View all properties
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default RecommendedProperties;
