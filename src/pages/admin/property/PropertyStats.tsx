/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getPropertyStats } from "@/api/admin/property";
import { Card, CardContent } from "@/components/ui/card";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { Loader2, Home, BarChart3, Building2, CheckCircle2, XCircle, Clock4, DollarSign } from "lucide-react";

const PropertyStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPropertyStats()
      .then((data) => setStats(data))
      .catch(() => console.error("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <div className="flex justify-center items-center min-h-[70vh]">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </AdminLayout>
    );

  if (!stats)
    return (
      <AdminLayout>
        <div className="flex flex-col justify-center items-center min-h-[70vh] text-gray-500">
          <Home className="w-10 h-10 mb-2 text-gray-400" />
          <p>No statistics available.</p>
        </div>
      </AdminLayout>
    );

  const items = [
    { label: "Total Properties", value: stats.total, icon: Building2, color: "bg-blue-100 text-blue-700 border-blue-200" },
    { label: "Published", value: stats.published, icon: CheckCircle2, color: "bg-green-100 text-green-700 border-green-200" },
    { label: "Pending Approval", value: stats.pending_approval, icon: Clock4, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { label: "Approved", value: stats.approved, icon: BarChart3, color: "bg-teal-100 text-teal-700 border-teal-200" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, color: "bg-red-100 text-red-700 border-red-200" },
    { label: "Sold", value: stats.sold, icon: DollarSign, color: "bg-purple-100 text-purple-700 border-purple-200" },
    { label: "Rented", value: stats.rented, icon: BarChart3, color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">📊 Property Statistics Overview</h1>
        </div>

        {/* Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Card
                key={item.label}
                className={`rounded-2xl shadow-sm border ${item.color} hover:shadow-lg hover:scale-[1.02] transition-all duration-300`}
              >
                <CardContent className="flex flex-col items-center justify-center py-6 space-y-3 text-center">
                  <div className={`p-3 rounded-full ${item.color.replace("text-", "bg-opacity-20 text-")}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-medium text-gray-600">{item.label}</h3>
                  <p className="text-3xl font-extrabold">{item.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PropertyStats;
