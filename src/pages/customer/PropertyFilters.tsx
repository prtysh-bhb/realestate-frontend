/**
 * PropertyFilters Component
 * Professional property listing page with advanced filters
 * Premium design with glassmorphism and modern aesthetics
 */

import { Attributes, getPropertiesByFilter, propertyAttributes } from '@/api/customer/properties';
import PropertyCard from '@/components/sections/home/PropertyCard';
import Loader from '@/components/ui/Loader';
import { FilterState, Property } from '@/types/property';
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  X,
  Home as HomeIcon,
  LayoutGrid,
  RotateCcw,
  Building2,
  MapPin,
  Sparkles
} from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white font-semibold">
                Properties For {propType === 'sale' ? 'Sale' : 'Rent'}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Discover Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Perfect Property
              </span>
            </h1>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Browse through our curated selection of premium properties and find your dream home today
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{totalRecords}+</div>
                <div className="text-sm text-gray-400">Available Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-sm text-gray-400">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-sm text-gray-400">Customer Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-12">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all font-semibold"
          >
            <Filter size={20} />
            {isOpen ? "Hide Filters" : "Show Filters & Search"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl">
                    <LayoutGrid className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Available Properties
                    </h3>
                    <p className="text-gray-600 mt-1">
                      <span className="font-bold text-blue-600">{totalRecords}</span> properties match your search criteria
                    </p>
                  </div>
                </div>

                {/* Sort Dropdown */}
                <select
                  id="sortBy"
                  value={filters.sortBy}
                  onChange={handleInputChange}
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer font-medium"
                >
                  <option value="Newest First">Newest First</option>
                  <option value="Oldest First">Oldest First</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                </select>
              </div>
            </motion.div>

            {/* Properties Grid */}
            {loading ? (
              <div className="flex justify-center items-center min-h-[60vh]">
                <Loader />
              </div>
            ) : properties.length > 0 ? (
              <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                {properties.map((property, index) => (
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
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center"
              >
                <div className="inline-flex flex-col items-center gap-6 max-w-md mx-auto">
                  <div className="p-8 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-3xl">
                    <Building2 className="w-20 h-20 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-3">
                      No Properties Found
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      We couldn't find any properties matching your search criteria. Try adjusting your filters or search in a different location.
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all transform hover:scale-105"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset All Filters
                  </button>
                </div>
              </motion.div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center gap-3 mt-12"
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-blue-300 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-5 py-3 rounded-2xl font-bold transition-all ${
                          page === pageNum
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                            : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 hover:border-blue-300 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
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
              className="lg:hidden fixed top-0 right-0 h-full w-[90%] max-w-md bg-white backdrop-blur-xl shadow-2xl z-50 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white backdrop-blur-xl border-b border-gray-200 p-6 flex items-center justify-between z-10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <Filter className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Filters & Search</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X size={22} className="text-gray-600" />
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
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 lg:sticky lg:top-24">
      {/* Section Header */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            Filter Properties
          </h3>
        </div>
        <p className="text-sm text-gray-600">Refine your search to find the perfect match</p>
      </div>

      {/* Quick Search */}
      <div className="mb-6">
        <label className="block text-sm font-bold text-gray-900 mb-3">
          Quick Search
        </label>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by keyword..."
            id="keyword"
            maxLength={100}
            value={filters?.keyword}
            onChange={handleInputChange}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-6">
        {/* Location */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
            <MapPin className="w-4 h-4 text-blue-600" />
            Location
          </label>
          <input
            type="text"
            id="location"
            value={filters?.location}
            onChange={handleInputChange}
            maxLength={50}
            placeholder="e.g., Downtown, Suburbs..."
            className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            City
          </label>
          <input
            type="text"
            id="city"
            value={filters?.city}
            onChange={handleInputChange}
            maxLength={50}
            placeholder="e.g., New York, Los Angeles..."
            className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Price Range */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-gray-900">
              Maximum Price
            </label>
            <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
            <span>$0</span>
            <span>$10M+</span>
          </div>
        </div>

        {/* Bedrooms & Bathrooms Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Beds
            </label>
            <select
              id="bedrooms"
              value={filters?.bedrooms}
              onChange={handleInputChange}
              className="w-full px-3 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer font-medium"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}+
                </option>
              ))}
            </select>
          </div>

          {/* Bathrooms */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Baths
            </label>
            <select
              id="bathrooms"
              value={filters?.bathrooms}
              onChange={handleInputChange}
              className="w-full px-3 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer font-medium"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num}+
                </option>
              ))}
              <option value="5">5+</option>
            </select>
          </div>
        </div>

        {/* Size Range */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-gray-900">
              Maximum Area
            </label>
            <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
              {Number(filters?.max_area || 0).toLocaleString()} ft²
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
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
            <span>0 ft²</span>
            <span>10,000+ ft²</span>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
            <Building2 className="w-4 h-4 text-blue-600" />
            Property Type
          </label>
          <select
            id="property_type"
            value={filters?.property_type}
            onChange={handleInputChange}
            className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer font-medium"
          >
            <option value="">All Types</option>
            {propertyTypes?.map((type) => (
              <option key={type.key} value={type.key}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Amenities
          </h3>
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto scrollbar-thin pr-2">
            {amenities?.map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-all group border-2 border-transparent hover:border-blue-100"
              >
                <input
                  type="checkbox"
                  value={item.key}
                  checked={filters?.amenities?.includes(item.key)}
                  onChange={handleAmenityChange}
                  className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-gray-200 space-y-3">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
          >
            <Search className="w-5 h-5" />
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
