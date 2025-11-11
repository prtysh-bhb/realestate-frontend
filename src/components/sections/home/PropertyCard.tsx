import { FC } from "react";
import { MapPin, BedDouble, Bath, Ruler, DollarSign, Heart } from "lucide-react";
import { Property } from "@/types/property";
import { removeFavProperties, setFavProperties } from "@/api/customer/properties";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { formatAmount } from "@/helpers/customer_helper";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean; // optional flag, default false
  fetchProperties?: () => void;
}

const PropertyCard: FC<PropertyCardProps> = ({ property, isFavorite = false, fetchProperties }) => {
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
    if(!isLogin){
      navigate('/login');
      return;
    }
    const response = await setFavProperties(property.id);
    fetchProperties?.();
    
    if(response.success){
        toast.success(response.message);
    }else{
        toast.error(response.message);
    }
  }

  const deleteFavourite = async () => {
    if(!isLogin){
      navigate('/login');
      return;
    }
    const response = await removeFavProperties(property.id);
    fetchProperties?.();
    if(response.success){
        toast.success(response.message);
    }else{
        toast.error(response.message);
    }
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 relative">

      {/* Image Section */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={property.title}
          className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
        />

        {/* Type Badge */}
        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow capitalize">
          {property.type || "For Sale"}
        </span>

        {/* Favorite Icon */}
        {isFavorite && isLogin ? (
                <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow cursor-pointer" onClick={deleteFavourite}>
                    <Heart size={20} className="text-red-500 fill-red-500" />
                </div>
            ) : (
                <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow cursor-pointer" onClick={handleFavourite}>
                    <Heart size={20} className="text-gray-500 fill-gray-500 hover:text-red-500 hover:fill-red-500" />
                </div>
         )}

        {/* Property Type Badge */}
        <span className="absolute bottom-3 left-3 bg-white text-xs font-semibold px-3 py-1 rounded-md shadow border border-gray-100 capitalize">
          {property.property_type ?? "N/A"}
        </span>
      </div>

      {/* Content Section */}
      <div className="p-5 grid gap-1">
        <Link to={"/properties/view/"+property.id} className="font-bold text-lg text-gray-800 mb-2 hover:text-blue-600 cursor-pointer">
          {property.title || "Untitled Property"}
        </Link>

        <p className="text-md text-gray-500 font-medium flex items-center gap-1 mb-4">
          <MapPin size={18} className="text-gray-700" />
          {property.address || "Address unavailable"}
        </p>

        {/* Property Info Section */}
        <div className="flex justify-start gap-5 font-medium text-gray-600 text-lg mb-4">
          <div className="flex items-center gap-1">
            <BedDouble size={18} className="text-gray-700" />
            <span>{property.bedrooms ?? "—"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={18} className="text-gray-700" />
            <span>{property.bathrooms ?? "—"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler size={18} className="text-gray-700" />
            <span>
              {property.area ? `${property.area} Sq Ft` : "— Sq Ft"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t border-gray-200 pt-3">
          <div className="flex items-center gap-2">
            
            <img
              src={property?.agent?.avatar_url ?? ' '}
              alt={property.agent.name}
              className="w-9 h-9 rounded-full object-cover"
              onError={(e) => {
                  e.currentTarget.src = "/src/assets/user.jpg";
              }}
            />
            <span className="text-md text-gray-700 font-medium">
              {property.agent.name || "Unknown Agent"}
            </span>
          </div>

          <p className="font-bold text-gray-800 text-xl flex items-center gap-1">
            <DollarSign size={20} />
            {formatAmount(price)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
