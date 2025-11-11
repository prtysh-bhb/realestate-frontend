/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { getProperties } from "@/api/public/recomandedproperty";
import PropertyCard from "./PropertyCard";
import { Property } from "@/types/property";

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

  // ✅ Fetch property data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res: any = await getProperties();

      const propertyArray: Property[] =
        res?.data?.properties && Array.isArray(res.data.properties)
          ? res.data.properties
          : [];

      setProperties(propertyArray);
    } catch (err: any) {
      console.error("Error fetching properties:", err);
      const message =
        err.response?.data?.message ||
        "Failed to load properties. Please try again later.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter logic
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

  // ✅ Loading and error UI
  if (loading)
    return (
      <section className="py-[100px] text-center">
        <p className="text-gray-600">Loading properties...</p>
      </section>
    );

  if (error)
    return (
      <section className="py-[100px] text-center">
        <p className="text-red-600">{error}</p>
      </section>
    );

  return (
    <section className="relative flex flex-col items-center bg-white py-[100px] px-4 md:px-10">
      {/* Header */}
      <div className="text-center mb-16">
        <p className="text-sm uppercase tracking-widest text-[#134ef2] font-semibold">
          Featured Properties
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
          Recommended For You
        </h2>

        {/* Category Filter Tabs */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-md border text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#134ef2] text-white border-[#134ef2]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        {Array.isArray(filteredProperties) && filteredProperties.length > 0 ? (
          filteredProperties.map((p) => (
            <PropertyCard key={p.id} property={p} isFavorite={p?.is_favorite ?? false} fetchProperties={fetchData} />
          ))
        ) : (
          <p className="text-gray-500 mt-10 col-span-full text-center">
            No properties found.
          </p>
        )}
      </div>
    </section>
  );
};

export default RecommendedProperties;
