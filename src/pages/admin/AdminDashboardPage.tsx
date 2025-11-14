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
  ArrowDown
} from "lucide-react";
import { formatAmount, formatReadableDate } from "@/helpers/customer_helper";

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

  const stats = dashboardData?.data.stats;
  const recentUsers = dashboardData?.data.recent_users || [];
  const recentProperties = dashboardData?.data.recent_properties || [];
  const pendingApprovals = dashboardData?.data.pending_approvals || [];
  const topAgentsByProperties = dashboardData?.data.top_agents_by_properties || [];
  const topAgentsByInquiries = dashboardData?.data.top_agents_by_inquiries || [];
  const propertiesByType = dashboardData?.data.properties_by_type || [];

  // Overview Statistics
  const overviewStats = [
    {
      label: "Total Users",
      value: stats?.users.total || 0,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      change: stats?.users.this_month || 0,
      changeType: "up"
    },
    {
      label: "Total Properties",
      value: stats?.properties.total || 0,
      icon: Building2,
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      change: stats?.properties.this_month || 0,
      changeType: "up"
    },
    {
      label: "Total Inquiries",
      value: stats?.inquiries.total || 0,
      icon: MessageCircle,
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      change: stats?.inquiries.this_month || 0,
      changeType: "up"
    },
    {
      label: "Property Views",
      value: stats?.views.total || 0,
      icon: Eye,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      change: stats?.views.this_month || 0,
      changeType: "up"
    }
  ];

  // User Statistics
  const userStats = [
    { label: "Agents", value: stats?.users.agents || 0, icon: Users, color: "bg-blue-100 text-blue-700" },
    { label: "Customers", value: stats?.users.customers || 0, icon: UserCheck, color: "bg-green-100 text-green-700" },
    { label: "Admins", value: stats?.users.admins || 0, icon: Shield, color: "bg-purple-100 text-purple-700" },
    { label: "Active Users", value: stats?.users.active || 0, icon: UserCheck, color: "bg-teal-100 text-teal-700" },
    { label: "Deactivated", value: stats?.users.deactivated || 0, icon: UserX, color: "bg-red-100 text-red-700" },
  ];

  // Property Statistics
  const propertyStats = [
    { label: "Published", value: stats?.properties.published || 0, icon: CheckCircle2, color: "bg-green-100 text-green-700" },
    { label: "Draft", value: stats?.properties.draft || 0, icon: Clock4, color: "bg-yellow-100 text-yellow-700" },
    { label: "Sold", value: stats?.properties.sold || 0, icon: TrendingUp, color: "bg-purple-100 text-purple-700" },
    { label: "Rented", value: stats?.properties.rented || 0, icon: Home, color: "bg-blue-100 text-blue-700" },
    { label: "Pending Approval", value: stats?.properties.pending_approval || 0, icon: Clock4, color: "bg-orange-100 text-orange-700" },
    { label: "Approved", value: stats?.properties.approved || 0, icon: CheckCircle2, color: "bg-teal-100 text-teal-700" },
    { label: "Rejected", value: stats?.properties.rejected || 0, icon: XCircle, color: "bg-red-100 text-red-700" },
  ];

  // Inquiry Statistics
  const inquiryStats = [
    { label: "New", value: stats?.inquiries.new || 0, icon: Mail, color: "bg-orange-100 text-orange-700" },
    { label: "Contacted", value: stats?.inquiries.contacted || 0, icon: MessageCircle, color: "bg-blue-100 text-blue-700" },
    { label: "Closed", value: stats?.inquiries.closed || 0, icon: CheckCircle2, color: "bg-green-100 text-green-700" },
    { label: "Recent (7d)", value: stats?.inquiries.recent || 0, icon: Calendar, color: "bg-purple-100 text-purple-700" },
  ];

  const getRoleBadge = (role: string) => {
    const roleConfig: { [key: string]: { color: string; bgColor: string } } = {
      admin: { color: 'text-purple-700', bgColor: 'bg-purple-100' },
      agent: { color: 'text-blue-700', bgColor: 'bg-blue-100' },
      customer: { color: 'text-green-700', bgColor: 'bg-green-100' },
    };

    const config = roleConfig[role] || { color: 'text-gray-700', bgColor: 'bg-gray-100' };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
        {role.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string; bgColor: string } } = {
      published: { color: 'text-green-700', bgColor: 'bg-green-100' },
      draft: { color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
      sold: { color: 'text-purple-700', bgColor: 'bg-purple-100' },
      rented: { color: 'text-blue-700', bgColor: 'bg-blue-100' },
      pending: { color: 'text-orange-700', bgColor: 'bg-orange-100' },
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
  const userName = profile.name || "Admin";

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
                <p className="text-purple-100">System Overview & Analytics Dashboard</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-center md:text-right">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Administrator</span>
              </div>
              <p className="text-purple-100 text-sm mt-2">
                Managing {stats?.users.total || 0} users and {stats?.properties.total || 0} properties
              </p>
            </div>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {overviewStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value.toLocaleString()}</p>
                      <div className="flex items-center space-x-1 mt-2">
                        {stat.changeType === 'up' ? (
                          <ArrowUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          +{stat.change} this month
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Statistics */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">User Statistics</h3>
              </div>
              <div className="space-y-3">
                {userStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${stat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                      </div>
                      <span className="font-bold text-gray-900">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Property Statistics */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Property Statistics</h3>
              </div>
              <div className="space-y-3">
                {propertyStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${stat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                      </div>
                      <span className="font-bold text-gray-900">{stat.value}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Inquiry Statistics */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <MessageCircle className="w-5 h-5 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">Inquiry Statistics</h3>
              </div>
              <div className="space-y-3">
                {inquiryStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${stat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                      </div>
                      <span className="font-bold text-gray-900">{stat.value}</span>
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
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getRoleBadge(user.role)}
                      <p className="text-xs text-gray-500 mt-1">{formatReadableDate(user.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Properties */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Properties</h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentProperties.map((property) => (
                  <div key={property.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{property.title}</h4>
                      {getStatusBadge(property.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{formatAmount(property.price)}</span>
                      <span>{property.agent.name}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      {getStatusBadge(property.approval_status)}
                      <span className="text-xs text-gray-500">{formatReadableDate(property.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Pending Approvals</h3>
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-sm font-medium">
                  {pendingApprovals.length}
                </span>
              </div>
              <div className="space-y-3">
                {pendingApprovals.map((property) => (
                  <div key={property.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{property.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{formatAmount(property.price)}</span>
                      <span>{property.agent.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <button className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-xs font-medium hover:bg-green-700">
                        Approve
                      </button>
                      <button className="flex-1 bg-red-600 text-white py-1 px-2 rounded text-xs font-medium hover:bg-red-700">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
                {pendingApprovals.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No pending approvals</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Agents by Properties */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Top Agents (Properties)</h3>
              </div>
              <div className="space-y-3">
                {topAgentsByProperties.map((agent, index) => (
                  <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">{agent.properties_count}</span>
                      <p className="text-xs text-gray-500">properties</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Agents by Inquiries */}
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Top Agents (Inquiries)</h3>
              </div>
              <div className="space-y-3">
                {topAgentsByInquiries.map((agent, index) => (
                  <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                        <p className="text-xs text-gray-500">{agent.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">{agent.inquiries_count}</span>
                      <p className="text-xs text-gray-500">inquiries</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Types Distribution */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Properties by Type</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {propertiesByType.map((type) => (
                <div key={type.type} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{type.count}</div>
                  <div className="text-sm text-gray-600 capitalize">{type.type || 'Unknown'}</div>
                </div>
              ))}
              {propertiesByType.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <Home className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No property type data available</p>
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