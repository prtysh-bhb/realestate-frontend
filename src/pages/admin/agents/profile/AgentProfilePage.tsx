/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAvatar,
  deleteAccount,
} from "@/api/agent/profileApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, UserCog, ShieldCheck, Trash2, ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/layout/admin/AdminLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { validateImage } from "@/helpers/image_helper";

const AgentProfilePage = () => {
  const { user, setUser } = useAuth();
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  /** ✅ Validate before update */
  const validateProfile = (u: any) => {
    const newErrors: Record<string, string> = {};

    if (!u.name || u.name.trim() === "") newErrors.name = "Name is required.";
    else if (u.name.length > 50)
      newErrors.name = "Name must be less than 50 characters.";

    if (u.email && u.email.length > 70)
      newErrors.email = "Email must be less than 70 characters.";
    else if (
      u.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(u.email)
    )
      newErrors.email = "Invalid email format.";

    if (u.phone && u.phone.length > 20)
      newErrors.phone = "Phone number too long.";

    if (u.bio && u.bio.length > 1000)
      newErrors.bio = "Bio must be less than 1000 characters.";

    if (u.address && u.address.length > 100)
      newErrors.address = "Address must be less than 100 characters.";

    if (u.city && u.city.length > 50)
      newErrors.city = "City must be less than 50 characters.";

    if (u.state && u.state.length > 50)
      newErrors.state = "State must be less than 50 characters.";
    
    if (u.zipcode && isNaN(u.zipcode))
      newErrors.zipcode = "Zipcode must be a number.";

    if (u.zipcode && u.zipcode.length > 10)
      newErrors.zipcode = "Zipcode must be less than 10 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateProfile(user)) {
      toast.error("Please fix the validation errors.");
      return;
    }

    try {
      await updateProfile(user);
      toast.success("Profile updated successfully!");
      fetchProfile();
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
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
    const validFiles = validateImage(e, 2); // 2 MB limit
    if (!validFiles) return;

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
      <div className="flex items-center justify-center h-[70vh]">
        <Loader2 className="animate-spin text-gray-400 w-6 h-6" />
      </div>
    );

  return (
    <AdminLayout>
      <div className="mx-auto p-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <UserCog className="text-green-500" /> Agent Profile
            </h2>
            <p className="text-gray-500 text-sm">
              Manage your agent information and account settings
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </Button>
        </div>

        {/* Profile Card */}
        <div className="bg-white shadow-sm border rounded-xl p-6 flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center md:w-1/3 border-b md:border-b-0 md:border-r pb-6 md:pb-0">
            <img
              src={user.avatar_url || "/default-avatar.png"}
              alt="avatar"
              className="w-32 h-32 rounded-full border object-cover shadow-sm"
            />
            <div className="mt-4 space-y-2 text-center">
              <p
                className="text-lg font-semibold text-gray-800"
                title={user.name || ""}
              >
                {user.name && user.name.length > 30 ? `${user.name.slice(0, 30)}...` : user.name}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <label className="cursor-pointer">
                <input type="file" className="hidden" onChange={handleAvatarUpload} />
                <span className="text-sm text-gray-700 border bg-white px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 cursor-pointer">
                  Upload Avatar
                </span>
              </label>
              <Button
                variant="destructive"
                size="sm"
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
            <h3 className="font-semibold text-gray-800">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "name", label: "Full Name", required: true, maxLength: 50 },
                { name: "email", label: "Email", disabled: true, maxLength: 70 },
                { name: "phone", label: "Phone", maxLength: 20, inputMode: "tel" },
                { name: "company_name", label: "Company Name", maxLength: 100 },
                { name: "license_number", label: "License Number", maxLength: 50 },
                { name: "address", label: "Address", maxLength: 100 },
                { name: "city", label: "City", maxLength: 50 },
                { name: "state", label: "State", maxLength: 50 },
                { name: "zipcode", label: "Zip Code", maxLength: 10, inputMode: "numeric" },
              ].map((f) => (
                <div key={f.name}>
                  <Input
                    placeholder={f.label}
                    disabled={f.disabled}
                    value={user[f.name] || ""}
                    // html validation attributes:
                    required={!!f.required}
                    maxLength={f.maxLength}
                    inputMode={f.inputMode as any}
                    // propagate change
                    onChange={(e) => setUser({ ...user, [f.name]: e.target.value })}
                    className={`${errors[f.name] ? "border-red-400" : ""}`}
                  />
                  {errors[f.name] && (
                    <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Bio */}
            <textarea
              value={user.bio || ""}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              placeholder="Write a short bio..."
              className={`w-full border rounded-lg p-2 text-sm text-gray-700 ${errors.bio ? "border-red-400" : ""}`}
              rows={3}
              maxLength={1000}
              aria-invalid={!!errors.bio}
              aria-describedby={errors.bio ? "bio-error" : undefined}
            />
            {errors.bio && (
              <p id="bio-error" className="text-red-500 text-xs mt-1">{errors.bio}</p>
            )}

            <Button
              onClick={handleUpdate}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-white shadow-sm border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="text-green-500" />
            <h3 className="font-semibold text-gray-800">Change Password</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              type="password"
              placeholder="Current Password"
              value={password.current_password}
              maxLength={50}
              onChange={(e) =>
                setPassword({ ...password, current_password: e.target.value })
              }
            />
            <Input
              type="password"
              placeholder="New Password"
              value={password.new_password}
              maxLength={50}
              onChange={(e) =>
                setPassword({ ...password, new_password: e.target.value })
              }
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
        <div className="bg-white shadow-sm border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="text-red-500" />
            <h3 className="font-semibold text-red-600">Danger Zone</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Once you delete your account, there is no going back.
          </p>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            Delete My Account
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AgentProfilePage;
