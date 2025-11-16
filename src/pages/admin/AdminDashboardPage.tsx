/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/api/axios";
import { getProfile } from "@/api/admin/profileApi";
import {
  Home,
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

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
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );

  if (error)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        </div>
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

  // Mock stats data - replace with real data from API
  const stats = [
    {
      title: "Total Properties",
      value: "2,543",
      change: "+12.5%",
      trend: "up",
      icon: Home,
      color: "blue",
      bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: role === "admin" ? "Active Agents" : "My Listings",
      value: role === "admin" ? "342" : "28",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "emerald",
      bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      title: "Total Revenue",
      value: "$1.2M",
      change: "+23.1%",
      trend: "up",
      icon: DollarSign,
      color: "purple",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      title: "Conversions",
      value: "89.4%",
      change: "-2.4%",
      trend: "down",
      icon: TrendingUp,
      color: "orange",
      bgColor: "bg-orange-500/10 dark:bg-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
  ];

  const recentActivity = [
    { id: 1, action: "New property added", user: "John Doe", time: "5 min ago", status: "success" },
    { id: 2, action: "Agent registration pending", user: "Jane Smith", time: "1 hour ago", status: "pending" },
    { id: 3, action: "Property sale completed", user: "Mike Johnson", time: "2 hours ago", status: "success" },
    { id: 4, action: "Inquiry received", user: "Sarah Williams", time: "3 hours ago", status: "pending" },
    { id: 5, action: "Document uploaded", user: "Tom Brown", time: "5 hours ago", status: "success" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Welcome back, {userName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Here's what's happening with your {role} account today
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/30 dark:to-emerald-950/30 rounded-lg border border-blue-100 dark:border-emerald-900/50">
              <Clock className="text-blue-600 dark:text-emerald-400" size={16} />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`${stat.iconColor}`} size={20} />
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs font-semibold ${
                    stat.trend === "up" ? "text-emerald-600 dark:text-emerald-500" : "text-red-600 dark:text-red-500"
                  }`}>
                    {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                  View all
                </button>
              </div>

              <div className="space-y-1">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-emerald-50/50 dark:hover:from-blue-950/10 dark:hover:to-emerald-950/10 transition-all"
                  >
                    <div className={`p-1.5 rounded-lg ${
                      activity.status === "success"
                        ? "bg-emerald-100 dark:bg-emerald-950/30"
                        : "bg-amber-100 dark:bg-amber-950/30"
                    }`}>
                      {activity.status === "success" ? (
                        <CheckCircle2 className="text-emerald-600 dark:text-emerald-500" size={16} />
                      ) : (
                        <AlertCircle className="text-amber-600 dark:text-amber-500" size={16} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Quick Actions</h2>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-2.5 p-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all shadow-md hover:shadow-lg text-sm font-medium">
                  <Home size={16} />
                  <span>Add Property</span>
                </button>

                {role === "admin" && (
                  <button className="w-full flex items-center gap-2.5 p-3 rounded-lg bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all shadow-md hover:shadow-lg text-sm font-medium">
                    <Users size={16} />
                    <span>Add Agent</span>
                  </button>
                )}

                <button className="w-full flex items-center gap-2.5 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-emerald-500 hover:bg-blue-50 dark:hover:bg-emerald-950/20 text-gray-700 dark:text-gray-300 transition-all text-sm font-medium">
                  <Activity size={16} />
                  <span>View Reports</span>
                </button>

                <button className="w-full flex items-center gap-2.5 p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-gray-700 dark:text-gray-300 transition-all text-sm font-medium">
                  <DollarSign size={16} />
                  <span>Transactions</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
