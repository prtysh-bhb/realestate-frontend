/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Property Card - Premium Design
 * Stunning property card with modern aesthetics and smooth interactions
 */

import { FC, useState } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Heart,
  Eye,
  Share2,
  TrendingUp,
} from "lucide-react";
import { Property } from "@/types/property";
import {
  removeFavProperties,
  setFavProperties,
} from "@/api/customer/properties";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  fetchProperties?: () => void;
}

const PropertyCard: FC<PropertyCardProps> = ({
  property,
  isFavorite = false,
  fetchProperties,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFav, setIsFav] = useState(isFavorite);
  const isLogin = localStorage.getItem("token") ? true : false;
  const navigate = useNavigate();

  const imageSrc =
    property.primary_image_url ||
    property.image_urls?.[0] ||
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800";

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === "number" ? price : parseFloat(price);
    if (isNaN(numPrice)) return "$0";
    return `$${numPrice.toLocaleString()}`;
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLogin) {
      navigate("/login");
      return;
    }

    try {
      if (isFav) {
        await removeFavProperties(property.id);
        setIsFav(false);
        toast.success("Removed from favorites");
      } else {
        await setFavProperties(property.id);
        setIsFav(true);
        toast.success("Added to favorites");
      }
      fetchProperties?.();
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Share functionality
    toast.success("Link copied to clipboard!");
  };

  return (
    <Link to={`/properties/view/${property.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100"
      >
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={imageSrc}
            alt={property.title}
            className="w-full h-full object-cover object-top"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.6 }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-slate-900 text-sm font-semibold rounded-full shadow-lg">
              {property.type === "sale" ? "For Sale" : "For Rent"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <Share2 className="w-5 h-5 text-slate-700" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleFavorite}
              className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFav
                    ? "fill-red-500 text-red-500"
                    : "text-slate-700"
                }`}
              />
            </motion.button>
          </div>

          {/* Price Tag */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    {formatPrice(property.price)}
                  </p>
                  {property.type === "rent" && (
                    <p className="text-sm text-gray-600 font-medium">/month</p>
                  )}
                </div>
                <TrendingUp className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm font-medium line-clamp-1">
              {property.city}, {property.state}
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Bed className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {property.bedrooms}
              </span>
              <span className="text-xs text-gray-500">Beds</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Bath className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {property.bathrooms}
              </span>
              <span className="text-xs text-gray-500">Baths</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <Maximize2 className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {property.area}
              </span>
              <span className="text-xs text-gray-500">sqft</span>
            </div>
          </div>

          {/* View Details Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            View Details
          </motion.button>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-blue-500/0 group-hover:border-blue-500/20 rounded-3xl transition-all duration-500 pointer-events-none" />
      </motion.div>
    </Link>
  );
};

export default PropertyCard;
