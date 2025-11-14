/**
 * Hero Section Component
 * Modern, professional hero section with glassmorphism search
 * Inspired by Zillow, Redfin, and modern real estate platforms
 */

import Header from "@/components/layout/public/Header";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Home,
  X,
  TrendingUp,
} from "lucide-react";
import { FilterState } from "@/types/property";
import { useNavigate } from "react-router-dom";
import { PropertyAttribute, propertyAttributes } from "@/api/customer/properties";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<"rent" | "sale">("rent");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [amenities, setAmenities] = useState<PropertyAttribute[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<PropertyAttribute[]>([]);

  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    location: '',
    state: '',
    city: '',
    property_type: '',
    min_price: '0',
    max_price: '',
    bedrooms: '',
    bathrooms: '',
    min_area: '0',
    max_area: '',
    type: 'rent',
    amenities: [],
    sortBy: 'Newest First'
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleAmenityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFilters(prev => {
      const newAmenities = checked
        ? [...prev.amenities, value]
        : prev.amenities.filter(a => a !== value);
      
      return { ...prev, amenities: newAmenities };
    });
  };

  const fetchAttributes = async () => {
    const attributeResponse = await propertyAttributes();

    setAmenities(attributeResponse.data.amenities || []);
    setPropertyTypes(attributeResponse.data.property_types || []);
  }

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      type: activeTab,
    }));
    fetchAttributes();
  }, [activeTab]);

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (showAdvanced && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAdvanced]);

  const handleSearch = () => {
    // Navigate with query params
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle array values (amenities)
        value.forEach(item => params.append(key, item));
      } else if (value) {
        // Only add non-empty values
        params.append(key, String(value));
      }
    });
    
    navigate(`/properties/${filters.type}?${params.toString()}`);
  };

  return (
    <>
      <Header />
      <div
        className="relative min-h-screen flex flex-col items-center justify-center text-white bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/hero-banner.jpg')",
        }}
      >
        {/* Modern gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-secondary-900/80" />

        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-success-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 px-4 sm:px-8 max-w-7xl w-full pt-32 pb-16">
          {/* Main headline */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-accent-300">
                Dream Home
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-secondary-100 mb-4 max-w-3xl mx-auto font-light">
              Discover the best properties tailored to your lifestyle
            </p>
            {/* Quick stats */}
            <div className="flex items-center justify-center gap-8 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success-400" />
                <span className="text-secondary-200">10,000+ Properties</span>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Home className="w-5 h-5 text-primary-400" />
                <span className="text-secondary-200">500+ Agents</span>
              </div>
            </div>
          </motion.div>

          {/* Modern Rent / Sale Tabs */}
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex bg-white/10 backdrop-blur-xl rounded-2xl p-1.5 border border-white/20 shadow-2xl">
              <button
                onClick={() => setActiveTab("rent")}
                className={`px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  activeTab === "rent"
                    ? "bg-gradient-to-r from-success-500 to-success-600 text-white shadow-lg scale-105"
                    : "text-white hover:bg-white/10"
                }`}
              >
                FOR RENT
              </button>
              <button
                onClick={() => setActiveTab("sale")}
                className={`px-8 py-3 text-sm font-bold rounded-xl transition-all duration-300 ${
                  activeTab === "sale"
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg scale-105"
                    : "text-white hover:bg-white/10"
                }`}
              >
                FOR SALE
              </button>
            </div>
          </motion.div>

          {/* Glassmorphism Search Bar */}
          <motion.div
            className="bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Keyword */}
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Keyword
                </label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="text"
                    placeholder="Villa, Apartment..."
                    id="keyword"
                    value={filters?.keyword}
                    onChange={handleInputChange}
                    maxLength={100}
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="text"
                    id="location"
                    value={filters?.location}
                    onChange={handleInputChange}
                    maxLength={50}
                    placeholder="City, State, ZIP..."
                    className="w-full pl-12 pr-4 py-3.5 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
                  Property Type
                </label>
                <select
                  id="property_type"
                  value={filters?.property_type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="">All Types</option>
                  {propertyTypes?.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Buttons */}
              <div className="md:col-span-3 flex gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 border-2 border-secondary-300 dark:border-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300 font-semibold rounded-xl"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
                <Button
                  size="lg"
                  onClick={handleSearch}
                  className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Advanced Filter Section - Desktop/Tablet (dropdown below) */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                className="hidden md:block mt-6 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-left overflow-hidden"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-secondary-900 dark:text-white">
                    Advanced Filters
                  </h3>
                  <button
                    onClick={() => setShowAdvanced(false)}
                    className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                  </button>
                </div>
                <AdvancedFiltersContent
                  filters={filters}
                  amenities={amenities}
                  handleInputChange={handleInputChange}
                  handleAmenityChange={handleAmenityChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Advanced Filter Section - Mobile (side drawer) */}
      <AnimatePresence>
        {showAdvanced && (
          <>
            {/* Backdrop with blur */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowAdvanced(false)}
            />

            {/* Sliding Drawer */}
            <motion.div
              className="md:hidden fixed top-0 right-0 h-full w-[85%] max-w-md bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl shadow-2xl border-l border-white/20 dark:border-secondary-700/20 z-50 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl border-b border-secondary-200 dark:border-secondary-700 p-6 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Advanced Filters</h2>
                <button
                  onClick={() => setShowAdvanced(false)}
                  className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
                >
                  <X size={22} className="text-secondary-600 dark:text-secondary-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <AdvancedFiltersContent
                  filters={filters}
                  amenities={amenities ?? []}
                  handleInputChange={handleInputChange}
                  handleAmenityChange={handleAmenityChange}
                />
              </div>

              {/* Footer - Apply Button */}
              <div className="sticky bottom-0 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl border-t border-secondary-200 dark:border-secondary-700 p-6">
                <Button
                  onClick={() => {
                    setShowAdvanced(false);
                    handleSearch();
                  }}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                  size="lg"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Modern Advanced Filters Component
const AdvancedFiltersContent = ({
  filters,
  amenities,
  handleInputChange,
  handleAmenityChange
}: {
  filters: FilterState;
  amenities: PropertyAttribute[];
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleAmenityChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Price and Size Range */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Price Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
              Price Range
            </label>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              ${Number(filters?.max_price || 0).toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10000000"
            step="10000"
            id="max_price"
            value={filters?.max_price || 0}
            onChange={handleInputChange}
            className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-xs text-secondary-500">
            <span>$0</span>
            <span>$10M+</span>
          </div>
        </div>

        {/* Size Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
              Size Range
            </label>
            <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
              {Number(filters?.max_area || 0).toLocaleString()} Sq Ft
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="10000"
            step="100"
            id="max_area"
            value={filters?.max_area || 0}
            onChange={handleInputChange}
            className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <div className="flex justify-between text-xs text-secondary-500">
            <span>0 Sq Ft</span>
            <span>10,000+ Sq Ft</span>
          </div>
        </div>
      </div>

      {/* City, Bedrooms, Bathrooms */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
            City
          </label>
          <input
            type="text"
            id="city"
            value={filters?.city}
            onChange={handleInputChange}
            maxLength={50}
            placeholder="Enter city..."
            className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
            Bedrooms
          </label>
          <select
            id="bedrooms"
            value={filters?.bedrooms}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}+ Beds</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
            Bathrooms
          </label>
          <select
            id="bathrooms"
            value={filters?.bathrooms}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>{num}+ Baths</option>
            ))}
          </select>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="text-sm font-bold text-secondary-900 dark:text-white mb-4">
          Amenities
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {amenities?.map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer transition-colors group"
            >
              <input
                type="checkbox"
                value={item.key}
                checked={filters.amenities.includes(item.key)}
                onChange={handleAmenityChange}
                className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-2 focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-sm text-secondary-700 dark:text-secondary-300 group-hover:text-secondary-900 dark:group-hover:text-white">
                {item?.label ?? ""}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;