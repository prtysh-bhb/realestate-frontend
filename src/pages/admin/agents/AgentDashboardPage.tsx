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
  Calendar
} from "lucide-react";
import { formatAmount, formatReadableDate } from "@/helpers/customer_helper";
import { Link } from "react-router-dom";

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

  // Property Statistics Cards
  const propertyStats = [
    { 
      label: "Total Properties", 
      value: stats?.properties.total ?? 0, 
      icon: Building2, 
      color: "bg-blue-500", 
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    { 
      label: "Published", 
      value: stats?.properties.published ?? 0, 
      icon: CheckCircle2, 
      color: "bg-green-500", 
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    { 
      label: "Pending Approval", 
      value: stats?.properties.pending_approval ?? 0, 
      icon: Clock4, 
      color: "bg-yellow-500", 
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-700"
    },
    { 
      label: "Approved", 
      value: stats?.properties.approved ?? 0, 
      icon: BarChart3, 
      color: "bg-teal-500", 
      bgColor: "bg-teal-50",
      textColor: "text-teal-700"
    },
    { 
      label: "Sold", 
      value: stats?.properties.sold ?? 0, 
      icon: DollarSign, 
      color: "bg-purple-500", 
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    { 
      label: "Rented", 
      value: stats?.properties.rented ?? 0, 
      icon: Home, 
      color: "bg-indigo-500", 
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700"
    },
  ];

  // Inquiry Statistics Cards
  const inquiryStats = [
    { 
      label: "Total Inquiries", 
      value: stats?.inquiries.total ?? 0, 
      icon: MessageCircle, 
      color: "bg-orange-500", 
      bgColor: "bg-orange-50",
      textColor: "text-orange-700"
    },
    { 
      label: "New Inquiries", 
      value: stats?.inquiries.new ?? 0, 
      icon: Users, 
      color: "bg-red-500", 
      bgColor: "bg-red-50",
      textColor: "text-red-700"
    },
    { 
      label: "Contacted", 
      value: stats?.inquiries.contacted ?? 0, 
      icon: CheckCircle2, 
      color: "bg-green-500", 
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    { 
      label: "Closed", 
      value: stats?.inquiries.closed ?? 0, 
      icon: NotebookPen, 
      color: "bg-gray-500", 
      bgColor: "bg-gray-50",
      textColor: "text-gray-700"
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; bgColor: string } } = {
      published: { color: 'text-green-700', bgColor: 'bg-green-100' },
      draft: { color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
      sold: { color: 'text-purple-700', bgColor: 'bg-purple-100' },
      rented: { color: 'text-blue-700', bgColor: 'bg-blue-100' },
      new: { color: 'text-orange-700', bgColor: 'bg-orange-100' },
      contacted: { color: 'text-blue-700', bgColor: 'bg-blue-100' },
      closed: { color: 'text-gray-700', bgColor: 'bg-gray-100' },
      pending: { color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
      approved: { color: 'text-green-700', bgColor: 'bg-green-100' },
      rejected: { color: 'text-red-700', bgColor: 'bg-red-100' },
    };

    const config = statusConfig[status] || { color: 'text-gray-700', bgColor: 'bg-gray-100' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center text-red-500">
            <XCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg">{error}</p>
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
            <Users className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg">No profile data found.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const avatarUrl = profile.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80";
  const userName = profile.name || "Agent";

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-500 rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-white object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold">Welcome back, {userName}! 👋</h1>
                <p className="text-blue-100">Here's what's happening with your properties today</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-right">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Active Agent</span>
              </div>
              <p className="text-blue-100 text-sm mt-2">
                {stats?.properties.this_month || 0} new properties this month
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Properties This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.properties.this_month || 0}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Inquiries This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.inquiries.this_month || 0}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Recent Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.inquiries.recent || 0}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.inquiries.total ? 
                    Math.round((stats.inquiries.closed / stats.inquiries.total) * 100) : 0
                  }%
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Property Statistics */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Property Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {propertyStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`w-6 h-6 ${stat.textColor}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
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
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Inquiry Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {inquiryStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.label} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`w-6 h-6 ${stat.textColor}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
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
          <Card className="lg:col-span-2 border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Properties</h3>
              </div>
              <div className="space-y-4">
                {recentProperties.map((property) => (
                  <Link to={'/agent/property/view/'+property.id} key={property.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow flex items-center">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 truncate">{property.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">{formatAmount(property.price)}</span>
                        {getStatusBadge(property.status)}
                        {getStatusBadge(property.approval_status)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{formatReadableDate(property.created_at)}</p>
                    </div>
                  </Link>
                ))}
                {recentProperties.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No properties found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Inquiries */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Inquiries</h3>
              </div>
              <div className="space-y-4">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <Link to={'/agent/lead/view/'+inquiry.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{inquiry.customer.name}</h4>
                          <p className="text-sm text-gray-600 truncate">{inquiry.customer.email}</p>
                          <p className="text-sm text-gray-700 mt-1">{inquiry.property.title}</p>
                        </div>
                        {getStatusBadge(inquiry.status)}
                      </div>
                    </Link>
                    <p className="text-xs text-gray-500 mt-2">{formatReadableDate(inquiry.created_at)}</p>
                  </div>
                ))}
                {recentInquiries.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No inquiries found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Properties */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Properties</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topProperties.map((property) => (
                <Link to={'/agent/property/view/'+property.id} key={property.id} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 line-clamp-2">{property.title}</h4>
                    {getStatusBadge(property.status)}
                  </div>
                  <p className="text-lg font-bold text-blue-600 mb-2">{formatAmount(property.price)}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{property.inquiries_count} inquiries</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.inquiries_count > 5 
                        ? 'bg-green-100 text-green-700'
                        : property.inquiries_count > 2
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {property.inquiries_count > 5 ? 'Hot' : property.inquiries_count > 2 ? 'Warm' : 'Cold'}
                    </div>
                  </div>
                </Link>
              ))}
              {topProperties.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No performance data available</p>
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