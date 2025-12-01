/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/api/axios";
import { getProfile } from "@/api/admin/profileApi";
import { 
  Users, 
  Building2, 
  MessageCircle, 
  Eye, 
  UserCheck, 
  UserX,
  CheckCircle2,
  Clock4,
  XCircle,
  TrendingUp,
  BarChart3,
  Home,
  Shield,
  Mail,
  Calendar,
  ArrowUp,
  ArrowDown,
  Award,
  Rocket,
  Star,
  Zap
} from "lucide-react";
import { formatAmount, formatReadableDate } from "@/helpers/customer_helper";
import Loader from "@/components/ui/Loader";

interface DashboardResponse {
  success: boolean;
  message: string;
  role: string;
  data: {
    stats: {
      users: {
        total: number;
        agents: number;
        customers: number;
        admins: number;
        active: number;
        deactivated: number;
        this_month: number;
      };
      properties: {
        total: number;
        published: number;
        draft: number;
        sold: number;
        rented: number;
        pending_approval: number;
        approved: number;
        rejected: number;
        this_month: number;
      };
      inquiries: {
        total: number;
        new: number;
        contacted: number;
        closed: number;
        recent: number;
        this_month: number;
      };
      views: {
        total: number;
        this_month: number;
        today: number;
      };
    };
    recent_users: Array<{
      id: number;
      name: string;
      email: string;
      role: string;
      created_at: string;
    }>;
    recent_properties: Array<{
      id: number;
      title: string;
      price: number;
      status: string;
      approval_status: string;
      agent_id: number;
      created_at: string;
      agent: {
        id: number;
        name: string;
        email: string;
      };
    }>;
    pending_approvals: Array<{
      id: number;
      title: string;
      price: number;
      agent_id: number;
      created_at: string;
      agent: {
        id: number;
        name: string;
        email: string;
      };
    }>;
    top_agents_by_properties: Array<{
      id: number;
      name: string;
      email: string;
      properties_count: number;
    }>;
    top_agents_by_inquiries: Array<{
      id: number;
      name: string;
      email: string;
      inquiries_count: number;
    }>;
    properties_by_type: Array<{
      type: string;
      count: number;
    }>;
  };
}

const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const profileRes = await getProfile();
        const user = profileRes.data.data.user;
        setProfile(user);

        const res = await api.get<DashboardResponse>("/admin/dashboard");        
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

  const stats = dashboardData?.data?.stats;
  const recentUsers = dashboardData?.data?.recent_users || [];
  const recentProperties = dashboardData?.data?.recent_properties || [];
  const pendingApprovals = dashboardData?.data?.pending_approvals || [];
  const topAgentsByProperties = dashboardData?.data?.top_agents_by_properties || [];
  const topAgentsByInquiries = dashboardData?.data?.top_agents_by_inquiries || [];
  const propertiesByType = dashboardData?.data?.properties_by_type || [];

  // Overview Statistics with vibrant colors
  const overviewStats = [
    {
      label: "Total Users",
      value: stats?.users.total || 0,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      change: stats?.users.this_month || 0,
      changeType: "up"
    },
    {
      label: "Total Properties",
      value: stats?.properties.total || 0,
      icon: Building2,
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50",
      change: stats?.properties.this_month || 0,
      changeType: "up"
    },
    {
      label: "Total Inquiries",
      value: stats?.inquiries.total || 0,
      icon: MessageCircle,
      gradient: "from-rose-500 to-pink-500",
      bgGradient: "from-rose-50 to-pink-50",
      change: stats?.inquiries.this_month || 0,
      changeType: "up"
    },
    {
      label: "Property Views",
      value: stats?.views.total || 0,
      icon: Eye,
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50",
      change: stats?.views.this_month || 0,
      changeType: "up"
    }
  ];

  // User Statistics with vibrant colors
  const userStats = [
    { 
      label: "Agents", 
      value: stats?.users.agents || 0, 
      icon: Users, 
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    { 
      label: "Customers", 
      value: stats?.users.customers || 0, 
      icon: UserCheck, 
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50"
    },
    { 
      label: "Admins", 
      value: stats?.users.admins || 0, 
      icon: Shield, 
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50"
    },
    { 
      label: "Active Users", 
      value: stats?.users.active || 0, 
      icon: UserCheck, 
      gradient: "from-teal-500 to-cyan-500",
      bgGradient: "from-teal-50 to-cyan-50"
    },
    { 
      label: "Deactivated", 
      value: stats?.users.deactivated || 0, 
      icon: UserX, 
      gradient: "from-rose-500 to-red-500",
      bgGradient: "from-rose-50 to-red-50"
    },
  ];

  // Property Statistics with vibrant colors
  const propertyStats = [
    { 
      label: "Published", 
      value: stats?.properties.published || 0, 
      icon: CheckCircle2, 
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50"
    },
    { 
      label: "Draft", 
      value: stats?.properties.draft || 0, 
      icon: Clock4, 
      gradient: "from-amber-500 to-yellow-500",
      bgGradient: "from-amber-50 to-yellow-50"
    },
    { 
      label: "Sold", 
      value: stats?.properties.sold || 0, 
      icon: TrendingUp, 
      gradient: "from-violet-500 to-purple-500",
      bgGradient: "from-violet-50 to-purple-50"
    },
    { 
      label: "Rented", 
      value: stats?.properties.rented || 0, 
      icon: Home, 
      gradient: "from-blue-500 to-indigo-500",
      bgGradient: "from-blue-50 to-indigo-50"
    },
    { 
      label: "Pending Approval", 
      value: stats?.properties.pending_approval || 0, 
      icon: Clock4, 
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50"
    },
    { 
      label: "Approved", 
      value: stats?.properties.approved || 0, 
      icon: CheckCircle2, 
      gradient: "from-teal-500 to-emerald-500",
      bgGradient: "from-teal-50 to-emerald-50"
    },
    { 
      label: "Rejected", 
      value: stats?.properties.rejected || 0, 
      icon: XCircle, 
      gradient: "from-rose-500 to-red-500",
      bgGradient: "from-rose-50 to-red-50"
    },
  ];

  // Inquiry Statistics with vibrant colors
  const inquiryStats = [
    { 
      label: "New", 
      value: stats?.inquiries.new || 0, 
      icon: Mail, 
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-50 to-amber-50"
    },
    { 
      label: "Contacted", 
      value: stats?.inquiries.contacted || 0, 
      icon: MessageCircle, 
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    { 
      label: "Closed", 
      value: stats?.inquiries.closed || 0, 
      icon: CheckCircle2, 
      gradient: "from-emerald-500 to-green-500",
      bgGradient: "from-emerald-50 to-green-50"
    },
    { 
      label: "Recent (7d)", 
      value: stats?.inquiries.recent || 0, 
      icon: Calendar, 
      gradient: "from-purple-500 to-violet-500",
      bgGradient: "from-purple-50 to-violet-50"
    },
  ];

  const getRoleBadge = (role: string) => {
    const roleConfig: { [key: string]: { color: string; bgColor: string; gradient: string } } = {
      admin: { color: 'text-purple-700', bgColor: 'bg-purple-100', gradient: 'from-purple-100 to-violet-100' },
      agent: { color: 'text-blue-700', bgColor: 'bg-blue-100', gradient: 'from-blue-100 to-cyan-100' },
      customer: { color: 'text-emerald-700', bgColor: 'bg-emerald-100', gradient: 'from-emerald-100 to-green-100' },
    };

    const config = roleConfig[role] || { color: 'text-gray-700', bgColor: 'bg-gray-100', gradient: 'from-gray-100 to-slate-100' };
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${config.gradient} ${config.color} border border-white/50 shadow-sm`}>
        {role.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; bgColor: string; gradient: string } } = {
      published: { color: 'text-emerald-700', bgColor: 'bg-emerald-100', gradient: 'from-emerald-100 to-green-100' },
      draft: { color: 'text-amber-700', bgColor: 'bg-amber-100', gradient: 'from-amber-100 to-yellow-100' },
      sold: { color: 'text-violet-700', bgColor: 'bg-violet-100', gradient: 'from-violet-100 to-purple-100' },
      rented: { color: 'text-blue-700', bgColor: 'bg-blue-100', gradient: 'from-blue-100 to-indigo-100' },
      pending: { color: 'text-orange-700', bgColor: 'bg-orange-100', gradient: 'from-orange-100 to-amber-100' },
      approved: { color: 'text-emerald-700', bgColor: 'bg-emerald-100', gradient: 'from-emerald-100 to-lime-100' },
      rejected: { color: 'text-rose-700', bgColor: 'bg-rose-100', gradient: 'from-rose-100 to-red-100' },
    };

    const config = statusConfig[status] || { color: 'text-gray-700', bgColor: 'bg-gray-100', gradient: 'from-gray-100 to-slate-100' };
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${config.gradient} ${config.color} border border-white/50 shadow-sm`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <Loader />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center text-rose-500">
            <XCircle className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-semibold">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!profile) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center text-gray-500">
            <Users className="w-16 h-16 mx-auto mb-4" />
            <p className="text-lg font-semibold">No profile data found.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const userName = profile.name || "Admin";

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-8 rounded-2xl shadow-2xl border-0 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
                </div>
                <p className="text-blue-100 text-xl">
                  System overview and performance analytics for your {profile.role} dashboard
                </p>
              </div>
              <div className="hidden md:flex items-center gap-3 px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <Calendar className="text-white" size={20} />
                <span className="font-semibold">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value.toLocaleString()}</p>
                    <div className="flex items-center space-x-2 mt-3">
                      {stat.changeType === 'up' ? (
                        <ArrowUp className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-rose-500" />
                      )}
                      <span className={`text-sm font-semibold ${stat.changeType === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        +{stat.change} this month
                      </span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Statistics */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">User Statistics</h3>
              </div>
              <div className="space-y-4">
                {userStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={stat.label} 
                      className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-br ${stat.bgGradient} border-0 shadow-sm hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Property Statistics */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Property Statistics</h3>
              </div>
              <div className="space-y-4">
                {propertyStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={stat.label} 
                      className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-br ${stat.bgGradient} border-0 shadow-sm hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Statistics */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Inquiry Statistics</h3>
              </div>
              <div className="space-y-4">
                {inquiryStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={stat.label} 
                      className={`flex items-center justify-between p-4 rounded-xl bg-gradient-to-br ${stat.bgGradient} border-0 shadow-sm hover:shadow-md transition-all duration-200`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} text-white shadow-md`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{stat.label}</span>
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Pending Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Recent Users</h3>
                </div>
              </div>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getRoleBadge(user.role)}
                        <p className="text-xs text-gray-500 mt-2 font-medium">{formatReadableDate(user.created_at)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {recentUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-50 text-blue-400" />
                    <p className="font-semibold">No recent users</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Properties */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Recent Properties</h3>
                </div>
              </div>
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <div 
                    key={property.id} 
                    className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 pr-4">{property.title}</h4>
                      {getStatusBadge(property.status)}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span className="font-bold text-blue-600">{formatAmount(property.price)}</span>
                      <span className="font-medium">{property.agent.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      {getStatusBadge(property.approval_status)}
                      <span className="text-xs text-gray-500 font-medium">{formatReadableDate(property.created_at)}</span>
                    </div>
                  </div>
                ))}
                {recentProperties.length === 0 && (
                  <div className="text-center py-8 text-gray-500 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl">
                    <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50 text-emerald-400" />
                    <p className="font-semibold">No recent properties</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg">
                    <Clock4 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Pending Approvals</h3>
                </div>
                <span className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-bold border border-orange-200">
                  {pendingApprovals.length}
                </span>
              </div>
              <div className="space-y-4">
                {pendingApprovals.map((property) => (
                  <div 
                    key={property.id} 
                    className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <h4 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2">{property.title}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-orange-600">{formatAmount(property.price)}</span>
                      <span className="font-medium text-gray-700">{property.agent.name}</span>
                    </div>
                  </div>
                ))}
                {pendingApprovals.length === 0 && (
                  <div className="text-center py-8 text-gray-500 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50 text-emerald-400" />
                    <p className="font-semibold">No pending approvals</p>
                    <p className="text-sm mt-1">All caught up! 🎉</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Agents by Properties */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Top Agents (Properties)</h3>
              </div>
              <div className="space-y-4">
                {topAgentsByProperties.map((agent, index) => (
                  <div 
                    key={agent.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-500' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-slate-500' :
                        index === 2 ? 'bg-gradient-to-br from-amber-600 to-orange-500' :
                        'bg-gradient-to-br from-blue-500 to-cyan-500'
                      }`}>
                        {index < 3 ? (
                          <Award className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-sm font-bold text-white">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-600">{agent.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900 text-lg">{agent.properties_count}</span>
                      <p className="text-xs text-gray-500 font-semibold">properties</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Agents by Inquiries */}
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-500 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Top Agents (Inquiries)</h3>
              </div>
              <div className="space-y-4">
                {topAgentsByInquiries.map((agent, index) => (
                  <div 
                    key={agent.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                        index === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-500' :
                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-slate-500' :
                        index === 2 ? 'bg-gradient-to-br from-amber-600 to-orange-500' :
                        'bg-gradient-to-br from-purple-500 to-violet-500'
                      }`}>
                        {index < 3 ? (
                          <Star className="w-5 h-5 text-white" />
                        ) : (
                          <span className="text-sm font-bold text-white">{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-600">{agent.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900 text-lg">{agent.inquiries_count}</span>
                      <p className="text-xs text-gray-500 font-semibold">inquiries</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Types Distribution */}
        <Card className="border-0 shadow-xl bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Properties by Type</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {propertiesByType.map((type, index) => {
                const colors = [
                  'from-blue-500 to-cyan-500', 'from-emerald-500 to-green-500', 'from-rose-500 to-pink-500',
                  'from-violet-500 to-purple-500', 'from-orange-500 to-amber-500', 'from-teal-500 to-cyan-500'
                ];
                const bgColors = [
                  'from-blue-50 to-cyan-50', 'from-emerald-50 to-green-50', 'from-rose-50 to-pink-50',
                  'from-violet-50 to-purple-50', 'from-orange-50 to-amber-50', 'from-teal-50 to-cyan-50'
                ];
                
                return (
                  <div 
                    key={type.type} 
                    className={`text-center p-5 rounded-xl bg-gradient-to-br ${bgColors[index % colors.length]} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                  >
                    <div className={`text-3xl font-bold mb-2 bg-gradient-to-br ${colors[index % colors.length]} bg-clip-text text-transparent`}>
                      {type.count}
                    </div>
                    <div className="text-sm font-semibold text-gray-600 capitalize">{type.type || 'Unknown'}</div>
                  </div>
                );
              })}
              {propertiesByType.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl">
                  <Home className="w-16 h-16 mx-auto mb-4 opacity-50 text-blue-400" />
                  <p className="text-lg font-semibold">No property type data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;