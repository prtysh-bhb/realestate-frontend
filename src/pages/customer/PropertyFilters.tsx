/**
 * PropertyFilters Component
 * Professional property listing page with advanced filters
 * Inspired by Zillow, Redfin, and modern real estate platforms
 */

import { Attributes, getPropertiesByFilter, propertyAttributes } from '@/api/customer/properties';
import PropertyCard from '@/components/sections/home/PropertyCard';
import Loader from '@/components/ui/Loader';
import { FilterState, Property } from '@/types/property';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Search, X, Home as HomeIcon, LayoutGrid, RotateCcw } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PropertyFilters = () => {
  const location = useLocation();
  const propType = location.pathname.includes("/properties/sale") ? "sale" : "rent";
  const [loading, setLoading] = useState<boolean>(true);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [amenities, setAmenities] = useState<Attributes[]>();
  const [propertyTypes, setPropertyTypes] = useState<Attributes[]>();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    location: '',
    state: '',
    city: '',
    property_type: '',
    min_price: '',
    max_price: '',
    bedrooms: '',
    bathrooms: '',
    min_area: '',
    max_area: '',
    type: 'rent',
    amenities: [],
    sortBy: 'Newest First'
  });

  const [properties, setProperties] = useState<Property[]>([]);

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

  const fetchPropertyAttributes = async () => {
    const response = await propertyAttributes();
    setAmenities(response.data.amenities);
    setPropertyTypes(response.data.property_types);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const filterData: FilterState = {
      keyword: params.get("keyword") || "",
      location: params.get("location") || "",
      state: params.get("state") || "",
      city: params.get("city") || "",
      property_type: params.get("property_type") || "",
      min_price: params.get("min_price") || "",
      max_price: params.get("max_price") || "",
      bedrooms: params.get("bedrooms") || "",
      bathrooms: params.get("bathrooms") || "",
      min_area: params.get("min_area") || "",
      max_area: params.get("max_area") || "",
      type: propType || "rent",
      amenities: params.get("amenities")
        ? params.get("amenities")!.split(",")
        : [],
      sortBy: params.get("sortBy") || "Newest First",
    };

    setFilters(filterData);
    setShouldFetch(true);
  }, [location.search, propType]);

  const fetchProperties = async () => {    
    setLoading(true);

    try {
      const data = await getPropertiesByFilter(page, filters);
      
      if(data.success){
        setProperties(data?.data.data ?? []);
        setTotalPages(data?.data?.last_page || 1);
        setTotalRecords(data?.data?.total || 0);
        setLoading(false);
        setShouldFetch(false);
      }else{
        console.error('Error fetching properties: '+ data.message);
      }
    } catch(e) {
      console.error("Failed to fetch properties: "+ e);
    }
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchProperties();
      fetchPropertyAttributes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetch]);

  useEffect(() => {
    setShouldFetch(true);
  }, [page]);

  const handleApplyFilters = () => {
    setShouldFetch(true);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      state: '',
      city: '',
      property_type: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      bathrooms: '',
      min_area: '',
      max_area: '',
      type: propType,
      amenities: [],
      sortBy: ''
    });

    handleApplyFilters();
  };

  // const toggleFavorite = (propertyId: number) => {
  //   setProperties(prev => 
  //     prev.map(property => 
  //       property.id === propertyId 
  //         ? { ...property, isFavorite: !property.isFavorite }
  //         : property
  //     )
  //   );
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-secondary-50 dark:from-secondary-950 dark:via-secondary-900 dark:to-secondary-950">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">

        {/* Page Title */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-2">
                Find Your Perfect Property
              </h1>
              <p className="text-lg text-secondary-600 dark:text-secondary-400">
                {filters?.type && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full text-sm font-semibold">
                    <HomeIcon className="w-4 h-4" />
                    For {propType === 'sale' ? 'Sale' : 'Rent'}
                  </span>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Toggle Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all font-semibold"
            >
              <Filter size={18} />
              {isOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              amenities={amenities ?? []}
              propertyTypes={propertyTypes ?? []}
              handleInputChange={handleInputChange}
              handleAmenityChange={handleAmenityChange}
              handleApplyFilters={handleApplyFilters}
              handleResetFilters={handleResetFilters}
            />
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <motion.div
              className="bg-white dark:bg-secondary-900 rounded-2xl shadow-card border border-secondary-100 dark:border-secondary-800 p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                    <LayoutGrid className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    Properties Found
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                    <span className="font-semibold text-primary-600 dark:text-primary-400">{totalRecords}</span> properties match your criteria
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Properties Grid */}
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
              {loading ? (
                <div className="col-span-full flex justify-center items-center min-h-[50vh]">
                  <Loader />
                </div>
              ) : properties.length > 0 ? (
                properties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <PropertyCard
                      property={property}
                      isFavorite={property?.is_favorite ?? false}
                      fetchProperties={fetchProperties}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="inline-flex flex-col items-center gap-4">
                    <div className="p-6 bg-secondary-100 dark:bg-secondary-800 rounded-full">
                      <HomeIcon className="w-16 h-16 text-secondary-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
                      No Properties Found
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 max-w-md">
                      We couldn't find any properties matching your criteria. Try adjusting your filters.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-3 bg-white dark:bg-secondary-900 border-2 border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl shadow-lg">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-3 bg-white dark:bg-secondary-900 border-2 border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Sliding Drawer */}
            <motion.div
              className="lg:hidden fixed top-0 right-0 h-full w-[85%] max-w-md bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl shadow-2xl border-l border-white/20 dark:border-secondary-700/20 z-50 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl border-b border-secondary-200 dark:border-secondary-700 p-6 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
                >
                  <X size={22} className="text-secondary-600 dark:text-secondary-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <FilterSidebar
                  filters={filters}
                  amenities={amenities ?? []}
                  propertyTypes={propertyTypes ?? []}
                  handleInputChange={handleInputChange}
                  handleAmenityChange={handleAmenityChange}
                  handleApplyFilters={handleApplyFilters}
                  handleResetFilters={handleResetFilters}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


const FilterSidebar = ({
  filters,
  amenities,
  propertyTypes,
  handleInputChange,
  handleAmenityChange,
  handleApplyFilters,
  handleResetFilters,
} : {
  filters: FilterState;
  amenities: Attributes[];
  propertyTypes: Attributes[];
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAmenityChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
}) => {
  return (
    <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-card border border-secondary-100 dark:border-secondary-800 p-6 lg:sticky lg:top-24 transition-all duration-300">
      {/* Section Header */}
      <div className="mb-6 pb-6 border-b border-secondary-200 dark:border-secondary-700">
        <h3 className="text-lg font-bold text-secondary-900 dark:text-white flex items-center gap-2">
          <Filter className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          Filter Properties
        </h3>
      </div>

      {/* Quick Search */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
          Keyword Search
        </label>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
          <input
            type="text"
            placeholder="Search properties..."
            id="keyword"
            maxLength={100}
            value={filters?.keyword}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-3 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-6">
        {/* Location & City */}
        <div>
          <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            value={filters?.location}
            onChange={handleInputChange}
            maxLength={50}
            placeholder="Enter location..."
            className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-900 dark:text-white placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

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

        {/* Price Range */}
        <div>
          <div className="flex items-center justify-between mb-3">
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
          <div className="flex justify-between text-xs text-secondary-500 mt-2">
            <span>$0</span>
            <span>$10M+</span>
          </div>
        </div>

        {/* Bedrooms */}
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
            <option value="">Any Bedrooms</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}+ Beds
              </option>
            ))}
          </select>
        </div>

        {/* Bathrooms */}
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
            <option value="">Any Bathrooms</option>
            {[1, 2, 3, 4].map((num) => (
              <option key={num} value={num}>
                {num}+ Baths
              </option>
            ))}
            <option value="5">5+ Baths</option>
          </select>
        </div>

        {/* Size Range */}
        <div>
          <div className="flex items-center justify-between mb-3">
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
          <div className="flex justify-between text-xs text-secondary-500 mt-2">
            <span>0 Sq Ft</span>
            <span>10,000+ Sq Ft</span>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-2">
            Property Type
          </label>
          <select
            id="property_type"
            value={filters?.property_type}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer"
          >
            <option value="">All Property Types</option>
            {propertyTypes?.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-sm font-bold text-secondary-900 dark:text-white mb-4">
            Amenities
          </h3>
          <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto scrollbar-thin">
            {amenities?.map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer transition-colors group"
              >
                <input
                  type="checkbox"
                  value={item.key}
                  checked={filters?.amenities?.includes(item.key)}
                  onChange={handleAmenityChange}
                  className="w-4 h-4 rounded border-secondary-300 text-primary-600 focus:ring-2 focus:ring-primary-500 cursor-pointer"
                />
                <span className="text-sm text-secondary-700 dark:text-secondary-300 group-hover:text-secondary-900 dark:group-hover:text-white">
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-secondary-200 dark:border-secondary-700 space-y-3">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="w-full bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 py-3 rounded-xl font-semibold hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;