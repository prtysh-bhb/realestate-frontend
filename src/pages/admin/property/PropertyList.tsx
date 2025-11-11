/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  getAdminProperties,
  approveProperty,
  rejectProperty,
} from "@/api/admin/property";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Check,
  X,
  Home,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/components/layout/admin/AdminLayout";

const PropertyList = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingPropertyId, setRejectingPropertyId] = useState<number | null>(
    null
  );

  // ✅ Fetch all properties
  const fetchProperties = async () => {
    setLoading(true);
    try {
      const data = await getAdminProperties({
        approval_status: selectedFilter,
      });
      setProperties(data?.properties ?? []);
    } catch {
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [selectedFilter]);

  // ✅ Approve property
  const handleApprove = async (id: number) => {
    try {
      await approveProperty(id);
      toast.success("Property approved successfully");
      fetchProperties();
    } catch {
      toast.error("Failed to approve property");
    }
  };

  // ✅ Show reject popup
  const openRejectPopup = (id: number) => {
    setRejectingPropertyId(id);
    setRejectReason("");
    setShowRejectPopup(true);
  };

  // ✅ Confirm reject
  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please enter a reason for rejection");
      return;
    }

    if (!rejectingPropertyId) {
      toast.error("No property selected for rejection");
      return;
    }

    try {
      await rejectProperty(rejectingPropertyId, rejectReason);
      toast.success("Property rejected successfully");
      setShowRejectPopup(false);
      setRejectingPropertyId(null);
      fetchProperties();
    } catch {
      toast.error("Failed to reject property");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h1 className="text-2xl font-semibold text-gray-800">
            🏡 Admin Property Management
          </h1>

          <select
            className="border px-3 py-2 rounded-md text-sm shadow-sm focus:ring focus:ring-blue-200"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <option value="all">All Properties</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Loading / Empty */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <Home className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-600 font-medium">No properties found.</p>
            <p className="text-gray-400 text-sm">
              Try changing the filter or add new properties.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-sm rounded-xl border border-gray-100">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="p-3 text-left">Title</th>
                    <th className="p-3 text-left">Agent</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-left">City</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Approval</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 font-medium text-gray-800 truncate max-w-[200px]">
                        {p.title}
                      </td>
                      <td className="p-3 text-gray-600 text-sm">
                        {p.agent?.name || "N/A"}
                      </td>
                      <td className="p-3 text-gray-700 font-medium">
                        ${p.price.toLocaleString()}
                      </td>
                      <td className="p-3 text-gray-600">{p.city}</td>
                      <td className="p-3 text-gray-600 capitalize">
                        {p.status || "—"}
                      </td>
                      <td className="p-3">
                        <Badge
                          className={`px-3 py-1 border font-semibold text-xs ${getStatusColor(
                            p.approval_status
                          )}`}
                        >
                          {p.approval_status}
                        </Badge>
                      </td>
                      <td className="p-3 flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-400 text-green-700 hover:bg-green-50 cursor-pointer"
                          onClick={() => handleApprove(p.id)}
                          disabled={p.approval_status === "approved"}
                        >
                          <Check className="w-4 h-4 mr-1" /> Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                          onClick={() => openRejectPopup(p.id)}
                          disabled={p.approval_status === "rejected"}
                        >
                          <X className="w-4 h-4 mr-1" /> Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ✅ Popup Modal for Rejection */}
        {showRejectPopup && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="text-red-500" size={20} />
                  Reject Property
                </h4>
                <button
                  onClick={() => setShowRejectPopup(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4">
                Please enter the reason for rejecting this property.
              </p>

              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full border rounded-md p-3 text-sm mb-4 focus:ring-2 focus:ring-red-300"
                placeholder="Enter rejection reason..."
              ></textarea>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectPopup(false)}
                  className="cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmReject}
                  className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PropertyList;
