/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * PropertyView Component
 * Professional property details page with premium UI
 *
 * Screenshot (dev): /mnt/data/1ab1f4d7-eed7-4bb1-820b-277b5460a353.png
 */

import {
  Attributes,
  getProperty,
  InquiryFormData,
  propertyAttributes,
  propertyInquiry,
} from "@/api/customer/properties";
import Loader from "@/components/ui/Loader";
import { DocumentFile, Property } from "@/types/property";
import { createCustomerAppointment } from "@/api/customer/appointments";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Share2,
  Heart,
  FileText,
  FileImage,
  FileSpreadsheet,
  FileType,
  File,
  Eye,
  ChevronLeft,
  ChevronRight,
  Home,
  CheckCircle2,
  Mail,
  Phone,
  Download,
  Building2,
  Sparkles,
  Video,
  Image,
  Calendar,
  Clock,
  X,
  Star,
} from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CustomerInquiryModal from "./CustomerInquiryModal";
import { toast } from "sonner";
import { formatAmount, getDocumentTypeFromUrl, getFileSizeInMB } from "@/helpers/customer_helper";
import ImageModal from "./ImageModal";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import moment from "moment-timezone";
import { removeFavProperties, setFavProperties } from "@/api/customer/properties";

const PropertyView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [property, setProperty] = useState<Property | null>(null);
  const [amenities, setAmenities] = useState<Attributes[]>();
  const [propertyTypes, setPropertyTypes] = useState<Attributes[]>();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const isLogin = localStorage.getItem("token") ? true : false;

  // Appointment modal state
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [appointmentTime, setAppointmentTime] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<"visit" | "call">("visit");
  const [customerNotes, setCustomerNotes] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [locationInput, setLocationInput] = useState<string>("");
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [creatingAppointment, setCreatingAppointment] = useState(false);
  const [isFav, setIsFav] = useState<boolean>(property?.is_favorite ?? false);

  const fetchPropertyAttributes = async () => {
    const response = await propertyAttributes();
    setAmenities(response.data.amenities);
    setPropertyTypes(response.data.property_types);
  };

  const handleSubmitInquiry = async (inquiryData: InquiryFormData) => {
    const response = await propertyInquiry(Number(id), inquiryData);

    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }

    setIsModalOpen(false);
  };

  const handleCreateAppointment = async () => {
    // validations
    if (!appointmentDate || !appointmentTime) {
      toast.error("Please select date and time");
      return;
    }
    if (appointmentType === "call" && !phoneNumber.trim()) {
      toast.error("Please enter phone number for call");
      return;
    }
    if (appointmentType === "visit" && !locationInput.trim()) {
      toast.error("Please enter meeting location for visit");
      return;
    }
    if (!property) {
      toast.error("Property data not loaded");
      return;
    }

    try {
      setCreatingAppointment(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not authenticated — please log in");
        setIsAppointmentModalOpen(false);
        navigate("/login");
        return;
      }

      // convert date + time to timezone-aware ISO (Asia/Kolkata used as example)
      const scheduledAt = moment
        .tz(`${appointmentDate} ${appointmentTime}`, "YYYY-MM-DD HH:mm", "Asia/Kolkata")
        .toISOString();

      // Build payload exactly matching backend fields
      // API signature: createCustomerAppointment(propertyId, agentId, scheduledAt, type, durationMinutes, customerNotes, phoneNumber, location, status, token)
      await createCustomerAppointment(
        Number(property.id),
        property.agent?.id ?? null,
        scheduledAt,
        appointmentType,
        Number(durationMinutes) || 30,
        customerNotes?.trim() || null,
        phoneNumber?.trim() || null,
        (appointmentType === "visit"
          ? locationInput?.trim() || property.address
          : property.address) || null,
        "scheduled",
        token
      );

      toast.success("Appointment created successfully!");
      setIsAppointmentModalOpen(false);

      // Reset form
      setAppointmentDate("");
      setAppointmentTime("");
      setAppointmentType("visit");
      setCustomerNotes("");
      setPhoneNumber("");
      setLocationInput("");
      setDurationMinutes(30);

      // optional: navigate to user's appointments
    } catch (err: any) {
      console.error("create appointment", err?.response?.data ?? err);
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to create appointment";
      toast.error(msg);
    } finally {
      setCreatingAppointment(false);
    }
  };

  const getDocumentIcon = (type: "pdf" | "image" | "word" | "excel" | "other"): JSX.Element => {
    switch (type) {
      case "pdf":
        return <FileText className="text-red-500" />;
      case "image":
        return <FileImage className="text-green-500" />;
      case "word":
        return <FileType className="text-blue-600" />;
      case "excel":
        return <FileSpreadsheet className="text-green-600" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  const handleToggleFavorite = async () => {
    if (!isLogin) {
      navigate("/login");
      return;
    }

    // SAFETY: ensure property and property.id exist before calling API
    if (!property || typeof property.id !== "number") {
      toast.error("Property not loaded yet");
      return;
    }

    try {
      if (isFav) {
        await removeFavProperties(property.id); // now property.id is number
        setIsFav(false);
        toast.success("Removed from favorites");
      } else {
        await setFavProperties(property.id);
        setIsFav(true);
        toast.success("Added to favorites");
      }
    } catch (err) {
      console.error("toggle favorite error", err);
      toast.error("Failed to update favorites");
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = property
      ? `${window.location.origin}/properties/view/${property.id}`
      : window.location.href;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };
  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (images.length ? (prev + 1) % images.length : 0));
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      images.length ? (prev - 1 + images.length) % images.length : 0
    );
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getProperty(Number(id));
        if (data.success) {
          initDocuments(data.data.property?.document_urls ?? []);
          setProperty(data.data.property);
          setImages(data.data.property?.image_urls ?? []);
          setDocuments(data.data.property?.document_urls ?? []);
        } else {
          console.error("Error fetching property:" + data.message);
        }
      } catch (err) {
        console.error("Failed to load property details", err);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyAttributes();
    fetchProperty();
  }, [id]);

  const initDocuments = (documents: DocumentFile[] = []): void => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".webm"];

    const imageDocs = documents.filter((doc) =>
      imageExtensions.some((ext) => (doc.url ?? "").toLowerCase().endsWith(ext))
    );

    const nonImageDocs = documents.filter(
      (doc) =>
        !imageExtensions.some((ext) => (doc.url ?? "").toLowerCase().endsWith(ext)) &&
        !videoExtensions.some((ext) => (doc.url ?? "").toLowerCase().endsWith(ext))
    );

    setImages(imageDocs.map((doc) => doc.url));
    setDocuments(nonImageDocs);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <Link
              to={`/properties/${property?.type}`}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              {property?.type === "sale" ? "For Sale" : "For Rent"}
            </Link>
            <ChevronRight size={16} className="text-gray-400" />
            <span className="text-gray-900 font-semibold truncate max-w-xs">{property?.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        {/* Property Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{property?.title}</h1>
                
                {property?.is_featured && (
                  <span className="flex justify-center items-center text-xs font-semibold px-3 py-1 rounded-full capitalize bg-yellow-100 text-yellow-700">
                    <Star size={16} />
                  </span>
                )}

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    property?.approval_status === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : property?.approval_status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {(property?.approval_status?.charAt(0).toUpperCase() ?? "") +
                    (property?.approval_status?.slice(1) ?? "")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-4 max-w-auto">
                <MapPin size={18} className="text-blue-600 flex-shrink-0" />
                <span className="text-base">
                  {property?.address}, {property?.city}, {property?.state} {property?.zipcode}
                </span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-left sm:text-right">
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  {formatAmount(property?.price ?? 0)}
                </p>
                <p className="text-gray-600 capitalize font-medium mt-1">
                  For {property?.type === "sale" ? "Sale" : "Rent"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-blue-300 transition-all shadow-sm cursor-pointer"
                >
                  <Share2 size={20} className="text-gray-600 cursor-pointer" />
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm cursor-pointer"
                >
                  <Heart
                    className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : "text-slate-700"}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                icon: Bed,
                label: "Bedrooms",
                value: property?.bedrooms ?? "-",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Bath,
                label: "Bathrooms",
                value: property?.bathrooms ?? "-",
                color: "from-emerald-500 to-emerald-600",
              },
              {
                icon: Maximize,
                label: "Area",
                value: property?.area ? `${property.area.toLocaleString()} ft²` : "-",
                color: "from-purple-500 to-purple-600",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6"
              >
                <div className={`inline-flex p-3 bg-gradient-to-br ${stat.color} rounded-xl mb-3`}>
                  <stat.icon size={24} className="text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Media Gallery with Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("photos")}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
                  activeTab === "photos"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Image size={20} />
                Photos ({images.length})
              </button>
              <button
                onClick={() => setActiveTab("videos")}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all ${
                  activeTab === "videos"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Video size={20} />
                Video
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {activeTab === "photos" ? (
                <>
                  {images.length > 0 ? (
                    <div className="relative">
                      {/* Main Image */}
                      <div className="relative h-96 sm:h-[500px] lg:h-[600px]">
                        <img
                          src={images[selectedImageIndex] ?? ""}
                          alt={`Property image ${selectedImageIndex + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/assets/no_image_found.jpg";
                          }}
                        />

                        {/* Navigation Arrows */}
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                            >
                              <ChevronLeft size={24} className="text-gray-900" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                            >
                              <ChevronRight size={24} className="text-gray-900" />
                            </button>
                          </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                          {selectedImageIndex + 1} / {images.length}
                        </div>
                      </div>

                      {/* Thumbnail Strip */}
                      {images.length > 1 && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {images.map((image, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedImageIndex(index)}
                                className={`relative flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden transition-all ${
                                  selectedImageIndex === index
                                    ? "ring-4 ring-blue-600 scale-105"
                                    : "ring-2 ring-gray-200 hover:ring-blue-300"
                                }`}
                              >
                                <img
                                  src={image}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/assets/no_image_found.jpg";
                                  }}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-100">
                      <Image className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No photos available</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {property?.video_url ? (
                    <div className="space-y-4">
                      {/* Main Video Player */}
                      <div className="relative h-96 sm:h-[500px] lg:h-[600px] bg-black rounded-xl overflow-hidden">
                        <ReactPlayer
                          src={property?.video_url}
                          width="100%"
                          height="100%"
                          controls
                          style={{ borderRadius: "12px" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-96 flex flex-col items-center justify-center bg-gray-100">
                      <Video className="w-16 h-16 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg">No video available</p>
                      <p className="text-gray-400 text-sm mt-2">
                        Check back later for property video
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Rest of the component remains exactly the same */}
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                  <Home size={24} className="text-white" />
                </div>
                Property Description
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">{property?.description}</p>
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl">
                  <Building2 size={24} className="text-white" />
                </div>
                Property Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  {
                    label: "Property Type",
                    value:
                      propertyTypes?.find((a) => a.key === property?.property_type)?.label ?? "-",
                  },
                  { label: "City", value: property?.city },
                  { label: "State", value: property?.state },
                  { label: "Zip Code", value: property?.zipcode },
                  {
                    label: "Listed On",
                    value: new Date(property?.created_at ?? "").toLocaleDateString(),
                  },
                  { label: "Property ID", value: `#${property?.id}` },
                ].map((detail, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-600 font-medium">{detail.label}</span>
                    <span className="font-bold text-gray-900 capitalize w-50">{detail.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                  <Sparkles size={24} className="text-white" />
                </div>
                Amenities & Features
              </h2>
              {property?.amenities && property?.amenities?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property?.amenities?.map((amenityKey: string, index: number) => {
                    const amenity = amenities?.find((a) => a.key === amenityKey);

                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border-2 border-transparent hover:border-blue-100 hover:bg-blue-50 transition-all"
                      >
                        <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">
                          {amenity ? amenity.label : amenityKey}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 italic">
                  No amenities listed for this property
                </div>
              )}
            </motion.div>

            {/* Location & Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6 sm:p-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <MapPin size={24} className="text-white" />
                  </div>
                  Location
                </h2>
              </div>
              <div className="p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <Home size={18} className="text-blue-600" />
                      Address
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {property?.address}
                      <br />
                      {property?.city}, {property?.state} {property?.zipcode}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin size={18} className="text-emerald-600" />
                      Neighborhood
                    </h3>
                    <p className="text-gray-700">{property?.location}</p>
                  </div>
                </div>
                {/* Map */}
                <div className="rounded-2xl overflow-hidden h-64 sm:h-80 shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.8776891874794!2d72.57136217526489!3d23.022505779165887!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f5cf3a65df%3A0x3b1c7c5c50b99b39!2sAhmedabad%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1699536000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Property Location Map"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Agent & Actions */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl shadow-xl p-6 sm:p-8 top-24"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Listing Agent</h2>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={property?.agent?.avatar_url ?? " "}
                  alt="Agent"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/assets/user.jpg";
                  }}
                />
                <div>
                  <h3 className="font-bold text-xl text-white">{property?.agent?.name}</h3>
                  <p className="text-blue-100 text-sm">Licensed Agent</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <a
                  href={`mailto:${property?.agent?.email}`}
                  className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all text-white"
                >
                  <Mail size={18} />
                  <span className="text-sm truncate">{property?.agent?.email}</span>
                </a>
                {property?.agent?.phone && (
                  <a
                    href={`tel:${property?.agent?.phone}`}
                    className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all text-white"
                  >
                    <Phone size={18} />
                    <span className="text-sm">{property?.agent?.phone}</span>
                  </a>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    if (isLogin) {
                      setIsModalOpen(true);
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="w-full cursor-pointer bg-white text-blue-700 py-4 rounded-2xl hover:bg-gray-50 transition-all font-bold shadow-lg flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  <Mail size={20} />
                  Request Information
                </button>

                <button
                  onClick={() => {
                    if (isLogin) {
                      // prefill location with property address
                      setLocationInput(property?.address ?? "");
                      setIsAppointmentModalOpen(true);
                    } else {
                      navigate("/login");
                    }
                  }}
                  className="w-full cursor-pointer bg-emerald-500 text-white py-4 rounded-2xl hover:bg-emerald-600 transition-all font-bold shadow-lg flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  <Calendar size={20} />
                  Create Appointment
                </button>
              </div>
            </motion.div>

            {/* Property Status */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Property Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Listing Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      property?.status === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : property?.status === "sold" || property?.status === "rented"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {(property?.status?.charAt(0).toUpperCase() ?? "") + property?.status?.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">Approval Status</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      property?.approval_status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : property?.approval_status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {(property?.approval_status?.charAt(0).toUpperCase() ?? "") +
                      property?.approval_status?.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Documents */}
            {documents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-blue-600" />
                  Documents
                </h3>
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {getDocumentIcon(getDocumentTypeFromUrl(doc.url))}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{doc.name}</p>
                          <p className="text-gray-500 text-xs">{getFileSizeInMB(doc.size)}</p>
                        </div>
                      </div>
                      {isLogin ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="flex-shrink-0 p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                        >
                          <Download size={20} />
                        </a>
                      ) : (
                        <Link
                          to="/login"
                          className="flex-shrink-0 p-2 text-blue-600 hover:bg-blue-100 rounded-xl transition-all"
                        >
                          <Eye size={20} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      <CustomerInquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitInquiry}
      />

      {/* Image Modal */}
      <ImageModal
        images={images ?? []}
        initialIndex={selectedImageIndex}
        isOpen={isImageModalOpen}
        onClose={handleCloseImageModal}
        title="Property Images"
      />

      {/* Appointment Modal */}
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsAppointmentModalOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Create Appointment
                </h3>
                <button
                  onClick={() => setIsAppointmentModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Property Info */}
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="font-semibold text-gray-900">{property?.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{property?.address}</p>
                <p className="text-sm font-medium text-blue-600 mt-1">
                  Agent: {property?.agent?.name}
                </p>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                <input
                  type="time"
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Appointment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Type *
                </label>
                <select
                  value={appointmentType}
                  onChange={(e) => setAppointmentType(e.target.value as "visit" | "call")}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="visit">Property Visit</option>
                  <option value="call">Phone Call</option>
                </select>
              </div>

              {/* Phone Number (for calls) */}
              {appointmentType === "call" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Location (for visits) */}
              {appointmentType === "visit" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Location *
                  </label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="Enter meeting address or spot (defaults to property address)"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  min={15}
                  max={480}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Customer Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  rows={3}
                  placeholder="Any special requirements or questions..."
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Location Info */}
              <div className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>Location: {property?.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Clock className="w-4 h-4" />
                  <span>Default Duration: 30 minutes (you can change)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsAppointmentModalOpen(false)}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
                disabled={creatingAppointment}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAppointment}
                disabled={
                  creatingAppointment ||
                  !appointmentDate ||
                  !appointmentTime ||
                  (appointmentType === "call" && !phoneNumber.trim()) ||
                  (appointmentType === "visit" && !locationInput.trim())
                }
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {creatingAppointment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    Create Appointment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default PropertyView;
