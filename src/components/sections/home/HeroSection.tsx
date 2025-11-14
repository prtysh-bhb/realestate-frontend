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
} from "lucide-react";
import { FilterState } from "@/types/property";
import { useNavigate } from "react-router-dom";
import { Attributes, propertyAttributes } from "@/api/customer/properties";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<"rent" | "sale">("rent");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [amenities, setAmenities] = useState<Attributes[]>();
  const [propertyTypes, setPropertyTypes] = useState<Attributes[]>();

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
        className="relative min-h-screen flex flex-col items-center justify-center text-center text-white bg-cover bg-bottom bg-fixed"
        style={{
          backgroundImage: "url('/assets/hero-banner.jpg')",
        }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50 backdrop-blur-sm" />

        {/* Hero content */}
        <div className="relative z-10 px-4 sm:px-8 max-w-6xl w-full pt-24 py-8">
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Find Your <span className="text-[#3151f3]">Dream Home</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            We are a real estate agency that helps you find the best residence
            you dream of. Let’s discuss your dream home today.
          </motion.p>

          {/* Rent / Sale Tabs */}
          <div className="relative z-20 inline-flex bg-white/10 backdrop-blur-md rounded-full p-1 mb-6">
            <button
              onClick={() => setActiveTab("rent")}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-all ${
                activeTab === "rent"
                  ? "bg-[#0d33f6] text-white shadow"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              FOR RENT
            </button>
            <button
              onClick={() => setActiveTab("sale")}
              className={`px-6 py-2 text-sm font-semibold rounded-full transition-all ${
                activeTab === "sale"
                  ? "bg-[#0d33f6] text-white shadow"
                  : "text-gray-200 hover:text-white"
              }`}
            >
              FOR SALE
            </button>
          </div>

          {/* Basic Search Bar */}
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-4 items-center justify-between max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
          >
            {/* Keyword */}
            <div className="flex-1 w-full">
              <label className="flex flex-start text-xl font-medium text-black ">
                Keyword
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-3 mt-1 bg-gray-50">
                <Home size={18} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search Keyword..."
                  id="keyword"
                  value={filters?.keyword}
                  onChange={handleInputChange}
                  maxLength={100}
                  className="bg-transparent outline-none text-sm w-full text-gray-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex-1 w-full">
              <label className="flex flex-start text-xl font-medium text-black">
                Location
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-3 mt-1 bg-gray-50">
                <MapPin size={18} className="text-gray-400" />
                <input
                  type="text"
                  id="location"
                  value={filters?.location}
                  onChange={handleInputChange}
                  maxLength={50}
                  placeholder="Search Location..."
                  className="bg-transparent outline-none text-sm w-full text-gray-700 cursor-pointer"
                />
              </div>
            </div>

            {/* Type */}
            <div className="flex-1 w-full">
              <label className="flex flex-start text-xl font-medium text-black">Property Type</label>
              <select id="property_type" value={filters?.property_type} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 mt-1 text-sm bg-gray-50 text-gray-700 outline-none cursor-pointer">
                <option value="">Select Property Type</option>
                {propertyTypes?.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-6 justify-end">
              <Button
                variant="outline"
                size={'lg'}
                className="border-gray-300 text-black text-md hover:bg-gray-100 cursor-pointer"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <SlidersHorizontal size={16} className="mr-1" /> Advanced
              </Button>
              <Button size={'lg'} onClick={handleSearch} className="bg-[#134ef2] hover:bg-[#0d33f6] text-white px-6 py-2 cursor-pointer">
                <Search size={16} className="mr-2" /> Search
              </Button>
            </div>
          </motion.div>

          {/* Advanced Filter Section - Desktop/Tablet (dropdown below) */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                className="hidden md:block absolute bg-white rounded-2xl shadow-xl mt-4 p-6 md:p-8 left-8 right-8 text-left text-gray-700 overflow-hidden z-30"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <AdvancedFiltersContent 
                  filters={filters}
                  amenities={amenities ?? []}
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
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowAdvanced(false)}
            />

            {/* Sliding Drawer */}
            <motion.div
              className="md:hidden fixed top-0 right-0 h-full w-[85%] max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold text-gray-800">Advanced Filters</h2>
                <button
                  onClick={() => setShowAdvanced(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
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
              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                <Button 
                  onClick={() => {
                    setShowAdvanced(false);
                    handleSearch();
                  }}
                  className="w-full bg-[#134ef2] hover:bg-[#0d33f6] text-white"
                  size="lg"
                >
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

// Extracted component for the advanced filters content
const AdvancedFiltersContent = ({ 
  filters, 
  amenities,
  handleInputChange, 
  handleAmenityChange 
}: {
  filters: FilterState;
  amenities: Attributes[];
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleAmenityChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <>
      {/* Price and Size Range */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Price Range */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">
            Price Range <span className="text-gray-400">(USD)</span>
          </label>
          <input
            type="range"
            min="0"
            max="650000"
            step="0"
            id="max_price"
            value={filters?.max_price || 0}
            onChange={handleInputChange}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <p className="text-sm text-gray-500 mt-1">
            Up to <b>${Number(filters?.max_price || 0).toLocaleString()}</b>
          </p>
        </div>

        {/* Size Range */}
        <div>
          <label className="text-sm font-semibold text-gray-600 mb-2 block">
            Size Range <span className="text-gray-400">(SqFt)</span>
          </label>
          <input
            type="range"
            min="0"
            max="1500"
            step="0"
            id="max_area"
            value={filters?.max_area || 0}
            onChange={handleInputChange}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <p className="text-sm text-gray-500 mt-1">
            Up to <b>{Number(filters?.max_area || 0).toLocaleString()} SqFt</b>
          </p>
        </div>
      </div>

      {/* Dropdowns */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="text-sm font-semibold text-gray-600">
            City
          </label>
          <div className="w-full border border-gray-200 rounded-lg p-3 mt-1 text-sm bg-gray-50 outline-none cursor-pointer">
            <input
              type="text"
              id="city"
              value={filters?.city}
              onChange={handleInputChange}
              maxLength={50}
              placeholder="Search City..."
              className="bg-transparent outline-none text-sm w-full text-gray-700 cursor-pointer"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">
            Bathrooms
          </label>
          <select id="bathrooms" value={filters?.bathrooms} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 mt-1 text-sm bg-gray-50 outline-none cursor-pointer">
            <option value="">Select Bathrooms</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-600">
            Bedrooms
          </label>
          <select id="bedrooms" value={filters?.bedrooms} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg p-3 mt-1 text-sm bg-gray-50 outline-none cursor-pointer">
            <option value="">Select Bedrooms</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="text-sm font-bold mb-3">Amenities:</h3>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-3 text-sm text-gray-600">
          {amenities?.map((item) => (
            <div key={item.key} className="flex items-center">
              <label key={item.key} className="flex items-center text-sm gap-2">
                <input type="checkbox" value={item.key} checked={filters.amenities.includes(item.key)} onChange={handleAmenityChange} className="accent-blue-600 rounded cursor-pointer" />
                {item?.label ?? ""}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;