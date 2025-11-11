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
} from "lucide-react";
import AdminLayout from "@/components/layout/admin/AdminLayout";

const ViewProfilePage = () => {
  const [user, setUser] = useState<any>(null);
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
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
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
      <div className="mx-auto mt-10 px-4 sm:px-6 lg:px-8">
        {/* Card Container */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-500 p-6 flex flex-col items-center text-center text-white">
            <img
              src={user.avatar_url || "/default-avatar.png"}
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-white shadow-md object-cover mb-3"
            />
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-sm opacity-90 flex items-center gap-1 justify-center">
              <User size={14} /> {user.role?.toUpperCase()}
            </p>
            <p className="text-sm mt-1 opacity-80">
              Member since {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Info Section */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="text-blue-500" size={18} />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="text-blue-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Phone
                  </p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            {/* Address */}
            {user.address && (
              <div className="flex items-center gap-3 sm:col-span-2">
                <Home className="text-blue-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Address
                  </p>
                  <p className="font-medium">{user.address}</p>
                </div>
              </div>
            )}

            {/* Location */}
            {(user.city || user.state) && (
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Location
                  </p>
                  <p className="font-medium">
                    {user.city || "-"}
                    {user.state ? `, ${user.state}` : ""}
                  </p>
                </div>
              </div>
            )}

            {/* Zipcode */}
            {user.zipcode && (
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-500" size={18} />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Zipcode
                  </p>
                  <p className="font-medium">{user.zipcode}</p>
                </div>
              </div>
            )}

            {/* Company (if Agent/Admin) */}
            {(user.role === "agent" || user.role === "admin") && (
              <>
                <div className="flex items-center gap-3">
                  <Building2 className="text-blue-500" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Company Name
                    </p>
                    <p className="font-medium">{user.company_name || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="text-blue-500" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      License Number
                    </p>
                    <p className="font-medium">{user.license_number || "-"}</p>
                  </div>
                </div>
              </>
            )}

            {/* Email Verification */}
            <div className="flex items-center gap-3">
              <ShieldCheck
                className={`${
                  user.email_verified_at ? "text-green-500" : "text-red-500"
                }`}
                size={18}
              />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Email Verified
                </p>
                <p className="font-medium">
                  {user.email_verified_at
                    ? new Date(user.email_verified_at).toLocaleString()
                    : "Not Verified"}
                </p>
              </div>
            </div>

            {/* Last Login */}
            <div className="flex items-center gap-3">
              <Clock className="text-blue-500" size={18} />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Last Login
                </p>
                <p className="font-medium">
                  {user.last_login_at
                    ? new Date(user.last_login_at).toLocaleString()
                    : "No record"}
                </p>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Bio
                </p>
                <p className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  {user.bio}
                </p>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-center gap-3 py-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <Button
              onClick={() => navigate("/admin/profile")}
              className="bg-blue-600 hover:bg-blue-700 text-white w-32"
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-32"
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewProfilePage;
