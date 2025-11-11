import Header from "@/components/layout/public/Header";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Home,
} from "lucide-react";
import { FilterState } from "@/types/property";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState<"rent" | "sale">("rent");
  const [showAdvanced, setShowAdvanced] = useState(false);
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

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      type: activeTab,
    }));
  }, [activeTab]);

  const handleSearch = () => {
    // Navigate with query params
    const params = new URLSearchParams(filters);
    navigate(`/properties/${filters.type}?${params.toString()}`);
  };

  return (
    <>
      <Header />
      <div
        className="relative min-h-screen flex flex-col items-center justify-center text-center text-white bg-cover bg-bottom bg-fixed"
        style={{
          backgroundImage: "url('src/assets/hero-banner.jpg')",
        }}
      >
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50 backdrop-blur-sm" />

        {/* Hero content */}
        <div className="relative z-10 px-4 sm:px-8 max-w-6xl w-full">
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
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="commercial">Commercial</option>
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

          {/* Advanced Filter Section */}
          {showAdvanced && (
            <motion.div
              className="absolute bg-white rounded-2xl shadow-xl mt-4 p-6 md:p-8 max-w-6xl mx-auto text-left text-gray-700 overflow-hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* ✅ Working Price and Size Range */}
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
                    Up to <b>${filters?.max_price.toLocaleString()}</b>
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
                    Up to <b>{filters?.max_area.toLocaleString()} SqFt</b>
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

              <div>
                <h3 className="text-sm font-bold mb-3">Amenities:</h3>
                <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-3 text-sm text-gray-600 ">
                  {[
                    "Air Condition",
                    "Garage",
                    "Elevator",
                    "Swimming Pool",
                    "WiFi",
                    "Pet Friendly",
                    "Security",
                    "Parking",
                    "Garden",
                    "Furnishing",
                    "Heating",
                    "Floor",
                  ].map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input type="checkbox" value={item} checked={filters.amenities.includes(item)} onChange={handleAmenityChange} className="accent-blue-600 rounded cursor-pointer" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
