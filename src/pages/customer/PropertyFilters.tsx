import { getPropertiesByFilter } from '@/api/customer/properties';
import PropertyCard from '@/components/sections/home/PropertyCard';
import Loader from '@/components/ui/Loader';
import { FilterState, Property } from '@/types/property';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Filter, Search, X } from 'lucide-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PropertyFilters = () => {
  const location = useLocation();
  const propType = location.pathname.includes("/properties/sale") ? "sale" : "rent";
  const [loading, setLoading] = useState<boolean>(true);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
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

  const amenitiesOptions = [
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
  ];

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
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">

        {/* Page Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Find Your Perfect Property &nbsp; 
              {filters?.type && (<span className='text-blue-500 capitalize'>({'For ' + propType})</span>)}
            </h2>
            <p className="text-gray-600 mt-2">Refine your search with our advanced filters</p>
          </div>
        </div>

        {/* Main Content */}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}

          {/* Mobile Toggle Button */}
          <div className="lg:hidden flex justify-between items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            >
              <Filter size={18} />
              {isOpen ? "Hide Filters" : "Show Filters"}
            </button>
          </div>

          {/* Filter Sections */}
          <div className="hidden lg:block">
            <MobileFilters
              isOpen={isOpen}
              filters={filters}
              handleInputChange={handleInputChange}
              handleAmenityChange={handleAmenityChange}
              handleApplyFilters={handleApplyFilters}
              handleResetFilters={handleResetFilters}
              amenitiesOptions={amenitiesOptions}
            />
          </div>

          {/* Properties Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Properties Found</h3>
                  <p className="text-gray-600 mt-1">{totalRecords} properties match your criteria</p>
                </div>
              </div>
            </div>

            {/* Properties Grid */}
            <div className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`}>
              {loading ? (
              // ✅ Show loader centered within the grid area
              <div className="col-span-full flex justify-center items-center min-h-[50vh]">
                <Loader />
              </div>
            ) : properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard key={property.id} property={property} isFavorite={property?.is_favorite ?? false} fetchProperties={fetchProperties} />
              ))
            ) : (
              // ✅ Fallback when no data
              <div className="col-span-full text-center text-gray-500 py-10">
                No properties found.
              </div>
            )}
            </div>

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <ChevronLeft />
                </button>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages} className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <ChevronRight />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Filter Section - Mobile (side drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
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
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <MobileFilters 
                  isOpen={isOpen}
                  filters={filters}
                  handleInputChange={handleInputChange}
                  handleAmenityChange={handleAmenityChange}
                  handleApplyFilters={handleApplyFilters}
                  handleResetFilters={handleResetFilters}
                  amenitiesOptions={amenitiesOptions}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


const MobileFilters = ({
  isOpen,
  filters,
  handleInputChange,
  handleAmenityChange,
  handleApplyFilters,
  handleResetFilters,
  amenitiesOptions,
} : {
  isOpen: boolean;
  filters: FilterState;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleAmenityChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleApplyFilters: () => void;
  handleResetFilters: () => void;
  amenitiesOptions: string[];
}) => {
  return (
    <div
      className={`${
        isOpen ? "block " : "hidden "
      } lg:bg-white lg:rounded-xl lg:shadow-md lg:p-6 lg:block lg:sticky lg:top-6 transition-all duration-300`}
    >
      {/* Quick Search */}
      <div className="mb-6">
        <div className="relative">
          <Search size={19} className='absolute left-3 top-3.5 text-gray-400' />
          <input
            type="text"
            placeholder="Search properties..."
            id="keyword"
            maxLength={100}
            value={filters?.keyword}
            onChange={handleInputChange}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-6">
        {/* Location & City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 hover:underline">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={filters?.location}
              onChange={handleInputChange}
              maxLength={50}
              placeholder="Search location..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 hover:underline">
              City
            </label>
            <input
              type="text"
              id="city"
              value={filters?.city}
              onChange={handleInputChange}
              maxLength={50}
              placeholder="Search city..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 hover:underline">
            Price Range (USD)
          </h3>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="650000"
              id="max_price"
              value={filters?.max_price || 0}
              onChange={handleInputChange}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-sm text-gray-500">
              Up to <b>${filters?.max_price?.toLocaleString() || 0}</b>
            </p>
          </div>
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-semibold text-gray-800 mb-2 block hover:underline">
              Bedrooms
            </label>
            <select
              id="bedrooms"
              value={filters?.bedrooms}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">Select Bedrooms</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-semibold text-gray-800 mb-2 block hover:underline">
              Bathrooms
            </label>
            <select
              id="bathrooms"
              value={filters?.bathrooms}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="">Select Bathrooms</option>
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
              <option value="5">5+</option>
            </select>
          </div>
        </div>

        {/* Size Range */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 hover:underline">
            Size Range (SqFt)
          </h3>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="1500"
              id="max_area"
              value={filters?.max_area || 0}
              onChange={handleInputChange}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-sm text-gray-500">
              Up to <b>{filters?.max_area?.toLocaleString() || 0} SqFt</b>
            </p>
          </div>
        </div>

        {/* Property Type */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 hover:underline">
            Property Type
          </h3>
          <select
            id="property_type"
            value={filters?.property_type}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">Select Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-2 hover:underline">
            Amenities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {amenitiesOptions.map((item) => (
              <label
                key={item}
                className="flex items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="checkbox"
                  value={item}
                  checked={filters?.amenities?.includes(item)}
                  onChange={handleAmenityChange}
                  className="accent-blue-600 rounded cursor-pointer"
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-gray-200 space-y-2">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;