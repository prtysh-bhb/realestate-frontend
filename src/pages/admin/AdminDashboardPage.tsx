/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/api/axios";
import { getProfile } from "@/api/admin/profileApi";

interface DashboardResponse {
  success: boolean;
  message: string;
  role: string;
}

const AdminDashboardPage = () => {
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
        <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
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

        {/* Dashboard Info Card */}
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

        {/* Status Card */}
        <Card className="p-4 shadow-sm border-none bg-white dark:bg-gray-800">
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <h3 className="text-2xl font-semibold text-green-600">
                {dashboardData?.success ? "Active" : "Inactive"}
              </h3>
            </div>
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
              <span className="text-green-600 font-bold text-lg">✓</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
