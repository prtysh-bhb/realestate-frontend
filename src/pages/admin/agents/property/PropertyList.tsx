/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getAgentProperties, deleteProperty } from "@/api/agent/property";
import type { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { toast } from "sonner";
import {
  Eye,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Home,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";

const PropertyList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch agent properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getAgentProperties();
      setProperties(data?.data ?? []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ✅ Open confirm popup
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  // ✅ Delete property
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(deleteId);
      await deleteProperty(deleteId);
      toast.success("Property deleted successfully");
      fetchProperties();
    } catch (err) {
      toast.error("Failed to delete property");
    } finally {
      setDeleting(null);
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  // ✅ Property publish status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "sold":
        return "bg-red-100 text-red-700";
      case "rented":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ✅ Admin approval color
  const getApprovalColor = (approval?: string) => {
    switch (approval?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 min-h-screen">
        {/* ---------- Header ---------- */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            🏠 My Properties
          </h1>
          <Button
            onClick={() => navigate("/agent/properties/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            + Add New Property
          </Button>
        </div>

        {/* ---------- Loading / Empty / List ---------- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin mb-2" />
            <p>Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
            <Home className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600 text-sm">No properties found yet.</p>
            <p className="text-gray-400 text-xs">
              Add your first property to get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 p-5 flex flex-col justify-between"
              >
                {/* ---------- Property Info ---------- */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                      {property.title}
                    </h2>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(
                          property.status
                        )}`}
                      >
                        {property.status}
                      </span>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getApprovalColor(
                          property.approval_status
                        )}`}
                      >
                        {property.approval_status || "Pending"}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 flex items-center gap-1 mb-1">
                    <MapPin size={14} className="text-blue-500" />
                    {property.city}, {property.state}
                  </div>

                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <DollarSign size={14} className="text-green-500" />
                    ${property.price.toLocaleString()}
                  </div>
                </div>

                {/* ---------- Actions ---------- */}
                <div className="flex justify-between items-center mt-5 border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                    onClick={() =>
                      navigate(`/agent/properties/${property.id}`)
                    }
                  >
                    <Eye size={16} /> View
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                      onClick={() =>
                        navigate(`/agent/properties/${property.id}/edit`)
                      }
                    >
                      <Edit size={16} />
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => confirmDelete(property.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Delete Confirmation Popup */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="text-yellow-500" size={20} />
                  Confirm Delete
                </h4>
                <button
                  onClick={() => setShowConfirm(false)}
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
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting === deleteId}
                  className={`px-4 py-2 rounded text-white text-sm cursor-pointer ${
                    deleting === deleteId
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {deleting === deleteId ? (
                    <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PropertyList;
