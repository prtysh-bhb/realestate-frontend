/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { getProfile } from "@/api/admin/profileApi";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  User,
  Calendar,
  Clock,
  ShieldCheck,
  Home,
  Edit,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { useAuth } from "@/context/AuthContext";

const ViewProfilePage = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      const payload = (res as any)?.data;
      setUser(payload?.data?.user ?? null);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-500 dark:border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <p className="text-gray-600">No profile data found.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl">
                <User className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                  My Profile
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  View your personal information
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="border-gray-300 dark:border-gray-600"
              >
                <ArrowLeft size={18} className="mr-2" />
                Back
              </Button>
              <Button
                onClick={() => navigate("/admin/profile/edit")}
                className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg"
              >
                <Edit size={18} className="mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {/* Cover & Avatar Section */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-r from-blue-500 via-blue-600 to-emerald-500"></div>
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={user.avatar_url || "/default-avatar.png"}
                  alt="avatar"
                  className="w-32 h-32 rounded-2xl border-4 border-white dark:border-gray-900 shadow-xl object-cover"
                />
                {user.email_verified_at && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1.5 shadow-lg border-2 border-white dark:border-gray-900">
                    <CheckCircle2 className="text-white" size={16} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 px-8 pb-8">
            {/* Name and Role */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {user.name}
              </h2>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30 text-blue-700 dark:text-emerald-400 rounded-lg text-sm font-semibold capitalize">
                  {user.role}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar size={14} />
                  Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Mail className="text-blue-600 dark:text-blue-400" size={18} />
                  </div>
                  Contact Information
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Mail className="text-gray-400 mt-0.5" size={18} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email Address</p>
                      <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Phone className="text-gray-400 mt-0.5" size={18} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Phone Number</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.address && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Home className="text-gray-400 mt-0.5" size={18} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Address</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user.address}</p>
                      </div>
                    </div>
                  )}

                  {(user.city || user.state) && (
                    <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <MapPin className="text-gray-400 mt-0.5" size={18} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.city || "-"}
                          {user.state ? `, ${user.state}` : ""}
                          {user.zipcode ? ` ${user.zipcode}` : ""}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <Briefcase className="text-emerald-600 dark:text-emerald-400" size={18} />
                  </div>
                  Additional Details
                </h3>

                <div className="space-y-3">
                  {/* Company Name (for agents/admins) */}
                  {(user.role === "agent" || user.role === "admin") && (
                    <>
                      {user.company_name && (
                        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Building2 className="text-gray-400 mt-0.5" size={18} />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Company Name</p>
                            <p className="font-medium text-gray-900 dark:text-white">{user.company_name}</p>
                          </div>
                        </div>
                      )}

                      {user.license_number && (
                        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Briefcase className="text-gray-400 mt-0.5" size={18} />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">License Number</p>
                            <p className="font-medium text-gray-900 dark:text-white">{user.license_number}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Email Verification */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {user.email_verified_at ? (
                      <ShieldCheck className="text-emerald-500 mt-0.5" size={18} />
                    ) : (
                      <AlertCircle className="text-amber-500 mt-0.5" size={18} />
                    )}
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Email Verification</p>
                      <p className={`font-medium ${user.email_verified_at ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                        {user.email_verified_at
                          ? `Verified on ${new Date(user.email_verified_at).toLocaleDateString()}`
                          : "Not Verified"}
                      </p>
                    </div>
                  </div>

                  {/* Last Login */}
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Clock className="text-gray-400 mt-0.5" size={18} />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Last Login</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleString()
                          : "No record"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewProfilePage;
