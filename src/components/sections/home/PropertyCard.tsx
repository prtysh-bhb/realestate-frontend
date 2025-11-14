/**
 * PropertyCard Component
 * Professional property card component for listing properties
 * Inspired by Zillow, MagicBricks, and modern real estate platforms
 */

import { FC } from "react";
import { MapPin, BedDouble, Bath, Ruler, Heart } from "lucide-react";
import { Property } from "@/types/property";
import { removeFavProperties, setFavProperties } from "@/api/customer/properties";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { formatAmount } from "@/helpers/customer_helper";
import { PROPERTY_TYPE } from "@/constants";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  fetchProperties?: () => void;
}

const PropertyCard: FC<PropertyCardProps> = ({
  property,
  isFavorite = false,
  fetchProperties
}) => {
  const isLogin = localStorage.getItem("token") ? true : false;
  const navigate = useNavigate();

  const imageSrc =
    property.primary_image_url ||
    property.image_urls?.[0] ||
    "https://placehold.co/400x300?text=No+Image";

  const price =
    typeof property.price === "number"
      ? `$${property.price}`
      : property.price || "$0.00";

  const handleFavourite = async () => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    const response = await setFavProperties(property.id);
    fetchProperties?.();

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const deleteFavourite = async () => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    const response = await removeFavProperties(property.id);
    fetchProperties?.();
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const isSale = property.type === PROPERTY_TYPE.SALE;

  return (
    <div className="group bg-white dark:bg-secondary-900 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 border border-secondary-100 dark:border-secondary-800 relative h-full flex flex-col">

      {/* Image Section with hover effect */}
      <Link to={`/properties/view/${property.id}`} className="relative h-64 w-full overflow-hidden bg-secondary-100 dark:bg-secondary-800">
        <img
          src={imageSrc}
          alt={property.title}
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Type Badge - Sale or Rent */}
        <span
          className={`absolute top-4 left-4 px-4 py-1.5 rounded-full font-semibold text-sm shadow-lg backdrop-blur-sm transition-all capitalize ${
            isSale
              ? "bg-primary-600/90 text-white"
              : "bg-success-600/90 text-white"
          }`}
        >
          For {property.type || "Sale"}
        </span>

        {/* Favorite Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            isFavorite ? deleteFavourite() : handleFavourite();
          }}
          className="absolute top-4 right-4 bg-white/95 dark:bg-secondary-800/95 backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:scale-110 transition-transform duration-200"
        >
          <Heart
            size={20}
            className={
              isFavorite && isLogin
                ? "text-accent-500 fill-accent-500"
                : "text-secondary-600 dark:text-secondary-300 hover:text-accent-500"
            }
          />
        </button>

        {/* Property Type Badge */}
        <span className="absolute bottom-4 left-4 bg-white/95 dark:bg-secondary-800/95 backdrop-blur-sm text-sm font-semibold px-4 py-1.5 rounded-lg shadow-md border border-secondary-200 dark:border-secondary-700 capitalize">
          {property.property_type ?? "N/A"}
        </span>
      </Link>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Price - Prominent Display */}
        <div className="mb-3">
          <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
            ${formatAmount(price)}
          </p>
          <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">
            {isSale ? "Purchase Price" : "Monthly Rent"}
          </p>
        </div>

        {/* Title */}
        <Link
          to={`/properties/view/${property.id}`}
          className="font-bold text-xl text-secondary-900 dark:text-white mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2 group-hover:text-primary-600"
        >
          {property.title || "Untitled Property"}
        </Link>

        {/* Location */}
        <div className="flex items-start gap-2 text-secondary-600 dark:text-secondary-300 mb-4">
          <MapPin size={18} className="mt-0.5 flex-shrink-0" />
          <p className="text-sm line-clamp-2">{property.address || "Address unavailable"}</p>
        </div>

        {/* Property Features */}
        <div className="flex items-center gap-6 py-4 border-t border-secondary-100 dark:border-secondary-800 mb-4">
          <div className="flex items-center gap-2 text-secondary-700 dark:text-secondary-300">
            <BedDouble size={20} className="text-secondary-500" />
            <span className="text-sm font-semibold">{property.bedrooms ?? "—"}</span>
            <span className="text-xs text-secondary-500">Beds</span>
          </div>
          <div className="flex items-center gap-2 text-secondary-700 dark:text-secondary-300">
            <Bath size={20} className="text-secondary-500" />
            <span className="text-sm font-semibold">{property.bathrooms ?? "—"}</span>
            <span className="text-xs text-secondary-500">Baths</span>
          </div>
          <div className="flex items-center gap-2 text-secondary-700 dark:text-secondary-300">
            <Ruler size={20} className="text-secondary-500" />
            <span className="text-sm font-semibold">
              {property.area ? property.area : "—"}
            </span>
            <span className="text-xs text-secondary-500">Sq Ft</span>
          </div>
        </div>

        {/* Agent Info - Footer */}
        <div className="mt-auto pt-4 border-t border-secondary-100 dark:border-secondary-800">
          <div className="flex items-center gap-3">
            <img
              src={property?.agent?.avatar_url ?? "/assets/user.jpg"}
              alt={property.agent?.name || "Agent"}
              className="w-10 h-10 rounded-full object-cover border-2 border-secondary-200 dark:border-secondary-700"
              onError={(e) => {
                e.currentTarget.src = "/assets/user.jpg";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-secondary-900 dark:text-white truncate">
                {property.agent?.name || "Unknown Agent"}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                Listing Agent
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
