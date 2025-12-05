/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Home, Star, StarOff } from "lucide-react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import {
  getPropertyById,
  deleteProperty,
  deletePropertyVideo,
  markAsFeatured,
  removeFeatured,
} from "@/api/agent/property";
import type { Property } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import PropertyDocuments from "./PropertyDocuments";
import { Attributes, propertyAttributes } from "@/api/customer/properties";
import { formatAmount } from "@/helpers/customer_helper";
import ReactPlayer from "react-player";
import DeleteModal from "../components/DeleteModal";

const ViewProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [amenities, setAmenities] = useState<Attributes[]>();
  const [propertyTypes, setPropertyTypes] = useState<Attributes[]>();
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showVideoDeleteModal, setShowVideoDeleteModal] = useState(false);
  const [togglingFeatured, setTogglingFeatured] = useState(false);
  const [featuredRemaining, setFeaturedRemaining] = useState<number | "unlimited" | null>(null);

  const fetchPropertyAttributes = async () => {
    const response = await propertyAttributes();
    setAmenities(response.data.amenities);
    setPropertyTypes(response.data.property_types);
  };

  const updatePropertyFromResponse = (respData: any) => {
    if (!respData) return;
    if (respData.property) {
      setProperty(respData.property);
    }
    if (respData.featured_remaining !== undefined) {
      setFeaturedRemaining(respData.featured_remaining);
    }
  };
  const handleMarkAsFeatured = async () => {
    if (!property?.id) return;
    setTogglingFeatured(true);
    try {
      const data = (await markAsFeatured(property.id)) as any;
      if (data?.success) {
        toast.success(data.message || "Property marked as featured");
        // update property + remaining from backend response if provided
        updatePropertyFromResponse(data.data ?? {});
      } else {
        toast.error(data?.message || "Failed to mark featured");
      }
    } catch (err: any) {
      // backend may return 403 with detailed message (e.g. limit reached)
      const msg = err?.response?.data?.message || err?.message || "Failed to mark featured";
      toast.error(msg);
    } finally {
      setTogglingFeatured(false);
    }
  };

  const handleRemoveFeatured = async () => {
    if (!property?.id) return;
    setTogglingFeatured(true);
    try {
      const data = (await removeFeatured(property.id)) as any;
      if (data?.success) {
        toast.success(data?.message || "Featured removed");
        updatePropertyFromResponse(data.data ?? {});
      } else {
        toast.error(data?.message || "Failed to remove featured");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to remove featured";
      toast.error(msg);
    } finally {
      setTogglingFeatured(false);
    }
  };
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/agent/properties");
    }
  };

  const fetchProperty = async () => {
    try {
      const data = await getPropertyById(Number(id));
      if (data) setProperty(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deleteProperty(Number(id));
      toast.success("Property deleted successfully");
      navigate("/agent/properties");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete property");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleVideoDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await deletePropertyVideo(Number(id));
      toast.success("Property video deleted successfully");
      fetchProperty();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete property");
    } finally {
      setDeleting(false);
      setShowVideoDeleteModal(false);
    }
  };

  useEffect(() => {
    fetchProperty();
    fetchPropertyAttributes();
  }, [id]);

  if (loading)
    return (
      <AdminLayout>
        <div className="p-6 text-gray-500">Loading property details...</div>
      </AdminLayout>
    );

  if (!property)
    return (
      <AdminLayout>
        <div className="p-6 text-red-500">Property not found.</div>
      </AdminLayout>
    );

  const allImages =
    property.image_urls && property.image_urls.length > 0 ? property.image_urls : [];

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* ---------- Back & Delete Buttons ---------- */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition font-medium cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <div className="flex gap-2 ">
            {property.is_featured ? (
              <button
                onClick={handleRemoveFeatured}
                disabled={togglingFeatured}
                className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-3 py-2 rounded hover:bg-gray-200 transition text-sm cursor-pointer"
                title="Remove featured"
              >
                <StarOff size={16} />
                <span className="lg:block hidden">
                {togglingFeatured ? "Removing..." : "Unfeature"}
                </span>
              </button>
            ) : (
              <button
                onClick={handleMarkAsFeatured}
                disabled={togglingFeatured}
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 transition text-sm cursor-pointer"
                title="Mark as featured"
              >
                <Star size={16} />
                <span className="lg:block hidden">
                {togglingFeatured ? "Featuring..." : "Feature"}
                </span>
              </button>
            )}

            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
            >
              <Trash2 size={16} />
              <span className="lg:block hidden">
              Delete Property
              </span>
            </button>
          </div>
        </div>

        {/* ---------- Title ---------- */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            {property.title}{" "}
            {property.is_featured && (
              <span className="ml-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600 text-white text-sm font-semibold">
                <Star className="w-4 h-4" /> Featured
              </span>
            )}
          </h1>

          <p className="text-sm text-gray-500">
            Property ID: {property.id} | Status:{" "}
            <span
              className={`font-semibold ${
                property.status === "published"
                  ? "text-green-600"
                  : property.status === "draft"
                  ? "text-yellow-600"
                  : "text-gray-600"
              }`}
            >
              {property.status}
            </span>
          </p>
        </div>

        {/* ---------- Image Gallery ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {allImages.length > 0 ? (
            allImages.map((img: string, i: number) => (
              <img
                key={i}
                src={img}
                alt={`Property Image ${i + 1}`}
                className="w-full h-64 object-cover rounded-xl border border-gray-200 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/800x400?text=Image+Unavailable";
                }}
              />
            ))
          ) : (
            <div className="w-full h-50 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <Home className="w-16 h-16 text-gray-300 dark:text-gray-600" />
            </div>
          )}
        </div>

        {/* ---------- Property Info ---------- */}
        <Card className="shadow-md border border-gray-200">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Info label="Price" value={`${formatAmount(property.price)}`} />
              <Info label="Type" value={property.type} />
              <Info
                label="Property Type"
                value={propertyTypes?.find((a) => a.key === property?.property_type)?.label ?? "-"}
              />
              <Info label="Bedrooms" value={property.bedrooms} />
              <Info label="Bathrooms" value={property.bathrooms} />
              <Info label="Area" value={`${property.area} sqft`} />
              <Info label="Location" value={`${property.city ?? "—"}, ${property.state ?? "—"}`} />
              <Info label="Address" value={property.address} />
              <Info label="Zip Code" value={property.zipcode} />
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-gray-500 text-sm mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenityKey: string, i: number) => {
                    const amenity = amenities?.find((a) => a.key === amenityKey);

                    return (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full"
                      >
                        {amenity ? amenity.label : amenityKey}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <p className="text-gray-500 text-sm mb-2">Description</p>
              <p className="text-gray-800 leading-relaxed">
                {property.description || "No description provided."}
              </p>
            </div>

            {property.approval_status && (
              <div className="border-t pt-4">
                <p className="text-gray-500 text-sm mb-1">Approval Status</p>
                <p
                  className={`font-semibold capitalize ${
                    property.approval_status === "approved"
                      ? "text-green-600"
                      : property.approval_status === "pending"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {property.approval_status}
                </p>

                {property.rejection_reason && (
                  <p className="text-sm text-red-500 mt-1">Reason: {property.rejection_reason}</p>
                )}
              </div>
            )}

            <div className="border-t pt-4 text-gray-500 text-sm">
              <p>
                Created on:{" "}
                <span className="text-gray-800 font-medium">
                  {property.created_at ? new Date(property.created_at).toLocaleDateString() : "—"}
                </span>
              </p>
              {property.updated_at && (
                <p>
                  Last updated:{" "}
                  <span className="text-gray-800 font-medium">
                    {new Date(property.updated_at).toLocaleDateString()}
                  </span>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ✅ Property Documents Section */}
        <div className="mt-8">
          <PropertyDocuments propertyId={property.id} />
        </div>

        {property.video_url && (
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Video</h3>

              <label
                onClick={() => setShowVideoDeleteModal(true)}
                className="cursor-pointer inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                <>
                  <Trash2 size={16} /> Delete Video
                </>
              </label>
            </div>
            <div className="relative h-72 sm:h-[500px] lg:h-[500px] bg-black rounded-xl overflow-hidden">
              <ReactPlayer
                src={property?.video_url ?? ""}
                width="100%"
                height="100%"
                controls
                style={{ borderRadius: "12px" }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ✅ Delete Property Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          show={showDeleteModal}
          title="Delete Property"
          message="This action cannot be undone. Do you really want to delete this property?"
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteProperty}
          loading={deleting}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}

      {/* ✅ Delete Property Video Confirmation Modal */}
      {showVideoDeleteModal && (
        <DeleteModal
          show={showVideoDeleteModal}
          title="Delete Property Video"
          message="This action cannot be undone. Do you really want to delete this property video?"
          onClose={() => setShowVideoDeleteModal(false)}
          onConfirm={handleVideoDelete}
          loading={deleting}
          confirmText="Delete"
          cancelText="Cancel"
        />
      )}
    </AdminLayout>
  );
};

const Info = ({
  label,
  value,
  color = "text-gray-800",
}: {
  label: string;
  value: any;
  color?: string;
}) => (
  <div>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className={`text-lg font-semibold ${color}`}>
      {value !== undefined && value !== null && value !== "" ? value : "—"}
    </p>
  </div>
);

export default ViewProperty;
