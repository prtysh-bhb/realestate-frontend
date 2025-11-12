/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/api/axios";
import { getProfile } from "@/api/admin/profileApi";
import { BarChart3, Building2, CheckCircle2, XCircle, Clock4, DollarSign, NotebookPen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface DashboardResponse {
  success: boolean;
  message: string;
  role: string;
}

const AdminDashboardPage = () => {
  const {user} = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load profile + dashboard in parallel
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch full profile info (includes avatar, name, role, etc.)
        const profileRes = await getProfile();
        const user = profileRes.data.data.user;
        setProfile(user);

        // 2️⃣ Choose endpoint based on role
        const endpoint =
          user.role === "admin"
            ? "/admin/dashboard"
            : user.role === "agent"
            ? "/agent/dashboard"
            : "/customer/dashboard";

        const res = await api.get<DashboardResponse>(endpoint);
        setDashboardData(res.data);

      } catch (err: any) {
        console.error("Error fetching dashboard:", err);
        if (err.response?.status === 403) {
          setError("Access denied. You are not authorized to view this dashboard.");
        } else {
          setError("Failed to fetch dashboard data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const items = [
    { label: "Total Properties", value: stats?.total ?? 0, icon: Building2, color: "bg-blue-100 text-blue-700 border-blue-200" },
    { label: "Published", value: stats?.published ?? 0, icon: CheckCircle2, color: "bg-green-100 text-green-700 border-green-200" },
    { label: "Pending Approval", value: stats?.pending_approval ?? 0, icon: Clock4, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { label: "Approved", value: stats?.approved ?? 0, icon: BarChart3, color: "bg-teal-100 text-teal-700 border-teal-200" },
    { label: "Rejected", value: stats?.rejected ?? 0, icon: XCircle, color: "bg-red-100 text-red-700 border-red-200" },
    { label: "Sold", value: stats?.sold ?? 0, icon: DollarSign, color: "bg-purple-100 text-purple-700 border-purple-200" },
    { label: "Rented", value: stats?.rented ?? 0, icon: BarChart3, color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
    { label: "Leads Captured", value: stats?.leads_captured ?? 0, icon: NotebookPen, color: "bg-orange-100 text-orange-700 border-orange-200" },
  ];

  // ===============================
  // Conditional Rendering
  // ===============================

  if (loading)
    return (
      <AdminLayout>
        <div className="text-center py-10 text-gray-500">Loading dashboard...</div>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <div className="text-center text-red-500 py-10">{error}</div>
      </AdminLayout>
    );

  if (!profile)
    return (
      <AdminLayout>
        <div className="text-center py-10 text-gray-500">No profile data found.</div>
      </AdminLayout>
    );

  const avatarUrl = profile.avatar_url || "https://i.pravatar.cc/100";
  const userName = profile.name || "User";
  const role = profile.role || "user";

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* 👋 Welcome Header */}
        <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 rounded-xl">
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-16 h-16 rounded-full border border-gray-200 object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {userName} 👋
              </h1>
              <p className="text-sm text-gray-500">
                You are logged in as{" "}
                <span className="capitalize font-medium text-gray-700 dark:text-gray-200">
                  {role}
                </span>
              </p>
            </div>
          </div>
          <div className="text-end">
              <p className="text-sm text-gray-500">Account Status</p>
              <h3 className="text-2xl font-semibold text-green-600">
                {dashboardData?.success ? "Active" : "Inactive"}
              </h3>
            </div>
        </div>

        {/* Responsive grid */}
        {user?.role == "agent" ? (
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
        ) : (
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-sm border-none">
            <CardContent className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {dashboardData?.message || "Dashboard data loaded successfully!"}
              </h3>
              <p className="text-sm text-gray-500">
                Role:{" "}
                <span className="font-medium text-gray-700 dark:text-gray-200">
                  {dashboardData?.role || role}
                </span>
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
