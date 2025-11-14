/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  deleteAccount,
} from "@/api/admin/profileApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  UserCog,
  ShieldCheck,
  Trash2,
  Building2,
  ArrowLeft,
} from "lucide-react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const AdminProfilePage = () => {
  const { user, setUser } = useAuth();
  const [password, setPassword] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfile();
      const data = res.data as { data: { user: any } };
      setUser(data.data.user);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    try {
      await updateProfile(user);
      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await changePassword(password);
      toast.success("Password changed!");
      setPassword({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch {
      toast.error("Failed to change password");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const formData = new FormData();
    formData.append("avatar", e.target.files[0]);
    try {
      await uploadAvatar(formData);
      toast.success("Avatar uploaded!");
      fetchProfile();
    } catch {
      toast.error("Upload failed");
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt("Enter your password to confirm delete:");
    if (!password) return;
    try {
      await deleteAccount({ password, confirmation: "DELETE" });
      toast.success("Account deleted");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch {
      toast.error("Failed to delete account");
    }
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <Loader2 className="animate-spin text-gray-400 w-6 h-6" />
        </div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="mx-auto p-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <UserCog className="text-blue-500" /> Admin Profile
            </h2>
            <p className="text-gray-500 text-sm">
              Manage your personal and company information
            </p>
          </div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={16} /> Back
          </Button>
        </div>

        {/* Profile Card */}
        <form
          onSubmit={handleUpdate}
          className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row gap-8"
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center md:w-1/3 border-b md:border-b-0 md:border-r pb-6 md:pb-0">
            <img
              src={user.avatar_url || "/default-avatar.png"}
              alt="avatar"
              className="w-32 h-32 rounded-full border object-cover shadow-sm"
            />
            <div className="mt-4 space-y-2 text-center">
              <p
                className="text-lg font-semibold text-gray-800 dark:text-gray-100"
                title={user.name || ""}
              >
                {user.name && user.name.length > 50
                  ? `${user.name.slice(0, 50)}...`
                  : user.name}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
                <span className="text-sm text-gray-700 border border-gray-100 bg-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 cursor-pointer transition">
                  Upload Avatar
                </span>
              </label>
              <Button
                variant="destructive"
                size="sm"
                type="button"
                onClick={() => {
                  deleteAvatar();
                  toast.success("Avatar deleted");
                  fetchProfile();
                }}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Building2 className="text-blue-500" /> Personal Information
            </h3>

            {/* Info Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                value={user.name || ""}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Full Name"
                required
                maxLength={50}
              />
              <Input value={user.email || ""} disabled placeholder="Email" />
              <Input
                value={user.phone || ""}
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                placeholder="Phone Number"
                maxLength={20}
                inputMode="tel"
              />
              <Input
                value={user.address || ""}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                placeholder="Address"
                maxLength={100}
              />
              <Input
                value={user.city || ""}
                onChange={(e) => setUser({ ...user, city: e.target.value })}
                placeholder="City"
                maxLength={50}
              />
              <Input
                value={user.state || ""}
                onChange={(e) => setUser({ ...user, state: e.target.value })}
                placeholder="State"
                maxLength={50}
              />
              <Input
                value={user.zipcode || ""}
                onChange={(e) => setUser({ ...user, zipcode: e.target.value })}
                placeholder="Zip Code"
                maxLength={10}
                inputMode="numeric"
                pattern="\d*"
              />
            </div>

            {/* Bio */}
            <div>
              <p className="text-sm text-gray-600 mb-1">Bio</p>
              <textarea
                value={user.bio || ""}
                onChange={(e) => setUser({ ...user, bio: e.target.value })}
                placeholder="Write a short bio..."
                className="w-full border rounded-lg p-2 text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-100"
                rows={3}
                maxLength={1000}
              ></textarea>
            </div>

            <Button
              type="submit"
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>

        {/* Password Change */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="text-green-500" />
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">
              Change Password
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              type="password"
              placeholder="Current Password"
              value={password.current_password}
              autoComplete="new-password"
              maxLength={50}
              onChange={(e) =>
                setPassword({ ...password, current_password: e.target.value })
              }
              required
            />
            <Input
              type="password"
              placeholder="New Password"
              maxLength={50}
              value={password.new_password}
              onChange={(e) =>
                setPassword({ ...password, new_password: e.target.value })
              }
              required
            />
            <Input
              type="password"
              placeholder="Confirm New Password"
              maxLength={50}
              value={password.new_password_confirmation}
              onChange={(e) =>
                setPassword({
                  ...password,
                  new_password_confirmation: e.target.value,
                })
              }
              required
            />
          </div>
          <Button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white"
            onClick={handlePasswordChange}
          >
            Update Password
          </Button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="text-red-500" />
            <h3 className="font-semibold text-red-600">Danger Zone</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Delete My Account
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
