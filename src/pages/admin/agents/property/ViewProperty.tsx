/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, AlertTriangle, X } from "lucide-react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { getPropertyById, deleteProperty, Property } from "@/api/agent/property";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import PropertyDocuments from "./PropertyDocuments";
import { Attributes, propertyAttributes } from "@/api/customer/properties";

const getImageUrl = (path?: string | null) => {
  if (!path) return "https://placehold.co/800x400?text=No+Image";
  if (path.startsWith("http")) return path;
  const clean = path.replace(/^public\//, "").replace(/^storage\//, "");
  return `${import.meta.env.VITE_API_URL}/storage/${clean}`;
};

const ViewProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [amenities, setAmenities] = useState<Attributes[]>();
  const [propertyTypes, setPropertyTypes] = useState<Attributes[]>();
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchPropertyAttributes = async () => {
    const response = await propertyAttributes();
    setAmenities(response.data.amenities);
    setPropertyTypes(response.data.property_types);
  };

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/admin/agents/property");
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
      navigate("/admin/agents/property");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete property");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
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
    property.image_urls && property.image_urls.length > 0
      ? property.image_urls
      : property.images?.map((img) => getImageUrl(img)) || [];

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

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
          >
            <Trash2 size={16} />
            Delete Property
          </button>
        </div>

        {/* ---------- Title ---------- */}
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">
            {property.title}
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
            allImages.map((img, i) => (
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
            <img
              src="https://placehold.co/800x400?text=No+Image"
              alt="No Image"
              className="w-full h-64 object-cover rounded-xl border border-gray-200"
            />
          )}
        </div>

        {/* ---------- Property Info ---------- */}
        <Card className="shadow-md border border-gray-200">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Info label="Price" value={`$${property.price.toLocaleString()}`} />
              <Info label="Type" value={property.type} />
              <Info label="Property Type" value={propertyTypes?.find(a => a.key === property?.property_type)?.label ?? '-'} />
              <Info label="Bedrooms" value={property.bedrooms} />
              <Info label="Bathrooms" value={property.bathrooms} />
              <Info label="Area" value={`${property.area} sqft`} />
              <Info
                label="Location"
                value={`${property.city ?? "—"}, ${property.state ?? "—"}`}
              />
              <Info label="Address" value={property.address} />
              <Info label="Zip Code" value={property.zipcode} />
            </div>

            {property.amenities && property.amenities.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-gray-500 text-sm mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenityKey: string, i: number) => {
                    const amenity = amenities?.find(a => a.key === amenityKey);

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
                  <p className="text-sm text-red-500 mt-1">
                    Reason: {property.rejection_reason}
                  </p>
                )}
              </div>
            )}

            <div className="border-t pt-4 text-gray-500 text-sm">
              <p>
                Created on:{" "}
                <span className="text-gray-800 font-medium">
                  {property.created_at
                    ? new Date(property.created_at).toLocaleDateString()
                    : "—"}
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
      </div>

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="text-yellow-500" size={20} />
                Confirm Delete
              </h4>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to delete this property? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProperty}
                disabled={deleting}
                className={`px-4 py-2 rounded text-white text-sm cursor-pointer ${
                  deleting
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
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
