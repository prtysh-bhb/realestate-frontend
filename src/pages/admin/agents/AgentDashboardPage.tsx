/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/api/axios";
import { getProfile } from "@/api/admin/profileApi";
import { 
  BarChart3, 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock4, 
  DollarSign, 
  NotebookPen,
  Users,
  MessageCircle,
  Home,
  TrendingUp,
  Eye,
  Calendar,
  Target,
  Award,
  Rocket,
  ArrowRight,
  Clock
} from "lucide-react";
import { formatAmount, formatReadableDate } from "@/helpers/customer_helper";
import { Link } from "react-router-dom";
import Loader from "@/components/ui/Loader";

export interface DashboardResponse {
  success: boolean;
  role: string;
  message: string;
  data: {
    stats: {
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
    };
    recent_properties: RecentProperty[];
    recent_inquiries: RecentInquiry[];
    top_properties: TopProperty[];
  };
}

export interface RecentProperty {
  id: number;
  title: string;
  price: number;
  status: string;
  approval_status: string;
  created_at: string;
}

export interface RecentInquiry {
  id: number;
  property_id: number;
  customer_id: number;
  status: string;
  created_at: string;
  property: {
    id: number;
    title: string;
  };
  customer: {
    id: number;
    name: string;
    email: string;
  };
}

export interface TopProperty {
  id: number;
  title: string;
  price: number;
  status: string;
  inquiries_count: number;
}

const AgentDashboardPage = () => {
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

        const res = await api.get<DashboardResponse>("/agent/dashboard");
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

  const stats = dashboardData?.data.stats;
  const recentProperties = dashboardData?.data.recent_properties || [];
  const recentInquiries = dashboardData?.data.recent_inquiries || [];
  const topProperties = dashboardData?.data.top_properties || [];

  // Property Statistics Cards with vibrant colors
  const propertyStats = [
    { 
      label: "Total Properties", 
      value: stats?.properties?.total ?? 0, 
      icon: Building2, 
      color: "text-blue-600", 
      bgColor: "bg-gradient-to-br from-blue-500 to-cyan-500",
      cardGradient: "from-blue-50 to-cyan-50",
      borderColor: "border-blue-200"
    },
    { 
      label: "Published", 
      value: stats?.properties?.published ?? 0, 
      icon: CheckCircle2, 
      color: "text-emerald-600", 
      bgColor: "bg-gradient-to-br from-emerald-500 to-green-500",
      cardGradient: "from-emerald-50 to-green-50",
      borderColor: "border-emerald-200"
    },
    { 
      label: "Pending Approval", 
      value: stats?.properties?.pending_approval ?? 0, 
      icon: Clock4, 
      color: "text-amber-600", 
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-500",
      cardGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200"
    },
    { 
      label: "Approved", 
      value: stats?.properties?.approved ?? 0, 
      icon: BarChart3, 
      color: "text-teal-600", 
      bgColor: "bg-gradient-to-br from-teal-500 to-cyan-500",
      cardGradient: "from-teal-50 to-cyan-50",
      borderColor: "border-teal-200"
    },
    { 
      label: "Sold", 
      value: stats?.properties?.sold ?? 0, 
      icon: DollarSign, 
      color: "text-violet-600", 
      bgColor: "bg-gradient-to-br from-violet-500 to-purple-500",
      cardGradient: "from-violet-50 to-purple-50",
      borderColor: "border-violet-200"
    },
    { 
      label: "Rented", 
      value: stats?.properties?.rented ?? 0, 
      icon: Home, 
      color: "text-indigo-600", 
      bgColor: "bg-gradient-to-br from-indigo-500 to-blue-500",
      cardGradient: "from-indigo-50 to-blue-50",
      borderColor: "border-indigo-200"
    },
  ];

  // Inquiry Statistics Cards with vibrant colors
  const inquiryStats = [
    { 
      label: "Total Inquiries", 
      value: stats?.inquiries?.total ?? 0, 
      icon: MessageCircle, 
      color: "text-rose-600", 
      bgColor: "bg-gradient-to-br from-rose-500 to-pink-500",
      cardGradient: "from-rose-50 to-pink-50",
      borderColor: "border-rose-200"
    },
    { 
      label: "New Inquiries", 
      value: stats?.inquiries?.new ?? 0, 
      icon: Users, 
      color: "text-fuchsia-600", 
      bgColor: "bg-gradient-to-br from-fuchsia-500 to-purple-500",
      cardGradient: "from-fuchsia-50 to-purple-50",
      borderColor: "border-fuchsia-200"
    },
    { 
      label: "Contacted", 
      value: stats?.inquiries?.contacted ?? 0, 
      icon: CheckCircle2, 
      color: "text-lime-600", 
      bgColor: "bg-gradient-to-br from-lime-500 to-green-500",
      cardGradient: "from-lime-50 to-green-50",
      borderColor: "border-lime-200"
    },
    { 
      label: "Closed", 
      value: stats?.inquiries?.closed ?? 0, 
      icon: NotebookPen, 
      color: "text-slate-600", 
      bgColor: "bg-gradient-to-br from-slate-500 to-gray-500",
      cardGradient: "from-slate-50 to-gray-50",
      borderColor: "border-slate-200"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; bgColor: string; gradient: string } } = {
      published: { color: 'text-emerald-700', bgColor: 'bg-emerald-100', gradient: 'from-emerald-100 to-green-100' },
      draft: { color: 'text-amber-700', bgColor: 'bg-amber-100', gradient: 'from-amber-100 to-orange-100' },
      sold: { color: 'text-violet-700', bgColor: 'bg-violet-100', gradient: 'from-violet-100 to-purple-100' },
      rented: { color: 'text-blue-700', bgColor: 'bg-blue-100', gradient: 'from-blue-100 to-cyan-100' },
      new: { color: 'text-rose-700', bgColor: 'bg-rose-100', gradient: 'from-rose-100 to-pink-100' },
      contacted: { color: 'text-blue-700', bgColor: 'bg-blue-100', gradient: 'from-blue-100 to-sky-100' },
      closed: { color: 'text-slate-700', bgColor: 'bg-slate-100', gradient: 'from-slate-100 to-gray-100' },
      pending: { color: 'text-amber-700', bgColor: 'bg-amber-100', gradient: 'from-amber-100 to-yellow-100' },
      approved: { color: 'text-emerald-700', bgColor: 'bg-emerald-100', gradient: 'from-emerald-100 to-lime-100' },
      rejected: { color: 'text-rose-700', bgColor: 'bg-rose-100', gradient: 'from-rose-100 to-red-100' },
    };

    const config = statusConfig[status] || { color: 'text-slate-700', bgColor: 'bg-slate-100', gradient: 'from-slate-100 to-gray-100' };
    
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${config.gradient} ${config.color} border border-white/50 shadow-sm`}>
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

  const userName = profile.name || "Agent";

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50/30 min-h-screen">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-8 rounded-2xl shadow-lg border-0 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
                </div>
                <p className="text-blue-100 text-lg">
                  Here's what's happening with your {profile.role} account today
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

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: "Properties This Month", 
              value: stats?.properties.this_month || 0, 
              icon: Target, 
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-50 to-cyan-50"
            },
            { 
              label: "Inquiries This Month", 
              value: stats?.inquiries.this_month || 0, 
              icon: TrendingUp, 
              gradient: "from-emerald-500 to-green-500",
              bgGradient: "from-emerald-50 to-green-50"
            },
            { 
              label: "Recent Inquiries", 
              value: stats?.inquiries.recent || 0, 
              icon: Eye, 
              gradient: "from-amber-500 to-orange-500",
              bgGradient: "from-amber-50 to-orange-50"
            },
            { 
              label: "Success Rate", 
              value: stats?.inquiries.total ? 
                Math.round((stats.inquiries.closed / stats.inquiries.total) * 100) : 0, 
              icon: Award, 
              gradient: "from-violet-500 to-purple-500",
              bgGradient: "from-violet-50 to-purple-50"
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`bg-gradient-to-br ${stat.bgGradient} rounded-2xl p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}{stat.label === "Success Rate" ? "%" : ""}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* Property Statistics */}
          <div className="space-y-6 mt-10">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">Property Statistics</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {propertyStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className={`border-0 shadow-lg bg-gradient-to-br ${stat.cardGradient} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                    <CardContent className="p-5">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor} text-white shadow-lg`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Inquiry Statistics */}
          <div className="space-y-6 mt-10">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">Inquiry Statistics</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inquiryStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className={`border-0 shadow-lg bg-gradient-to-br ${stat.cardGradient} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                    <CardContent className="p-5">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor} text-white shadow-lg`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Properties */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg">
                    <Rocket className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Recent Properties</h3>
                    <p className="text-sm text-gray-500 mt-1 hidden sm:block">
                      Latest property listings and their status
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700">
                    {recentProperties.length} properties
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {recentProperties.map((property) => (
                  <Link 
                    to={'/agent/properties/'+property.id} 
                    key={property.id} 
                    className="block bg-gradient-to-br from-white to-blue-50/70 border border-blue-100 rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group hover:border-blue-200"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      {/* Property Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div className="hidden sm:flex flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg items-center justify-center border border-blue-200">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors text-sm sm:text-base">
                              {property.title}
                            </h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2">
                              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                                {formatAmount(property.price)}
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {getStatusBadge(property.status)}
                                {getStatusBadge(property.approval_status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Date and Actions */}
                      <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-6">
                        <div className="text-right">
                          <p className="hidden sm:flex text-xs sm:text-sm text-gray-500 font-medium whitespace-nowrap">
                            {formatReadableDate(property.created_at)}
                          </p>
                          <div className="hidden sm:flex items-center gap-1 mt-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />
                            Added recently
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Status Row */}
                    <div className="sm:hidden flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatReadableDate(property.created_at)}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        View Details →
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Empty State */}
                {recentProperties.length === 0 && (
                  <div className="text-center py-12 px-4 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-blue-200">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-200">
                      <Building2 className="w-8 h-8 text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-700 mb-2">No Properties Yet</h4>
                    <p className="text-gray-500 mb-4 max-w-sm mx-auto">
                      Start building your portfolio by adding your first property listing
                    </p>
                    <Link 
                      to="/agent/properties/create"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Rocket className="w-4 h-4" />
                      Add First Property
                    </Link>
                  </div>
                )}

                {/* View All Link */}
                {recentProperties.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <Link 
                      to="/agent/properties"
                      className="flex items-center justify-center gap-2 w-full py-3 text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 rounded-xl transition-all duration-300 group"
                    >
                      <span>View All Properties</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Inquiries */}
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Recent Inquiries</h3>
                </div>
              </div>
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div 
                    key={inquiry.id} 
                    className="bg-gradient-to-br from-white to-rose-50/50 border border-rose-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <Link to={'/agent/leads/'+inquiry.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 group-hover:text-rose-600 transition-colors">
                            {inquiry.customer.name}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">{inquiry.customer.email}</p>
                          <p className="text-sm text-gray-700 mt-2 font-medium">{inquiry.property.title}</p>
                        </div>
                        {getStatusBadge(inquiry.status)}
                      </div>
                    </Link>
                    <p className="text-xs text-gray-500 mt-3 font-medium">
                      {formatReadableDate(inquiry.created_at)}
                    </p>
                  </div>
                ))}
                {recentInquiries.length === 0 && (
                  <div className="text-center py-12 text-gray-500 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50 text-rose-400" />
                    <p className="text-lg font-semibold">No inquiries found</p>
                    <p className="text-sm mt-1">Inquiries will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Properties */}
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Top Performing Properties</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topProperties.map((property) => (
                <Link 
                  to={'/agent/properties/'+property.id} 
                  key={property.id} 
                  className="bg-gradient-to-br from-white to-emerald-50/50 border border-emerald-100 rounded-xl p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-bold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {property.title}
                    </h4>
                    {getStatusBadge(property.status)}
                  </div>
                  <p className="text-xl font-bold text-blue-600 mb-3">{formatAmount(property.price)}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-semibold">{property.inquiries_count} inquiries</span>
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      property.inquiries_count > 5 
                        ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200'
                        : property.inquiries_count > 2
                        ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200'
                        : 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200'
                    }`}>
                      {property.inquiries_count > 5 ? '🔥 Hot' : property.inquiries_count > 2 ? '⭐ Warm' : '💤 Cold'}
                    </div>
                  </div>
                </Link>
              ))}
              {topProperties.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500 bg-gradient-to-br from-slate-50 to-gray-100 rounded-2xl">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50 text-emerald-400" />
                  <p className="text-lg font-semibold">No performance data available</p>
                  <p className="text-sm mt-1">Properties with inquiries will appear here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AgentDashboardPage;